export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ViewMode = 'LIST' | 'KANBAN';
export type DensityMode = 'COMFORTABLE' | 'COMPACT';
export type SortOption = 'DUE_DATE_ASC' | 'PRIORITY_DESC' | 'TITLE_ASC';

export interface ProjectRef {
  id: string;
  name: string;
  key: string;
  color: string;
}

export interface UserEntity {
  id: string;
  name: string;
  avatar: string;
}

export interface TaskEntity {
  id: string;
  key: string;
  title: string;
  project: ProjectRef;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  estimatedHours: number;
  assignees: UserEntity[];
  description?: string;
}
