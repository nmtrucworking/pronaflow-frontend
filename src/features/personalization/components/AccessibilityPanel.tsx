/**
 * Accessibility Settings Panel
 * Module 9: User Experience Personalization
 * Advanced accessibility controls (font, color blindness, motion, contrast)
 */

import React from 'react';
import { Eye, Type, Palette, Zap, Volume2, MousePointer2 } from 'lucide-react';
import { useUserSettings, useUpdateUserSettings } from '@/hooks/usePersonalization';
import { ColorBlindMode, FontFamily, DensityMode } from '@/types/personalization';

const AccessibilityPanel: React.FC = () => {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  if (isLoading || !settings) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    );
  }

  const accessibility = settings.accessibility;

  const handleToggle = (key: keyof typeof accessibility, value: any) => {
    updateSettings.mutate({
      accessibility: {
        ...accessibility,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Typography */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Typography
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customize text appearance for better readability
            </p>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Font Size: {accessibility.fontSize}px
              </span>
              <span className="text-xs text-slate-500">
                Preview: <span style={{ fontSize: `${accessibility.fontSize}px` }}>Aa</span>
              </span>
            </label>
            <input
              type="range"
              min="12"
              max="20"
              step="2"
              value={accessibility.fontSize}
              onChange={(e) => handleToggle('fontSize', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>12px (Small)</span>
              <span>14px (Default)</span>
              <span>16px (Medium)</span>
              <span>18px (Large)</span>
              <span>20px (Extra Large)</span>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Font Family
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['system', 'dyslexic', 'monospace'] as FontFamily[]).map((font) => (
                <button
                  key={font}
                  onClick={() => handleToggle('fontFamily', font)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    accessibility.fontFamily === font
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{font}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {font === 'system' && 'Default'}
                    {font === 'dyslexic' && 'Easier to read'}
                    {font === 'monospace' && 'Fixed width'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color Vision */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Color Vision Deficiency
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Apply color filters for color blindness support
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'none', label: 'None', description: 'No filter' },
            { value: 'deuteranopia', label: 'Deuteranopia', description: 'Red-green (most common)' },
            { value: 'protanopia', label: 'Protanopia', description: 'Red-blind' },
            { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-yellow' },
          ] as const).map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleToggle('colorBlindMode', mode.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                accessibility.colorBlindMode === mode.value
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm text-slate-900 dark:text-white">
                {mode.label}
              </div>
              <div className="text-xs text-slate-500 mt-1">{mode.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Visual Preferences
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Adjust visual effects and animations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* High Contrast */}
          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">High Contrast Mode</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Increase contrast for better visibility
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={(e) => handleToggle('highContrast', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">Reduce Motion</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Minimize animations and transitions
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibility.reducedMotion}
              onChange={(e) => handleToggle('reducedMotion', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>

          {/* Screen Reader Support */}
          <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">Screen Reader Optimizations</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Enhance experience for screen readers
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibility.screenReaderOptimized}
              onChange={(e) => handleToggle('screenReaderOptimized', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* Information Density */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Information Density
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Control spacing and layout density
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(['comfortable', 'compact'] as DensityMode[]).map((density) => (
            <button
              key={density}
              onClick={() => handleToggle('density', density)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                accessibility.density === density
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="font-medium text-sm text-slate-900 dark:text-white capitalize">
                {density}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {density === 'comfortable' ? 'More spacing' : 'Condensed view'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
