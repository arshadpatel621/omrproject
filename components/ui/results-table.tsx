import { AnimationDurations, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

interface ResultItem {
  id: string | number;
  studentIdentifier: string;
  score: number;
  maxScore?: number;
}

interface ResultsTableProps {
  data: ResultItem[];
  onItemPress?: (item: ResultItem) => void;
  style?: any;
}

export function ResultsTable({ data, onItemPress, style }: ResultsTableProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  const sortedData = [...data].sort((a, b) => b.score - a.score);

  const getScoreColor = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return successColor;
    if (percentage >= 60) return warningColor;
    return errorColor;
  };

  const getScoreIcon = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'checkmark.circle.fill';
    if (percentage >= 60) return 'exclamationmark.triangle.fill';
    return 'xmark.circle.fill';
  };

  return (
    <View style={[styles.container, { backgroundColor, borderColor }, style]}>
      {/* Table Header */}
      <Animated.View 
        entering={FadeInUp.duration(AnimationDurations.normal)}
        style={[styles.header, { borderBottomColor: borderColor }]}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { color: textSecondaryColor }]}>Rank</Text>
          <Text style={[styles.headerText, { color: textSecondaryColor }]}>Student ID</Text>
          <Text style={[styles.headerText, { color: textSecondaryColor }]}>Score</Text>
          <Text style={[styles.headerText, { color: textSecondaryColor }]}>Status</Text>
        </View>
      </Animated.View>

      {/* Table Body */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedData.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInUp.delay(index * 50).duration(AnimationDurations.normal)}
          >
            <Pressable
              onPress={() => onItemPress?.(item)}
              style={[
                styles.row,
                { borderBottomColor: borderColor },
                index === sortedData.length - 1 && styles.lastRow
              ]}
            >
              <View style={styles.rankColumn}>
                <View style={[
                  styles.rankBadge,
                  { backgroundColor: index < 3 ? primaryColor : textSecondaryColor }
                ]}>
                  <Text style={styles.rankText}>
                    {index + 1}
                  </Text>
                </View>
              </View>

              <View style={styles.studentColumn}>
                <Text style={[styles.studentText, { color: textColor }]}>
                  {item.studentIdentifier}
                </Text>
              </View>

              <View style={styles.scoreColumn}>
                <Text style={[
                  styles.scoreText,
                  { color: getScoreColor(item.score, item.maxScore) }
                ]}>
                  {item.score}
                </Text>
                {item.maxScore && (
                  <Text style={[styles.maxScoreText, { color: textSecondaryColor }]}>
                    /{item.maxScore}
                  </Text>
                )}
              </View>

              <View style={styles.statusColumn}>
                <IconSymbol
                  name={getScoreIcon(item.score, item.maxScore)}
                  size={16}
                  color={getScoreColor(item.score, item.maxScore)}
                />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.md,
  },
  header: {
    borderBottomWidth: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rankColumn: {
    width: 50,
    alignItems: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  studentColumn: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  studentText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  scoreColumn: {
    width: 80,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  maxScoreText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  statusColumn: {
    width: 40,
    alignItems: 'center',
  },
});
