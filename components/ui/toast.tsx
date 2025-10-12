import { AnimationDurations, BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    SlideInRight,
    SlideOutRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function Toast({
  message,
  type,
  visible,
  onDismiss,
  duration = 4000,
  action,
}: ToastProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const backgroundColor = useThemeColor({}, 'surfaceElevated');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return useThemeColor({}, 'success');
      case 'error':
        return useThemeColor({}, 'error');
      case 'warning':
        return useThemeColor({}, 'warning');
      default:
        return useThemeColor({}, 'primary');
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark.circle.fill';
      case 'error':
        return 'xmark.circle.fill';
      case 'warning':
        return 'exclamationmark.triangle.fill';
      default:
        return 'info.circle.fill';
    }
  };

  const typeColor = getTypeColor();

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: AnimationDurations.normal });
      
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      scale.value = withTiming(0, { duration: AnimationDurations.fast });
      opacity.value = withTiming(0, { duration: AnimationDurations.fast });
    }
  }, [visible, duration, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={SlideInRight.duration(AnimationDurations.normal)}
      exiting={SlideOutRight.duration(AnimationDurations.fast)}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: typeColor }]}>
          <IconSymbol name={getTypeIcon()} size={16} color="#FFFFFF" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          {action && (
            <Pressable onPress={action.onPress} style={styles.actionButton}>
              <Text style={[styles.actionText, { color: typeColor }]}>
                {action.label}
              </Text>
            </Pressable>
          )}
        </View>

        <Pressable onPress={onDismiss} style={styles.dismissButton}>
          <IconSymbol name="xmark" size={14} color={textColor} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButton: {
    marginTop: Spacing.xs,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
});
