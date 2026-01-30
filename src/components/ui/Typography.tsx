import React from 'react';
import { cn } from '../../lib/utils';
import { getTypographyStyle, TYPOGRAPHY_PRESETS } from '../../utils/typography';

// Typography Scale Interfaces
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

interface LabelProps extends TypographyProps {
  htmlFor?: string;
}

type TypographyVariant = keyof typeof TYPOGRAPHY_PRESETS;

interface StyledTypographyProps extends TypographyProps {
  variant?: TypographyVariant;
  useInlineStyle?: boolean;
}

// Display Typography (Largest headings)
export const Display = ({ children, className, as: Component = 'h1' }: TypographyProps) => (
  <Component className={cn("text-display", className)}>
    {children}
  </Component>
);

// Title Typography (Main headings)
export const Title = ({ children, className, as: Component = 'h2' }: TypographyProps) => (
  <Component className={cn("text-title", className)}>
    {children}
  </Component>
);

// Headline Typography (Section headings)
export const Headline = ({ children, className, as: Component = 'h3' }: TypographyProps) => (
  <Component className={cn("text-headline", className)}>
    {children}
  </Component>
);

// Subheading Typography
export const Subheading = ({ children, className, as: Component = 'h4' }: TypographyProps) => (
  <Component className={cn("text-subheading", className)}>
    {children}
  </Component>
);

// Body Text Typography
export const Body = ({ children, className, as: Component = 'p' }: TypographyProps) => (
  <Component className={cn("text-body", className)}>
    {children}
  </Component>
);

// Caption Typography (Small descriptive text)
export const Caption = ({ children, className, as: Component = 'span' }: TypographyProps) => (
  <Component className={cn("text-caption", className)}>
    {children}
  </Component>
);

// Overline Typography (Labels, badges, categories)
export const Overline = ({ children, className, as: Component = 'span' }: TypographyProps) => (
  <Component className={cn("text-overline", className)}>
    {children}
  </Component>
);

// Code Typography
export const Code = ({ children, className, as: Component = 'code' }: TypographyProps) => (
  <Component className={cn("font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded", className)}>
    {children}
  </Component>
);

// Helper Typography for forms
export const Label = ({ children, className, htmlFor, as: Component = 'label' }: LabelProps) => (
  <Component className={cn("label-text", className)} {...(htmlFor && { htmlFor })}>
    {children}
  </Component>
);

export const HelperText = ({ children, className, as: Component = 'span' }: TypographyProps) => (
  <Component className={cn("helper-text", className)}>
    {children}
  </Component>
);

export const ErrorText = ({ children, className, as: Component = 'span' }: TypographyProps) => (
  <Component className={cn("error-text", className)}>
    {children}
  </Component>
);

// Typography Size Utilities (if you need direct size control)
export const TextSize = {
  micro: "text-micro",
  caption: "text-caption", 
  xs: "text-xs",
  sm: "text-sm",
  body: "text-body",
  base: "text-base",
  subtitle: "text-subtitle",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
} as const;

export const FontWeight = {
  ultralight: "font-ultralight",
  thin: "font-thin",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
} as const;

// Export all as Typography namespace
export const Typography = {
  Display,
  Title,
  Headline,
  Subheading,
  Body,
  Caption,
  Overline,
  Code,
  Label,
  HelperText,
  ErrorText,
  TextSize,
  FontWeight,
};