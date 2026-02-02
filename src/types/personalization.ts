/**
 * User Experience Personalization Types
 * Module 9: User Preferences, Accessibility, Customization
 */

// ==================== Theme & Appearance ====================
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorBlindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
export type DensityMode = 'comfortable' | 'compact';
export type FontFamily = 'system' | 'dyslexic' | 'monospace';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

// ==================== Localization ====================
export type LanguageCode = 'en-US' | 'vi-VN';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';
export type NumberFormat = 'en-US' | 'vi-VN';

export interface Language {
  code: LanguageCode;
  name: string;
  native_name: string;
  flag: string;
}

// ==================== Notifications ====================
export type NotificationChannel = 'in_app' | 'email' | 'push';
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily';

export interface NotificationPreference {
  event_type: string;
  in_app: boolean;
  email: boolean;
  push: boolean;
}

export interface DoNotDisturbSchedule {
  enabled: boolean;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  days: string[]; // ['monday', 'tuesday', ...]
  exceptions: string[]; // Event types that bypass DND
}

// ==================== Accessibility ====================
export interface AccessibilitySettings {
  high_contrast: boolean;
  reduced_motion: boolean;
  screen_reader_enabled: boolean;
  keyboard_navigation: boolean;
  color_blind_mode: ColorBlindMode;
}

// ==================== Keyboard Shortcuts ====================
export interface KeyboardShortcut {
  id: string;
  key: string; // e.g., 'Cmd+K', 'Ctrl+B'
  description: string;
  action: string;
  category: 'navigation' | 'editing' | 'view' | 'general';
}

// ==================== Dashboard Customization ====================
export type WidgetType = 
  | 'my-tasks' 
  | 'project-progress' 
  | 'calendar' 
  | 'recent-activities'
  | 'team-members'
  | 'notifications'
  | 'quick-stats';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  is_enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config?: Record<string, any>;
}

export interface DashboardLayout {
  id: string;
  user_id: string;
  name: string;
  widgets: Widget[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== User Settings (Main) ====================
export interface UserSettings {
  id: string;
  user_id: string;
  
  // Theme & Appearance
  theme_mode: ThemeMode;
  color_blind_mode: ColorBlindMode;
  density_mode: DensityMode;
  
  // Typography
  font_family: FontFamily;
  font_size: FontSize;
  base_font_size: number; // 12, 14, 16, 18
  
  // Localization
  language: LanguageCode;
  timezone: string; // IANA timezone
  date_format: DateFormat;
  time_format: TimeFormat;
  number_format: NumberFormat;
  
  // Layout
  sidebar_collapsed: boolean;
  sidebar_mini_mode: boolean;
  
  // Accessibility
  accessibility: AccessibilitySettings;
  
  // Notifications
  notification_preferences: NotificationPreference[];
  do_not_disturb: DoNotDisturbSchedule | null;
  
  // Dashboard
  dashboard_layout_id: string | null;
  
  // Other
  created_at: string;
  updated_at: string;
}

// ==================== DTO ====================
export interface UpdateUserSettingsDTO {
  theme_mode?: ThemeMode;
  color_blind_mode?: ColorBlindMode;
  density_mode?: DensityMode;
  font_family?: FontFamily;
  font_size?: FontSize;
  language?: LanguageCode;
  timezone?: string;
  date_format?: DateFormat;
  time_format?: TimeFormat;
  sidebar_collapsed?: boolean;
  accessibility?: Partial<AccessibilitySettings>;
  notification_preferences?: NotificationPreference[];
  do_not_disturb?: DoNotDisturbSchedule | null;
}

export interface CreateDashboardLayoutDTO {
  name: string;
  widgets: Widget[];
  is_default?: boolean;
}

export interface UpdateDashboardLayoutDTO {
  name?: string;
  widgets?: Widget[];
  is_default?: boolean;
}

// ==================== Response Types ====================
export interface UserPreferencesResponse {
  success: boolean;
  data: UserSettings;
}

export interface AvailableLanguagesResponse {
  success: boolean;
  data: Language[];
}

export interface DashboardLayoutsResponse {
  success: boolean;
  data: DashboardLayout[];
}
