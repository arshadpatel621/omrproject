import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DragDropUpload } from '@/components/ui/drag-drop-upload';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function UploadScreen() {
  const { token } = useAuth();
  const { showSuccess, showError } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [answerKeyUrl, setAnswerKeyUrl] = useState('');
  const [studentSheetsUrl, setStudentSheetsUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classes = [
    'Class 1A', 'Class 1B', 'Class 2A', 'Class 2B',
    'Class 3A', 'Class 3B', 'Class 4A', 'Class 4B',
    'Class 5A', 'Class 5B', 'Class 6A', 'Class 6B',
    'Class 7A', 'Class 7B', 'Class 8A', 'Class 8B',
    'Class 9A', 'Class 9B', 'Class 10A', 'Class 10B'
  ];

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const submit = async () => {
    if (!selectedClass || !answerKeyUrl || !studentSheetsUrl) {
      showError('Please select a class and upload both files');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Files uploaded and processed successfully!');
      
      // Reset form
      setSelectedClass('');
      setAnswerKeyUrl('');
      setStudentSheetsUrl('');
    } catch (e: any) {
      showError('Failed to upload files');
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
        <ThemedText type="title" style={styles.title}>Upload Files</ThemedText>
        <ThemedText style={styles.subtitle}>
          Upload answer keys and student answer sheets for processing
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <Card variant="elevated" style={styles.formCard}>
          <ThemedText type="subtitle" style={styles.formTitle}>Select Class</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Student Class *</ThemedText>
            <View style={[styles.classSelector, { borderColor }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classScroll}>
                {classes.map((className) => (
                  <Pressable
                    key={className}
                    onPress={() => setSelectedClass(className)}
                    style={[
                      styles.classOption,
                      { 
                        backgroundColor: selectedClass === className ? primaryColor : 'transparent',
                        borderColor: selectedClass === className ? primaryColor : borderColor
                      }
                    ]}
                  >
                    <ThemedText style={[
                      styles.classOptionText,
                      { color: selectedClass === className ? '#FFFFFF' : textColor }
                    ]}>
                      {className}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200)}>
        <Card variant="glass" style={styles.uploadCard}>
          <ThemedText type="subtitle" style={styles.uploadTitle}>Answer Key</ThemedText>
          <DragDropUpload
            onFileSelect={(file) => console.log('Answer key selected:', file)}
            onImageUrlChange={setAnswerKeyUrl}
            imageUrl={answerKeyUrl}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)}>
        <Card variant="glass" style={styles.uploadCard}>
          <ThemedText type="subtitle" style={styles.uploadTitle}>Student Answer Sheets</ThemedText>
          <DragDropUpload
            onFileSelect={(file) => console.log('Student sheets selected:', file)}
            onImageUrlChange={setStudentSheetsUrl}
            imageUrl={studentSheetsUrl}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)}>
        <UIButton 
          title="Upload and Process Files" 
          onPress={submit}
          loading={isSubmitting}
          disabled={isSubmitting || !selectedClass || !answerKeyUrl || !studentSheetsUrl}
          size="lg"
          style={styles.submitButton}
        />
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
  uploadTitle: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  classSelector: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  classScroll: {
    maxHeight: 60,
  },
  classOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  classOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});