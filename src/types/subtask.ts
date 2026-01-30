/**
 * Subtask Entity
 * Module 4: Task Execution & Orchestration
 * 
 * Checklist chi tiết trong Task
 */

export interface Subtask {
  subtask_id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  assignee_id?: string;
  position: number; // For ordering
  created_at?: string;
  updated_at?: string;
  // Nested assignee data (optional)
  assignee?: {
    id: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CreateSubtaskDTO {
  task_id: string;
  title: string;
  assignee_id?: string;
}

export interface UpdateSubtaskDTO {
  title?: string;
  is_done?: boolean;
  assignee_id?: string;
  position?: number;
}

/**
 * Position field enables drag-and-drop reordering
 * is_done flag tracks completion status
 */
