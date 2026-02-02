/**
 * Design System Configuration Index
 * Central export point for all design tokens and utilities
 */

export { default as COLORS, COLOR_REFS, getThemeColors } from './colors';
export type { } from './colors';

export {
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
} from './colorUtils';

// Re-export commonly used values
export const {
  primary,
  neutral,
  semantic,
  status,
  priority,
  ui,
  dark,
} = require('./colors').default;
