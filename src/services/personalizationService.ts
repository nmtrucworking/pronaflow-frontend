/**
 * Personalization & User Experience Service
 * Handles API calls for Module 9: User Settings & Preferences
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';
import type {
  UserSettings,
  UpdateUserSettingsDTO,
  Language,
  DashboardLayout,
  DashboardLayoutConfig,
  CreateDashboardLayoutDTO,
  UpdateDashboardLayoutDTO,
  KeyboardShortcut,
  NotificationPreference,
  Widget,
} from '@/types/personalization';

interface DashboardLayoutApiResponse {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  layout_config?: DashboardLayoutConfig;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardLayoutListApiResponse {
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
  items: DashboardLayoutApiResponse[];
}

interface NotificationPreferenceListApiResponse {
  total: number;
  items: NotificationPreference[];
}

const toFallbackWidget = (item: any, index: number): Widget => ({
  id: item?.id || `widget-${index}`,
  type: item?.type || 'quick-stats',
  title: item?.title || 'Widget',
  description: item?.description || 'Custom widget',
  icon: item?.icon || 'layout-grid',
  is_enabled: item?.is_enabled ?? item?.visible ?? true,
  size: item?.size || 'medium',
  position: item?.position || { x: item?.x || 0, y: item?.y || index },
  config: item?.config || {},
});

const normalizeWidgets = (layoutConfig?: DashboardLayoutConfig): Widget[] => {
  const rawWidgets = Array.isArray(layoutConfig?.widgets) ? layoutConfig?.widgets : [];
  return rawWidgets.map((item, index) => toFallbackWidget(item, index));
};

const normalizeDashboardLayout = (layout: DashboardLayoutApiResponse): DashboardLayout => {
  const widgets = normalizeWidgets(layout.layout_config);
  return {
    id: layout.id,
    user_id: layout.user_id,
    workspace_id: layout.workspace_id,
    name: layout.name,
    layout_config: layout.layout_config || { widgets },
    widgets,
    is_active: layout.is_active,
    is_default: layout.is_active,
    created_at: layout.created_at,
    updated_at: layout.updated_at,
  };
};

class PersonalizationService {
  private api: AxiosInstance;
  private readonly basePath = '/personalization';

  constructor() {
    this.api = createApiClient();
  }

  // ==================== User Preferences ====================
  
  async getUserSettings(userId: string): Promise<UserSettings> {
    const response = await this.api.get(`${this.basePath}/settings`);
    return response.data.data || response.data;
  }

  async updateUserSettings(userId: string, data: UpdateUserSettingsDTO): Promise<UserSettings> {
    const response = await this.api.put(`${this.basePath}/settings`, data);
    return response.data.data || response.data;
  }

  async resetToDefaults(userId: string): Promise<UserSettings> {
    await this.api.post(`${this.basePath}/reset`);
    return this.getUserSettings(userId);
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
  
  async getDashboardLayouts(workspaceId: string): Promise<DashboardLayout[]> {
    const response = await this.api.get<DashboardLayoutListApiResponse>(`${this.basePath}/dashboard/layouts`, {
      params: { workspace_id: workspaceId },
    });
    return (response.data.items || []).map(normalizeDashboardLayout);
  }

  async getDashboardLayout(workspaceId: string, layoutId: string): Promise<DashboardLayout> {
    const layouts = await this.getDashboardLayouts(workspaceId);
    const layout = layouts.find((item) => item.id === layoutId);
    if (!layout) {
      throw new Error('Dashboard layout not found');
    }
    return layout;
  }

  async createDashboardLayout(workspaceId: string, data: CreateDashboardLayoutDTO): Promise<DashboardLayout> {
    const response = await this.api.post<DashboardLayoutApiResponse>(`${this.basePath}/dashboard/layouts`, {
      ...data,
      workspace_id: workspaceId,
    });
    return normalizeDashboardLayout(response.data);
  }

  async updateDashboardLayout(
    workspaceId: string,
    layoutId: string,
    data: UpdateDashboardLayoutDTO
  ): Promise<DashboardLayout> {
    const response = await this.api.put<DashboardLayoutApiResponse>(`${this.basePath}/dashboard/layouts/${layoutId}`, data);
    return normalizeDashboardLayout(response.data);
  }

  async deleteDashboardLayout(workspaceId: string, layoutId: string): Promise<void> {
    await this.api.delete(`${this.basePath}/dashboard/layouts/${layoutId}`);
  }

  async setDefaultLayout(workspaceId: string, layoutId: string): Promise<void> {
    await this.updateDashboardLayout(workspaceId, layoutId, { is_active: true });
  }

  // ==================== Keyboard Shortcuts ====================

  // ==================== Notification Preferences ====================

  async getNotificationPreferences(): Promise<NotificationPreference[]> {
    const response = await this.api.get<NotificationPreferenceListApiResponse>(
      `${this.basePath}/notifications/preferences`
    );
    return response.data.items || [];
  }

  async updateNotificationPreference(
    eventType: string,
    data: Partial<NotificationPreference>
  ): Promise<NotificationPreference> {
    const response = await this.api.put<NotificationPreference>(
      `${this.basePath}/notifications/preferences/${eventType}`,
      data
    );
    return response.data;
  }
  
  async getKeyboardShortcuts(): Promise<KeyboardShortcut[]> {
    const response = await this.api.get(`${this.basePath}/shortcuts/cheatsheet`);
    const shortcuts = response.data?.shortcuts || [];
    return shortcuts.map((item: { key: string; action: string; context?: string }, index: number) => ({
      id: `${item.action}-${index}`,
      key: item.key,
      description: item.context || 'Global',
      action: item.action,
      category: 'general' as const,
    }));
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
