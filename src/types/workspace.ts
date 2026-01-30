/**
 * Workspace Entity & Related Types
 * Module 2: Multi-tenancy & Identity Resolution
 * 
 * Tenant Logic - Container cao nhất cho multi-tenant architecture
 * Ref: docs/docs - PronaFlow React&FastAPI/02-Architeture/Entities/Workspace*.md
 */

// ============================================================================
// Enums
// ============================================================================

export type WorkspaceStatus = 'ACTIVE' | 'SOFT_DELETED';
export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer' | 'guest';

// ============================================================================
// Workspace Models
// ============================================================================

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: WorkspaceStatus;
  is_deleted: boolean;
  deleted_at?: string; // ISO timestamp, nullable
  created_at: string;
  updated_at: string;
}

export interface WorkspaceDetail extends Workspace {
  members?: WorkspaceMember[];
  settings?: WorkspaceSetting;
}

// ============================================================================
// Workspace Member Models
// ============================================================================

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  is_active: boolean;
  joined_at: string;
  left_at?: string | null;
  user?: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
  };
}

// ============================================================================
// Workspace Invitation Models
// ============================================================================

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  invited_role: WorkspaceRole;
  token_hash: string;
  expires_at: string;
  accepted_at?: string | null;
  invited_by?: string;
  created_at: string;
}

// ============================================================================
// Workspace Settings Models
// ============================================================================

export interface WorkspaceSetting {
  workspace_id: string;
  timezone?: string;
  work_days?: string;
  work_hours?: string;
  logo_url?: string;
  updated_at: string;
}

// ============================================================================
// Workspace Access Log Models
// ============================================================================

export interface WorkspaceAccessLog {
  id: string;
  user_id: string;
  workspace_id: string;
  created_at: string;
}

// ============================================================================
// API Request/Response DTOs
// ============================================================================

export interface CreateWorkspaceDTO {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceDTO {
  name?: string;
  description?: string;
  status?: WorkspaceStatus;
}

export interface AddMemberDTO {
  user_id: string;
  role?: WorkspaceRole;
}

export interface UpdateMemberDTO {
  role?: WorkspaceRole;
  is_active?: boolean;
}

export interface CreateInvitationDTO {
  email: string;
  invited_role?: WorkspaceRole;
}

export interface AcceptInvitationDTO {
  token: string;
}

export interface UpdateSettingsDTO {
  timezone?: string;
  work_days?: string;
  work_hours?: string;
  logo_url?: string;
}

export interface WorkspaceListResponse {
  total: number;
  items: Workspace[];
}

// ============================================================================
// UI State Models
// ============================================================================

export interface WorkspaceFilterOptions {
  search?: string;
  status?: WorkspaceStatus;
  role?: WorkspaceRole;
  sortBy?: 'name' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface MemberFilterOptions {
  search?: string;
  role?: WorkspaceRole;
  is_active?: boolean;
  sortBy?: 'name' | 'role' | 'joined_at';
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Error Models
// ============================================================================

export interface WorkspaceError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
