import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth';
import { api, authHeaders } from '@/lib/api';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UIButton } from '@/components/ui/button';

export default function UploadScreen() {
  const { token } = useAuth();
  const [testId, setTestId] = useState('');
  const [version, setVersion] = useState('A');
  const [student, setStudent] = useState('S-001');
  const [imageUrl, setImageUrl] = useState('');

  const submit = async () => {
    try {
      const res = await api.post('/submissions', { testId: Number(testId), versionCode: version, studentIdentifier: student, imageUrl }, { headers: authHeaders(token) });
      await api.post(`/submissions/${res.data.id}/process`, {}, { headers: authHeaders(token) });
      Alert.alert('Submitted', 'Processing complete for the submission');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to upload');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Animated.View entering={FadeInDown.duration(350)}>
        <ThemedText type="title">Upload Scanned OMR Sheet</ThemedText>
        <ThemedText style={{ opacity: 0.7, marginBottom: 10 }}>Upload image URL for now (camera/gallery can be added).</ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <View style={[styles.drop, { borderColor: '#cbd5e1' }] }>
          <ThemedText type="subtitle" style={{ textAlign: 'center', marginBottom: 8 }}>Choose File</ThemedText>
          <ThemedText style={{ textAlign: 'center', opacity: 0.6 }}>Provide an image URL below</ThemedText>
        </View>

        <TextInput placeholder="Test ID" value={testId} onChangeText={setTestId} style={styles.input} />
        <TextInput placeholder="Version (A/B/C/D)" value={version} onChangeText={setVersion} style={styles.input} />
        <TextInput placeholder="Student ID" value={student} onChangeText={setStudent} style={styles.input} />
        <TextInput placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} style={styles.input} />

        <UIButton title="Submit" onPress={submit} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <ThemedText type="subtitle" style={{ marginTop: 20 }}>Preview</ThemedText>
        {!!imageUrl && (
          <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 200, borderRadius: 12 }} resizeMode="cover" />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 12, marginBottom: 10 },
  drop: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, padding: 20, alignItems: 'center', marginVertical: 10 },
});