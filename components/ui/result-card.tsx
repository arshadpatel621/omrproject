import { AnimationDurations, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { ProgressBar } from './progress-bar';

interface ResultCardProps {
  studentId: string;
  score: number;
  maxScore?: number;
  rank?: number;
  onPress?: () => void;
  style?: any;
  index?: number;
}

export function ResultCard({ 
  studentId, 
  score, 
  maxScore = 100, 
  rank, 
  onPress, 
  style,
  index = 0 
}: ResultCardProps) {
  const scale = useSharedValue(1);
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return successColor;
    if (percentage >= 60) return warningColor;
    return errorColor;
  };

  const getScoreIcon = () => {
    if (percentage >= 80) return 'checkmark.circle.fill';
    if (percentage >= 60) return 'exclamationmark.triangle.fill';
    return 'xmark.circle.fill';
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(AnimationDurations.normal)}
      style={[animatedStyle, style]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor,
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.studentInfo}>
            <Text style={[styles.studentId, { color: textColor }]}>
              {studentId}
            </Text>
            {rank && (
              <View style={[styles.rankBadge, { backgroundColor: primaryColor }]}>
                <Text style={styles.rankText}>#{rank}</Text>
              </View>
            )}
          </View>
          <IconSymbol
            name={getScoreIcon()}
            size={20}
            color={getScoreColor()}
          />
        </View>

        <View style={styles.scoreSection}>
          <View style={styles.scoreInfo}>
            <Text style={[styles.score, { color: getScoreColor() }]}>
              {score}
            </Text>
            <Text style={[styles.maxScore, { color: textSecondaryColor }]}>
              / {maxScore}
            </Text>
          </View>
          <Text style={[styles.percentage, { color: textSecondaryColor }]}>
            {Math.round(percentage)}%
          </Text>
        </View>

        <ProgressBar
          progress={percentage}
          variant={percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}
          size="sm"
          style={styles.progressBar}
        />

        <View style={styles.footer}>
          <Text style={[styles.status, { color: textSecondaryColor }]}>
            {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentId: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  rankBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.sm,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scoreInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  maxScore: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 2,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    marginBottom: Spacing.sm,
  },
  footer: {
    alignItems: 'flex-start',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
