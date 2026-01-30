/**
 * Task Entity
 * Module 4: Task Execution & Orchestration
 * 
 * Đơn vị thực thi trung tâm
 */

import type { Member } from './member';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  task_id: string;
  project_id: string;
  task_list_id: string; // Required
  key?: string; // Generated key like "PRJ-001"
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  is_milestone: boolean;
  planned_start?: string; // ISO timestamp
  planned_end?: string; // ISO timestamp
  actual_start?: string; // ISO timestamp, Auto
  actual_end?: string; // ISO timestamp, Auto
  estimated_hours?: number;
  created_by: string; // User ID
  created_at: string;
  updated_at?: string;
  
  // Frontend only fields
  assignee?: Member;
  assignees?: string[]; // Array of User IDs
  dependencies?: string[]; // Array of Task IDs
  tags?: string[]; // Array of Tag IDs
  points?: number;
  progress?: number; // 0-100
}

export interface CreateTaskDTO {
  project_id: string;
  task_list_id: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  is_milestone?: boolean;
  planned_start?: string;
  planned_end?: string;
  estimated_hours?: number;
  assignee_ids?: string[];
  tag_ids?: string[];
  points?: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  is_milestone?: boolean;
  planned_start?: string;
  planned_end?: string;
  estimated_hours?: number;
  assignee_ids?: string[];
  tag_ids?: string[];
  points?: number;
}