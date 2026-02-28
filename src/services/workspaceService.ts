/**
 * Workspace API Service
 * Handles all API calls to workspace backend endpoints
 */

import type { AxiosInstance } from 'axios';
import { createApiClient, API_ROOT_URL } from '@/lib/axiosClient';
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
} from '@/types/workspace';

class WorkspaceService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient(API_ROOT_URL);
  }

  // ========================================================================
  // Workspace CRUD Operations
  // ========================================================================

  /**
   * Create a new workspace
   * POST /v1/workspaces
   */
  async createWorkspace(data: CreateWorkspaceDTO): Promise<Workspace> {
    const response = await this.api.post<Workspace>('/v1/workspaces', data);
    return response.data;
  }

  /**
   * Get list of user's workspaces
   * GET /v1/workspaces
   */
  async listWorkspaces(skip: number = 0, limit: number = 10): Promise<WorkspaceListResponse> {
    const response = await this.api.get<WorkspaceListResponse>('/v1/workspaces', {
      params: { skip, limit },
    });
    return response.data;
  }

  /**
   * Get workspace details with members and settings
   * GET /v1/workspaces/:id
   */
  async getWorkspace(workspaceId: string): Promise<WorkspaceDetail> {
    const response = await this.api.get<WorkspaceDetail>(`/v1/workspaces/${workspaceId}`);
    return response.data;
  }

  /**
   * Update workspace information
   * PUT /v1/workspaces/:id
   */
  async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceDTO
  ): Promise<Workspace> {
    const response = await this.api.put<Workspace>(
      `/v1/workspaces/${workspaceId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete workspace (soft delete)
   * DELETE /v1/workspaces/:id
   */
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await this.api.delete(`/v1/workspaces/${workspaceId}`);
  }

  // ========================================================================
  // Member Management
  // ========================================================================

  /**
   * Add member to workspace
   * POST /v1/workspaces/:id/members
   */
  async addMember(
    workspaceId: string,
    data: AddMemberDTO
  ): Promise<WorkspaceMember> {
    const response = await this.api.post<WorkspaceMember>(
      `/v1/workspaces/${workspaceId}/members`,
      data
    );
    return response.data;
  }

  /**
   * Get list of workspace members
   * GET /v1/workspaces/:id/members
   */
  async listMembers(
    workspaceId: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceMember[]> {
    const response = await this.api.get<WorkspaceMember[]>(
      `/v1/workspaces/${workspaceId}/members`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  /**
   * Update member role
   * PUT /v1/workspaces/:id/members/:userId
   */
  async updateMember(
    workspaceId: string,
    userId: string,
    data: UpdateMemberDTO
  ): Promise<WorkspaceMember> {
    const response = await this.api.put<WorkspaceMember>(
      `/v1/workspaces/${workspaceId}/members/${userId}`,
      data
    );
    return response.data;
  }

  /**
   * Remove member from workspace
   * DELETE /v1/workspaces/:id/members/:userId
   */
  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await this.api.delete(`/v1/workspaces/${workspaceId}/members/${userId}`);
  }

  // ========================================================================
  // Invitation Management
  // ========================================================================

  /**
   * Send workspace invitation
   * POST /v1/workspaces/:id/invitations
   */
  async sendInvitation(
    workspaceId: string,
    data: CreateInvitationDTO
  ): Promise<WorkspaceInvitation> {
    const response = await this.api.post<WorkspaceInvitation>(
      `/v1/workspaces/${workspaceId}/invitations`,
      data
    );
    return response.data;
  }

  /**
   * Get list of pending invitations
   * GET /v1/workspaces/:id/invitations
   */
  async listInvitations(
    workspaceId: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceInvitation[]> {
    const response = await this.api.get<WorkspaceInvitation[]>(
      `/v1/workspaces/${workspaceId}/invitations`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  /**
   * Cancel pending invitation
   * DELETE /v1/workspaces/:id/invitations/:invitationId
   */
  async cancelInvitation(
    workspaceId: string,
    invitationId: string
  ): Promise<void> {
    await this.api.delete(
      `/v1/workspaces/${workspaceId}/invitations/${invitationId}`
    );
  }

  /**
   * Accept workspace invitation
   * POST /v1/workspaces/invitations/accept
   */
  async acceptInvitation(token: string): Promise<{ workspace_id: string; workspace_name: string }> {
    const response = await this.api.post<{ workspace_id: string; workspace_name: string }>(
      '/v1/workspaces/invitations/accept',
      {},
      { params: { token } }
    );
    return response.data;
  }

  /**
   * Get last accessed workspace
   * GET /v1/workspaces/me/last-accessed
   */
  async getLastAccessedWorkspace(): Promise<{ workspace_id: string; name: string; accessed_at: string }> {
    const response = await this.api.get<{ workspace_id: string; name: string; accessed_at: string }>(
      '/v1/workspaces/me/last-accessed'
    );
    return response.data;
  }

  // ========================================================================
  // Settings Management
  // ========================================================================

  /**
   * Get workspace settings
   * GET /v1/workspaces/:id/settings
   */
  async getSettings(workspaceId: string): Promise<WorkspaceSetting> {
    const response = await this.api.get<WorkspaceSetting>(
      `/v1/workspaces/${workspaceId}/settings`
    );
    return response.data;
  }

  /**
   * Update workspace settings
   * PUT /v1/workspaces/:id/settings
   */
  async updateSettings(
    workspaceId: string,
    data: UpdateSettingsDTO
  ): Promise<WorkspaceSetting> {
    const response = await this.api.put<WorkspaceSetting>(
      `/v1/workspaces/${workspaceId}/settings`,
      data
    );
    return response.data;
  }

  // ========================================================================
  // Access & Audit
  // ========================================================================

  /**
   * Log workspace access (context switch)
   * POST /v1/workspaces/:id/access
   */
  async logAccess(workspaceId: string): Promise<void> {
    await this.api.post(`/v1/workspaces/${workspaceId}/access`);
  }

  /**
   * Get access history
   * GET /v1/workspaces/:id/access-logs
   */
  async getAccessLogs(
    workspaceId: string,
    userId?: string,
    skip: number = 0,
    limit: number = 50
  ): Promise<WorkspaceAccessLog[]> {
    const response = await this.api.get<WorkspaceAccessLog[]>(
      `/v1/workspaces/${workspaceId}/access-logs`,
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
    role: string = 'member'
  ): Promise<WorkspaceInvitation[]> {
    const results: WorkspaceInvitation[] = [];
    for (const email of emails) {
      try {
        const result = await this.sendInvitation(workspaceId, {
          email,
          invited_role: role as any,
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
