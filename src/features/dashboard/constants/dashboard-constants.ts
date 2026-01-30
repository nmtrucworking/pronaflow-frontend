import type { TaskPriority, TaskGroupType } from './dashboard-types';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const PRIORITY_CONFIG = {
  URGENT: {
    label: 'Urgent',
    color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900',
    icon: AlertCircle,
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900',
    icon: ArrowRight,
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900',
    icon: ArrowRight,
  },
  LOW: {
    label: 'Low',
    color: 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    icon: ArrowRight,
  },
} as const;

export const TASK_GROUP_HEADER_COLORS: Record<TaskGroupType, string> = {
  danger: 'text-red-600 dark:text-red-400',
  info: 'text-indigo-600 dark:text-indigo-400',
  neutral: 'text-slate-600 dark:text-slate-400',
};

export const SORT_OPTIONS = {
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
} as const;

export const DEFAULT_DASHBOARD_CONFIG = {
  showStats: true,
  showCalendar: true,
  showActivity: true,
  showWeeklyProgress: true,
};
