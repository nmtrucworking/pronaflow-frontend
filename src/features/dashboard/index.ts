/**
 * Dashboard Feature Module
 */

export { DashboardPage } from './pages';

// Components
export {
  DashboardHeader,
  DashboardMain,
  TaskPriorityBadge,
  TaskActionsMenu,
  StatCard,
  TaskGroup,
  EmptyState,
  TaskRow,
  FilterMenu,
  DashboardCustomizer,
} from './components';

// Hooks
export {
  useGroupedTasks,
  useDashboardConfig,
} from './hooks';

// Types
export type {
  ProjectEntity,
  UserEntity,
  TaskEntity,
  TaskPriority,
  TaskStatus,
  DensityMode,
  DashboardConfig,
  TaskGroupType,
  SortOption,
  GroupedTasks,
  ActivityItem,
} from './types/dashboard-types';

// Constants
export {
  PRIORITY_CONFIG,
  TASK_GROUP_HEADER_COLORS,
  SORT_OPTIONS,
  DEFAULT_DASHBOARD_CONFIG,
} from './constants';
