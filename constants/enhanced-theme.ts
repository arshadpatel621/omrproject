/**
 * Enhanced professional theme system for OMR application
 * Modern, accessible color palette with glassmorphism and gradient effects
 */

import { Platform } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows, AnimationDurations } from './theme';

// Enhanced color palette with semantic naming
export const EnhancedColors = {
  light: {
    ...Colors.light,
    // Status colors
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    info: '#0EA5E9', // Sky blue
    
    // Semantic colors for OMR app
    examPrimary: '#6366F1', // Indigo
    gradePrimary: '#059669', // Emerald
    rankGold: '#F59E0B', // Gold for rank 1
    rankSilver: '#94A3B8', // Silver for rank 2
    rankBronze: '#CD7C2F', // Bronze for rank 3
    
    // UI state colors
    processing: '#8B5CF6', // Purple for processing states
    pending: '#F59E0B', // Amber for pending states
    completed: '#10B981', // Green for completed states
  },
  dark: {
    ...Colors.dark,
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
    
    // Semantic colors for OMR app
    examPrimary: '#6366F1',
    gradePrimary: '#059669',
    rankGold: '#F59E0B',
    rankSilver: '#94A3B8',
    rankBronze: '#CD7C2F',
    
    // UI state colors
    processing: '#8B5CF6',
    pending: '#F59E0B',
    completed: '#10B981',
  },
};

// Professional typography scale
export const Typography = {
  fonts: Platform.select({
    ios: {
      regular: 'system-ui',
      medium: 'system-ui-medium',
      semiBold: 'system-ui-semibold',
      bold: 'system-ui-bold',
      mono: 'ui-monospace',
    },
    android: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      mono: 'RobotoMono-Regular',
    },
    default: {
      regular: 'Inter',
      medium: 'Inter',
      semiBold: 'Inter',
      bold: 'Inter',
      mono: 'monospace',
    },
  }),
  
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Enhanced spacing system
export const EnhancedSpacing = {
  ...Spacing,
  '7xl': 80,
  '8xl': 96,
  '9xl': 128,
};

// Professional card variants
export const CardVariants = {
  default: {
    backgroundColor: 'surface',
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  elevated: {
    backgroundColor: 'surfaceElevated',
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  outlined: {
    backgroundColor: 'surface',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: 'border',
  },
  gradient: {
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  glass: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    ...Shadows.sm,
  },
  exam: {
    backgroundColor: 'surface',
    borderRadius: BorderRadius['2xl'],
    borderWidth: 2,
    borderColor: 'examPrimary',
    ...Shadows.lg,
  },
  rank: {
    backgroundColor: 'surfaceElevated',
    borderRadius: BorderRadius.xl,
    ...Shadows.xl,
  },
};

// Animation presets for common UI patterns
export const AnimationPresets = {
  entrance: {
    duration: AnimationDurations.normal,
    type: 'spring',
    springDamping: 0.8,
    springStiffness: 100,
  },
  
  exit: {
    duration: AnimationDurations.fast,
    type: 'timing',
    easing: 'easeOut',
  },
  
  interaction: {
    duration: AnimationDurations.fast,
    type: 'spring',
    springDamping: 0.6,
    springStiffness: 200,
  },
  
  processing: {
    duration: AnimationDurations.slow,
    type: 'timing',
    easing: 'linear',
  },
  
  floating: {
    duration: 3000,
    type: 'timing',
    easing: 'inOut',
  },
};

// Component size variants
export const ComponentSizes = {
  button: {
    xs: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.sm,
      fontSize: Typography.sizes.xs,
    },
    sm: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      fontSize: Typography.sizes.sm,
    },
    md: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg,
      fontSize: Typography.sizes.base,
    },
    lg: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing['2xl'],
      borderRadius: BorderRadius.xl,
      fontSize: Typography.sizes.lg,
    },
    xl: {
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing['3xl'],
      borderRadius: BorderRadius['2xl'],
      fontSize: Typography.sizes.xl,
    },
  },
  
  card: {
    sm: {
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    md: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    lg: {
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
    },
    xl: {
      padding: Spacing['2xl'],
      borderRadius: BorderRadius['2xl'],
    },
  },
};

// Professional icon sizes
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 56,
  '6xl': 64,
};

// Layout breakpoints (for responsive design)
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// OMR-specific design tokens
export const OMRTokens = {
  exam: {
    cardMinHeight: 120,
    formFieldHeight: 50,
    sectionSpacing: Spacing['2xl'],
  },
  
  results: {
    rankCardHeight: 80,
    scoreDisplaySize: Typography.sizes['3xl'],
    statsCardMinHeight: 90,
  },
  
  upload: {
    dropZoneHeight: 150,
    progressBarHeight: 8,
    filePreviewSize: 60,
  },
  
  dashboard: {
    statCardHeight: 100,
    quickActionSize: 80,
    headerHeight: 120,
  },
};

export default {
  EnhancedColors,
  Typography,
  EnhancedSpacing,
  CardVariants,
  AnimationPresets,
  ComponentSizes,
  IconSizes,
  Breakpoints,
  OMRTokens,
};