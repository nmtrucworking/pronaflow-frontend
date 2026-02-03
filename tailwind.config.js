import COLORS from './src/config/colors.ts';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      // Transparent
      transparent: 'transparent',
      current: 'currentColor',

      // Primary Brand Color - Emerald Green
      emerald: COLORS.primary,
      
      // Neutral/Gray - Slate
      slate: COLORS.neutral,
      gray: COLORS.neutral,

      // Semantic Colors
      success: COLORS.semantic.success,
      warning: COLORS.semantic.warning,
      error: COLORS.semantic.error,
      info: COLORS.semantic.info,

      // Additional semantic
      red: COLORS.semantic.error,
      amber: COLORS.semantic.warning,
      green: COLORS.semantic.success,

      // Priority colors
      priority: COLORS.priority,
    },
    extend: {
      fontSize: {
        // Base typography scale - sử dụng rem để đảm bảo tính nhất quán
        'xs': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],            // 16px
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],   // 18px
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.025em' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],    // 24px
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.05em' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.075em' }],        // 48px
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.075em' }],     // 60px
        
        // Specialized sizes for UI components
        'micro': ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.1em' }],      // 10px - For badges, tiny text
        'caption': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.05em' }],  // 11px - For captions, labels
        'body': ['0.9375rem', { lineHeight: '1.5', letterSpacing: '0' }],          // 15px - For body text
        'subtitle': ['1.0625rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }], // 17px - For subtitles
      },
      fontWeight: {
        'ultralight': 100,
        'thin': 200,
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
        'black': 900,
      },
      fontFamily: {
        'sans': [
          'Inter', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Helvetica Neue', 
          'Arial', 
          'sans-serif'
        ],
        'mono': [
          'JetBrains Mono',
          'Fira Code', 
          'Consolas', 
          'Monaco', 
          'Courier New', 
          'monospace'
        ],
      },
    },
  },
  plugins: [],
}