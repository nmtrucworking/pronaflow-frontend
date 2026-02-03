/**
 * Archive & Data Management Service
 * Module 8: Archive & Data Management
 * 
 * Handles archiving, trash management, and audit logs
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

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

export interface ArchiveRequest {
  resource_type: 'project' | 'task' | 'workspace';
  resource_id: string;
  reason?: string;
}

export interface RestoreRequest {
  resource_type: 'project' | 'task' | 'workspace';
  resource_id: string;
}

export interface DataExportRequest {
  workspace_id: string;
  include_archived: boolean;
  include_deleted: boolean;
  format: 'json' | 'csv' | 'excel';
  resources?: string[];
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

// ============================================================================
// ARCHIVE METHODS
// ============================================================================

/**
 * Archive a project
 */
export const archiveProject = async (
  projectId: string,
  reason?: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/archive/projects/${projectId}/archive`, { reason });
};

/**
 * Restore archived project
 */
export const restoreProject = async (
  projectId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/archive/projects/${projectId}/restore`);
};

/**
 * Archive a workspace
 */
export const archiveWorkspace = async (
  workspaceId: string,
  reason?: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/archive/workspaces/${workspaceId}/archive`, { reason });
};

/**
 * Get archived items
 */
export const getArchivedItems = async (
  params?: {
    resource_type?: 'project' | 'task' | 'workspace';
    workspace_id?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ items: ArchivedItem[]; pagination: any }>> => {
  return axiosClient.get('/archive/items', { params });
};

/**
 * Permanently delete archived item
 */
export const permanentlyDeleteArchived = async (
  archiveId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/archive/items/${archiveId}/permanent`);
};

// ============================================================================
// TRASH METHODS
// ============================================================================

/**
 * Move item to trash
 */
export const moveToTrash = async (
  data: {
    resource_type: 'project' | 'task' | 'workspace' | 'file';
    resource_id: string;
  }
): Promise<AxiosResponse<{ trash_id: string; message: string }>> => {
  return axiosClient.post('/archive/trash', data);
};

/**
 * Get trash items
 */
export const getTrashItems = async (
  params?: {
    resource_type?: string;
    workspace_id?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ items: TrashItem[]; pagination: any }>> => {
  return axiosClient.get('/archive/trash', { params });
};

/**
 * Restore from trash
 */
export const restoreFromTrash = async (
  trashId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/archive/trash/${trashId}/restore`);
};

/**
 * Empty trash
 */
export const emptyTrash = async (
  workspaceId?: string
): Promise<AxiosResponse<{ message: string; deleted_count: number }>> => {
  return axiosClient.delete('/archive/trash/empty', {
    params: { workspace_id: workspaceId }
  });
};

/**
 * Permanently delete trash item
 */
export const permanentlyDeleteTrash = async (
  trashId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/archive/trash/${trashId}`);
};

// ============================================================================
// AUDIT LOG METHODS
// ============================================================================

/**
 * Get audit logs
 */
export const getAuditLogs = async (
  params?: {
    workspace_id?: string;
    user_id?: string;
    action?: string;
    resource_type?: string;
    resource_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ logs: AuditLog[]; pagination: any }>> => {
  return axiosClient.get('/audit-logs', { params });
};

/**
 * Get audit log details
 */
export const getAuditLogById = async (
  auditId: string
): Promise<AxiosResponse<AuditLog>> => {
  return axiosClient.get(`/audit-logs/${auditId}`);
};

/**
 * Export audit logs
 */
export const exportAuditLogs = async (
  params: {
    workspace_id?: string;
    date_from?: string;
    date_to?: string;
    format: 'csv' | 'excel' | 'json';
  }
): Promise<AxiosResponse<Blob>> => {
  return axiosClient.post('/audit-logs/export', params, {
    responseType: 'blob'
  });
};

// ============================================================================
// DATA EXPORT METHODS
// ============================================================================

/**
 * Request data export
 */
export const requestDataExport = async (
  data: DataExportRequest
): Promise<AxiosResponse<{ export_id: string; status: string }>> => {
  return axiosClient.post('/archive/export', data);
};

/**
 * Get export status
 */
export const getExportStatus = async (
  exportId: string
): Promise<AxiosResponse<{ export_id: string; status: string; download_url?: string }>> => {
  return axiosClient.get(`/archive/export/${exportId}`);
};

/**
 * Download export
 */
export const downloadExport = async (
  exportId: string
): Promise<AxiosResponse<Blob>> => {
  return axiosClient.get(`/archive/export/${exportId}/download`, {
    responseType: 'blob'
  });
};

// ============================================================================
// DATA RETENTION METHODS
// ============================================================================

/**
 * Get retention policies
 */
export const getRetentionPolicies = async (
  workspaceId: string
): Promise<AxiosResponse<{ policies: DataRetentionPolicy[] }>> => {
  return axiosClient.get(`/archive/workspaces/${workspaceId}/retention-policies`);
};

/**
 * Create retention policy
 */
export const createRetentionPolicy = async (
  workspaceId: string,
  data: {
    resource_type: string;
    retention_days: number;
    auto_archive: boolean;
    auto_delete: boolean;
  }
): Promise<AxiosResponse<DataRetentionPolicy>> => {
  return axiosClient.post(`/archive/workspaces/${workspaceId}/retention-policies`, data);
};

/**
 * Update retention policy
 */
export const updateRetentionPolicy = async (
  policyId: string,
  data: Partial<{
    retention_days: number;
    auto_archive: boolean;
    auto_delete: boolean;
  }>
): Promise<AxiosResponse<DataRetentionPolicy>> => {
  return axiosClient.patch(`/archive/retention-policies/${policyId}`, data);
};

/**
 * Delete retention policy
 */
export const deleteRetentionPolicy = async (
  policyId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/archive/retention-policies/${policyId}`);
};

export default {
  // Archive
  archiveProject,
  restoreProject,
  archiveWorkspace,
  getArchivedItems,
  permanentlyDeleteArchived,
  
  // Trash
  moveToTrash,
  getTrashItems,
  restoreFromTrash,
  emptyTrash,
  permanentlyDeleteTrash,
  
  // Audit Logs
  getAuditLogs,
  getAuditLogById,
  exportAuditLogs,
  
  // Data Export
  requestDataExport,
  getExportStatus,
  downloadExport,
  
  // Data Retention
  getRetentionPolicies,
  createRetentionPolicy,
  updateRetentionPolicy,
  deleteRetentionPolicy,
};
