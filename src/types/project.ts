/**
 * Project Entity
 * Module 3: Project Planning & Portfolio
 */

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'ON_HOLD' | 'ARCHIVED';
export type ProjectType = 'WATERFALL' | 'AGILE';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type FileType = 'PDF' | 'DOC' | 'IMG' | 'XLS' | 'VIDEO' | 'OTHER';

export interface UserEntity {
  user_id?: string;
  id?: string;
  username?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  avatar?: string;
}

export type ProjectMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface ProjectMember {
  project_member_id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  joined_at: string;
  // Nested user data (optional)
  user?: UserEntity;
}

export interface Project {
  project_id: string;
  workspace_id: string;
  key: string; // Generated key like "PRJ-01"
  name: string;
  description?: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  type: ProjectType;
  progress: number; // 0-100
  start_date: string; // ISO Date
  end_date?: string; // ISO Date
  owner_id: string;
  created_at: string;
  updated_at?: string;
  
  // Frontend only fields
  manager?: UserEntity; // Deprecated, use owner_id instead
  members?: ProjectMember[];
  tags?: string[]; // Tag IDs
  thumbnail_url?: string;
}

export interface ProjectFile {
  file_id: string;
  project_id: string;
  name: string;
  type: FileType;
  size: string;
  uploader: UserEntity;
  uploaded_at: string;
}

export interface CreateProjectDTO {
  workspace_id: string;
  name: string;
  description?: string;
  priority?: ProjectPriority;
  type: ProjectType;
  start_date: string;
  end_date?: string;
  member_ids?: string[];
  tag_ids?: string[];
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  priority?: ProjectPriority;
  status?: ProjectStatus;
  type?: ProjectType;
  start_date?: string;
  end_date?: string;
  tag_ids?: string[];
}

export interface ProjectSettings {
  allow_public_access: boolean;
  allow_comments: boolean;
  allow_file_uploads: boolean;
  default_task_status: string;
}

// ========================================================================
// Project Templates
// ========================================================================

export interface ProjectTemplate {
  template_id: string;
  name: string;
  description?: string;
  structure?: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at?: string;
  is_public?: boolean;
}

export interface CreateTemplateDTO {
  name: string;
  description?: string;
  structure?: Record<string, any>;
  is_public?: boolean;
}

export interface UpdateTemplateDTO {
  name?: string;
  description?: string;
  structure?: Record<string, any>;
  is_public?: boolean;
}

// ========================================================================
// Change Requests
// ========================================================================

export type ChangeRequestStatus = 'pending' | 'approved' | 'rejected' | 'implemented';

export interface ChangeRequest {
  change_request_id: string;
  project_id: string;
  title: string;
  description: string;
  scope: string;
  impact_analysis: string;
  status: ChangeRequestStatus;
  requested_changes: Record<string, any>;
  created_by: string;
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  reviewer_notes?: string;
}

export interface CreateChangeRequestDTO {
  title: string;
  description: string;
  scope: string;
  impact_analysis: string;
  requested_changes: Record<string, any>;
}

export interface UpdateChangeRequestDTO {
  title?: string;
  description?: string;
  scope?: string;
  impact_analysis?: string;
  requested_changes?: Record<string, any>;
}

export interface ApproveChangeRequestDTO {
  approved: boolean;
  reviewer_notes?: string;
}

// ========================================================================
// Project Metrics & Health
// ========================================================================

export type HealthStatus = 'green' | 'amber' | 'red';

export interface ScheduleHealth {
  status: string;
  progress: number;
  on_track: boolean;
  days_remaining?: number;
  days_overdue?: number;
}

export interface BudgetHealth {
  status: string;
  spent_percentage: number;
  spent: number;
  total_budget: number;
  remaining: number;
}

export interface ResourceHealth {
  status: string;
  utilization: number;
  allocated_resources: number;
  available_resources: number;
}

export interface ProjectMetricsDetail {
  schedule_health: ScheduleHealth;
  budget_health: BudgetHealth;
  resource_health: ResourceHealth;
}

export interface ProjectMetrics {
  project_id: string;
  health_status: HealthStatus;
  metrics: ProjectMetricsDetail;
  last_updated: string;
}

// ========================================================================
// Project Member DTOs
// ========================================================================

export interface AddProjectMemberDTO {
  user_id: string;
  role: ProjectMemberRole;
}

export interface UpdateProjectMemberDTO {
  role: ProjectMemberRole;
}

export interface AddMultipleMembersDTO {
  members: Array<{
    user_id: string;
    role: ProjectMemberRole;
  }>;
}

// ========================================================================
// Project Status Update
// ========================================================================

export interface UpdateProjectStatusDTO {
  status: ProjectStatus;
  completion_date?: string;
  notes?: string;
}

// ========================================================================
// Project Clone
// ========================================================================

export interface CloneProjectDTO {
  new_name: string;
  copy_tasks?: boolean;
  copy_members?: boolean;
  copy_files?: boolean;
  workspace_id?: string;
}

// ========================================================================
// List Responses
// ========================================================================

export interface ProjectListResponse {
  projects: Project[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface TemplateListResponse {
  templates: ProjectTemplate[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface ChangeRequestListResponse {
  change_requests: ChangeRequest[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}