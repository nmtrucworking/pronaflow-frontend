import COLORS from '@/config/colors';

export const PROJECT_STATUS_COLORS = {
  'To Do': COLORS.neutral[500],
  'In Progress': COLORS.semantic.info[500],
  Review: COLORS.semantic.warning[500],
  Done: COLORS.status.success,
} as const;

export const PROJECT_STATUS_BADGE_CLASS = {
  NOT_STARTED: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  DONE: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-orange-100 text-orange-700',
  ARCHIVED: 'bg-gray-200 text-gray-600',
} as const;

export const PROJECT_PRIORITY_COLORS = {
  Urgent: COLORS.priority.urgent,
  High: COLORS.priority.high,
  Medium: COLORS.priority.medium,
  Low: COLORS.priority.low,
} as const;

export const PROJECT_PRIORITY_BADGE_CLASS = {
  LOW: 'bg-blue-100 text-blue-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
} as const;

export const TASK_STATUS_COLORS = {
  NOT_STARTED: COLORS.neutral[400],
  IN_PROGRESS: COLORS.semantic.info[500],
  IN_REVIEW: COLORS.semantic.warning[500],
  DONE: COLORS.status.success,
} as const;

export const TASK_PRIORITY_COLORS = {
  LOW: COLORS.priority.low,
  MEDIUM: COLORS.priority.medium,
  HIGH: COLORS.priority.high,
  URGENT: COLORS.priority.urgent,
} as const;

export const CALENDAR_PRIORITY_COLORS = {
  urgent: COLORS.status.error,
  high: COLORS.status.warning,
  medium: COLORS.semantic.info[500],
  low: COLORS.status.success,
} as const;

export const GANTT_STATUS_COLORS = {
  todo: COLORS.neutral[500],
  'in-progress': COLORS.semantic.info[500],
  review: COLORS.semantic.warning[500],
  done: COLORS.status.success,
} as const;

export const GANTT_TASK_PROGRESS_STYLE = {
  done: {
    progressColor: COLORS.status.success,
    progressSelectedColor: COLORS.semantic.success[600],
  },
  inProgress: {
    progressColor: COLORS.semantic.info[500],
    progressSelectedColor: COLORS.semantic.info[600],
  },
  review: {
    progressColor: COLORS.status.warning,
    progressSelectedColor: COLORS.semantic.warning[600],
  },
  todo: {
    progressColor: COLORS.neutral[500],
    progressSelectedColor: COLORS.neutral[600],
  },
} as const;
