/**
 * PRONAFLOW GANTT CHART THEME SYSTEM
 * Advanced theming support with light/dark mode and responsive design tokens
 */

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
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      modal: 'rgba(255, 255, 255, 0.95)',
      overlay: 'rgba(15, 23, 42, 0.6)',
    },
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      inverse: '#ffffff',
    },
    border: {
      light: '#f1f5f9',
      medium: '#e2e8f0',
      strong: '#cbd5e1',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    priority: {
      urgent: '#ef4444',
      high: '#f97316',
      normal: '#3b82f6',
      low: '#64748b',
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
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
      50: '#1e293b',
      100: '#334155',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#60a5fa',
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      modal: 'rgba(15, 23, 42, 0.95)',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      muted: '#94a3b8',
      inverse: '#0f172a',
    },
    border: {
      light: '#334155',
      medium: '#475569',
      strong: '#64748b',
    },
    status: {
      success: '#22c55e',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    priority: {
      urgent: '#f87171',
      high: '#fb7185',
      normal: '#60a5fa',
      low: '#94a3b8',
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