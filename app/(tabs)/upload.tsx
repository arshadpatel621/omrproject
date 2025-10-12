import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DragDropUpload } from '@/components/ui/drag-drop-upload';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { api, authHeaders } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function UploadScreen() {
  const { token } = useAuth();
  const { showSuccess, showError } = useToast();
  const [testId, setTestId] = useState('');
  const [version, setVersion] = useState('A');
  const [student, setStudent] = useState('S-001');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const submit = async () => {
    if (!testId || !version || !student || !imageUrl) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/submissions', { 
        testId: Number(testId), 
        versionCode: version, 
        studentIdentifier: student, 
        imageUrl 
      }, { headers: authHeaders(token) });
      
      await api.post(`/submissions/${res.data.id}/process`, {}, { headers: authHeaders(token) });
      showSuccess('OMR sheet uploaded and processed successfully!');
      
      // Reset form
      setTestId('');
      setVersion('A');
      setStudent('S-001');
      setImageUrl('');
    } catch (e: any) {
      showError(e?.response?.data?.error || 'Failed to upload OMR sheet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(350)}>
        <ThemedText type="title" style={styles.title}>Upload OMR Sheet</ThemedText>
        <ThemedText style={styles.subtitle}>
          Upload your scanned OMR sheet for automated evaluation and analysis
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <Card variant="glass" style={styles.uploadCard}>
          <DragDropUpload
            onFileSelect={(file) => console.log('File selected:', file)}
            onImageUrlChange={setImageUrl}
            imageUrl={imageUrl}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <Card variant="elevated" style={styles.formCard}>
          <ThemedText type="subtitle" style={styles.formTitle}>Test Information</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Test ID *</ThemedText>
            <TextInput 
              placeholder="Enter test ID" 
              value={testId} 
              onChangeText={setTestId} 
              style={[styles.input, { borderColor, color: textColor }]}
              placeholderTextColor={useThemeColor({}, 'textMuted')}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Version *</ThemedText>
            <TextInput 
              placeholder="A, B, C, or D" 
              value={version} 
              onChangeText={setVersion} 
              style={[styles.input, { borderColor, color: textColor }]}
              placeholderTextColor={useThemeColor({}, 'textMuted')}
              maxLength={1}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Student ID *</ThemedText>
            <TextInput 
              placeholder="Enter student identifier" 
              value={student} 
              onChangeText={setStudent} 
              style={[styles.input, { borderColor, color: textColor }]}
              placeholderTextColor={useThemeColor({}, 'textMuted')}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Image URL *</ThemedText>
            <TextInput 
              placeholder="Enter image URL" 
              value={imageUrl} 
              onChangeText={setImageUrl} 
              style={[styles.input, { borderColor, color: textColor }]}
              placeholderTextColor={useThemeColor({}, 'textMuted')}
              multiline
            />
          </View>

          <UIButton 
            title="Process OMR Sheet" 
            onPress={submit}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            style={styles.submitButton}
          />
        </Card>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontFamily: 'Inter',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing['2xl'],
    lineHeight: 22,
  },
  uploadCard: {
    marginBottom: Spacing.lg,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  formTitle: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 16,
    fontFamily: 'Inter',
    minHeight: 48,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
});