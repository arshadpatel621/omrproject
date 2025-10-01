import axios from 'axios';
import Constants from 'expo-constants';

function guessBaseUrl() {
  // Prefer explicit env
  const envUrl = process.env.EXPO_PUBLIC_API_URL as string | undefined;
  if (envUrl) return envUrl;
  // Try to derive from Metro host in development
  const hostUri = (Constants as any).expoConfig?.hostUri || (Constants as any).debuggerHost || '';
  if (typeof hostUri === 'string' && hostUri.length > 0) {
    const host = hostUri.split(':')[0];
    return `http://${host}:4000`;
  }
  // Fallback
  return 'http://localhost:4000';
}

export const api = axios.create({
  baseURL: guessBaseUrl(),
  timeout: 8000,
  headers: { 'Accept-Encoding': 'gzip' },
});

export function authHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}