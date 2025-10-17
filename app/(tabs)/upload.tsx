import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Pressable, Alert } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, SlideInRight } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DragDropUpload } from '@/components/ui/drag-drop-upload';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';

interface Answer {
  [key: number]: string; // question number -> selected option (A, B, C, D)
}

interface ProcessedResult {
  questionNumber: number;
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
}

export default function UploadScreen() {
  const { showSuccess, showError } = useToast();
  const [totalQuestions, setTotalQuestions] = useState(20); // Default, should come from exam details
  
  // Answer sheets state
  const [solvedAnswers, setSolvedAnswers] = useState<Answer>({});
  const [studentAnswers, setStudentAnswers] = useState<Answer>({});
  
  // Upload states
  const [solvedSheetImage, setSolvedSheetImage] = useState('');
  const [studentSheetImage, setStudentSheetImage] = useState('');
  
  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState<ProcessedResult[]>([]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');

  const options = ['A', 'B', 'C', 'D'];

  // Handle bubble selection for solved answer sheet
  const handleSolvedAnswer = (questionNum: number, option: string) => {
    setSolvedAnswers(prev => ({ ...prev, [questionNum]: option }));
  };

  // Handle bubble selection for student answer sheet
  const handleStudentAnswer = (questionNum: number, option: string) => {
    setStudentAnswers(prev => ({ ...prev, [questionNum]: option }));
  };

  // Simulate OCR processing from uploaded images
  const processUploadedImages = async () => {
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random answers for demo (in real app, this would be OCR results)
    const simulatedSolvedAnswers: Answer = {};
    const simulatedStudentAnswers: Answer = {};
    
    for (let i = 1; i <= totalQuestions; i++) {
      simulatedSolvedAnswers[i] = options[Math.floor(Math.random() * options.length)];
      simulatedStudentAnswers[i] = options[Math.floor(Math.random() * options.length)];
    }
    
    setSolvedAnswers(simulatedSolvedAnswers);
    setStudentAnswers(simulatedStudentAnswers);
    
    showSuccess('Images processed successfully! Answers extracted.');
  };

  // Main process function to compare answers
  const processAnswers = async () => {
    // Validate that we have answers to compare
    const solvedCount = Object.keys(solvedAnswers).length;
    const studentCount = Object.keys(studentAnswers).length;
    
    if (solvedCount === 0 || studentCount === 0) {
      showError('Please provide both solved answer sheet and student answer sheet (either upload images or fill bubbles manually)');
      return;
    }
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      const processedResults: ProcessedResult[] = [];
      
      // Compare answers with progress updates
      for (let i = 1; i <= totalQuestions; i++) {
        const correctAnswer = solvedAnswers[i] || 'Not provided';
        const studentAnswer = studentAnswers[i] || 'Not provided';
        const isCorrect = correctAnswer === studentAnswer && correctAnswer !== 'Not provided' && studentAnswer !== 'Not provided';
        
        processedResults.push({
          questionNumber: i,
          correctAnswer,
          studentAnswer,
          isCorrect,
        });
        
        // Update progress
        const progress = Math.round((i / totalQuestions) * 100);
        setProcessingProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      setResults(processedResults);
      setIsProcessed(true);
      
      const correctCount = processedResults.filter(r => r.isCorrect).length;
      const percentage = Math.round((correctCount / totalQuestions) * 100);
      
      showSuccess(`Processing complete! Score: ${correctCount}/${totalQuestions} (${percentage}%)`);
      
    } catch (error) {
      showError('Failed to process answers');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Navigate to results page
  const viewResults = () => {
    if (results.length === 0) {
      showError('No results to display. Please process answers first.');
      return;
    }
    
    // In a real app, you would pass results through navigation state or context
    // For now, we'll navigate to the results page
    router.push('/(tabs)/results');
    showSuccess('Navigating to detailed results...');
  };
  
  // Render bubble component for answer selection
  const renderBubble = (questionNum: number, option: string, isSelected: boolean, onSelect: () => void, isSolved: boolean = false) => (
    <Pressable
      key={option}
      onPress={onSelect}
      style={[
        styles.bubble,
        {
          backgroundColor: isSelected ? primaryColor : 'transparent',
          borderColor: isSelected ? primaryColor : borderColor,
        }
      ]}
    >
      <ThemedText style={[
        styles.bubbleText,
        { color: isSelected ? '#FFFFFF' : textColor }
      ]}>
        {option}
      </ThemedText>
    </Pressable>
  );
  
  // Render question row with bubbles
  const renderQuestion = (questionNum: number, isSolved: boolean = false) => {
    const currentAnswers = isSolved ? solvedAnswers : studentAnswers;
    const handleAnswer = isSolved ? handleSolvedAnswer : handleStudentAnswer;
    
    return (
      <View key={questionNum} style={styles.questionRow}>
        <ThemedText style={styles.questionNumber}>{questionNum}</ThemedText>
        <View style={styles.bubblesContainer}>
          {options.map(option => 
            renderBubble(
              questionNum,
              option,
              currentAnswers[questionNum] === option,
              () => handleAnswer(questionNum, option),
              isSolved
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title" style={styles.title}>Upload Sheets</ThemedText>
      
      {/* Solved Answer Sheet */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Solved Answer Sheet</ThemedText>
        <UIButton
          title={solvedSheetImage ? "✅ Uploaded" : "Upload Image"}
          onPress={() => {
            // Simulate file selection
            setSolvedSheetImage('solved_sheet.jpg');
            showSuccess('Solved answer sheet uploaded!');
          }}
          variant={solvedSheetImage ? "outline" : "primary"}
          style={styles.uploadButton}
        />
      </View>
      
      {/* Student Answer Sheet */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Student Answer Sheet</ThemedText>
        <UIButton
          title={studentSheetImage ? "✅ Uploaded" : "Upload Image"}
          onPress={() => {
            // Simulate file selection
            setStudentSheetImage('student_sheet.jpg');
            showSuccess('Student answer sheet uploaded!');
          }}
          variant={studentSheetImage ? "outline" : "primary"}
          style={styles.uploadButton}
        />
      </View>
      
      {/* Process Button */}
      <UIButton 
        title={isProcessing ? `Processing... ${processingProgress}%` : "Process"}
        onPress={processAnswers}
        loading={isProcessing}
        disabled={isProcessing || !solvedSheetImage || !studentSheetImage}
        size="lg"
        style={styles.processButton}
      />
      
      {/* Progress Bar */}
      {isProcessing && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${processingProgress}%` }
              ]} 
            />
          </View>
          <ThemedText style={styles.progressText}>
            Processing... {processingProgress}%
          </ThemedText>
        </View>
      )}
      
      {/* Check Results Button */}
      {isProcessed && (
        <UIButton
          title="Check Results"
          onPress={viewResults}
          variant="secondary"
          size="lg"
          style={styles.checkResultsButton}
        />
      )}
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
    marginBottom: Spacing['2xl'],
    fontFamily: 'Inter',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  uploadButton: {
    marginBottom: Spacing.sm,
  },
  processButton: {
    marginVertical: Spacing.xl,
  },
  progressContainer: {
    marginVertical: Spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 191, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00BFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  checkResultsButton: {
    marginTop: Spacing.lg,
  },
});
