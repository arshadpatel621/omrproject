import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing, BorderRadius, Shadows, Gradients } from '@/constants/theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  padding?: keyof typeof Spacing;
  gradientType?: 'primary' | 'secondary' | 'warm' | 'cool';
  borderGradient?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function Card({
  children,
  variant = 'default',
  padding = 'lg',
  gradientType = 'primary',
  borderGradient = false,
  style,
  testID,
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceElevatedColor = useThemeColor({}, 'surfaceElevated');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  const getCardStyles = () => {
    const baseStyle = {
      ...styles.base,
      padding: Spacing[padding],
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: surfaceElevatedColor,
          ...Shadows.lg,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: surfaceColor,
          borderWidth: 1.5,
          borderColor: borderGradient ? primaryColor : borderColor,
        };
      case 'gradient':
        // For gradient cards, we'll use a subtle gradient background color
        const gradients = isDark ? Gradients.dark : Gradients.light;
        const gradientColors = gradients[gradientType] || gradients.primary;
        return {
          ...baseStyle,
          backgroundColor: gradientColors[0],
          ...Shadows.md,
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: isDark 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(255, 255, 255, 0.7)',
          borderWidth: 1,
          borderColor: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          ...Shadows.sm,
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          backgroundColor: surfaceColor,
          ...Shadows.sm,
        };
    }
  };

  return (
    <View style={[getCardStyles(), style]} testID={testID}>
      {borderGradient && variant === 'outlined' && (
        <View style={styles.gradientBorder} />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
    padding: 1.5,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
  },
});
