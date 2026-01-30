/**
 * PERFORMANCE OPTIMIZATION UTILITIES
 * Virtualization, memoization and lazy loading for large datasets
 */

import { useMemo, useCallback, useRef, useState, useEffect } from 'react';

// Virtualization hook for large task lists
export function useVirtualization<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  overscan = 5
) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length - 1
  );

  const visibleItems = items.slice(
    Math.max(0, startIndex - overscan),
    endIndex + 1
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.max(0, (startIndex - overscan) * itemHeight);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex: Math.max(0, startIndex - overscan),
    endIndex,
    onScroll: (e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

// Debounced search hook
export function useDebouncedSearch(
  initialValue: string = '',
  delay: number = 300
) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
}

// Optimized task filtering with memoization
export function useTaskFilter<T extends { 
  id: string; 
  name: string; 
  type: string;
  assignee?: string;
  priority?: string;
  project?: string;
}>(
  tasks: T[],
  filters: {
    searchQuery: string;
    selectedPriorities: Set<string>;
    selectedAssignees: Set<string>;
    includeProjects: boolean;
  }
) {
  const { searchQuery, selectedPriorities, selectedAssignees, includeProjects } = filters;

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    const matchTask = (task: T) => {
      const matchQuery = !query || 
        task.name.toLowerCase().includes(query) || 
        (task.assignee?.toLowerCase().includes(query) ?? false);
      
      const matchPriority = selectedPriorities.size === 0 || 
        (!!task.priority && selectedPriorities.has(task.priority));
      
      const matchAssignee = selectedAssignees.size === 0 || 
        (!!task.assignee && selectedAssignees.has(task.assignee));

      return matchQuery && matchPriority && matchAssignee;
    };

    return tasks.filter(task => {
      if (task.type === 'task') {
        return matchTask(task);
      } else if (task.type === 'project') {
        if (!includeProjects) return false;
        
        // Show project if it matches search or has matching child tasks
        const selfMatch = !query || task.name.toLowerCase().includes(query);
        const childrenMatch = tasks.some(t => 
          t.type === 'task' && 
          t.project === task.id && 
          matchTask(t)
        );
        
        return selfMatch || childrenMatch;
      }
      
      return false;
    });
  }, [tasks, searchQuery, selectedPriorities, selectedAssignees, includeProjects]);

  return filteredTasks;
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {},
  enabled = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [enabled, options]);

  return isIntersecting;
}

// Performance monitoring
export function usePerformanceMonitor() {
  const renderTimesRef = useRef<number[]>([]);
  const renderStartRef = useRef<number>(0);

  const startRender = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      renderTimesRef.current.push(renderTime);
      
      // Keep only last 10 render times
      if (renderTimesRef.current.length > 10) {
        renderTimesRef.current.shift();
      }
    }
  }, []);

  const getAverageRenderTime = useCallback(() => {
    const times = renderTimesRef.current;
    return times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length
      : 0;
  }, []);

  return {
    startRender,
    endRender,
    getAverageRenderTime,
    renderTimes: renderTimesRef.current,
  };
}

// Memoized task grouping
export function useTaskGrouping<T extends { 
  id: string; 
  type: string; 
  project?: string;
  displayOrder?: number;
}>(tasks: T[]) {
  return useMemo(() => {
    const projects = new Map<string, T>();
    const tasksByProject = new Map<string, T[]>();
    const orphanTasks: T[] = [];

    for (const task of tasks) {
      if (task.type === 'project') {
        projects.set(task.id, task);
        tasksByProject.set(task.id, []);
      } else if (task.project) {
        const projectTasks = tasksByProject.get(task.project) || [];
        projectTasks.push(task);
        tasksByProject.set(task.project, projectTasks);
      } else {
        orphanTasks.push(task);
      }
    }

    // Sort tasks within each project
    for (const [projectId, projectTasks] of tasksByProject) {
      projectTasks.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }

    return {
      projects,
      tasksByProject,
      orphanTasks,
    };
  }, [tasks]);
}

// Optimized date calculations
export const useDateCalculations = () => {
  const calculateDuration = useCallback((start: Date, end: Date): number => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }, []);

  const calculateProgress = useCallback((
    start: Date, 
    end: Date, 
    current: Date = new Date()
  ): number => {
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = current.getTime() - start.getTime();
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  }, []);

  const isOverdue = useCallback((endDate: Date, current: Date = new Date()): boolean => {
    return current > endDate;
  }, []);

  const formatDuration = useCallback((days: number): string => {
    if (days === 1) return '1 ngày';
    if (days < 7) return `${days} ngày`;
    if (days < 30) return `${Math.round(days / 7)} tuần`;
    return `${Math.round(days / 30)} tháng`;
  }, []);

  return {
    calculateDuration,
    calculateProgress,
    isOverdue,
    formatDuration,
  };
};