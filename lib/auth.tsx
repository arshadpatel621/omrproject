import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export type User = { id: number; email: string; role: 'ADMIN' | 'TEACHER' };

interface AuthContextValue {
  token: string | null;
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  applyAuth: (token: string, user: User) => Promise<void>;
  demoLogin: (role: 'ADMIN' | 'TEACHER') => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem('auth:token');
        const savedUser = await AsyncStorage.getItem('auth:user');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const applyAuth = async (t: string, u: User) => {
    setToken(t);
    setUser(u);
    await AsyncStorage.setItem('auth:token', t);
    await AsyncStorage.setItem('auth:user', JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const t = res.data.token as string;
    const u = res.data.user as User;
    await applyAuth(t, u);
    return u;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('auth:token');
    await AsyncStorage.removeItem('auth:user');
  };

  const demoLogin = async (role: 'ADMIN' | 'TEACHER') => {
    // Instant UI auth with placeholder user (no token yet)
    const demoEmail = `demo+${role.toLowerCase()}_${Date.now()}@example.com`;
    setUser({ id: 0, email: demoEmail, role });
    // Try to register in the background, fallback to login if exists
    try {
      const res = await api.post('/auth/register', { email: demoEmail, password: 'demo123', role });
      await applyAuth(res.data.token, res.data.user);
    } catch (e: any) {
      try {
        const res2 = await api.post('/auth/login', { email: demoEmail, password: 'demo123' });
        await applyAuth(res2.data.token, res2.data.user);
      } catch (_) {
        // Leave as UI-only demo if backend unreachable
      }
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, ready, login, logout, applyAuth, demoLogin }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}