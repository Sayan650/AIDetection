// Design tokens and theme constants
export const colors = {
  // Primary colors
  primary: '#6366f1',      // Indigo (accents, buttons)
  secondary: '#8b5cf6',    // Violet (secondary highlights)
  
  // Status colors
  success: '#10b981',      // Emerald green
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
  info: '#3b82f6',         // Blue
  
  // Background colors
  background: '#0f172a',   // Slate-900 (deep dark background)
  surface: '#1e293b',      // Slate-800 (cards, surfaces)
  surfaceVariant: '#334155', // Slate-700 (elevated surfaces)
  
  // Text colors
  text: '#f1f5f9',         // Slate-100 (light text)
  textSecondary: '#94a3b8', // Slate-400 (muted text)
  textDisabled: '#64748b',  // Slate-500 (disabled text)
  
  // Border and divider colors
  border: '#334155',       // Slate-700
  divider: '#475569',      // Slate-600
  
  // Overlay colors
  overlay: 'rgba(15, 23, 42, 0.8)', // Semi-transparent background
  backdrop: 'rgba(0, 0, 0, 0.5)',   // Modal backdrop
  
  // Transparent
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

export const lineHeight = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
} as const;

// Component-specific theme tokens
export const components = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    paddingHorizontal: {
      sm: spacing.md,
      md: spacing.lg,
      lg: spacing.xl,
    },
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
  },
  input: {
    height: 48,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
} as const;

// Complete theme object
export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  lineHeight,
  shadows,
  components,
} as const;

// Type definitions for theme
export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;