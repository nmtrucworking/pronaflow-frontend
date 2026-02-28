/**
 * PRONAFLOW COLOR PALETTE & DESIGN SYSTEM
 * Centralized color reference for professional design consistency
 * All colors derive from the primary logo teal: #14b8a6
 */

export const COLORS = {
  // Primary Brand Color - Logo Teal
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main brand color (logo light/dark midpoint)
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Neutral Colors - Slate
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Semantic Colors
  semantic: {
    success: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      900: '#134e4a',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      900: '#7f1d1d',
    },
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      900: '#134e4a',
    },
  },

  // Status Colors
  status: {
    success: '#14b8a6',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#14b8a6',
    pending: '#f59e0b',
    active: '#14b8a6',
    inactive: '#94a3b8',
  },

  // Priority Colors
  priority: {
    urgent: '#FF0000',    // Red
    high: '#FFA500',      // Orange
    medium: '#00BFFF',    // Deep Sky Blue
    low: '#808080',       // Gray
  },

  // UI Colors
  ui: {
    // Text Colors
    text: {
      primary: '#0f172a',        // Dark slate for light mode
      secondary: '#334155',      // Medium slate
      muted: '#64748b',          // Light slate
      inverse: '#ffffff',        // White for dark mode
      onSuccess: '#ffffff',
      onError: '#ffffff',
      onWarning: '#000000',
    },

    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      modal: 'rgba(255, 255, 255, 0.95)',
      overlay: 'rgba(15, 23, 42, 0.6)',
    },

    // Border Colors
    border: {
      light: '#f1f5f9',
      medium: '#e2e8f0',
      strong: '#cbd5e1',
      focus: '#14b8a6',
    },

    // Shadow Colors
    shadow: {
      sm: 'rgba(0, 0, 0, 0.05)',
      md: 'rgba(0, 0, 0, 0.1)',
      lg: 'rgba(0, 0, 0, 0.15)',
      xl: 'rgba(0, 0, 0, 0.25)',
    },
  },

  // Dark Mode Colors
  dark: {
    text: {
      primary: '#f8fafc',        // Light slate for dark mode
      secondary: '#e2e8f0',      // Lighter slate
      muted: '#94a3b8',          // Medium slate
      inverse: '#0f172a',        // Dark slate
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      modal: 'rgba(15, 23, 42, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    border: {
      light: '#334155',
      medium: '#475569',
      strong: '#64748b',
      focus: '#14b8a6',
    },
  },
} as const;

/**
 * Color Reference Map - Maps semantic names to actual colors
 * Used for consistent application across the design system
 */
export const COLOR_REFS = {
  // Primary Actions
  primary: COLORS.primary[500],
  primaryHover: COLORS.primary[600],
  primaryActive: COLORS.primary[700],
  primaryLight: COLORS.primary[50],

  // Success States
  success: COLORS.semantic.success[500],
  successHover: COLORS.semantic.success[600],
  successLight: COLORS.semantic.success[50],

  // Warning States
  warning: COLORS.semantic.warning[500],
  warningHover: COLORS.semantic.warning[600],
  warningLight: COLORS.semantic.warning[50],

  // Error States
  error: COLORS.semantic.error[500],
  errorHover: COLORS.semantic.error[600],
  errorLight: COLORS.semantic.error[50],

  // Text
  textPrimary: COLORS.ui.text.primary,
  textSecondary: COLORS.ui.text.secondary,
  textMuted: COLORS.ui.text.muted,

  // Backgrounds
  bgPrimary: COLORS.ui.background.primary,
  bgSecondary: COLORS.ui.background.secondary,
  bgTertiary: COLORS.ui.background.tertiary,

  // Borders
  borderLight: COLORS.ui.border.light,
  borderMedium: COLORS.ui.border.medium,
  borderStrong: COLORS.ui.border.strong,
  borderFocus: COLORS.ui.border.focus,
} as const;

/**
 * Theme-aware color getter
 * Returns appropriate colors based on light/dark mode
 */
export const getThemeColors = (isDark: boolean) => ({
  text: isDark ? COLORS.dark.text : COLORS.ui.text,
  background: isDark ? COLORS.dark.background : COLORS.ui.background,
  border: isDark ? COLORS.dark.border : COLORS.ui.border,
  primary: COLORS.primary,
  semantic: COLORS.semantic,
  status: COLORS.status,
  priority: COLORS.priority,
});

export default COLORS;
