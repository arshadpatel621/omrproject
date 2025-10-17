import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
  const primaryColor = useThemeColor({}, 'primary');

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
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <IconSymbol name="chart.bar.fill" size={32} color={primaryColor} />
            <View style={styles.headerText}>
              <ThemedText type="title" style={styles.title}>Results & Rankings</ThemedText>
              <ThemedText style={styles.subtitle}>
                Comprehensive student performance analysis
              </ThemedText>
            </View>
          </View>
          <View style={styles.headerStats}>
            <ThemedText style={styles.statsNumber}>{sortedData.length}</ThemedText>
            <ThemedText style={styles.statsLabel}>Students</ThemedText>
          </View>
        </View>
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
        <>
          {/* Statistics Overview */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <View style={styles.statsOverview}>
              <Card variant="gradient" style={styles.overviewCard}>
                <View style={styles.overviewContent}>
                  <IconSymbol name="trophy.fill" size={28} color="#FFFFFF" />
                  <View style={styles.overviewText}>
                    <ThemedText style={styles.overviewTitle}>Top Score</ThemedText>
                    <ThemedText style={styles.overviewValue}>
                      {showMockData ? Math.max(...mockResults.map(r => r.marks)) : (sortedData[0]?.score || 0)}/{showMockData ? mockResults[0]?.totalMarks || 100 : 100}
                    </ThemedText>
                  </View>
                </View>
              </Card>
              
              <Card variant="elevated" style={styles.overviewCard}>
                <View style={styles.overviewContent}>
                  <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={primaryColor} />
                  <View style={styles.overviewText}>
                    <ThemedText style={[styles.overviewTitle, { color: textColor }]}>Average</ThemedText>
                    <ThemedText style={[styles.overviewValue, { color: textColor }]}>
                      {showMockData 
                        ? Math.round(mockResults.reduce((sum, r) => sum + r.marks, 0) / mockResults.length)
                        : Math.round(sortedData.reduce((sum, r) => sum + (r.score || 0), 0) / sortedData.length) || 0}%
                    </ThemedText>
                  </View>
                </View>
              </Card>
              
              <Card variant="glass" style={styles.overviewCard}>
                <View style={styles.overviewContent}>
                  <IconSymbol name="person.3.fill" size={24} color={primaryColor} />
                  <View style={styles.overviewText}>
                    <ThemedText style={[styles.overviewTitle, { color: textColor }]}>Pass Rate</ThemedText>
                    <ThemedText style={[styles.overviewValue, { color: textColor }]}>
                      {showMockData 
                        ? Math.round((mockResults.filter(r => r.marks >= r.totalMarks * 0.6).length / mockResults.length) * 100)
                        : Math.round((sortedData.filter(r => (r.score || 0) >= 60).length / sortedData.length) * 100) || 0}%
                    </ThemedText>
                  </View>
                </View>
              </Card>
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.delay(250)}>
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
        </>
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
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
    paddingVertical: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  headerStats: {
    alignItems: 'center',
    marginLeft: Spacing.lg,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.xs / 2,
  },
  statsLabel: {
    fontSize: 12,
    opacity: 0.7,
    fontWeight: '600',
  },
  statsOverview: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  overviewCard: {
    flex: 1,
    minHeight: 80,
    justifyContent: 'center',
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewText: {
    marginLeft: Spacing.sm,
    alignItems: 'flex-start',
  },
  overviewTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
