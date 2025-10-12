import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'rectangular' | 'circular';
  lines?: number;
  spacing?: number;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius,
  style,
  variant = 'rectangular',
  lines = 1,
  spacing = 8,
}: SkeletonProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const shimmerColor = useThemeColor({}, 'border');

  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    
    return {
      opacity,
    };
  });

  const getBorderRadius = () => {
    if (borderRadius !== undefined) return borderRadius;
    
    switch (variant) {
      case 'circular':
        return 9999;
      case 'text':
        return BorderRadius.sm;
      default:
        return BorderRadius.md;
    }
  };

  const getHeight = () => {
    if (variant === 'text') return 16;
    return height;
  };

  if (lines > 1) {
    return (
      <View style={style}>
        {Array.from({ length: lines }).map((_, index) => (
          <View key={index} style={{ marginBottom: index < lines - 1 ? spacing : 0 }}>
            <Skeleton
              width={index === lines - 1 ? '75%' : width}
              height={getHeight()}
              borderRadius={getBorderRadius()}
              variant={variant}
            />
          </View>
        ))}
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height: getHeight(),
          backgroundColor: shimmerColor,
          borderRadius: getBorderRadius(),
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Predefined skeleton components for common use cases
export function SkeletonText({ lines = 3, ...props }: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="text" lines={lines} {...props} />;
}

export function SkeletonAvatar({ size = 40, ...props }: Omit<SkeletonProps, 'variant' | 'width' | 'height'>) {
  return <Skeleton variant="circular" width={size} height={size} {...props} />;
}

export function SkeletonCard({ ...props }: Omit<SkeletonProps, 'variant' | 'width' | 'height'>) {
  return (
    <View style={styles.cardContainer}>
      <Skeleton variant="rectangular" height={120} {...props} />
      <View style={styles.cardContent}>
        <SkeletonText lines={2} />
        <Skeleton variant="rectangular" height={32} width="60%" style={{ marginTop: Spacing.sm }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  cardContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  cardContent: {
    padding: Spacing.lg,
  },
});
