/**
 * THEME CONTEXT PROVIDER
 * React Context for managing theme state across the Gantt Chart application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { lightTheme, darkTheme } from './gantt-theme';
import type { ThemeMode, ThemeContextType } from './gantt-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'system', 
  storageKey = 'pronaflow-gantt-theme' 
}: ThemeProviderProps) {
  const getSystemMode = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [preference, setPreference] = useState<ThemeMode>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return defaultTheme;
  });

  const mode = preference === 'system' ? getSystemMode() : preference;
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setPreference(prev => {
      const currentMode = prev === 'system' ? getSystemMode() : prev;
      return currentMode === 'light' ? 'dark' : 'light';
    });
  };

  const setTheme = (newMode: ThemeMode) => {
    setPreference(newMode);
  };

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, preference);
    }
  }, [preference, storageKey]);

  // Apply theme class to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mode);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined' || preference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const value: ThemeContextType = {
    theme,
    mode,
    preference,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Theme-aware styled component helpers
export const createThemeAwareClass = (
  lightClass: string,
  darkClass?: string
): string => {
  if (!darkClass) {
    return lightClass;
  }
  return `${lightClass} dark:${darkClass}`;
};

// CSS-in-JS style helper for theme values
export const useThemeStyles = () => {
  const { theme } = useTheme();
  
  return {
    primary: theme.colors.primary,
    background: theme.colors.background,
    text: theme.colors.text,
    border: theme.colors.border,
    spacing: theme.spacing,
    typography: theme.typography,
    borderRadius: theme.borderRadius,
    shadows: theme.shadows,
  };
};