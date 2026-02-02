/**
 * PRONAFLOW GANTT CHART THEME SYSTEM
 * Advanced theming support with light/dark mode using centralized color palette
 */

import COLORS from '../config/colors';

export interface GanttTheme {
  colors: {
    primary: {
      50: string;
      100: string;
      500: string;
      600: string;
      700: string;
      900: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      modal: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      light: string;
      medium: string;
      strong: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    priority: {
      urgent: string;
      high: string;
      normal: string;
      low: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontSize: {
      caption: string;
      small: string;
      body: string;
      heading: string;
      title: string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      black: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    large: string;
  };
}

export const lightTheme: GanttTheme = {
  colors: {
    primary: {
      50: COLORS.primary[50],
      100: COLORS.primary[100],
      500: COLORS.primary[500],
      600: COLORS.primary[600],
      700: COLORS.primary[700],
      900: COLORS.primary[900],
    },
    background: {
      primary: COLORS.ui.background.primary,
      secondary: COLORS.ui.background.secondary,
      tertiary: COLORS.ui.background.tertiary,
      modal: COLORS.ui.background.modal,
      overlay: COLORS.ui.background.overlay,
    },
    text: {
      primary: COLORS.ui.text.primary,
      secondary: COLORS.ui.text.secondary,
      muted: COLORS.ui.text.muted,
      inverse: COLORS.ui.text.inverse,
    },
    border: {
      light: COLORS.ui.border.light,
      medium: COLORS.ui.border.medium,
      strong: COLORS.ui.border.strong,
    },
    status: {
      success: COLORS.status.success,
      warning: COLORS.status.warning,
      error: COLORS.status.error,
      info: COLORS.status.info,
    },
    priority: {
      urgent: COLORS.priority.urgent,
      high: COLORS.priority.high,
      normal: COLORS.priority.normal,
      low: COLORS.priority.low,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  typography: {
    fontSize: {
      caption: '0.625rem',
      small: '0.75rem',
      body: '0.875rem',
      heading: '1.125rem',
      title: '1.5rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: `0 1px 2px 0 ${COLORS.ui.shadow.sm}`,
    md: `0 4px 6px -1px ${COLORS.ui.shadow.md}`,
    lg: `0 10px 15px -3px ${COLORS.ui.shadow.lg}`,
    xl: `0 25px 50px -12px ${COLORS.ui.shadow.xl}`,
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    large: '1280px',
  },
};

export const darkTheme: GanttTheme = {
  ...lightTheme,
  colors: {
    primary: {
      50: COLORS.primary[900],
      100: COLORS.primary[800],
      500: COLORS.primary[500],
      600: COLORS.primary[600],
      700: COLORS.primary[400],
      900: COLORS.primary[200],
    },
    background: {
      primary: COLORS.dark.background.primary,
      secondary: COLORS.dark.background.secondary,
      tertiary: COLORS.dark.background.tertiary,
      modal: COLORS.dark.background.modal,
      overlay: COLORS.dark.background.overlay,
    },
    text: {
      primary: COLORS.dark.text.primary,
      secondary: COLORS.dark.text.secondary,
      muted: COLORS.dark.text.muted,
      inverse: COLORS.dark.text.inverse,
    },
    border: {
      light: COLORS.dark.border.light,
      medium: COLORS.dark.border.medium,
      strong: COLORS.dark.border.strong,
    },
    status: {
      success: COLORS.status.success,
      warning: COLORS.status.warning,
      error: COLORS.status.error,
      info: COLORS.status.info,
    },
    priority: {
      urgent: COLORS.priority.urgent,
      high: COLORS.priority.high,
      normal: COLORS.priority.normal,
      low: COLORS.priority.low,
    },
  },
};

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: GanttTheme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}