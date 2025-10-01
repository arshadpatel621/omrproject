import React from 'react';
import { View, Button } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth';

export default function PostLoginScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
      <ThemedText type="title">Welcome{user ? `, ${user.email}` : ''}</ThemedText>
      <ThemedText>Choose where to go:</ThemedText>
      <Button title="Admin Dashboard" onPress={() => router.replace('/(tabs)/admin')} />
      <Button title="Teacher Dashboard" onPress={() => router.replace('/(tabs)/teacher')} />
      <Button title="Logout" color="#ef4444" onPress={async () => { await logout(); router.replace('/auth/login'); }} />
    </View>
  );
}