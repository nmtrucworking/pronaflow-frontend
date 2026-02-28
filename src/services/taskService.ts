/**
 * Task API Service
 * Module 4: Task Execution & Orchestration
 * Handles all API calls to task backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';

// ==================== TYPES ====================

export interface TaskResponse {
  task_id: string;
  task_list_id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  tags?: string[];
  dependencies?: string[];
  subtasks_count?: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  task_list_id: string;
  project_id?: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  tags?: string[];
  dependencies?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  estimated_hours?: number;
  progress?: number;
}

export interface TaskComment {
  comment_id: string;
  task_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  updated_at?: string;
  edited: boolean;
  mentions?: string[];
}

export interface CreateCommentDTO {
  content: string;
  mentions?: string[];
}

export interface BulkUpdateDTO {
  task_ids: string[];
  status?: 'todo' | 'in_progress' | 'in_review' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
}

export interface TaskListResponse {
  tasks: TaskResponse[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface CommentListResponse {
  comments: TaskComment[];
  total: number;
}

// ==================== SERVICE CLASS ====================

class TaskService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient();
  }

  // ==================== TASK OPERATIONS ====================

  /**
   * Get tasks list with filters
   * GET /tasks
   */
  async getTasks(params?: {
    project_id?: string;
    task_list_id?: string;
    status?: string;
    priority?: string;
    assigned_to?: string;
    due_date_from?: string;
    due_date_to?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
  }): Promise<TaskListResponse> {
    const response = await this.api.get<TaskListResponse>('/tasks', { params });
    return response.data;
  }

  /**
   * Get task details
   * GET /tasks/{task_id}
   */
  async getTask(taskId: string): Promise<TaskResponse> {
    const response = await this.api.get<TaskResponse>(`/tasks/${taskId}`);
    return response.data;
  }

  /**
   * Create a new task
   * POST /tasks
   */
  async createTask(data: CreateTaskDTO): Promise<TaskResponse> {
    const response = await this.api.post<TaskResponse>('/tasks', data);
    return response.data;
  }

  /**
   * Update task
   * PATCH /tasks/{task_id}
   */
  async updateTask(taskId: string, data: UpdateTaskDTO): Promise<TaskResponse> {
    const response = await this.api.patch<TaskResponse>(`/tasks/${taskId}`, data);
    return response.data;
  }

  /**
   * Update task status
   * PATCH /tasks/{task_id}/status
   */
  async updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'in_review' | 'completed'): Promise<TaskResponse> {
    const response = await this.api.patch<TaskResponse>(`/tasks/${taskId}/status`, { status });
    return response.data;
  }

  /**
   * Delete task
   * DELETE /tasks/{task_id}
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}`);
  }

  /**
   * Move task to different position/list
   * POST /tasks/{task_id}/move
   */
  async moveTask(taskId: string, taskListId: string, position?: number): Promise<{ message: string }> {
    const response = await this.api.post<{ message: string }>(`/tasks/${taskId}/move`, {
      task_list_id: taskListId,
      position,
    });
    return response.data;
  }

  // ==================== BULK OPERATIONS ====================

  /**
   * Bulk update multiple tasks
   * PATCH /tasks/bulk/update
   */
  async bulkUpdateTasks(data: BulkUpdateDTO): Promise<{ updated_count: number }> {
    const response = await this.api.patch<{ updated_count: number }>('/tasks/bulk/update', data);
    return response.data;
  }

  /**
   * Bulk delete tasks
   * POST /tasks/bulk/delete
   */
  async bulkDeleteTasks(taskIds: string[]): Promise<{ deleted_count: number }> {
    const response = await this.api.post<{ deleted_count: number }>('/tasks/bulk/delete', { task_ids: taskIds });
    return response.data;
  }

  /**
   * Bulk move tasks
   * POST /tasks/bulk/move
   */
  async bulkMoveTasks(taskIds: string[], taskListId: string): Promise<{ moved_count: number }> {
    const response = await this.api.post<{ moved_count: number }>('/tasks/bulk/move', {
      task_ids: taskIds,
      task_list_id: taskListId,
    });
    return response.data;
  }

  // ==================== COMMENTS ====================

  /**
   * Get task comments
   * GET /tasks/{task_id}/comments
   */
  async getComments(taskId: string, params?: { page?: number; page_size?: number }): Promise<CommentListResponse> {
    const response = await this.api.get<CommentListResponse>(`/tasks/${taskId}/comments`, { params });
    return response.data;
  }

  /**
   * Create comment
   * POST /tasks/{task_id}/comments
   */
  async createComment(taskId: string, data: CreateCommentDTO): Promise<TaskComment> {
    const response = await this.api.post<TaskComment>(`/tasks/${taskId}/comments`, data);
    return response.data;
  }

  /**
   * Update comment
   * PATCH /tasks/{task_id}/comments/{comment_id}
   */
  async updateComment(taskId: string, commentId: string, content: string): Promise<TaskComment> {
    const response = await this.api.patch<TaskComment>(`/tasks/${taskId}/comments/${commentId}`, { content });
    return response.data;
  }

  /**
   * Delete comment
   * DELETE /tasks/{task_id}/comments/{comment_id}
   */
  async deleteComment(taskId: string, commentId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}/comments/${commentId}`);
  }

  // ==================== SUBTASKS ====================

  /**
   * Create subtask
   * POST /tasks/{task_id}/subtasks
   */
  async createSubtask(taskId: string, data: any): Promise<any> {
    const response = await this.api.post(`/tasks/${taskId}/subtasks`, data);
    return response.data;
  }

  /**
   * Get subtasks
   * GET /tasks/{task_id}/subtasks
   */
  async getSubtasks(taskId: string): Promise<any> {
    const response = await this.api.get(`/tasks/${taskId}/subtasks`);
    return response.data;
  }

  /**
   * Update subtask
   * PATCH /tasks/{task_id}/subtasks/{subtask_id}
   */
  async updateSubtask(taskId: string, subtaskId: string, data: any): Promise<any> {
    const response = await this.api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    return response.data;
  }

  /**
   * Delete subtask
   * DELETE /tasks/{task_id}/subtasks/{subtask_id}
   */
  async deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  }

  // ==================== ATTACHMENTS ====================

  /**
   * Upload file attachment
   * POST /tasks/{task_id}/files
   */
  async uploadAttachment(taskId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post(`/tasks/${taskId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  /**
   * Get attachments
   * GET /tasks/{task_id}/files
   */
  async getAttachments(taskId: string): Promise<any> {
    const response = await this.api.get(`/tasks/${taskId}/files`);
    return response.data;
  }

  /**
   * Delete attachment
   * DELETE /tasks/{task_id}/files/{file_id}
   */
  async deleteAttachment(taskId: string, fileId: string): Promise<void> {
    await this.api.delete(`/tasks/${taskId}/files/${fileId}`);
  }
}

// Export singleton instance
export const taskService = new TaskService();
export default taskService;
