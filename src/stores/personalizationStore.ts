/**
 * Personalization Store
 * Global state management for user preferences
 * No API calls - everything is client-side
 */

import React from 'react';
import { create } from 'zustand';

// Preference interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'base' | 'large';
  density: 'compact' | 'normal' | 'comfortable';
  language: 'vi' | 'en';
  timezone: string;
  autoCollapseSidebar: boolean;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'base',
  density: 'normal',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  autoCollapseSidebar: false,
};

const STORAGE_KEY = 'pronaflow-user-preferences';

interface PersonalizationStore {
  // State
  preferences: UserPreferences;
  isLoaded: boolean;

  // Actions
  initializeFromStorage: () => void;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updateMultiple: (updates: Partial<UserPreferences>) => void;
  resetToDefaults: () => void;
}

export const usePersonalizationStore = create<PersonalizationStore>((set, get) => ({
    // Initial state
    preferences: DEFAULT_PREFERENCES,
    isLoaded: false,

    // Initialize from browser storage
    initializeFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserPreferences;
          set({
            preferences: {
              ...DEFAULT_PREFERENCES,
              ...parsed,
            },
            isLoaded: true,
          });
          // Apply theme immediately
          applyPreferencesToDOM(parsed);
        } else {
          set({ isLoaded: true });
          applyPreferencesToDOM(DEFAULT_PREFERENCES);
        }
      } catch (error) {
        console.error('Failed to load preferences from storage', error);
        set({ isLoaded: true });
        applyPreferencesToDOM(DEFAULT_PREFERENCES);
      }
    },

    // Update single preference
    updatePreference: (key: any, value: any) => {
      const current = get().preferences;
      const updated: UserPreferences = {
        ...current,
        [key]: value,
      };

      set({ preferences: updated });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Apply to DOM if visual preference
      if (['theme', 'fontSize', 'density', 'language', 'timezone'].includes(key)) {
        applyPreferencesToDOM(updated);
      }

      // Dispatch custom event for other listeners
      window.dispatchEvent(
        new CustomEvent('preferences-changed', { detail: { key, value } })
      );
    },

    // Update multiple preferences at once
    updateMultiple: (updates: any) => {
      const current = get().preferences;
      const updated: UserPreferences = {
        ...current,
        ...updates,
      };

      set({ preferences: updated });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      applyPreferencesToDOM(updated);

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent('preferences-changed', { detail: updates })
      );
    },

    // Reset to default
    resetToDefaults: () => {
      set({
        preferences: DEFAULT_PREFERENCES,
      });
      localStorage.removeItem(STORAGE_KEY);
      applyPreferencesToDOM(DEFAULT_PREFERENCES);

      window.dispatchEvent(
        new CustomEvent('preferences-reset', {})
      );
    },
  })
);

/**
 * Apply preferences to DOM
 */
function applyPreferencesToDOM(preferences: UserPreferences) {
  const root = document.documentElement;

  // Theme
  if (preferences.theme === 'system') {
    root.classList.remove('light', 'dark');
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(isDark ? 'dark' : 'light');
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(preferences.theme === 'dark' ? 'dark' : 'light');
  }

  // Font size
  root.style.setProperty(
    '--font-size-scale',
    preferences.fontSize === 'small' ? '0.9' : preferences.fontSize === 'large' ? '1.1' : '1'
  );

  // Density
  root.style.setProperty(
    '--density',
    preferences.density === 'compact' ? '0.8' : preferences.density === 'comfortable' ? '1' : '1.2'
  );

  // Language
  document.documentElement.lang = preferences.language || 'vi';

  // Timezone (stored in state, not applied to DOM)
}

/**
 * Hook to use personalization store
 */
export const usePersonalization = () => {
  return usePersonalizationStore();
};

/**
 * Hook to select specific preference (for performance)
 */
export const usePreference = <K extends keyof UserPreferences>(key: K) => {
  return usePersonalizationStore((state) => state.preferences[key]);
};
