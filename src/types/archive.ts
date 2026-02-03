/**
 * Archive & Data Management Types
 * Module 8: Archive & Data Management
 */

export interface ArchivedItem {
  archive_id: string;
  resource_type: 'project' | 'task' | 'workspace';
  resource_id: string;
  resource_name: string;
  archived_by: string;
  archived_at: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface TrashItem {
  trash_id: string;
  resource_type: 'project' | 'task' | 'workspace' | 'file';
  resource_id: string;
  resource_name: string;
  deleted_by: string;
  deleted_at: string;
  auto_delete_at: string;
  can_restore: boolean;
}

export interface AuditLog {
  audit_id: string;
  user_id: string;
  username: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  user_agent: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface DataRetentionPolicy {
  policy_id: string;
  workspace_id: string;
  resource_type: string;
  retention_days: number;
  auto_archive: boolean;
  auto_delete: boolean;
  created_at: string;
  updated_at: string;
}
