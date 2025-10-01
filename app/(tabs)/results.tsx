import React, { useMemo, useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, Linking } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth';
import { api, authHeaders } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { UIButton } from '@/components/ui/button';

export default function ResultsScreen() {
  const { token } = useAuth();
  const [testId, setTestId] = useState('1');
  const { data, isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: ['results', testId],
    queryFn: async () => {
      const res = await api.get(`/submissions/results?testId=${Number(testId)}`, { headers: authHeaders(token) });
      return res.data as any[];
    }
  });

  const exportCsv = () => {
    const base = (api.defaults.baseURL || '').replace(/\/$/, '');
    Linking.openURL(`${base}/reports/test/${Number(testId)}.csv`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Animated.View entering={FadeInDown.duration(350)}>
        <ThemedText type="title">Results</ThemedText>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <TextInput placeholder="Test ID" value={testId} onChangeText={setTestId} style={styles.input} />
          <UIButton title={isFetching ? 'Loading…' : 'Load'} onPress={() => refetch()} />
        </View>
      </Animated.View>

      <FlatList
        data={data || []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 50)}>
            <View style={styles.card}>
              <ThemedText type="subtitle">{item.studentIdentifier || `Student ${index + 1}`}</ThemedText>
              <ThemedText>Score: {item.score ?? 0}</ThemedText>
            </View>
          </Animated.View>
        )}
        ListEmptyComponent={<ThemedText>No results yet. Load results above.</ThemedText>}
      />

      <UIButton title="Export Results" onPress={exportCsv} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 10 },
  card: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 12, marginBottom: 10 },
});