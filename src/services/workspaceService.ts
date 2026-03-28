/**
 * Workspace API Service
 * Handles all API calls to workspace backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';
import {
  Workspace,
  WorkspaceDetail,
  WorkspaceMember,
  WorkspaceInvitation,
  WorkspaceSetting,
  WorkspaceAccessLog,
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberDTO,
  CreateInvitationDTO,
  UpdateSettingsDTO,
  WorkspaceListResponse,
  WorkspaceRole,
} from '@/types/workspace';

class WorkspaceService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient();
  }

  // ========================================================================
  // Workspace CRUD Operations
  // ========================================================================

  /**
   * Create a new workspace
   * POST /workspaces
   */
  async createWorkspace(data: CreateWorkspaceDTO): Promise<Workspace> {
    const response = await this.api.post<Workspace>('/workspaces', data);
    return response.data;
  }

  /**
   * Get list of user's workspaces
   * GET /workspaces
   */
  async listWorkspaces(skip: number = 0, limit: number = 10): Promise<WorkspaceListResponse> {
    const response = await this.api.get<WorkspaceListResponse>('/workspaces', {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get workspace details with members and settings
   * GET /workspaces/:id
   */
  async getWorkspace(workspaceId: string): Promise<WorkspaceDetail> {
    const response = await this.api.get<WorkspaceDetail>(`/workspaces/${workspaceId}`);
    return response.data;
  }

  /**
   * Update workspace information
   * PUT /workspaces/:id
   */
  async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceDTO
  ): Promise<Workspace> {
    const response = await this.api.put<Workspace>(
      `/workspaces/${workspaceId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete workspace (soft delete)
   * DELETE /workspaces/:id
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}`);
  }

  // ========================================================================
  // Member Management
  // ========================================================================

  /**
   * Add member to workspace
   * POST /workspaces/:id/members
   */
  async addMember(
    workspaceId: string,
    data: AddMemberDTO
  ): Promise<WorkspaceMember> {
    const response = await this.api.post<WorkspaceMember>(
      `/workspaces/${workspaceId}/members`,
      data
    );
    return response.data;
  }

  /**
   * Get list of workspace members
    * GET /workspaces/:id/members
   */
  async listMembers(
    workspaceId: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceMember[]> {
    const response = await this.api.get<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  /**
   * Update member role
    * PUT /workspaces/:id/members/:userId
   */
  async updateMember(
    workspaceId: string,
    userId: string,
    data: UpdateMemberDTO
  ): Promise<WorkspaceMember> {
    const response = await this.api.put<WorkspaceMember>(
      `/workspaces/${workspaceId}/members/${userId}`,
      data
    );
    return response.data;
  }

  /**
   * Remove member from workspace
   * DELETE /workspaces/:id/members/:userId
   */
  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  }

  // ========================================================================
  // Invitation Management
  // ========================================================================

  /**
   * Send workspace invitation
    * POST /workspaces/:id/invitations
   */
  async sendInvitation(
    workspaceId: string,
    data: CreateInvitationDTO
  ): Promise<WorkspaceInvitation> {
    const response = await this.api.post<WorkspaceInvitation>(
      `/workspaces/${workspaceId}/invitations`,
      data
    );
    return response.data;
  }

  /**
   * Get list of pending invitations
    * GET /workspaces/:id/invitations
   */
  async listInvitations(
    workspaceId: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceInvitation[]> {
    const response = await this.api.get<WorkspaceInvitation[]>(
      `/workspaces/${workspaceId}/invitations`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  /**
   * Cancel pending invitation
    * DELETE /workspaces/:id/invitations/:invitationId
   */
  async cancelInvitation(
    workspaceId: string,
    invitationId: string
  ): Promise<void> {
    await this.api.delete(
      `/workspaces/${workspaceId}/invitations/${invitationId}`
    );
  }

  /**
   * Accept workspace invitation
    * POST /workspaces/invitations/accept
   */
  async acceptInvitation(token: string): Promise<{ workspace_id: string; workspace_name: string }> {
    const response = await this.api.post<{ workspace_id: string; workspace_name: string }>(
      '/workspaces/invitations/accept',
      {},
      { params: { token } }
    );
    return response.data;
  }

  /**
   * Get last accessed workspace
    * GET /workspaces/me/last-accessed
   */
  async getLastAccessedWorkspace(): Promise<{ workspace_id: string; name: string; accessed_at: string }> {
    const response = await this.api.get<{ workspace_id: string; name: string; accessed_at: string }>(
      '/workspaces/me/last-accessed'
    );
    return response.data;
  }

  // ========================================================================
  // Settings Management
  // ========================================================================

  /**
   * Get workspace settings
    * GET /workspaces/:id/settings
   */
  async getSettings(workspaceId: string): Promise<WorkspaceSetting> {
    const response = await this.api.get<WorkspaceSetting>(
      `/workspaces/${workspaceId}/settings`
    );
    return response.data;
  }

  /**
   * Update workspace settings
    * PUT /workspaces/:id/settings
   */
  async updateSettings(
    workspaceId: string,
    data: UpdateSettingsDTO
  ): Promise<WorkspaceSetting> {
    const response = await this.api.put<WorkspaceSetting>(
      `/workspaces/${workspaceId}/settings`,
      data
    );
    return response.data;
  }

  // ========================================================================
  // Access & Audit
  // ========================================================================

  /**
   * Log workspace access (context switch)
   * POST /workspaces/:id/access
   */
  async logAccess(workspaceId: string): Promise<void> {
    await this.api.post(`/workspaces/${workspaceId}/access`);
  }

  /**
   * Get access history
    * GET /workspaces/:id/access-logs
   */
  async getAccessLogs(
    workspaceId: string,
    userId?: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceAccessLog[]> {
    const response = await this.api.get<WorkspaceAccessLog[]>(
      `/workspaces/${workspaceId}/access-logs`,
      {
        params: {
          user_id: userId,
          skip,
          limit,
        },
      }
    );
    return response.data;
  }

  // ========================================================================
  // Batch Operations
  // ========================================================================

  /**
   * Add multiple members at once
   */
  async addMultipleMembers(
    workspaceId: string,
    members: AddMemberDTO[]
  ): Promise<WorkspaceMember[]> {
    const results: WorkspaceMember[] = [];
    for (const member of members) {
      try {
        const result = await this.addMember(workspaceId, member);
        results.push(result);
      } catch (error) {
        console.error(`Failed to add member ${member.user_id}:`, error);
      }
    }
    return results;
  }

  /**
   * Send invitations to multiple emails
   */
  async sendBulkInvitations(
    workspaceId: string,
    emails: string[],
    role: WorkspaceRole = 'member'
  ): Promise<WorkspaceInvitation[]> {
    const results: WorkspaceInvitation[] = [];
    for (const email of emails) {
      try {
        const result = await this.sendInvitation(workspaceId, {
          email,
          invited_role: role,
        });
        results.push(result);
      } catch (error) {
        console.error(`Failed to invite ${email}:`, error);
      }
    }
    return results;
  }
}

// Export singleton instance
export const workspaceService = new WorkspaceService();
export default workspaceService;
