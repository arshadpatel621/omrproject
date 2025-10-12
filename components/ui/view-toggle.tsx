import { BorderRadius } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';

export type ViewType = 'card' | 'table';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  style?: any;
}

export function ViewToggle({ currentView, onViewChange, style }: ViewToggleProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const cardPosition = useSharedValue(currentView === 'card' ? 0 : 1);

  React.useEffect(() => {
    cardPosition.value = withSpring(currentView === 'card' ? 0 : 1, {
      damping: 15,
      stiffness: 300,
    });
  }, [currentView]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardPosition.value * 50 }],
  }));

  return (
    <View style={[styles.container, { backgroundColor, borderColor }, style]}>
      <Animated.View
        style={[
          styles.activeBackground,
          { backgroundColor: primaryColor },
          animatedStyle,
        ]}
      />
      
      <Pressable
        style={styles.button}
        onPress={() => onViewChange('card')}
      >
        <IconSymbol
          name="rectangle.grid.2x2"
          size={16}
          color={currentView === 'card' ? '#FFFFFF' : textSecondaryColor}
        />
      </Pressable>
      
      <Pressable
        style={styles.button}
        onPress={() => onViewChange('table')}
      >
        <IconSymbol
          name="tablecells"
          size={16}
          color={currentView === 'table' ? '#FFFFFF' : textSecondaryColor}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 2,
    position: 'relative',
  },
  activeBackground: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 46,
    height: 32,
    borderRadius: BorderRadius.md,
  },
  button: {
    width: 46,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
});
