/**
 * RESPONSIVE UTILITIES
 * Hooks and utilities for responsive design in Gantt Chart
 */

import { useState, useEffect } from 'react';
import { useTheme } from '../themes/ThemeProvider';

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop' | 'large';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint(): BreakpointKey {
  const { theme } = useTheme();
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < parseInt(theme.breakpoints.mobile)) {
        setBreakpoint('mobile');
      } else if (width < parseInt(theme.breakpoints.tablet)) {
        setBreakpoint('tablet');
      } else if (width < parseInt(theme.breakpoints.desktop)) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('large');
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [theme.breakpoints]);

  return breakpoint;
}

export function useDeviceType(): DeviceType {
  const breakpoint = useBreakpoint();
  
  if (breakpoint === 'mobile') return 'mobile';
  if (breakpoint === 'tablet') return 'tablet';
  return 'desktop';
}

export function useIsMobile(): boolean {
  return useDeviceType() === 'mobile';
}

export function useIsTablet(): boolean {
  return useDeviceType() === 'tablet';
}

export function useIsDesktop(): boolean {
  return useDeviceType() === 'desktop';
}

// Responsive values hook
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop: T;
}): T {
  const deviceType = useDeviceType();
  
  if (deviceType === 'mobile' && values.mobile !== undefined) {
    return values.mobile;
  }
  
  if (deviceType === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  
  return values.desktop;
}

// Responsive Gantt Chart configuration
export interface ResponsiveGanttConfig {
  rowHeight: number;
  listCellWidth: string;
  columnWidth: number;
  fontSize: string;
  headerHeight: number;
  scale: number;
  showSearch: boolean;
  showFilters: boolean;
  compactMode: boolean;
}

export function useResponsiveGanttConfig(): ResponsiveGanttConfig {
  const deviceType = useDeviceType();
  const { theme } = useTheme();

  return useResponsiveValue({
    mobile: {
      rowHeight: 40,
      listCellWidth: '200px',
      columnWidth: 80,
      fontSize: theme.typography.fontSize.caption,
      headerHeight: 40,
      scale: 0.85,
      showSearch: false,
      showFilters: false,
      compactMode: true,
    },
    tablet: {
      rowHeight: 50,
      listCellWidth: '250px',
      columnWidth: 100,
      fontSize: theme.typography.fontSize.small,
      headerHeight: 48,
      scale: 0.9,
      showSearch: true,
      showFilters: false,
      compactMode: true,
    },
    desktop: {
      rowHeight: 68,
      listCellWidth: '300px',
      columnWidth: 170,
      fontSize: theme.typography.fontSize.body,
      headerHeight: 56,
      scale: 1,
      showSearch: true,
      showFilters: true,
      compactMode: false,
    },
  });
}

// Touch gesture detection
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouch;
}

// Viewport dimensions
export function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}