/**
 * WorkspaceMember Entity
 * Module 2: Multi-tenancy & Identity Resolution
 * 
 * Bảng trung tâm của Multi-tenancy (User ↔ Workspace)
 */

export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceMember {
  workspace_member_id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceMemberRole;
  joined_at: string; // ISO timestamp
  left_at?: string; // ISO timestamp, nullable
  is_active: boolean;
  // Nested user data (optional)
  user?: {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface InviteWorkspaceMemberDTO {
  email: string;
  role: WorkspaceMemberRole;
}

export interface UpdateWorkspaceMemberRoleDTO {
  role: WorkspaceMemberRole;
}

export interface RemoveWorkspaceMemberDTO {
  reason?: string;
}

/**
 * Constraints:
 * - (workspace_id, user_id) UNIQUE
 * - Workspace luôn ≥ 1 OWNER
 */
