// frontend/src/utils/typography.ts

/**
 * Typography utilities cho PronaFlow
 * Đảm bảo tính nhất quán về font-size, line-height và letter-spacing
 */

export const FONT_SIZES = {
  micro: '0.625rem',      // 10px
  caption: '0.6875rem',   // 11px
  xs: '0.75rem',          // 12px
  sm: '0.875rem',         // 14px
  body: '0.9375rem',      // 15px
  base: '1rem',           // 16px
  subtitle: '1.0625rem',  // 17px
  lg: '1.125rem',         // 18px
  xl: '1.25rem',          // 20px
  '2xl': '1.5rem',        // 24px
  '3xl': '1.875rem',      // 30px
  '4xl': '2.25rem',       // 36px
  '5xl': '3rem',          // 48px
  '6xl': '3.75rem',       // 60px
} as const;

export const LINE_HEIGHTS = {
  none: '1',
  tight: '1.1',
  snug: '1.2',
  normal: '1.25',
  relaxed: '1.3',
  loose: '1.4',
  extra: '1.5',
  comfortable: '1.625',
} as const;

export const LETTER_SPACINGS = {
  tighter: '-0.075em',
  tight: '-0.05em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

/**
 * Typography preset cho các use cases phổ biến
 */
export const TYPOGRAPHY_PRESETS = {
  display: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACINGS.tight,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.tight,
  },
  headline: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.tight,
  },
  subheading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  body: {
    fontSize: FONT_SIZES.body,
    fontWeight: '400',
    lineHeight: LINE_HEIGHTS.comfortable,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  caption: {
    fontSize: FONT_SIZES.caption,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.wider,
  },
  overline: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.widest,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  buttonLarge: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  buttonSmall: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  input: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '400',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  helper: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '400',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  error: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
} as const;

/**
 * Hook để sử dụng typography presets trong React components
 */
export const useTypography = (preset: keyof typeof TYPOGRAPHY_PRESETS) => {
  return TYPOGRAPHY_PRESETS[preset];
};

/**
 * Utility để tạo CSS style object từ typography preset
 */
export const getTypographyStyle = (preset: keyof typeof TYPOGRAPHY_PRESETS) => {
  return TYPOGRAPHY_PRESETS[preset];
};

/**
 * Utility để tạo CSS classes cho typography
 */
export const getTypographyClasses = (preset: keyof typeof TYPOGRAPHY_PRESETS) => {
  const style = TYPOGRAPHY_PRESETS[preset];
  const classes = [];
  
  // Convert fontSize to Tailwind class
  const fontSizeMap: Record<string, string> = {
    [FONT_SIZES.micro]: 'text-micro',
    [FONT_SIZES.caption]: 'text-caption',
    [FONT_SIZES.xs]: 'text-xs',
    [FONT_SIZES.sm]: 'text-sm',
    [FONT_SIZES.body]: 'text-body',
    [FONT_SIZES.base]: 'text-base',
    [FONT_SIZES.subtitle]: 'text-subtitle',
    [FONT_SIZES.lg]: 'text-lg',
    [FONT_SIZES.xl]: 'text-xl',
    [FONT_SIZES['2xl']]: 'text-2xl',
    [FONT_SIZES['3xl']]: 'text-3xl',
    [FONT_SIZES['4xl']]: 'text-4xl',
    [FONT_SIZES['5xl']]: 'text-5xl',
    [FONT_SIZES['6xl']]: 'text-6xl',
  };
  
  if (fontSizeMap[style.fontSize]) {
    classes.push(fontSizeMap[style.fontSize]);
  }
  
  // Convert fontWeight to Tailwind class
  const fontWeightMap: Record<string, string> = {
    '400': 'font-normal',
    '500': 'font-medium',
    '600': 'font-semibold',
    '700': 'font-bold',
  };
  
  if (fontWeightMap[style.fontWeight]) {
    classes.push(fontWeightMap[style.fontWeight]);
  }
  
  return classes.join(' ');
};