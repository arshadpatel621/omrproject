import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  style?: any;
}

export function ProgressBar({
  progress,
  size = 'md',
  variant = 'primary',
  showPercentage = false,
  animated = true,
  style,
}: ProgressBarProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'textSecondary');

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return useThemeColor({}, 'success');
      case 'warning':
        return useThemeColor({}, 'warning');
      case 'error':
        return useThemeColor({}, 'error');
      default:
        return useThemeColor({}, 'primary');
    }
  };

  const progressColor = getVariantColor();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 4,
          borderRadius: BorderRadius.sm,
        };
      case 'lg':
        return {
          height: 12,
          borderRadius: BorderRadius.md,
        };
      case 'md':
      default:
        return {
          height: 8,
          borderRadius: BorderRadius.sm,
        };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const width = animated 
      ? withSpring(progress, { damping: 15, stiffness: 100 })
      : progress;

    return {
      width: `${width}%`,
    };
  });

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.track, getSizeStyles(), { backgroundColor, borderColor }]}>
        <Animated.View
          style={[
            styles.fill,
            getSizeStyles(),
            { backgroundColor: progressColor },
            animatedStyle,
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={[styles.percentage, { color: textColor }]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
  },
  fill: {
    height: '100%',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: Spacing.sm,
    minWidth: 32,
    textAlign: 'right',
  },
});
