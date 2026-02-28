/**
 * Project API Service
 * Module 3: Project Lifecycle Management
 * Handles all API calls to project backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient, API_ROOT_URL } from '@/lib/axiosClient';
import {
  Project,
  ProjectMember,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectSettings,
} from '@/types/project';

interface ProjectListResponse {
  projects: Project[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

interface ProjectTemplate {
  template_id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface ChangeRequest {
  change_request_id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
}

interface ProjectMetrics {
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
    this.api = createApiClient(API_ROOT_URL);
  }

  // ========================================================================
  // Project CRUD Operations
  // ========================================================================

  /**
   * Create a new project
   * POST /v1/projects
   */
  async createProject(data: CreateProjectDTO): Promise<Project> {
    const response = await this.api.post<Project>('/v1/projects', data);
    return response.data;
  }

  /**
   * Get list of projects with filters
   * GET /v1/projects
   */
  async listProjects(
    workspaceId?: string,
    status?: string,
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'created_at'
  ): Promise<ProjectListResponse> {
    const response = await this.api.get<ProjectListResponse>('/v1/projects', {
      params: {
        workspace_id: workspaceId,
        status,
        page,
        page_size: pageSize,
        sort_by: sortBy,
      },
    });
    return response.data;
  }

  /**
   * Get project details
   * GET /v1/projects/:id
   */
  async getProject(projectId: string): Promise<Project> {
    const response = await this.api.get<Project>(`/v1/projects/${projectId}`);
    return response.data;
  }

  /**
   * Update project information
   * PATCH /v1/projects/:id
   */
  async updateProject(projectId: string, data: UpdateProjectDTO): Promise<Project> {
    const response = await this.api.patch<Project>(`/v1/projects/${projectId}`, data);
    return response.data;
  }

  /**
   * Update project status
   * PATCH /v1/projects/:id/status
   */
  async updateProjectStatus(
    projectId: string,
    status: string,
    completionDate?: string
  ): Promise<{ status: string; completion_date?: string }> {
    const response = await this.api.patch<{ status: string; completion_date?: string }>(
      `/v1/projects/${projectId}/status`,
      {
        status,
        completion_date: completionDate,
      }
    );
    return response.data;
  }

  /**
   * Delete project (soft delete)
   * DELETE /v1/projects/:id
   */
  async deleteProject(projectId: string): Promise<void> {
    await this.api.delete(`/v1/projects/${projectId}`);
  }

  /**
   * Clone project
   * POST /v1/projects/:id/clone
   */
  async cloneProject(
    projectId: string,
    newName: string,
    copyTasks: boolean = true,
    copyMembers: boolean = false
  ): Promise<Project> {
    const response = await this.api.post<Project>(`/v1/projects/${projectId}/clone`, {
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
   * GET /v1/projects/:id/members
   */
  async listProjectMembers(projectId: string, page: number = 1, pageSize: number = 50): Promise<ProjectMember[]> {
    const response = await this.api.get<ProjectMember[]>(`/v1/projects/${projectId}/members`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Add member to project
   * POST /v1/projects/:id/members
   */
  async addProjectMember(
    projectId: string,
    userId: string,
    role: string = 'member'
  ): Promise<ProjectMember> {
    const response = await this.api.post<ProjectMember>(`/v1/projects/${projectId}/members`, {
      user_id: userId,
      role,
    });
    return response.data;
  }

  /**
   * Update project member role
   * PATCH /v1/projects/:id/members/:userId
   */
  async updateProjectMemberRole(
    projectId: string,
    userId: string,
    role: string
  ): Promise<ProjectMember> {
    const response = await this.api.patch<ProjectMember>(
      `/v1/projects/${projectId}/members/${userId}`,
      { role }
    );
    return response.data;
  }

  /**
   * Remove member from project
   * DELETE /v1/projects/:id/members/:userId
   */
  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await this.api.delete(`/v1/projects/${projectId}/members/${userId}`);
  }

  // ========================================================================
  // Project Templates
  // ========================================================================

  /**
   * Create project template
   * POST /v1/projects/templates
   */
  async createTemplate(
    name: string,
    description?: string,
    structure?: Record<string, any>
  ): Promise<ProjectTemplate> {
    const response = await this.api.post<ProjectTemplate>('/v1/projects/templates', {
      name,
      description,
      structure,
    });
    return response.data;
  }

  /**
   * List project templates
   * GET /v1/projects/templates
   */
  async listTemplates(page: number = 1, pageSize: number = 20): Promise<ProjectTemplate[]> {
    const response = await this.api.get<ProjectTemplate[]>('/v1/projects/templates', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Create project from template
   * POST /v1/projects/from-template
   */
  async createProjectFromTemplate(
    templateId: string,
    workspaceId: string,
    projectName: string,
    startDate: string
  ): Promise<Project> {
    const response = await this.api.post<Project>('/v1/projects/from-template', {
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
   * POST /v1/projects/:id/change-requests
   */
  async createChangeRequest(
    projectId: string,
    title: string,
    description: string,
    scope: string,
    impactAnalysis: string,
    requestedChanges: Record<string, any>
  ): Promise<ChangeRequest> {
    const response = await this.api.post<ChangeRequest>(`/v1/projects/${projectId}/change-requests`, {
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
   * GET /v1/projects/:id/change-requests
   */
  async listChangeRequests(
    projectId: string,
    status?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ChangeRequest[]> {
    const response = await this.api.get<ChangeRequest[]>(`/v1/projects/${projectId}/change-requests`, {
      params: { status, page, page_size: pageSize },
    });
    return response.data;
  }

  /**
   * Approve/Reject change request
   * PATCH /v1/projects/:id/change-requests/:crId/approve
   */
  async approveChangeRequest(
    projectId: string,
    changeRequestId: string,
    approved: boolean,
    reviewerNotes?: string
  ): Promise<ChangeRequest> {
    const response = await this.api.patch<ChangeRequest>(
      `/v1/projects/${projectId}/change-requests/${changeRequestId}/approve`,
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
   * GET /v1/projects/:id/metrics
   */
  async getProjectMetrics(projectId: string): Promise<ProjectMetrics> {
    const response = await this.api.get<ProjectMetrics>(`/v1/projects/${projectId}/metrics`);
    return response.data;
  }

  /**
   * Update project settings
   * PUT /v1/projects/:id/settings
   */
  async updateProjectSettings(projectId: string, settings: Partial<ProjectSettings>): Promise<ProjectSettings> {
    const response = await this.api.put<ProjectSettings>(
      `/v1/projects/${projectId}/settings`,
      settings
    );
    return response.data;
  }

  /**
   * Get project settings
   * GET /v1/projects/:id/settings
   */
  async getProjectSettings(projectId: string): Promise<ProjectSettings> {
    const response = await this.api.get<ProjectSettings>(`/v1/projects/${projectId}/settings`);
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
