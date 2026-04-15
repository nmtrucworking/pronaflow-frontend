/**
 * Preferences Tab Component
 * Uses personalization store for client-side preference management
 * No API calls - everything is persisted to localStorage
 */

import React, { useMemo, useEffect, useState } from 'react';
import * as Label from '@radix-ui/react-label';
import {
  Sun,
  Moon,
  Monitor,
  Globe,
  Calendar,
  Clock,
  BarChart3,
  Eye,
  Type,
  ExternalLink,
  ChevronDown,
  Check,
} from 'lucide-react';
import { usePersonalizationStore } from '@/stores/personalizationStore';

interface InputGroupProps {
  label: string;
  id: string;
  helpText?: React.ReactNode;
  children: React.ReactNode;
}

function InputGroup({ label, id, helpText, children }: InputGroupProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        {helpText && (
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {helpText}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const THEME_OPTIONS = [
  { id: 'light', label: 'Sáng', icon: Sun },
  { id: 'dark', label: 'Tối', icon: Moon },
  { id: 'system', label: 'Hệ thống', icon: Monitor },
];

const FONT_SIZE_OPTIONS = [
  { id: 'small', label: '90%' },
  { id: 'base', label: '100% (Mặc định)' },
  { id: 'large', label: '110%' },
];

const DENSITY_OPTIONS = [
  { id: 'compact', label: 'Chặt' },
  { id: 'normal', label: 'Bình thường' },
  { id: 'comfortable', label: 'Rộng' },
];

const LANGUAGE_OPTIONS = [
  { id: 'vi', label: 'Tiếng Việt' },
  { id: 'en', label: 'English' },
];

const TIMEZONE_OPTIONS = [
  { id: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (UTC+7)' },
  { id: 'Asia/Kolkata', label: 'Asia/Kolkata (UTC+5:30)' },
  { id: 'UTC', label: 'UTC (UTC+0)' },
  { id: 'America/New_York', label: 'America/New York (UTC-5/-4)' },
  { id: 'Europe/London', label: 'Europe/London (UTC+0/+1)' },
];

const COLOR_MODE_PRESETS = {
  light: { label: 'Mặc định', hint: 'Màu hiển thị cân bằng theo thiết kế hệ thống.' },
  protanopia: { label: 'Mù màu đỏ (Protanopia)', hint: 'Giảm nhầm lẫn giữa dải đỏ/xanh.' },
  deuteranopia: { label: 'Mù màu lục (Deuteranopia)', hint: 'Tăng phân tách dải xanh lá.' },
  tritanopia: { label: 'Mù màu lam (Tritanopia)', hint: 'Điều chỉnh dải xanh lam/tím.' },
  dark: { label: 'Độ tương phản cao', hint: 'Tăng khả năng đọc với tương phản cao.' },
};

export function PreferencesTab() {
  const { preferences, updatePreference, updateMultiple, isLoaded } = usePersonalizationStore();

  if (!isLoaded) {
    return <div className="text-sm text-slate-500">Đang tải...</div>;
  }

  const handleChange = (key: string, value: any) => {
    updatePreference(key as any, value);
  };

  const previewDateTime = useMemo(() => {
    const sampleDate = new Date('2026-03-01T14:35:00.000Z');

    const dateParts = new Intl.DateTimeFormat(preferences.language === 'en' ? 'en-US' : 'vi-VN', {
      timeZone: preferences.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(sampleDate);

    const getPart = (type: 'day' | 'month' | 'year') =>
      dateParts.find((part) => part.type === type)?.value ?? '--';
    const day = getPart('day');
    const month = getPart('month');
    const year = getPart('year');

    const formattedDate = `${day}/${month}/${year}`;

    const formattedTime = new Intl.DateTimeFormat(preferences.language === 'en' ? 'en-US' : 'vi-VN', {
      timeZone: preferences.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(sampleDate);

    return { formattedDate, formattedTime };
  }, [preferences.language, preferences.timezone]);

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <div className="space-y-8">
        {/* Theme Selector */}
        <div>
          <Label.Root className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
            Chế độ giao diện
          </Label.Root>
          <div className="grid grid-cols-3 gap-4">
            {THEME_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = preferences.theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('theme', item.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all active:scale-95 relative group ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md shadow-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div
                    className={`w-full h-20 rounded-lg mb-3 flex items-center justify-center ${
                      item.id === 'light'
                        ? 'bg-slate-100 border border-slate-200'
                        : item.id === 'dark'
                          ? 'bg-slate-800 border border-slate-700'
                          : 'bg-gradient-to-br from-slate-100 to-slate-800 border border-slate-200'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        item.id === 'light'
                          ? 'text-slate-500'
                          : item.id === 'dark'
                            ? 'text-slate-400'
                            : 'text-slate-600'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive
                        ? 'text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <InputGroup
            label="Kích thước chữ"
            id="font_size"
            helpText="Điều chỉnh kích thước văn bản trên toàn nền tảng"
          >
            <div className="flex gap-2">
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChange('fontSize', option.id)}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    preferences.fontSize === option.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </InputGroup>
        </div>

        {/* Density */}
        <InputGroup
          label="Mật độ giao diện"
          id="density"
          helpText="Kiểm soát khoảng cách giữa các phần tử"
        >
          <div className="flex gap-2">
            {DENSITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleChange('density', option.id)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  preferences.density === option.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </InputGroup>

        {/* Language */}
        <InputGroup label="Ngôn ngữ" id="language">
          <div className="relative">
            <select
              value={preferences.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </InputGroup>

        {/* Timezone */}
        <InputGroup label="Múi giờ" id="timezone">
          <div className="relative">
            <select
              value={preferences.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {TIMEZONE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </InputGroup>

        {/* Preview */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" /> Xem trước
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">{previewDateTime.formattedDate}</span>
            <span className="mx-2 text-slate-400">•</span>
            <span className="font-medium">{previewDateTime.formattedTime}</span>
          </div>
        </div>

        {/* Auto-collapse Sidebar */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Sidebar tự động thu gọn
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tự động ẩn sidebar khi không sử dụng để chỉnh sửa
            </p>
          </div>
          <input
            type="checkbox"
            checked={preferences.autoCollapseSidebar}
            onChange={(e) => handleChange('autoCollapseSidebar', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 cursor-pointer"
          />
        </div>

        {/* Live update notice */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800/50 flex items-start gap-2">
          <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-400">
            Các thay đổi được lưu tự động trên trình duyệt của bạn và sẽ được áp dụng ngay lập tức. Không cần nhấn nút Lưu.
          </p>
        </div>
      </div>
    </div>
  );
}
