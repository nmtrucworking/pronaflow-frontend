# Color System Reference - PronaFlow

> Professional Color Design System with centralized palette management

## Overview

The PronaFlow design system uses a centralized color palette defined in `src/config/colors.ts`. All components, themes, and CSS variables derive from this single source of truth.

## Color Palette Structure

### Primary Brand Color - Emerald Green

The main brand identity built around emerald green with 10 shades:

```
Primary 50:   #f0fdf4   - Lightest (backgrounds)
Primary 100:  #dcfce7   
Primary 200:  #bbf7d0   
Primary 300:  #86efac   
Primary 400:  #4ade80   
Primary 500:  rgb(5 150 105 / 1)  ← MAIN BRAND COLOR
Primary 600:  #059669   - Interactive states
Primary 700:  #047857   - Hover states
Primary 800:  #065f46   
Primary 900:  #064e3b   - Darkest (dark mode)
```

### Semantic Colors

| Type | Color | Usage |
|------|-------|-------|
| **Success** | Emerald (#059669) | Completed tasks, successful operations |
| **Warning** | Amber (#f59e0b) | Pending, caution, attention needed |
| **Error** | Red (#ef4444) | Errors, critical, deletions |
| **Info** | Emerald (#059669) | Information, general alerts |

### Priority System

| Level | Color | Hex |
|-------|-------|-----|
| **Urgent** | Red | #ef4444 |
| **High** | Orange | #f97316 |
| **Normal** | Emerald | rgb(5 150 105) |
| **Low** | Slate | #94a3b8 |

### Neutral/Grayscale (Slate)

Used for text, borders, and backgrounds:

```
Neutral 50:   #f8fafc   - Lightest background
Neutral 100:  #f1f5f9
Neutral 200:  #e2e8f0   - Light borders
Neutral 300:  #cbd5e1
Neutral 400:  #94a3b8   - Muted text
Neutral 500:  #64748b
Neutral 600:  #475569
Neutral 700:  #334155   - Secondary text
Neutral 800:  #1e293b
Neutral 900:  #0f172a   - Dark text/backgrounds
```

## Usage Guide

### 1. Using CSS Variables (Recommended for CSS/HTML)

All colors are available as CSS custom properties in `src/index.css`:

```css
/* Primary colors */
color: var(--color-primary-500);
background: var(--color-primary-50);
border: 1px solid var(--color-border-focus);

/* Semantic colors */
color: var(--color-success);
background: var(--color-error);

/* UI colors - Responsive to light/dark mode */
color: var(--color-text-primary);
background: var(--color-bg-primary);
border: 1px solid var(--color-border-medium);
```

### 2. Using Tailwind Classes (Recommended for Components)

All Tailwind color utilities automatically use the palette:

```jsx
<button className="bg-emerald-600 text-white hover:bg-emerald-700">
  Primary Action
</button>

<div className="bg-success text-white">Success Alert</div>

<span className="text-error font-semibold">Error Message</span>
```

### 3. Using TypeScript Color Constants (Recommended for JS Logic)

Import colors directly in TypeScript/React:

```tsx
import COLORS, { COLOR_REFS } from '@/config/colors';

// Get specific colors
const primaryColor = COLORS.primary[500];
const successBg = COLORS.semantic.success[50];

// Use semantic references
const buttonColor = COLOR_REFS.primary;
const hoverColor = COLOR_REFS.primaryHover;

// Get theme-aware colors
import { getThemeColors } from '@/config/colors';
const { text, background } = getThemeColors(isDarkMode);
const textColor = text.primary;
```

## Light Mode vs Dark Mode

### Light Mode (Default)

- **Text**: `var(--color-text-primary)` (#0f172a - Dark slate)
- **Background**: `var(--color-bg-primary)` (White)
- **Borders**: `var(--color-border-medium)` (#e2e8f0)

### Dark Mode

Automatically activated by `@media (prefers-color-scheme: dark)`:

- **Text**: `var(--color-text-primary)` (#f8fafc - Light slate)
- **Background**: `var(--color-bg-primary)` (#0f172a - Dark slate)
- **Borders**: `var(--color-border-medium)` (#475569)

## Color Files Reference

| File | Purpose | Usage |
|------|---------|-------|
| `src/config/colors.ts` | **Source of Truth** - All color definitions | Import in components, themes, and configs |
| `src/index.css` | CSS Variables - Light/dark mode | Use in CSS and Tailwind classes |
| `tailwind.config.js` | Tailwind Configuration | Syncs with colors.ts automatically |
| `src/themes/gantt-theme.ts` | Theme System - Theme object definitions | Used by theme provider and context |
| `src/styles/gantt-theme.css` | Gantt Chart CSS - Library overrides | Uses CSS variables for consistency |

## Implementation Examples

### Button Component

```tsx
import { COLORS } from '@/config/colors';

export function Button() {
  return (
    <button 
      className="px-4 py-2 rounded-lg font-semibold"
      style={{
        backgroundColor: COLORS.primary[600],
        color: 'white',
      }}
    >
      Primary Action
    </button>
  );
}
```

### Card Component with Variants

```tsx
import COLORS from '@/config/colors';

function Card({ variant = 'default' }) {
  const variants = {
    default: {
      bg: COLORS.ui.background.primary,
      border: COLORS.ui.border.medium,
      text: COLORS.ui.text.primary,
    },
    success: {
      bg: COLORS.semantic.success[50],
      border: COLORS.semantic.success[500],
      text: COLORS.semantic.success[900],
    },
    error: {
      bg: COLORS.semantic.error[50],
      border: COLORS.semantic.error[500],
      text: COLORS.semantic.error[900],
    },
  };

  return (
    <div 
      style={{
        backgroundColor: variants[variant].bg,
        borderColor: variants[variant].border,
        color: variants[variant].text,
      }}
    >
      {/* Content */}
    </div>
  );
}
```

### Using with Theme Context

```tsx
import { useTheme } from '@/themes/ThemeProvider';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div 
      style={{
        color: theme.colors.text.primary,
        background: theme.colors.background.primary,
        border: `1px solid ${theme.colors.border.medium}`,
      }}
    >
      {/* Theme-aware content */}
    </div>
  );
}
```

## Color Update Workflow

When you need to change the brand color or update the palette:

1. **Edit `src/config/colors.ts`** - Update the COLORS object
2. **CSS variables automatically update** - Since `tailwind.config.js` imports from colors.ts
3. **All components automatically reflect changes** - Through Tailwind, CSS vars, and theme context

## Accessibility Considerations

- All text colors meet WCAG AA contrast requirements
- Primary color (Emerald) has strong contrast on light and dark backgrounds
- Error states use red with sufficient contrast
- Consider `prefers-color-scheme` for system preference support

## Integration with Tools

- **Figma**: Export palette as color library
- **Storybook**: Use COLOR_REFS for component stories
- **Testing**: Mock color values from COLORS constant
- **CSS-in-JS**: Use COLOR_REFS for dynamic styling

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Maintained By**: PronaFlow Design System Team
