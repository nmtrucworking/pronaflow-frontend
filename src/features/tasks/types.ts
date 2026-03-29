export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ViewMode = 'LIST' | 'KANBAN';
export type DensityMode = 'COMFORTABLE' | 'COMPACT';
export type SortOption = 'MANUAL' | 'DUE_DATE_ASC' | 'PRIORITY_DESC' | 'TITLE_ASC';

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

export interface TaskSubtask {
  id: string;
  title: string;
  is_completed: boolean;
  assignee_id?: string;
  position: number;
}

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
}

export interface TaskEntity {
  id: string;
  taskListId?: string;
  key: string;
  title: string;
  project: ProjectRef;
  status: TaskStatus;
  priority: TaskPriority;
  isMilestone?: boolean;
  dueDate: string;
  estimatedHours: number;
  assignees: UserEntity[];
  description?: string;
  subtasks?: TaskSubtask[];
  dependencies?: TaskDependency[];
}
