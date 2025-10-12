import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ResultCard } from '@/components/ui/result-card';
import { ResultsTable } from '@/components/ui/results-table';
import { SkeletonCard } from '@/components/ui/skeleton';
import { ViewToggle, ViewType } from '@/components/ui/view-toggle';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useToast } from '@/contexts/ToastContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { api, authHeaders } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { downloadFile, exportToCSV, exportToExcel } from '@/lib/exportUtils';
import { mockResults, StudentResult } from '@/lib/mockData';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ResultsScreen() {
  const { token } = useAuth();
  const { showSuccess, showError } = useToast();
  const [testId, setTestId] = useState('1');
  const [viewType, setViewType] = useState<ViewType>('table');
  const [showMockData, setShowMockData] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const { data, isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: ['results', testId],
    queryFn: async () => {
      const res = await api.get(`/submissions/results?testId=${Number(testId)}`, { headers: authHeaders(token) });
      return res.data as any[];
    }
  });

  const exportCsv = async () => {
    try {
      const resultsToExport = showMockData ? mockResults : (data || []);
      const csvContent = exportToCSV(resultsToExport, `student_results_${new Date().toISOString().split('T')[0]}`);
      downloadFile(csvContent, 'student_results', 'csv');
      showSuccess('CSV export prepared successfully!');
    } catch (error) {
      showError('Failed to export CSV file');
    }
  };

  const exportExcel = async () => {
    try {
      const resultsToExport = showMockData ? mockResults : (data || []);
      const excelContent = exportToExcel(resultsToExport, `student_results_${new Date().toISOString().split('T')[0]}`);
      downloadFile(excelContent, 'student_results', 'xlsx');
      showSuccess('Excel export prepared successfully!');
    } catch (error) {
      showError('Failed to export Excel file');
    }
  };

  const loadResults = async () => {
    if (!testId) {
      showError('Please enter a test ID');
      return;
    }
    try {
      await refetch();
      showSuccess('Results loaded successfully!');
    } catch (error) {
      showError('Failed to load results');
    }
  };

  const loadMockData = () => {
    setShowMockData(true);
    showSuccess('Mock data loaded successfully!');
  };

  const sortedData = useMemo(() => {
    if (showMockData) {
      return [...mockResults].sort((a, b) => b.marks - a.marks);
    }
    if (!data) return [];
    return [...data].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [data, showMockData]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(350)}>
        <ThemedText type="title" style={styles.title}>Student Results</ThemedText>
        <ThemedText style={styles.subtitle}>
          View and analyze student test results with rank-wise sorting
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100)}>
        <Card variant="elevated" style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Test ID</ThemedText>
              <TextInput 
                placeholder="Enter test ID" 
                value={testId} 
                onChangeText={setTestId} 
                style={[styles.input, { borderColor, color: textColor }]}
                placeholderTextColor={useThemeColor({}, 'textMuted')}
                keyboardType="numeric"
              />
            </View>
            <UIButton 
              title={isFetching ? 'Loading…' : 'Load Results'} 
              onPress={loadResults}
              loading={isFetching}
              disabled={isFetching}
              style={styles.loadButton}
            />
          </View>
          
          <View style={styles.buttonRow}>
            <UIButton 
              title="Load Demo Data" 
              onPress={loadMockData}
              variant="outline"
              style={styles.demoButton}
            />
          </View>
          
          {(data && data.length > 0) || showMockData ? (
            <View style={styles.viewControls}>
              <ThemedText style={styles.viewLabel}>View:</ThemedText>
              <ViewToggle 
                currentView={viewType} 
                onViewChange={setViewType}
                style={styles.viewToggle}
              />
            </View>
          ) : null}
        </Card>
      </Animated.View>

      {isFetching ? (
        <Animated.View entering={FadeInUp.delay(200)}>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} style={styles.skeletonCard} />
          ))}
        </Animated.View>
      ) : (data && data.length > 0) || showMockData ? (
        <Animated.View entering={FadeInUp.delay(200)}>
          {viewType === 'card' ? (
            <View style={styles.cardsContainer}>
              {sortedData.map((item, index) => (
                <ResultCard
                  key={item.id}
                  studentId={showMockData ? (item as StudentResult).studentName : (item.studentIdentifier || `Student ${index + 1}`)}
                  score={showMockData ? (item as StudentResult).marks : (item.score || 0)}
                  maxScore={showMockData ? (item as StudentResult).totalMarks : 100}
                  rank={index + 1}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <ResultsTable
              data={sortedData.map((item, index) => ({
                id: item.id,
                studentIdentifier: showMockData ? (item as StudentResult).studentName : (item.studentIdentifier || `Student ${index + 1}`),
                score: showMockData ? (item as StudentResult).marks : (item.score || 0),
                maxScore: showMockData ? (item as StudentResult).totalMarks : 100
              }))}
              style={styles.tableContainer}
            />
          )}
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp.delay(200)}>
          <Card variant="glass" style={styles.emptyCard}>
            <ThemedText style={styles.emptyText}>
              No results found. Load results using the controls above or try demo data.
            </ThemedText>
          </Card>
        </Animated.View>
      )}

      {((data && data.length > 0) || showMockData) && (
        <Animated.View entering={FadeInUp.delay(300)}>
          <View style={styles.exportButtons}>
            <UIButton 
              title="Export to CSV" 
              onPress={exportCsv}
              variant="outline"
              size="lg"
              style={styles.exportButton}
            />
            <UIButton 
              title="Export to Excel" 
              onPress={exportExcel}
              variant="outline"
              size="lg"
              style={styles.exportButton}
            />
          </View>
        </Animated.View>
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
    marginBottom: Spacing.sm,
    fontFamily: 'Inter',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing['2xl'],
    lineHeight: 22,
  },
  controlsCard: {
    marginBottom: Spacing.lg,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flex: 1,
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
  loadButton: {
    minWidth: 120,
  },
  viewControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  viewToggle: {
    marginLeft: Spacing.md,
  },
  cardsContainer: {
    marginBottom: Spacing.lg,
  },
  tableContainer: {
    marginBottom: Spacing.lg,
  },
  skeletonCard: {
    marginBottom: Spacing.md,
  },
  emptyCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
  },
  exportButton: {
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  demoButton: {
    minWidth: 150,
  },
  exportButtons: {
    gap: Spacing.md,
  },
});