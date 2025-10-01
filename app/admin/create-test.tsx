import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth';
import { api, authHeaders } from '@/lib/api';
import { router } from 'expo-router';

export default function CreateTestScreen() {
  const { token } = useAuth();
  const [name, setName] = useState('Math Test');
  const [subject, setSubject] = useState('Math');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [versions, setVersions] = useState('A,B');

  const onCreate = async () => {
    try {
      const versionCodes = versions.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = { name, subject, date, versionCodes, marking: { correct: 1, wrong: 0, blank: 0 } };
      await api.post('/tests', payload, { headers: authHeaders(token) });
      Alert.alert('Success', 'Test created');
      router.replace('/(tabs)/admin');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ? JSON.stringify(e.response.data.error) : 'Failed to create test');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Create Test</ThemedText>
      <TextInput placeholder="Test name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={styles.input} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={styles.input} />
      <TextInput placeholder="Versions (A,B,C)" value={versions} onChangeText={setVersions} style={styles.input} />
      <Button title="Create" onPress={onCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
});