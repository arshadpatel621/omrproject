import React, { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { UIButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInLeft, SlideInRight, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalExams: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 12,
    pendingEvaluations: 3,
    completedEvaluations: 9,
    averageScore: 78.5,
  });

  // Animated values for floating elements
  const floatingAnimation1 = useSharedValue(0);
  const floatingAnimation2 = useSharedValue(0);

  useEffect(() => {
    floatingAnimation1.value = withRepeat(
      withTiming(10, { duration: 3000 }),
      -1,
      true
    );
    floatingAnimation2.value = withRepeat(
      withTiming(-8, { duration: 2500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingAnimation1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: floatingAnimation2.value }],
  }));

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with Welcome */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <ThemedText type="title" style={styles.welcomeTitle}>Dashboard</ThemedText>
            <ThemedText style={styles.dateText}>{getCurrentDate()}</ThemedText>
            <ThemedText style={styles.timeText}>{getCurrentTime()}</ThemedText>
          </View>
          <Animated.View style={[styles.headerIcon, animatedStyle1]}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={40} color={primaryColor} />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Stats Cards */}
      <Animated.View entering={SlideInLeft.delay(200)}>
        <View style={styles.statsContainer}>
          <Card variant="gradient" style={[styles.statCard, { flex: 2 }]}>
            <View style={styles.statContent}>
              <IconSymbol name="doc.text.fill" size={28} color="#FFFFFF" />
              <View style={styles.statTextContainer}>
                <ThemedText style={styles.statNumber}>{stats.totalExams}</ThemedText>
                <ThemedText style={styles.statLabel}>Total Exams</ThemedText>
              </View>
            </View>
          </Card>
          
          <Card variant="elevated" style={[styles.statCard, { flex: 1 }]}>
            <View style={styles.statContent}>
              <IconSymbol name="clock.fill" size={24} color={primaryColor} />
              <View style={styles.statTextContainer}>
                <ThemedText style={[styles.statNumber, { color: textColor }]}>{stats.pendingEvaluations}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: textColor, opacity: 0.7 }]}>Pending</ThemedText>
              </View>
            </View>
          </Card>
        </View>
      </Animated.View>

      <Animated.View entering={SlideInRight.delay(300)}>
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={[styles.statCard, { flex: 1 }]}>
            <View style={styles.statContent}>
              <IconSymbol name="checkmark.circle.fill" size={24} color={primaryColor} />
              <View style={styles.statTextContainer}>
                <ThemedText style={[styles.statNumber, { color: textColor }]}>{stats.completedEvaluations}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: textColor, opacity: 0.7 }]}>Completed</ThemedText>
              </View>
            </View>
          </Card>
          
          <Card variant="glass" style={[styles.statCard, { flex: 2 }]}>
            <View style={styles.statContent}>
              <IconSymbol name="chart.bar.fill" size={28} color={primaryColor} />
              <View style={styles.statTextContainer}>
                <ThemedText style={[styles.statNumber, { color: textColor }]}>{stats.averageScore}%</ThemedText>
                <ThemedText style={[styles.statLabel, { color: textColor, opacity: 0.7 }]}>Average Score</ThemedText>
              </View>
            </View>
          </Card>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.delay(400)}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        
        <View style={styles.actionsGrid}>
          <Animated.View entering={SlideInLeft.delay(500)}>
            <Card variant="elevated" style={styles.actionCard}>
              <Pressable 
                style={styles.actionButton} 
                onPress={() => router.push('/(tabs)/exam-details')}
              >
                <View style={styles.actionIconContainer}>
                  <IconSymbol name="doc.text.fill" size={32} color={primaryColor} />
                </View>
                <ThemedText style={styles.actionTitle}>Create Exam</ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Set up new exam parameters
                </ThemedText>
              </Pressable>
            </Card>
          </Animated.View>

          <Animated.View entering={SlideInRight.delay(550)}>
            <Card variant="elevated" style={styles.actionCard}>
              <Pressable 
                style={styles.actionButton} 
                onPress={() => router.push('/(tabs)/upload')}
              >
                <View style={styles.actionIconContainer}>
                  <IconSymbol name="square.and.arrow.up.fill" size={32} color={primaryColor} />
                </View>
                <ThemedText style={styles.actionTitle}>Upload Sheets</ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Process answer sheets
                </ThemedText>
              </Pressable>
            </Card>
          </Animated.View>

          <Animated.View entering={SlideInLeft.delay(600)}>
            <Card variant="elevated" style={styles.actionCard}>
              <Pressable 
                style={styles.actionButton} 
                onPress={() => router.push('/(tabs)/results')}
              >
                <View style={styles.actionIconContainer}>
                  <IconSymbol name="chart.bar.fill" size={32} color={primaryColor} />
                </View>
                <ThemedText style={styles.actionTitle}>View Results</ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Analyze student performance
                </ThemedText>
              </Pressable>
            </Card>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View entering={FadeInUp.delay(650)}>
        <Card variant="glass" style={styles.recentCard}>
          <View style={styles.recentHeader}>
            <IconSymbol name="clock.fill" size={20} color={primaryColor} />
            <ThemedText type="subtitle" style={styles.recentTitle}>Recent Activity</ThemedText>
          </View>
          <View style={styles.recentList}>
            <View style={styles.recentItem}>
              <View style={styles.recentDot} />
              <View style={styles.recentContent}>
                <ThemedText style={styles.recentText}>Mathematics exam completed</ThemedText>
                <ThemedText style={styles.recentTime}>2 hours ago</ThemedText>
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.recentDot} />
              <View style={styles.recentContent}>
                <ThemedText style={styles.recentText}>Physics exam uploaded</ThemedText>
                <ThemedText style={styles.recentTime}>5 hours ago</ThemedText>
              </View>
            </View>
            <View style={styles.recentItem}>
              <View style={styles.recentDot} />
              <View style={styles.recentContent}>
                <ThemedText style={styles.recentText}>Grade 10A results exported</ThemedText>
                <ThemedText style={styles.recentTime}>1 day ago</ThemedText>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* Floating Background Elements */}
      <Animated.View style={[styles.floatingElement1, animatedStyle2]} />
      <Animated.View style={[styles.floatingElement2, animatedStyle1]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
    paddingVertical: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.xs,
    fontFamily: 'Inter',
  },
  dateText: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.6,
  },
  headerIcon: {
    marginLeft: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    minHeight: 80,
    justifyContent: 'center',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTextContainer: {
    marginLeft: Spacing.sm,
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: Spacing.xs / 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
    fontSize: 20,
    fontWeight: '700',
  },
  actionsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  actionCard: {
    marginBottom: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },
  recentCard: {
    marginBottom: Spacing['2xl'],
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  recentTitle: {
    marginLeft: Spacing.sm,
    fontSize: 18,
    fontWeight: '600',
  },
  recentList: {
    gap: Spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00BFFF',
    marginTop: 6,
    marginRight: Spacing.md,
  },
  recentContent: {
    flex: 1,
  },
  recentText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs / 2,
  },
  recentTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  floatingElement1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    zIndex: -1,
  },
  floatingElement2: {
    position: 'absolute',
    bottom: 150,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    zIndex: -1,
  },
});
