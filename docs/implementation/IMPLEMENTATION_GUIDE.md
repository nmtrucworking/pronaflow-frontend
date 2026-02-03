# Color System Implementation Guide

## Quick Start

### 1. **For CSS/HTML Styling**
Use CSS variables that automatically support light/dark mode:

```css
.my-component {
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-medium);
}
```

### 2. **For React Components (Tailwind)**
Use Tailwind classes which use the unified color palette:

```jsx
<button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
  Primary Action
</button>
```

### 3. **For TypeScript/React Logic**
Import and use color constants:

```tsx
import { COLORS, COLOR_REFS } from '@/config/colors';

const textColor = COLORS.ui.text.primary;
const buttonColor = COLOR_REFS.primary;
```

### 4. **For Pre-built Token Classes**
Use pre-configured color token classes:

```jsx
<button className="token-action-primary">Primary Button</button>
<div className="token-card-base">Card Content</div>
<span className="token-badge-success">Success</span>
```

## File Structure

```
src/config/
├── colors.ts          ← Source of Truth for all colors
├── colorUtils.ts      ← Helper functions and utilities
└── index.ts           ← Central export point

src/styles/
├── color-tokens.css   ← Pre-built color token classes
├── gantt-theme.css    ← Gantt chart using CSS variables
└── index.css          ← Global CSS with variables

tailwind.config.js    ← Uses colors.ts for Tailwind palette
```

## Integration Points

### ✅ Auto-synced Components

These automatically use the color system without changes:

1. **All Tailwind classes** - Color utilities automatically use the palette
2. **CSS Variables** - Update in light/dark mode automatically
3. **Theme System** - Theme context provides theme object

### 🔄 Migration Path

If you have hardcoded colors in components:

**Before:**
```tsx
<button style={{ backgroundColor: '#3b82f6' }}>Button</button>
```

**After:**
```tsx
<button className="bg-emerald-600">Button</button>
// or
<button style={{ backgroundColor: COLORS.primary[600] }}>Button</button>
```

## Component Examples

### Custom Button Component

```tsx
import COLORS, { getContrastingColor } from '@/config/colors';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  const colorMap = {
    primary: {
      bg: COLORS.primary[600],
      text: getContrastingColor(COLORS.primary[600]),
      hover: COLORS.primary[700],
    },
    secondary: {
      bg: COLORS.neutral[200],
      text: COLORS.neutral[900],
      hover: COLORS.neutral[300],
    },
    danger: {
      bg: COLORS.semantic.error[500],
      text: 'white',
      hover: COLORS.semantic.error[600],
    },
  };

  const colors = colorMap[variant];

  return (
    <button
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.bg;
      }}
    >
      {children}
    </button>
  );
}
```

### Status Badge Component

```tsx
import { getStatusColor, getSemanticColor, COLORS } from '@/config/colors';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info';
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const bgColor = COLORS.semantic[status][50];
  const textColor = COLORS.semantic[status][700];
  const borderColor = COLORS.semantic[status][200];

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
      }}
    >
      {label}
    </span>
  );
}
```

### Theme-aware Component

```tsx
import { useTheme } from '@/themes/ThemeProvider';

export function DynamicCard() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        color: theme.colors.text.primary,
        backgroundColor: theme.colors.background.primary,
        border: `1px solid ${theme.colors.border.medium}`,
      }}
    >
      This card automatically adapts to light/dark mode
    </div>
  );
}
```

## CSS Variables Reference

### Primary Colors
```css
--color-primary-50 through --color-primary-900
--color-primary-500  /* Main brand color */
```

### Semantic Colors
```css
--color-success    /* Success state */
--color-warning    /* Warning state */
--color-error      /* Error state */
--color-info       /* Info state */
```

### UI Colors
```css
--color-text-primary      /* Main text */
--color-text-secondary    /* Secondary text */
--color-text-muted        /* Muted text */
--color-text-inverse      /* Inverse (white on dark) */

--color-bg-primary        /* Main background */
--color-bg-secondary      /* Secondary background */
--color-bg-tertiary       /* Tertiary background */

--color-border-light      /* Light borders */
--color-border-medium     /* Medium borders */
--color-border-strong     /* Strong borders */
--color-border-focus      /* Focus state borders */
```

### Priority Colors
```css
--color-priority-urgent   /* Urgent tasks */
--color-priority-high     /* High priority */
--color-priority-normal   /* Normal priority */
--color-priority-low      /* Low priority */
```

## Light/Dark Mode Support

The color system automatically responds to system preferences:

```css
/* Automatically applied in dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #f8fafc;
    --color-bg-primary: #0f172a;
    /* ... other dark mode colors */
  }
}
```

To force dark mode in components:

```tsx
<div className="dark">
  {/* This section uses dark mode colors */}
</div>
```

## Testing Color System

### Unit Test Example
```tsx
import { COLORS, getContrastingColor } from '@/config/colors';

describe('Color System', () => {
  test('should have primary color defined', () => {
    expect(COLORS.primary[500]).toBe('rgb(5 150 105 / 1)');
  });

  test('should get contrasting color', () => {
    const contrast = getContrastingColor(COLORS.primary[50]);
    expect(contrast).toBe('#000000'); // Black text on light background
  });
});
```

### Component Test Example
```tsx
import { render } from '@testing-library/react';
import { StatusBadge } from '@/components/StatusBadge';

describe('StatusBadge', () => {
  test('should render with success colors', () => {
    const { getByText } = render(
      <StatusBadge status="success" label="Active" />
    );
    const badge = getByText('Active');
    expect(badge).toHaveStyle(`color: ${COLORS.semantic.success[700]}`);
  });
});
```

## Frequently Asked Questions

### Q: How do I change the primary brand color?
A: Edit `src/config/colors.ts` and update the `primary` object. All components automatically reflect the change.

### Q: Can I use custom colors outside the palette?
A: Not recommended. If needed, add to `colors.ts` rather than hardcoding in components.

### Q: How do I ensure color contrast meets WCAG standards?
A: Use the provided colors - they're already tested for WCAG AA compliance. Use `getContrastingColor()` for calculated text colors.

### Q: Does the system support 3rd-party color libraries?
A: Yes, the `colorUtils.ts` has conversion functions for hex/rgb. Import and use as needed.

### Q: How do I debug color issues?
A: Check:
1. CSS variables applied correctly via `getComputedStyle()`
2. Tailwind building correctly with updated config
3. Component using correct color reference

## Performance Notes

- Color system is **zero runtime cost** when using Tailwind classes
- CSS variables have minimal performance impact
- TypeScript imports are tree-shakeable
- No additional bundles or libraries required

## Migration Checklist

- [ ] Import `COLORS` in components using hardcoded colors
- [ ] Replace hex values with `COLORS.[family][shade]`
- [ ] Replace Tailwind `bg-blue-*` with `bg-emerald-*`
- [ ] Update theme references to use `useTheme()`
- [ ] Test light/dark mode switching
- [ ] Verify contrast ratios in accessibility tests

## Support & Questions

For questions about the color system:
1. Check [COLOR_SYSTEM.md](./COLOR_SYSTEM.md)
2. Review component examples in `src/features/`
3. Check Storybook for live component examples
4. Ask team lead or design system maintainer

---

**Last Updated**: February 2, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
