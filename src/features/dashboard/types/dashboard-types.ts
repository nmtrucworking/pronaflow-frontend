export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
export type DensityMode = 'comfortable' | 'compact';
export type TaskGroupType = 'danger' | 'info' | 'neutral';
export type SortOption = 'dueDate' | 'priority';

export interface ProjectEntity {
  project_id: string;
  name: string;
  key: string;
}

export interface UserEntity {
  user_id: string;
  username: string;
  avatar_url?: string;
}

export interface TaskEntity {
  task_id: string;
  task_number: number;
  title: string;
  project: ProjectEntity;
  status: TaskStatus;
  priority: TaskPriority;
  planned_end: string;
  assignees: UserEntity[];
}

export interface GroupedTasks {
  overdue: TaskEntity[];
  today: TaskEntity[];
  upcoming: TaskEntity[];
  done: TaskEntity[];
}

export interface DashboardConfig {
  showStats: boolean;
  showCalendar: boolean;
  showActivity: boolean;
  showWeeklyProgress: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'completion' | 'assignment' | 'comment';
  user: string;
  action: string;
  taskKey: string;
  timestamp: string;
  avatarColor: 'emerald' | 'blue' | 'slate';
}
