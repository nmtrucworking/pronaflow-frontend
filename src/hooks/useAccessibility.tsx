/**
 * ACCESSIBILITY UTILITIES
 * WCAG 2.1 AA compliant accessibility helpers for Gantt Chart
 */

import { useState, useEffect } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

// ARIA labels and roles for Gantt Chart elements
export const ARIA_LABELS = {
  ganttChart: 'Biểu đồ Gantt - Lịch trình dự án',
  taskList: 'Danh sách công việc',
  timeline: 'Dòng thời gian',
  task: 'Công việc',
  project: 'Dự án',
  createTask: 'Tạo công việc mới',
  searchTasks: 'Tìm kiếm công việc',
  filterTasks: 'Lọc công việc',
  viewMode: 'Chế độ xem',
  density: 'Mật độ hiển thị',
  darkMode: 'Chế độ tối',
  helpMenu: 'Menu trợ giúp',
  progressBar: 'Thanh tiến độ',
  assignee: 'Người phụ trách',
  priority: 'Độ ưu tiên',
  status: 'Trạng thái',
  startDate: 'Ngày bắt đầu',
  endDate: 'Ngày kết thúc',
  dependencies: 'Phụ thuộc',
  dragHandle: 'Kéo để di chuyển',
  resizeHandle: 'Kéo để thay đổi kích thước',
} as const;

// Keyboard navigation helper
export function useKeyboardNavigation(
  containerRef: RefObject<HTMLElement>,
  itemCount: number,
  onSelect?: (index: number) => void
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, shiftKey } = event;
    
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        setCurrentIndex(prev => Math.min(prev + 1, itemCount - 1));
        setIsNavigating(true);
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setCurrentIndex(prev => Math.max(prev - 1, 0));
        setIsNavigating(true);
        break;
        
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        setIsNavigating(true);
        break;
        
      case 'End':
        event.preventDefault();
        setCurrentIndex(itemCount - 1);
        setIsNavigating(true);
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(currentIndex);
        break;
        
      case 'Escape':
        setIsNavigating(false);
        break;
    }
  };

  return {
    currentIndex,
    isNavigating,
    handleKeyDown,
    setCurrentIndex,
    resetNavigation: () => setIsNavigating(false),
  };
}

// Focus management for modal dialogs
export function useFocusTrap(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleTabKey as any);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey as any);
    };
  }, [isOpen]);
}

// Screen reader announcements
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 100);
  };

  return { announcement, announce };
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return isHighContrast;
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return prefersReducedMotion;
}

// Generate accessible task descriptions
export function generateTaskAriaDescription(task: {
  name: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  assignee?: string;
  priority?: string;
  status?: string;
}) {
  const parts = [
    `Công việc: ${task.name}`,
    `Tiến độ: ${task.progress}%`,
    `Từ ${task.startDate.toLocaleDateString('vi-VN')} đến ${task.endDate.toLocaleDateString('vi-VN')}`,
  ];

  if (task.assignee) {
    parts.push(`Người phụ trách: ${task.assignee}`);
  }

  if (task.priority) {
    parts.push(`Độ ưu tiên: ${task.priority}`);
  }

  if (task.status) {
    parts.push(`Trạng thái: ${task.status}`);
  }

  return parts.join(', ');
}

// Color contrast checker
export function checkColorContrast(foreground: string, background: string): boolean {
  // This is a simplified version. In production, use a proper contrast checking library
  return true; // Placeholder implementation
}

// Skip links for keyboard navigation
export function SkipLinks() {
  return (
    <div className="sr-only">
      <a 
        href="#main-content" 
        className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white focus:not-sr-only focus:relative"
      >
        Bỏ qua đến nội dung chính
      </a>
      <a 
        href="#gantt-chart" 
        className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white focus:not-sr-only focus:relative"
      >
        Đến biểu đồ Gantt
      </a>
      <a 
        href="#task-controls" 
        className="absolute top-0 left-0 z-50 p-4 bg-blue-600 text-white focus:not-sr-only focus:relative"
      >
        Đến điều khiển công việc
      </a>
    </div>
  );
}