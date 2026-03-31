/**
 * Archive & Data Management Types
 * Module 8: Archive & Data Management
 */

export type ArchiveResourceType = 'project' | 'task' | 'workspace' | 'file';

export interface ArchiveItem {
  id: string;
  resource_id: string;
  resource_type: ArchiveResourceType;
  name: string;
  archived_at: string;
  archived_by: string;
  reason?: string;
  expiry_date?: string;
  is_archived: boolean;
}

export interface TrashItemEntity {
  trash_id: string;
  resource_id: string;
  resource_type: ArchiveResourceType;
  name: string;
  deleted_at: string;
  purge_after: string;
  deleted_by: string;
  reason?: string;
}

export interface DataExportRequest {
  workspace_id: string;
  resources: ('project' | 'task' | 'user' | 'attachment' | 'comment')[];
  format: 'json' | 'csv';
  include_deleted?: boolean;
}

export interface ExportStatus {
  export_id: string;
  status: 'queued' | 'processing' | 'ready' | 'failed';
  progress_percent: number;
  file_size?: number;
  download_url?: string;
  expires_at: string;
  error_message?: string;
}

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

// Backward-compatible aliases for legacy consumers.
export type LegacyArchivedItem = ArchivedItem;
export type LegacyTrashItem = TrashItem;
