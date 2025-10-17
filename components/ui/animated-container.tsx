import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  SlideInLeft, 
  SlideInRight,
  SlideInDown,
  SlideInUp,
  ZoomIn,
  BounceIn,
  FlipInEasyX,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

import { AnimationDurations } from '@/constants/theme';

export type AnimationType = 
  | 'fadeInDown' 
  | 'fadeInUp' 
  | 'slideInLeft' 
  | 'slideInRight'
  | 'slideInDown'
  | 'slideInUp'
  | 'zoomIn'
  | 'bounceIn'
  | 'flipInX';

export interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
  index?: number; // For staggered animations
  staggerDelay?: number;
}

const getAnimationConfig = (
  animation: AnimationType = 'fadeInDown', 
  delay = 0, 
  duration = AnimationDurations.normal
) => {
  const totalDelay = delay;
  
  switch (animation) {
    case 'fadeInDown':
      return FadeInDown.delay(totalDelay).duration(duration).springify();
    case 'fadeInUp':
      return FadeInUp.delay(totalDelay).duration(duration).springify();
    case 'slideInLeft':
      return SlideInLeft.delay(totalDelay).duration(duration).springify();
    case 'slideInRight':
      return SlideInRight.delay(totalDelay).duration(duration).springify();
    case 'slideInDown':
      return SlideInDown.delay(totalDelay).duration(duration).springify();
    case 'slideInUp':
      return SlideInUp.delay(totalDelay).duration(duration).springify();
    case 'zoomIn':
      return ZoomIn.delay(totalDelay).duration(duration).springify();
    case 'bounceIn':
      return BounceIn.delay(totalDelay).duration(duration);
    case 'flipInX':
      return FlipInEasyX.delay(totalDelay).duration(duration);
    default:
      return FadeInDown.delay(totalDelay).duration(duration).springify();
  }
};

export function AnimatedContainer({
  children,
  animation = 'fadeInDown',
  delay = 0,
  duration = AnimationDurations.normal,
  style,
  index = 0,
  staggerDelay = 100,
}: AnimatedContainerProps) {
  const staggeredDelay = delay + (index * staggerDelay);
  const animationConfig = getAnimationConfig(animation, staggeredDelay, duration);
  
  return (
    <Animated.View entering={animationConfig} style={style}>
      {children}
    </Animated.View>
  );
}

// Hook for custom floating animations
export function useFloatingAnimation(
  range = 10, 
  duration = 3000,
  autoStart = true
) {
  const translateY = useSharedValue(0);
  
  React.useEffect(() => {
    if (autoStart) {
      translateY.value = withTiming(range, {
        duration,
        easing: Easing.inOut(Easing.sine),
      }, () => {
        translateY.value = withTiming(-range, {
          duration,
          easing: Easing.inOut(Easing.sine),
        }, () => {
          // Repeat the animation
        });
      });
    }
  }, [autoStart, range, duration]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  return { animatedStyle, translateY };
}

// Hook for scale animations on press
export function useScaleAnimation(scale = 0.95) {
  const scaleValue = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));
  
  const onPressIn = () => {
    scaleValue.value = withSpring(scale, { damping: 15, stiffness: 300 });
  };
  
  const onPressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  return { animatedStyle, onPressIn, onPressOut };
}

// Hook for progress animations
export function useProgressAnimation(progress: number) {
  const progressValue = useSharedValue(0);
  
  React.useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));
  
  return { animatedStyle, progressValue };
}