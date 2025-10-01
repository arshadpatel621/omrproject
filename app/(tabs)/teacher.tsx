import React, { useState } from 'react';
import { View, Button, FlatList, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useQuery } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function TeacherScreen() {
  const { token } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    enabled: Boolean(token),
    queryKey: ['tests-teacher', Boolean(token)],
    queryFn: async () => {
      const res = await api.get('/tests', { headers: authHeaders(token) });
      return res.data as any[];
    },
  });

  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [versionCode, setVersionCode] = useState('A');
  const [studentId, setStudentId] = useState('S-001');
  const [imageUrl, setImageUrl] = useState('');

  const uploadSubmission = async () => {
    try {
      const payload = { testId: Number(selectedTestId), versionCode, studentIdentifier: studentId, imageUrl };
      const res = await api.post('/submissions', payload, { headers: authHeaders(token) });
      await api.post(`/submissions/${res.data.id}/process`, {}, { headers: authHeaders(token) });
      Alert.alert('Uploaded', 'Processed submission');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Upload failed');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <ThemedText type="title">Teacher Dashboard</ThemedText>
      <Button title="Refresh Tests" onPress={() => refetch()} />
      {isLoading ? (
        <ThemedText>Loading…</ThemedText>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8 }}>
              <ThemedText type="subtitle">{item.name} ({item.subject})</ThemedText>
              <ThemedText>Published: {String(item.published)}</ThemedText>
            </View>
          )}
        />
      )}

      <ThemedText type="subtitle">Upload Student Sheet (URL)</ThemedText>
      <TextInput placeholder="Test ID" value={selectedTestId} onChangeText={setSelectedTestId} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }} />
      <TextInput placeholder="Version (A/B/C/D)" value={versionCode} onChangeText={setVersionCode} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }} />
      <TextInput placeholder="Student ID" value={studentId} onChangeText={setStudentId} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }} />
      <TextInput placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }} />
      <Button title="Upload & Process" onPress={uploadSubmission} />
    </View>
  );
}