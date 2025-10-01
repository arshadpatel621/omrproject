import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useQuery } from '@tanstack/react-query';
import { api, authHeaders } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { UIButton } from '@/components/ui/button';

export default function AdminScreen() {
  const { token } = useAuth();
  const { data, isLoading, refetch, isFetching } = useQuery({
    enabled: Boolean(token),
    queryKey: ['tests-admin', Boolean(token)],
    queryFn: async () => {
      const res = await api.get('/tests', { headers: authHeaders(token) });
      return res.data as any[];
    },
  });

  const [name, setName] = useState('NEET Mock Exam 1');
  const [subject, setSubject] = useState('Biology');
  const [questions, setQuestions] = useState('100');
  const [markCorrect, setMarkCorrect] = useState('4');
  const [markWrong, setMarkWrong] = useState('-1');
  const [versions, setVersions] = useState('A,B');

  const createExam = async () => {
    try {
      const payload = {
        name,
        subject,
        date: new Date().toISOString().slice(0, 10),
        versionCodes: versions.split(',').map((s) => s.trim()).filter(Boolean),
        marking: { correct: Number(markCorrect), wrong: Number(markWrong), blank: 0 },
      };
      const res = await api.post('/tests', payload, { headers: authHeaders(token) });
      await refetch();
      Alert.alert('Created', `Exam ${res.data.name} created`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ? JSON.stringify(e.response.data.error) : 'Failed to create');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <ThemedText type="title" style={{ marginBottom: 10 }}>Create Exam</ThemedText>
          <TextInput placeholder="Exam Name" value={name} onChangeText={setName} style={styles.input} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput placeholder="No. of Questions" value={questions} onChangeText={setQuestions} style={[styles.input, { flex: 1 }]} />
            <TextInput placeholder="Marks Correct" value={markCorrect} onChangeText={setMarkCorrect} style={[styles.input, { flex: 1 }]} />
          </View>
          <TextInput placeholder="Negative Marks" value={markWrong} onChangeText={setMarkWrong} style={styles.input} />
          <TextInput placeholder="Versions (A,B,C,D)" value={versions} onChangeText={setVersions} style={styles.input} />

          <View style={styles.drop}>
            <ThemedText style={{ textAlign: 'center' }}>Click to upload or drag and drop</ThemedText>
            <ThemedText style={{ textAlign: 'center', opacity: 0.6 }}>JSON or CSV (placeholder)
            </ThemedText>
          </View>

          <UIButton title="Create Exam" onPress={createExam} />
        </Animated.View>
      </View>

      <View style={{ padding: 16 }}>
        <ThemedText type="title" style={{ marginBottom: 10 }}>Created Exams</ThemedText>
        {isLoading ? (
          <ThemedText>Loading…</ThemedText>
        ) : (
          <FlatList
            data={data || []}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInUp.delay(index * 50)}>
                <View style={styles.examRow}>
                  <View>
                    <ThemedText type="subtitle">{item.name}</ThemedText>
                    <ThemedText>{item.subject}</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <UIButton
                      title={item.published ? 'Unpublish' : 'Publish'}
                      variant="outline"
                      onPress={async () => {
                        await api.post(`/tests/${item.id}/publish`, {}, { headers: authHeaders(token) });
                        refetch();
                      }}
                    />
                  </View>
                </View>
              </Animated.View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginBottom: 10 },
  drop: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 20, alignItems: 'center', marginVertical: 10, borderColor: '#cbd5e1' },
  examRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
});
