/**
 * Futuristic theme system with dark mode first approach
 * Colors optimized for modern, professional UI with glassmorphism effects
 */

import { Platform } from 'react-native';

// Futuristic color palette
const accentColor = '#00BFFF'; // Bright cyan
const primaryColor = '#00BFFF';
const secondaryColor = '#7C3AED'; // Purple
const successColor = '#10B981'; // Emerald
const warningColor = '#F59E0B'; // Amber
const errorColor = '#EF4444'; // Red

export const Colors = {
  light: {
    // Base colors
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    
    // Accent colors
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    success: successColor,
    warning: warningColor,
    error: errorColor,
    
    // UI elements
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    tint: primaryColor,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: primaryColor,
    
    // Glassmorphism
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },
  dark: {
    // Base colors - Dark mode first
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#21262D',
    text: '#E2E8F0',
    textSecondary: '#B1BAC4',
    textMuted: '#8B949E',
    
    // Accent colors
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    success: successColor,
    warning: warningColor,
    error: errorColor,
    
    // UI elements
    border: '#30363D',
    borderLight: '#21262D',
    tint: accentColor,
    icon: '#8B949E',
    tabIconDefault: '#6E7681',
    tabIconSelected: accentColor,
    
    // Glassmorphism
    glassBackground: 'rgba(22, 27, 34, 0.8)',
    glassBorder: 'rgba(240, 246, 252, 0.1)',
  },
};

// Design tokens for consistent spacing and styling
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
} as const;

export const Gradients = {
  light: {
    primary: ['#00BFFF', '#0080FF'],
    secondary: ['#7C3AED', '#5B21B6'],
    warm: ['#F59E0B', '#D97706'],
    cool: ['#06B6D4', '#0891B2'],
    success: ['#10B981', '#059669'],
    error: ['#EF4444', '#DC2626'],
  },
  dark: {
    primary: ['#00BFFF', '#0080FF'],
    secondary: ['#7C3AED', '#5B21B6'],
    warm: ['#F59E0B', '#D97706'],
    cool: ['#06B6D4', '#0891B2'],
    success: ['#10B981', '#059669'],
    error: ['#EF4444', '#DC2626'],
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** Modern system fonts */
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'serif',
    rounded: 'Inter',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "Inter, 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Animation durations
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
} as const;

// Z-index values
export const ZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
