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