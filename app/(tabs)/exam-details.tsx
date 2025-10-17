import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View, Alert, Switch } from 'react-native';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ExamDetails {
  examName: string;
  subject: string;
  grade: string;
  totalQuestions: string;
  totalMarks: string;
  passingMarks: string;
  duration: string;
  date: string;
  instructions: string;
  isNegativeMarking: boolean;
  negativeMarkingRatio: string;
}

export default function ExamDetailsScreen() {
  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [examDetails, setExamDetails] = useState<ExamDetails>({
    examName: '',
    subject: '',
    grade: '',
    totalQuestions: '',
    totalMarks: '',
    passingMarks: '',
    duration: '',
    date: '',
    instructions: '',
    isNegativeMarking: false,
    negativeMarkingRatio: '0.25',
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'textMuted');

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const handleInputChange = (field: keyof ExamDetails, value: string | boolean) => {
    setExamDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const required = ['examName', 'subject', 'grade', 'totalQuestions', 'totalMarks', 'duration', 'date'];
    const missing = required.filter(field => !examDetails[field as keyof ExamDetails]);
    
    if (missing.length > 0) {
      showError(`Please fill all required fields: ${missing.join(', ')}`);
      return false;
    }

    const totalQuestions = parseInt(examDetails.totalQuestions);
    const totalMarks = parseInt(examDetails.totalMarks);
    const passingMarks = parseInt(examDetails.passingMarks);

    if (totalQuestions <= 0 || totalMarks <= 0) {
      showError('Questions and marks must be positive numbers');
      return false;
    }

    if (passingMarks && passingMarks >= totalMarks) {
      showError('Passing marks must be less than total marks');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showSuccess('Exam details saved successfully!');
      
      // Reset form
      setExamDetails({
        examName: '',
        subject: '',
        grade: '',
        totalQuestions: '',
        totalMarks: '',
        passingMarks: '',
        duration: '',
        date: '',
        instructions: '',
        isNegativeMarking: false,
        negativeMarkingRatio: '0.25',
      });
    } catch (error) {
      showError('Failed to save exam details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = (
    label: string,
    field: keyof ExamDetails,
    placeholder: string,
    options?: {
      multiline?: boolean;
      keyboardType?: 'default' | 'numeric';
      numberOfLines?: number;
    }
  ) => (
    <Animated.View entering={SlideInRight.delay(100)} style={styles.inputGroup}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          { 
            borderColor, 
            color: textColor,
            height: options?.multiline ? 100 : 50,
            textAlignVertical: options?.multiline ? 'top' : 'center',
          }
        ]}
        value={examDetails[field] as string}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor={textMutedColor}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        keyboardType={options?.keyboardType}
      />
    </Animated.View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={styles.header}>
          <IconSymbol name="doc.text.fill" size={32} color={primaryColor} />
          <ThemedText type="title" style={styles.title}>Exam Details</ThemedText>
          <ThemedText style={styles.subtitle}>
            Configure exam parameters and settings for OMR evaluation
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150)}>
        <Card variant="elevated" style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Basic Information</ThemedText>
          </View>

          {renderInputField('Exam Name *', 'examName', 'Enter exam name')}
          {renderInputField('Subject *', 'subject', 'Select or enter subject')}
          {renderInputField('Grade/Class *', 'grade', 'Select grade or class')}
          {renderInputField('Exam Date *', 'date', 'DD/MM/YYYY')}
          {renderInputField('Duration (minutes) *', 'duration', 'e.g., 120', { keyboardType: 'numeric' })}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250)}>
        <Card variant="glass" style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="number.circle.fill" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Marking Scheme</ThemedText>
          </View>

          {renderInputField('Total Questions *', 'totalQuestions', 'Number of questions', { keyboardType: 'numeric' })}
          {renderInputField('Total Marks *', 'totalMarks', 'Maximum marks', { keyboardType: 'numeric' })}
          {renderInputField('Passing Marks', 'passingMarks', 'Minimum marks to pass', { keyboardType: 'numeric' })}

          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <ThemedText style={styles.switchLabel}>Negative Marking</ThemedText>
              <ThemedText style={styles.switchDescription}>
                Enable penalty for incorrect answers
              </ThemedText>
            </View>
            <Switch
              value={examDetails.isNegativeMarking}
              onValueChange={(value) => handleInputChange('isNegativeMarking', value)}
              trackColor={{ false: borderColor, true: primaryColor }}
              thumbColor={examDetails.isNegativeMarking ? '#FFFFFF' : textMutedColor}
            />
          </View>

          {examDetails.isNegativeMarking && (
            <Animated.View entering={SlideInRight.duration(300)}>
              {renderInputField('Negative Marking Ratio', 'negativeMarkingRatio', 'e.g., 0.25 for 1/4th deduction', { keyboardType: 'numeric' })}
            </Animated.View>
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350)}>
        <Card variant="outlined" style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="text.alignleft" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Instructions</ThemedText>
          </View>

          {renderInputField(
            'Exam Instructions', 
            'instructions', 
            'Enter detailed instructions for students (optional)',
            { multiline: true, numberOfLines: 4 }
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(450)}>
        <UIButton
          title={isSubmitting ? "Saving..." : "Save Exam Details"}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          style={styles.submitButton}
          icon={<IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />}
        />
      </Animated.View>

      {/* Quick Stats Card */}
      <Animated.View entering={FadeInDown.delay(500)}>
        <Card variant="gradient" style={styles.statsCard}>
          <ThemedText style={styles.statsTitle}>Quick Summary</ThemedText>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {examDetails.totalQuestions || '0'}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Questions</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {examDetails.totalMarks || '0'}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Marks</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {examDetails.duration || '0'}min
              </ThemedText>
              <ThemedText style={styles.statLabel}>Duration</ThemedText>
            </View>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    fontFamily: 'Inter',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginLeft: Spacing.sm,
    fontWeight: '600',
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  switchLabelContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  switchDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  submitButton: {
    marginVertical: Spacing.lg,
  },
  statsCard: {
    marginBottom: Spacing['2xl'],
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});