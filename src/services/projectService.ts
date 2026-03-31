/**
 * Project API Service
 * Module 3: Project Lifecycle Management
 * Handles all API calls to project backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';
import {
  Project,
  ProjectMember,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectSettings,
} from '@/types/project';

export interface ProjectListResponse {
  projects: Project[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface ProjectTemplate {
  template_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface ChangeRequest {
  change_request_id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
}

export interface ProjectMetrics {
  project_id: string;
  health_status: 'green' | 'amber' | 'red';
  metrics: {
    schedule_health: {
      status: string;
      progress: number;
      on_track: boolean;
    };
    budget_health: {
      status: string;
      spent_percentage: number;
      spent: number;
    };
    resource_health: {
      status: string;
      utilization: number;
    };
  };
}

class ProjectService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient();
  }

  // ========================================================================
  // Project CRUD Operations
  // ========================================================================

  /**
   * Create a new project
   * POST /projects
   */
  async createProject(data: CreateProjectDTO): Promise<Project> {
    const response = await this.api.post<Project>('/projects', data);
    return response.data;
  }

  /**
   * Get list of projects with filters
    * GET /projects
   */
  async listProjects(
    workspaceId?: string,
    status?: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'created_at',
    includeArchived: boolean = false
  ): Promise<ProjectListResponse> {
    const response = await this.api.get<ProjectListResponse>('/projects', {
      params: {
        workspace_id: workspaceId,
        status,
        page,
        page_size: pageSize,
        sort_by: sortBy,
        include_archived: includeArchived,
      },
    });
    return response.data;
  }

  /**
   * Get project details
   * GET /projects/:id
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await this.api.get<Project>(`/projects/${projectId}`);
    return response.data;
  }

  /**
   * Update project information
   * PATCH /projects/:id
   */
  async updateProject(projectId: string, data: UpdateProjectDTO): Promise<Project> {
    const response = await this.api.patch<Project>(`/projects/${projectId}`, data);
    return response.data;
  }

  /**
   * Update project status
    * PATCH /projects/:id/status
   */
  async updateProjectStatus(
    projectId: string,
    status: string,
    completionDate?: string
  ): Promise<{ status: string; completion_date?: string }> {
    const response = await this.api.patch<{ status: string; completion_date?: string }>(
      `/projects/${projectId}/status`,
      {
        status,
        completion_date: completionDate,
      }
    );
    return response.data;
  }

  /**
   * Delete project (soft delete)
   * DELETE /projects/:id
   */
  async deleteProject(projectId: string): Promise<void> {
    await this.api.delete(`/projects/${projectId}`);
  }

  /**
   * Clone project
    * POST /projects/:id/clone
   */
  async cloneProject(
    projectId: string,
    newName: string,
    copyTasks: boolean = true,
    copyMembers: boolean = false
  ): Promise<Project> {
    const response = await this.api.post<Project>(`/projects/${projectId}/clone`, {
      new_name: newName,
      copy_tasks: copyTasks,
      copy_members: copyMembers,
    });
    return response.data;
  }

  // ========================================================================
  // Project Member Management
  // ========================================================================

  /**
   * List project members
   * GET /projects/:id/members
   */
  async listProjectMembers(projectId: string, page: number = 1, pageSize: number = 50): Promise<ProjectMember[]> {
    const response = await this.api.get<ProjectMember[]>(`/projects/${projectId}/members`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Add member to project
    * POST /projects/:id/members
   */
  async addProjectMember(
    projectId: string,
    userId: string,
    role: string = 'member'
  ): Promise<ProjectMember> {
    const response = await this.api.post<ProjectMember>(`/projects/${projectId}/members`, {
      user_id: userId,
      role,
    });
    return response.data;
  }

  /**
   * Update project member role
    * PATCH /projects/:id/members/:userId
   */
  async updateProjectMemberRole(
    projectId: string,
    userId: string,
    role: string
  ): Promise<ProjectMember> {
    const response = await this.api.patch<ProjectMember>(
      `/projects/${projectId}/members/${userId}`,
      { role }
    );
    return response.data;
  }

  /**
   * Remove member from project
   * DELETE /projects/:id/members/:userId
   */
  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await this.api.delete(`/projects/${projectId}/members/${userId}`);
  }

  // ========================================================================
  // Project Templates
  // ========================================================================

  /**
   * Create project template
    * POST /projects/templates
   */
  async createTemplate(
    name: string,
    description?: string,
    structure?: Record<string, any>
  ): Promise<ProjectTemplate> {
    const response = await this.api.post<ProjectTemplate>('/projects/templates', {
      name,
      description,
      structure,
    });
    return response.data;
  }

  /**
   * List project templates
   * GET /projects/templates
   */
  async listTemplates(page: number = 1, pageSize: number = 20): Promise<ProjectTemplate[]> {
    const response = await this.api.get<ProjectTemplate[]>('/projects/templates', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Create project from template
    * POST /projects/from-template
   */
  async createProjectFromTemplate(
    templateId: string,
    workspaceId: string,
    projectName: string,
    startDate: string
  ): Promise<Project> {
    const response = await this.api.post<Project>('/projects/from-template', {
      template_id: templateId,
      workspace_id: workspaceId,
      project_name: projectName,
      start_date: startDate,
    });
    return response.data;
  }

  // ========================================================================
  // Change Requests
  // ========================================================================

  /**
   * Create change request
    * POST /projects/:id/change-requests
   */
  async createChangeRequest(
    projectId: string,
    title: string,
    description: string,
    scope: string,
    impactAnalysis: string,
    requestedChanges: Record<string, any>
  ): Promise<ChangeRequest> {
    const response = await this.api.post<ChangeRequest>(`/projects/${projectId}/change-requests`, {
      title,
      description,
      scope,
      impact_analysis: impactAnalysis,
      requested_changes: requestedChanges,
    });
    return response.data;
  }

  /**
   * List change requests
    * GET /projects/:id/change-requests
   */
  async listChangeRequests(
    projectId: string,
    status?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ChangeRequest[]> {
    const response = await this.api.get<ChangeRequest[]>(`/projects/${projectId}/change-requests`, {
      params: { status, page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Approve/Reject change request
    * PATCH /projects/:id/change-requests/:crId/approve
   */
  async approveChangeRequest(
    projectId: string,
    changeRequestId: string,
    approved: boolean,
    reviewerNotes?: string
  ): Promise<ChangeRequest> {
    const response = await this.api.patch<ChangeRequest>(
      `/projects/${projectId}/change-requests/${changeRequestId}/approve`,
      {
        approved,
        reviewer_notes: reviewerNotes,
      }
    );
    return response.data;
  }

  // ========================================================================
  // Project Metrics & Health
  // ========================================================================

  /**
   * Get project metrics
   * GET /projects/:id/metrics
   */
  async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
    const response = await this.api.get<ProjectMetrics>(`/projects/${projectId}/metrics`);
    return response.data;
  }

  /**
   * Update project settings
   * PUT /projects/:id/settings
   */
  async updateProjectSettings(projectId: string, settings: Partial<ProjectSettings>): Promise<ProjectSettings> {
    const response = await this.api.put<ProjectSettings>(
      `/projects/${projectId}/settings`,
      settings
    );
    return response.data;
  }

  /**
   * Get project settings
   * GET /projects/:id/settings
   */
  async getProjectSettings(projectId: string): Promise<ProjectSettings> {
    const response = await this.api.get<ProjectSettings>(`/projects/${projectId}/settings`);
    return response.data;
  }

  // ========================================================================
  // Batch Operations
  // ========================================================================

  /**
   * Add multiple members to project
   */
  async addMultipleProjectMembers(
    projectId: string,
    members: Array<{ userId: string; role: string }>
  ): Promise<ProjectMember[]> {
    const results: ProjectMember[] = [];
    for (const member of members) {
      try {
        const result = await this.addProjectMember(projectId, member.userId, member.role);
        results.push(result);
      } catch (error) {
        console.error(`Failed to add member ${member.userId}:`, error);
      }
    }
    return results;
  }

  /**
   * Archive multiple projects
   */
  async archiveMultipleProjects(projectIds: string[]): Promise<void> {
    for (const projectId of projectIds) {
      try {
        await this.updateProjectStatus(projectId, 'ARCHIVED');
      } catch (error) {
        console.error(`Failed to archive project ${projectId}:`, error);
      }
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;
