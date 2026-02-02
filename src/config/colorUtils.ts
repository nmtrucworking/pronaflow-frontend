/**
 * COLOR UTILITIES & HELPERS
 * Helper functions for working with the centralized color system
 */

import COLORS, { COLOR_REFS, getThemeColors } from './colors';

/**
 * Get color with opacity
 * @example getColorWithOpacity('primary', 500, 0.5) => 'rgba(5, 150, 105, 0.5)'
 */
export const getColorWithOpacity = (
  colorFamily: keyof typeof COLORS,
  shade: number | string,
  opacity: number
): string => {
  const color = (COLORS[colorFamily] as any)?.[shade];
  if (!color) return '';
  
  // Handle rgb() format
  if (color.includes('rgb(')) {
    return color.replace('/ 1', `/ ${opacity}`);
  }
  
  // Handle hex format - convert to RGB
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : '';
  }
  
  return color;
};

/**
 * Convert hex color to RGB
 * @example hexToRgb('#059669') => { r: 5, g: 150, b: 105 }
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convert RGB to hex
 * @example rgbToHex(5, 150, 105) => '#059669'
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Check if color is light or dark
 * @example isLightColor('#ffffff') => true
 */
export const isLightColor = (color: string): boolean => {
  let hex = color;
  
  // Handle rgb format
  if (color.includes('rgb(')) {
    const rgb = color.match(/\d+/g);
    if (rgb) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }
  }
  
  // Handle hex format
  const rgb = hexToRgb(hex);
  if (rgb) {
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  }
  
  return false;
};

/**
 * Get contrasting text color (black or white) for a background color
 * @example getContrastingColor('#059669') => '#ffffff'
 */
export const getContrastingColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
};

/**
 * Get color by semantic name
 * @example getSemanticColor('success') => 'rgb(5 150 105 / 1)'
 */
export const getSemanticColor = (semantic: keyof typeof COLORS['semantic']): string => {
  return COLORS.semantic[semantic][500];
};

/**
 * Get priority color by level
 * @example getPriorityColor('high') => '#f97316'
 */
export const getPriorityColor = (priority: keyof typeof COLORS['priority']): string => {
  return COLORS.priority[priority];
};

/**
 * Get status color
 * @example getStatusColor('success') => 'rgb(5 150 105 / 1)'
 */
export const getStatusColor = (status: keyof typeof COLORS['status']): string => {
  return COLORS.status[status];
};

/**
 * Generate color palette from base color
 * Returns 10 shades from lightest to darkest
 */
export const generateColorPalette = (baseColor: string): string[] => {
  // This is a simplified version - in production, use a color library like chroma.js
  // For now, return the predefined palette
  return Object.values(COLORS.primary);
};

/**
 * Blend two colors together
 * @example blendColors('#ffffff', '#059669', 0.5) => middle color
 */
export const blendColors = (color1: string, color2: string, ratio: number): string => {
  const c1 = hexToRgb(color1) || { r: 255, g: 255, b: 255 };
  const c2 = hexToRgb(color2) || { r: 5, g: 150, b: 105 };
  
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  
  return rgbToHex(r, g, b);
};

/**
 * Get theme colors based on dark mode preference
 */
export const useColorSystem = (isDarkMode: boolean = false) => {
  return {
    colors: COLORS,
    refs: COLOR_REFS,
    theme: getThemeColors(isDarkMode),
    utils: {
      getColorWithOpacity,
      getContrastingColor,
      getSemanticColor,
      getPriorityColor,
      getStatusColor,
      blendColors,
    },
  };
};

export default {
  getColorWithOpacity,
  hexToRgb,
  rgbToHex,
  isLightColor,
  getContrastingColor,
  getSemanticColor,
  getPriorityColor,
  getStatusColor,
  generateColorPalette,
  blendColors,
  useColorSystem,
};
