/**
 * Task API Service
 * Module 4: Task Execution & Orchestration
 * Handles all API calls to task backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';

// ==================== TYPES ====================

export type ApiTaskStatus =
  | 'todo'
  | 'in_progress'
  | 'in_review'
  | 'completed'
  | 'BACKLOG'
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE'
  | 'CANCELLED';

export type ApiTaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'
  | 'CRITICAL';

export interface TaskResponse {
  task_id: string;
  task_list_id: string;
  project_id: string;
  title: string;
  description?: string;
  status: ApiTaskStatus;
  priority: ApiTaskPriority;
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
  is_milestone?: boolean;
  created_at: string;
  updated_at: string;
  subtasks?: SubtaskResponse[];
  dependency_links?: TaskDependencyResponse[];
}

export interface SubtaskResponse {
  id: string;
  task_id: string;
  title: string;
  is_done: boolean;
  assignee_id?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubtaskDTO {
  title: string;
  assignee_id?: string;
  position?: number;
}

export interface UpdateSubtaskDTO {
  title?: string;
  is_completed?: boolean;
  assignee_id?: string;
  position?: number;
}

export interface TaskDependencyResponse {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  created_at: string;
}

export interface CreateTaskDependencyDTO {
  depends_on_task_id: string;
  dependency_type?: string;
}

export interface CreateTaskDTO {
  task_list_id: string;
  project_id?: string;
  title: string;
  description?: string;
  status?: ApiTaskStatus;
  priority?: ApiTaskPriority;
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  is_milestone?: boolean;
  tags?: string[];
  dependencies?: string[];
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: ApiTaskPriority;
  due_date?: string;
  planned_start?: string;
  planned_end?: string;
  estimated_hours?: number;
  is_milestone?: boolean;
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
  status?: ApiTaskStatus;
  priority?: ApiTaskPriority;
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

interface BackendTaskListResponse {
  total: number;
  items: BackendTaskResponse[];
  skip: number;
  limit: number;
}

interface BackendTaskResponse {
  id?: string;
  task_id?: string;
  task_list_id: string;
  project_id: string;
  title: string;
  description?: string;
  status: ApiTaskStatus;
  priority: ApiTaskPriority;
  assigned_to?: string;
  created_by: string;
  due_date?: string;
  planned_end?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  tags?: string[];
  dependencies?: string[];
  subtasks_count?: number;
  comments_count?: number;
  is_milestone?: boolean;
  created_at: string;
  updated_at: string;
  subtasks?: SubtaskResponse[];
  dependency_links?: TaskDependencyResponse[];
}

export interface CommentListResponse {
  comments: TaskComment[];
  total: number;
}

interface BackendCommentResponse {
  id?: string;
  comment_id?: string;
  task_id: string;
  author_id?: string;
  user_id?: string;
  author_name?: string;
  content: string;
  created_at: string;
  updated_at?: string;
  is_edited?: boolean;
  edited?: boolean;
}

export interface TaskListItem {
  id: string;
  project_id: string;
  name: string;
  position: number;
  is_archived: boolean;
}

export interface CreateTaskListDTO {
  project_id: string;
  name: string;
  position?: number;
}

export interface UpdateTaskListDTO {
  name?: string;
  position?: number;
  is_archived?: boolean;
}

// ==================== SERVICE CLASS ====================

class TaskService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient();
  }

  private normalizeTask(task: BackendTaskResponse): TaskResponse {
    return {
      ...task,
      task_id: task.task_id || task.id || '',
      due_date: task.due_date || task.planned_end,
    };
  }

  private toPagination(total: number, pageSize: number, page: number) {
    const safePageSize = Math.max(1, pageSize);
    return {
      page,
      page_size: safePageSize,
      total,
      total_pages: Math.max(1, Math.ceil(total / safePageSize)),
    };
  }

  private normalizeComment(comment: BackendCommentResponse): TaskComment {
    return {
      comment_id: comment.comment_id || comment.id || '',
      task_id: comment.task_id,
      author_id: comment.author_id || comment.user_id || '',
      author_name: comment.author_name || 'User',
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      edited: comment.edited ?? comment.is_edited ?? false,
    };
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
    is_milestone?: boolean;
    assigned_to?: string;
    due_date_from?: string;
    due_date_to?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
  }): Promise<TaskListResponse> {
    const page = params?.page ?? 1;
    const pageSize = params?.page_size ?? 20;
    const skip = Math.max(0, (page - 1) * pageSize);

    const requestParams = {
      project_id: params?.project_id,
      task_list_id: params?.task_list_id,
      status: params?.status,
      is_milestone: params?.is_milestone,
      assignee_id: params?.assigned_to,
      skip,
      limit: pageSize,
    };

    const response = await this.api.get<BackendTaskListResponse | TaskListResponse>('/tasks', {
      params: requestParams,
    });

    if ('items' in response.data) {
      const backend = response.data as BackendTaskListResponse;
      return {
        tasks: backend.items.map((item) => this.normalizeTask(item)),
        pagination: this.toPagination(backend.total, backend.limit || pageSize, page),
      };
    }

    return response.data as TaskListResponse;
  }

  /**
   * Get task details
   * GET /tasks/{task_id}
   */
  async getTask(taskId: string): Promise<TaskResponse> {
    const response = await this.api.get<BackendTaskResponse>(`/tasks/${taskId}`);
    return this.normalizeTask(response.data);
  }

  /**
   * Create a new task
   * POST /tasks
   */
  async createTask(data: CreateTaskDTO): Promise<TaskResponse> {
    const response = await this.api.post<BackendTaskResponse>('/tasks', data);
    return this.normalizeTask(response.data);
  }

  /**
   * Update task
   * PATCH /tasks/{task_id}
   */
  async updateTask(taskId: string, data: UpdateTaskDTO): Promise<TaskResponse> {
    const response = await this.api.patch<BackendTaskResponse>(`/tasks/${taskId}`, data);
    return this.normalizeTask(response.data);
  }

  /**
   * Update task status
   * PATCH /tasks/{task_id}/status
   */
  async updateTaskStatus(taskId: string, status: ApiTaskStatus): Promise<TaskResponse> {
    const response = await this.api.patch<BackendTaskResponse>(`/tasks/${taskId}/status`, { status });
    return this.normalizeTask(response.data);
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
      target_task_list_id: taskListId,
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
    await Promise.all(
      data.task_ids.map((taskId) =>
        this.updateTask(taskId, {
          priority: data.priority,
        })
          .then(async () => {
            if (data.status) {
              await this.updateTaskStatus(taskId, data.status);
            }
          })
      )
    );

    return { updated_count: data.task_ids.length };
  }

  /**
   * Bulk delete tasks
   * POST /tasks/bulk/delete
   */
  async bulkDeleteTasks(taskIds: string[]): Promise<{ deleted_count: number }> {
    await Promise.all(taskIds.map((taskId) => this.deleteTask(taskId)));
    return { deleted_count: taskIds.length };
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
    const response = await this.api.get<BackendCommentResponse[] | { comments: BackendCommentResponse[]; total: number }>(`/tasks/${taskId}/comments`, { params });
    if (Array.isArray(response.data)) {
      return {
        comments: response.data.map((comment) => this.normalizeComment(comment)),
        total: response.data.length,
      };
    }
    return {
      comments: response.data.comments.map((comment) => this.normalizeComment(comment)),
      total: response.data.total,
    };
  }

  /**
   * Create comment
   * POST /tasks/{task_id}/comments
   */
  async createComment(taskId: string, data: CreateCommentDTO): Promise<TaskComment> {
    const response = await this.api.post<BackendCommentResponse>(`/tasks/${taskId}/comments`, data);
    return this.normalizeComment(response.data);
  }

  /**
   * Update comment
   * PATCH /tasks/{task_id}/comments/{comment_id}
   */
  async updateComment(_taskId: string, commentId: string, content: string): Promise<TaskComment> {
    const response = await this.api.patch<BackendCommentResponse>(`/tasks/comments/${commentId}`, { content });
    return this.normalizeComment(response.data);
  }

  /**
   * Delete comment
   * DELETE /tasks/{task_id}/comments/{comment_id}
   */
  async deleteComment(_taskId: string, commentId: string): Promise<void> {
    await this.api.delete(`/tasks/comments/${commentId}`);
  }

  // ==================== SUBTASKS ====================

  /**
   * Create subtask
   * POST /tasks/{task_id}/subtasks
   */
  async createSubtask(taskId: string, data: CreateSubtaskDTO): Promise<SubtaskResponse> {
    const response = await this.api.post<SubtaskResponse>(`/tasks/${taskId}/subtasks`, data);
    return response.data;
  }

  /**
   * Get subtasks
   * GET /tasks/{task_id}/subtasks
   */
  async getSubtasks(_taskId: string): Promise<SubtaskResponse[]> {
    const response = await this.api.get<SubtaskResponse[]>(`/tasks/${_taskId}/subtasks`);
    return response.data;
  }

  /**
   * Update subtask
   * PATCH /tasks/{task_id}/subtasks/{subtask_id}
   */
  async updateSubtask(_taskId: string, subtaskId: string, data: UpdateSubtaskDTO): Promise<SubtaskResponse> {
    const response = await this.api.patch<SubtaskResponse>(`/tasks/subtasks/${subtaskId}`, data);
    return response.data;
  }

  /**
   * Delete subtask
   * DELETE /tasks/{task_id}/subtasks/{subtask_id}
   */
  async deleteSubtask(_taskId: string, subtaskId: string): Promise<void> {
    await this.api.delete(`/tasks/subtasks/${subtaskId}`);
  }

  // ==================== DEPENDENCIES ====================

  async createDependency(taskId: string, data: CreateTaskDependencyDTO): Promise<TaskDependencyResponse> {
    const response = await this.api.post<TaskDependencyResponse>(`/tasks/${taskId}/dependencies`, data);
    return response.data;
  }

  async getDependencies(taskId: string): Promise<TaskDependencyResponse[]> {
    const response = await this.api.get<TaskDependencyResponse[]>(`/tasks/${taskId}/dependencies`);
    return response.data;
  }

  async deleteDependency(dependencyId: string): Promise<void> {
    await this.api.delete(`/tasks/dependencies/${dependencyId}`);
  }

  // ==================== TASK LISTS ====================

  async listTaskLists(projectId: string, includeArchived: boolean = false): Promise<TaskListItem[]> {
    const response = await this.api.get<TaskListItem[]>('/tasks/lists', {
      params: {
        project_id: projectId,
        include_archived: includeArchived,
      },
    });
    return response.data;
  }

  async createTaskList(data: CreateTaskListDTO): Promise<TaskListItem> {
    const response = await this.api.post<TaskListItem>('/tasks/lists', data);
    return response.data;
  }

  async updateTaskList(taskListId: string, data: UpdateTaskListDTO): Promise<TaskListItem> {
    const response = await this.api.patch<TaskListItem>(`/tasks/lists/${taskListId}`, data);
    return response.data;
  }

  async deleteTaskList(taskListId: string, force: boolean = false): Promise<void> {
    await this.api.delete(`/tasks/lists/${taskListId}`, {
      params: { force },
    });
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
