import React, { useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/lib/api';

export default function LoginScreen() {
  const { login, applyAuth, demoLogin } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('pass123');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const inputBg = useMemo(() => (isDark ? '#1f2937' : '#ffffff'), [isDark]);
  const inputText = useMemo(() => (isDark ? '#f9fafb' : '#111827'), [isDark]);
  const cardBg = useMemo(() => (isDark ? '#111827' : '#f8fafc'), [isDark]);
  const border = useMemo(() => (isDark ? '#374151' : '#e5e7eb'), [isDark]);

  const onLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await login(email.trim(), password);
      router.replace('/post-login');
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.message || 'Check your credentials';
      setError(typeof msg === 'string' ? msg : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0b1220' : '#eef2ff' }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }] }>
            <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 16 }}>Welcome</ThemedText>
            <ThemedText style={{ textAlign: 'center', marginBottom: 20 }}>Sign in to continue</ThemedText>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={[styles.input, { backgroundColor: inputBg, color: inputText, borderColor: border }]}
              />
            </View>

            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <View style={{ position: 'relative' }}>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { backgroundColor: inputBg, color: inputText, borderColor: border, paddingRight: 44 }]}
                />
                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  style={styles.eyeButton}
                >
                  <ThemedText type="link">{showPassword ? 'Hide' : 'Show'}</ThemedText>
                </Pressable>
              </View>
            </View>

            {error ? (
              <View style={[styles.errorBox, { borderColor: isDark ? '#b91c1c' : '#fecaca', backgroundColor: isDark ? '#7f1d1d' : '#fee2e2' }] }>
                <ThemedText style={{ color: '#fff' }}>{String(error)}</ThemedText>
              </View>
            ) : null}

            <Pressable onPress={onLogin} disabled={loading} style={[styles.primaryBtn, { opacity: loading ? 0.7 : 1 }]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.primaryBtnText}>Sign In</ThemedText>
              )}
            </Pressable>

            <Pressable
              onPress={async () => {
                // Instant demo: set role immediately and navigate
                await demoLogin('ADMIN');
                router.replace('/post-login');
              }}
              style={[styles.secondaryBtn, { borderColor: border }]}
            >
              <ThemedText style={styles.secondaryBtnText}>Instant Demo Admin</ThemedText>
            </Pressable>

            <Pressable
              onPress={async () => {
                await demoLogin('TEACHER');
                router.replace('/post-login');
              }}
              style={[styles.secondaryBtn, { borderColor: border }]}
            >
              <ThemedText style={styles.secondaryBtnText}>Instant Demo Teacher</ThemedText>
            </Pressable>

            <View style={{ marginTop: 12 }}>
              <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>Tip: Use your admin or teacher account.</ThemedText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  fieldGroup: { marginBottom: 14 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 14, android: 10, default: 12 }),
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 12,
    padding: 6,
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryBtn: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  secondaryBtnText: { fontWeight: '600', fontSize: 14 },
  errorBox: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
});
