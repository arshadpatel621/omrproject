import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const toggleAnimation = useSharedValue(isDark ? 1 : 0);

  React.useEffect(() => {
    toggleAnimation.value = withSpring(isDark ? 1 : 0, {
      damping: 15,
      stiffness: 300,
    });
  }, [isDark]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      toggleAnimation.value,
      [0, 1],
      ['#F8FAFC', '#161B22']
    );

    return {
      backgroundColor,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const rotate = toggleAnimation.value * 180;
    const scale = 0.8 + (toggleAnimation.value * 0.4);

    return {
      transform: [
        { rotate: `${rotate}deg` },
        { scale },
      ],
    };
  });

  return (
    <Pressable
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Animated.View style={[styles.toggle, animatedStyle]}>
        <Animated.View style={iconAnimatedStyle}>
          <IconSymbol
            name={isDark ? 'moon.fill' : 'sun.max.fill'}
            size={16}
            color={primaryColor}
          />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 28,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  toggle: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
