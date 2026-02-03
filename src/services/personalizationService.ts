/**
 * Personalization & User Experience Service
 * Handles API calls for Module 9: User Settings & Preferences
 */

import axios, { AxiosInstance } from 'axios';
import type {
  UserSettings,
  UpdateUserSettingsDTO,
  Language,
  DashboardLayout,
  CreateDashboardLayoutDTO,
  UpdateDashboardLayoutDTO,
  KeyboardShortcut,
} from '@/types/personalization';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000/api/v1';

class PersonalizationService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== User Preferences ====================
  
  async getUserSettings(userId: string): Promise<UserSettings> {
    const response = await this.api.get(`/users/${userId}/settings`);
    return response.data.data || response.data;
  }

  async updateUserSettings(userId: string, data: UpdateUserSettingsDTO): Promise<UserSettings> {
    const response = await this.api.patch(`/users/${userId}/settings`, data);
    return response.data.data || response.data;
  }

  async resetToDefaults(userId: string): Promise<UserSettings> {
    const response = await this.api.post(`/users/${userId}/settings/reset`);
    return response.data.data || response.data;
  }

  // ==================== Localization ====================
  
  async getAvailableLanguages(): Promise<Language[]> {
    const response = await this.api.get('/preferences/languages');
    return response.data.data || response.data;
  }

  async getTimezones(): Promise<string[]> {
    const response = await this.api.get('/preferences/timezones');
    return response.data.data || response.data;
  }

  // ==================== Dashboard Layouts ====================
  
  async getDashboardLayouts(userId: string): Promise<DashboardLayout[]> {
    const response = await this.api.get(`/users/${userId}/dashboard-layouts`);
    return response.data.data || response.data;
  }

  async getDashboardLayout(userId: string, layoutId: string): Promise<DashboardLayout> {
    const response = await this.api.get(`/users/${userId}/dashboard-layouts/${layoutId}`);
    return response.data.data || response.data;
  }

  async createDashboardLayout(userId: string, data: CreateDashboardLayoutDTO): Promise<DashboardLayout> {
    const response = await this.api.post(`/users/${userId}/dashboard-layouts`, data);
    return response.data.data || response.data;
  }

  async updateDashboardLayout(
    userId: string,
    layoutId: string,
    data: UpdateDashboardLayoutDTO
  ): Promise<DashboardLayout> {
    const response = await this.api.patch(`/users/${userId}/dashboard-layouts/${layoutId}`, data);
    return response.data.data || response.data;
  }

  async deleteDashboardLayout(userId: string, layoutId: string): Promise<void> {
    await this.api.delete(`/users/${userId}/dashboard-layouts/${layoutId}`);
  }

  async setDefaultLayout(userId: string, layoutId: string): Promise<void> {
    await this.api.post(`/users/${userId}/dashboard-layouts/${layoutId}/set-default`);
  }

  // ==================== Keyboard Shortcuts ====================
  
  async getKeyboardShortcuts(): Promise<KeyboardShortcut[]> {
    const response = await this.api.get('/preferences/keyboard-shortcuts');
    return response.data.data || response.data;
  }

  async updateKeyboardShortcut(
    shortcutId: string,
    newKey: string
  ): Promise<KeyboardShortcut> {
    const response = await this.api.patch(`/preferences/keyboard-shortcuts/${shortcutId}`, {
      key: newKey,
    });
    return response.data.data || response.data;
  }

  async resetKeyboardShortcuts(): Promise<KeyboardShortcut[]> {
    const response = await this.api.post('/preferences/keyboard-shortcuts/reset');
    return response.data.data || response.data;
  }

  // ==================== Local Storage Helpers ====================
  
  // Save theme to localStorage for immediate access
  saveThemeToLocal(theme: string): void {
    localStorage.setItem('pronaflow-theme', theme);
  }

  getThemeFromLocal(): string | null {
    return localStorage.getItem('pronaflow-theme');
  }

  // Save language to localStorage for immediate access
  saveLanguageToLocal(language: string): void {
    localStorage.setItem('pronaflow-language', language);
  }

  getLanguageFromLocal(): string | null {
    return localStorage.getItem('pronaflow-language');
  }

  // Save font size to localStorage
  saveFontSizeToLocal(fontSize: number): void {
    localStorage.setItem('pronaflow-font-size', fontSize.toString());
    document.documentElement.style.fontSize = `${fontSize}px`;
  }

  getFontSizeFromLocal(): number {
    const stored = localStorage.getItem('pronaflow-font-size');
    return stored ? parseInt(stored, 10) : 14;
  }

  // Apply settings immediately to document
  applySettings(settings: Partial<UserSettings>): void {
    if (settings.theme_mode) {
      this.saveThemeToLocal(settings.theme_mode);
      if (settings.theme_mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme_mode === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (settings.theme_mode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    }

    if (settings.language) {
      this.saveLanguageToLocal(settings.language);
    }

    if (settings.base_font_size) {
      this.saveFontSizeToLocal(settings.base_font_size);
    }

    if (settings.color_blind_mode) {
      document.documentElement.setAttribute('data-color-blind-mode', settings.color_blind_mode);
    }

    if (settings.accessibility?.reduced_motion) {
      document.documentElement.classList.toggle('reduce-motion', settings.accessibility.reduced_motion);
    }
  }
}

// Export singleton instance
export const personalizationService = new PersonalizationService();
export default personalizationService;
