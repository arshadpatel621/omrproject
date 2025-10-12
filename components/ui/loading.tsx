import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/theme';

export interface LoadingProps {
  text?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  testID?: string;
}

export function Loading({
  text,
  size = 'large',
  color,
  style,
  testID,
}: LoadingProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const loadingColor = color || primaryColor;

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ActivityIndicator size={size} color={loadingColor} />
      {text && (
        <ThemedText style={styles.text}>
          {text}
        </ThemedText>
      )}
    </View>
  );
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  style,
  testID,
}: EmptyStateProps) {
  return (
    <View style={[styles.emptyContainer, style]} testID={testID}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        {title}
      </ThemedText>
      {description && (
        <ThemedText style={styles.emptyDescription}>
          {description}
        </ThemedText>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  text: {
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptyDescription: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  action: {
    marginTop: Spacing.md,
  },
});