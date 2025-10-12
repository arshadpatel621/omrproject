import { AnimationDurations, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export function UIButton({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  style,
  icon,
  loading = false,
}: {
  title: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  icon?: React.ReactNode;
  loading?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');
  const glassBackground = useThemeColor({}, 'glassBackground');
  const glassBorder = useThemeColor({}, 'glassBorder');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: AnimationDurations.fast });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: AnimationDurations.fast });
  };

  const getButtonStyles = () => {
    const baseStyle = {
      ...styles.base,
      ...getSizeStyles(size),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: primaryColor,
          ...Shadows.md,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: secondaryColor,
          ...Shadows.md,
        };
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1.5,
          borderColor: primaryColor,
          backgroundColor: 'transparent',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'glass':
        return {
          ...baseStyle,
          backgroundColor: glassBackground,
          borderWidth: 1,
          borderColor: glassBorder,
          ...Shadows.sm,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      ...styles.text,
      ...getTextSizeStyles(size),
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
          fontWeight: '600',
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: primaryColor,
          fontWeight: '600',
        };
      case 'glass':
        return {
          ...baseTextStyle,
          color: textColor,
          fontWeight: '600',
        };
      default:
        return baseTextStyle;
    }
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          getButtonStyles(),
          disabled || loading ? { opacity: 0.6 } : null,
        ]}
      >
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyles()}>
            {loading ? 'Loading...' : title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
      };
    case 'lg':
      return {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing['2xl'],
        borderRadius: BorderRadius.xl,
      };
    case 'md':
    default:
      return {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
      };
  }
};

const getTextSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return { fontSize: 14 };
    case 'lg':
      return { fontSize: 18 };
    case 'md':
    default:
      return { fontSize: 16 };
  }
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});