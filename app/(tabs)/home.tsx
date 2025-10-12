import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/lib/auth';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Welcome, Administrator';
      case 'TEACHER':
        return 'Welcome, Teacher';
      default:
        return 'Welcome to Smart OMR';
    }
  };

  const getRoleDescription = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Manage tests, view analytics, and oversee the entire OMR evaluation system';
      case 'TEACHER':
        return 'Upload OMR sheets, view results, and track student performance';
      default:
        return 'Access OMR evaluation results and performance analytics';
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <ThemedText type="title" style={styles.title}>Smart OMR Evaluator</ThemedText>
        <ThemedText style={styles.subtitle}>
          Advanced optical mark recognition system for automated test evaluation
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150)}>
        <Card variant="gradient" style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <IconSymbol name="person.circle.fill" size={48} color="#FFFFFF" />
            <ThemedText style={styles.welcomeTitle}>{getWelcomeMessage()}</ThemedText>
            <ThemedText style={styles.welcomeDescription}>
              {getRoleDescription()}
            </ThemedText>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250)}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
        
        <View style={styles.actionsGrid}>
          <Card variant="elevated" style={styles.actionCard}>
            <Pressable 
              style={styles.actionButton} 
              onPress={() => router.push('/(tabs)/results')}
            >
              <IconSymbol name="chart.bar.fill" size={32} color={primaryColor} />
              <ThemedText style={styles.actionTitle}>View Results</ThemedText>
              <ThemedText style={styles.actionDescription}>
                Analyze test results and performance metrics
              </ThemedText>
            </Pressable>
          </Card>

          {user?.role === 'TEACHER' && (
            <Card variant="elevated" style={styles.actionCard}>
              <Pressable 
                style={styles.actionButton} 
                onPress={() => router.push('/(tabs)/upload')}
              >
                <IconSymbol name="square.and.arrow.up.fill" size={32} color={primaryColor} />
                <ThemedText style={styles.actionTitle}>Upload OMR</ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Upload and process OMR sheets
                </ThemedText>
              </Pressable>
            </Card>
          )}

          {user?.role === 'ADMIN' && (
            <Card variant="elevated" style={styles.actionCard}>
              <Pressable 
                style={styles.actionButton} 
                onPress={() => router.push('/(tabs)/admin')}
              >
                <IconSymbol name="gearshape.2.fill" size={32} color={primaryColor} />
                <ThemedText style={styles.actionTitle}>Admin Panel</ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Manage tests and system settings
                </ThemedText>
              </Pressable>
            </Card>
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(350)}>
        <Card variant="glass" style={styles.featuresCard}>
          <ThemedText type="subtitle" style={styles.featuresTitle}>Key Features</ThemedText>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={primaryColor} />
              <ThemedText style={styles.featureText}>Automated OMR Processing</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={primaryColor} />
              <ThemedText style={styles.featureText}>Real-time Results Analysis</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={primaryColor} />
              <ThemedText style={styles.featureText}>Performance Analytics</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={primaryColor} />
              <ThemedText style={styles.featureText}>Export to CSV</ThemedText>
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
  welcomeCard: {
    marginBottom: Spacing['2xl'],
    padding: Spacing['2xl'],
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  actionCard: {
    flex: 1,
    minWidth: 150,
    marginBottom: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresCard: {
    padding: Spacing.lg,
  },
  featuresTitle: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  featuresList: {
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: Spacing.sm,
    fontSize: 14,
    fontWeight: '500',
  },
});