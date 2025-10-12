import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient'; // Will be enabled after package installation
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PageBackgrounds, Gradients, BackgroundStyles } from '@/constants/theme';

export interface BackgroundContainerProps {
  children: React.ReactNode;
  variant?: keyof typeof PageBackgrounds;
  pattern?: keyof typeof BackgroundStyles.patterns;
  overlay?: boolean;
  customGradient?: string[];
  style?: ViewStyle;
  testID?: string;
}

export function BackgroundContainer({
  children,
  variant,
  pattern,
  overlay = true,
  customGradient,
  style,
  testID,
}: BackgroundContainerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Get background color based on variant (using first gradient color as solid color)
  const getBackgroundColor = (): string => {
    if (customGradient && customGradient.length > 0) return customGradient[0];
    if (variant && PageBackgrounds[variant]) {
      const colors = isDark ? PageBackgrounds[variant].dark : PageBackgrounds[variant].light;
      return colors[0];
    }
    // Default background color
    const defaultColors = isDark ? Gradients.dark.background : Gradients.light.background;
    return defaultColors[0];
  };

  // Get pattern styles
  const getPatternStyle = () => {
    if (!pattern) return {};
    
    const patternConfig = BackgroundStyles.patterns[pattern];
    return {
      backgroundImage: isDark ? patternConfig.dark : patternConfig.light,
      backgroundSize: patternConfig.size || '20px 20px',
    };
  };

  // Get overlay color
  const overlayColor = overlay 
    ? (isDark ? BackgroundStyles.overlays.dark : BackgroundStyles.overlays.light)
    : 'transparent';

  return (
    <View style={[styles.container, style]} testID={testID}>
      {/* Solid Background (will be gradient when LinearGradient is available) */}
      <View 
        style={[
          styles.gradient, 
          { backgroundColor: getBackgroundColor() }
        ]} 
      />
      
      {/* Pattern Overlay */}
      {pattern && (
        <View 
          style={[
            styles.pattern,
            // Note: React Native doesn't support CSS patterns directly
            // This would need to be implemented using SVG or other methods
            // For now, we'll use a subtle overlay
            {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.02)' 
                : 'rgba(0, 0, 0, 0.02)',
            }
          ]} 
        />
      )}
      
      {/* Content Overlay */}
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        {children}
      </View>
    </View>
  );
}

// Decorative background shapes component
export interface DecorativeShapesProps {
  variant?: 'circles' | 'squares' | 'academic' | 'minimal';
  opacity?: number;
}

export function DecorativeShapes({ 
  variant = 'circles', 
  opacity = 0.1 
}: DecorativeShapesProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const accentColor = useThemeColor({}, 'primary');
  
  const shapeColor = isDark 
    ? `rgba(255, 255, 255, ${opacity})`
    : `rgba(0, 0, 0, ${opacity})`;

  const renderShapes = () => {
    switch (variant) {
      case 'circles':
        return (
          <>
            <View style={[styles.shape, styles.circle1, { backgroundColor: shapeColor }]} />
            <View style={[styles.shape, styles.circle2, { backgroundColor: shapeColor }]} />
            <View style={[styles.shape, styles.circle3, { backgroundColor: shapeColor }]} />
          </>
        );
      case 'squares':
        return (
          <>
            <View style={[styles.shape, styles.square1, { backgroundColor: shapeColor }]} />
            <View style={[styles.shape, styles.square2, { backgroundColor: shapeColor }]} />
            <View style={[styles.shape, styles.square3, { backgroundColor: shapeColor }]} />
          </>
        );
      case 'academic':
        return (
          <>
            <View style={[styles.shape, styles.academic1, { backgroundColor: shapeColor, borderRadius: 8 }]} />
            <View style={[styles.shape, styles.academic2, { backgroundColor: shapeColor, borderRadius: 12 }]} />
            <View style={[styles.shape, styles.academic3, { backgroundColor: shapeColor, borderRadius: 16 }]} />
            <View style={[styles.shape, styles.academic4, { backgroundColor: shapeColor, borderRadius: 20 }]} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.decorativeContainer} pointerEvents="none">
      {renderShapes()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  pattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
  },
  decorativeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  shape: {
    position: 'absolute',
  },
  // Circle shapes
  circle1: {
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -75,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    top: '40%',
    right: -50,
  },
  // Square shapes
  square1: {
    width: 80,
    height: 80,
    top: 50,
    right: 30,
    transform: [{ rotate: '45deg' }],
  },
  square2: {
    width: 120,
    height: 120,
    bottom: 100,
    left: 20,
    transform: [{ rotate: '30deg' }],
  },
  square3: {
    width: 60,
    height: 60,
    top: '60%',
    right: 80,
    transform: [{ rotate: '60deg' }],
  },
  // Academic shapes (book/page-like rectangles)
  academic1: {
    width: 120,
    height: 80,
    top: 80,
    right: 40,
    transform: [{ rotate: '15deg' }],
  },
  academic2: {
    width: 100,
    height: 140,
    bottom: 120,
    left: 30,
    transform: [{ rotate: '-10deg' }],
  },
  academic3: {
    width: 90,
    height: 120,
    top: '45%',
    right: 60,
    transform: [{ rotate: '25deg' }],
  },
  academic4: {
    width: 70,
    height: 100,
    top: '25%',
    left: 40,
    transform: [{ rotate: '-15deg' }],
  },
});