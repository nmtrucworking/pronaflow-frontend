/**
 * Admin System Service
 * Module 14: System Administration
 * 
 * Handles system admin operations, user management, roles, permissions, and system config
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {
  admin_user_id: string;
  email: string;
  username: string;
  full_name: string;
  status: 'active' | 'locked' | 'suspended';
  roles: string[];
  last_login: string;
  created_at: string;
}

export interface Role {
  role_id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  permission_id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface RoleAssignment {
  assignment_id: string;
  user_id: string;
  role_id: string;
  assigned_by: string;
  status: 'active' | 'pending' | 'revoked';
  assigned_at: string;
  expires_at?: string;
}

export interface SystemConfig {
  config_id: string;
  key: string;
  value: any;
  description?: string;
  category?: string;
  is_public: boolean;
  updated_at: string;
}

export interface FeatureFlag {
  flag_id: string;
  key: string;
  enabled: boolean;
  description?: string;
  rollout_percentage?: number;
  target_users?: string[];
  target_workspaces?: string[];
  created_at: string;
  updated_at: string;
}

export interface SecurityIncident {
  incident_id: string;
  type: 'unauthorized_access' | 'data_breach' | 'suspicious_activity' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  description: string;
  user_id?: string;
  ip_address?: string;
  detected_at: string;
  resolved_at?: string;
  actions_taken?: string;
}

export interface ChangeRequest {
  change_id: string;
  title: string;
  description: string;
  type: 'feature' | 'bug_fix' | 'config' | 'maintenance';
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requested_by: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SystemStats {
  total_users: number;
  active_users_today: number;
  total_workspaces: number;
  total_projects: number;
  total_tasks: number;
  storage_used_gb: number;
  api_calls_today: number;
  error_rate: number;
  uptime_percentage: number;
}

// ============================================================================
// ADMIN USERS
// ============================================================================

/**
 * Create admin user
 */
export const createAdminUser = async (
  data: {
    email: string;
    username: string;
    full_name: string;
    password: string;
    roles?: string[];
  }
): Promise<AxiosResponse<AdminUser>> => {
  return axiosClient.post('/admin-system/users', data);
};

/**
 * Get all admin users
 */
export const getAdminUsers = async (
  params?: {
    status?: string;
    role?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ users: AdminUser[]; pagination: any }>> => {
  return axiosClient.get('/admin-system/users', { params });
};

/**
 * Get admin user by ID
 */
export const getAdminUserById = async (
  userId: string
): Promise<AxiosResponse<AdminUser>> => {
  return axiosClient.get(`/admin-system/users/${userId}`);
};

/**
 * Update admin user
 */
export const updateAdminUser = async (
  userId: string,
  data: Partial<AdminUser>
): Promise<AxiosResponse<AdminUser>> => {
  return axiosClient.patch(`/admin-system/users/${userId}`, data);
};

/**
 * Lock admin user
 */
export const lockAdminUser = async (
  userId: string,
  reason?: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/admin-system/users/${userId}/lock`, { reason });
};

/**
 * Unlock admin user
 */
export const unlockAdminUser = async (
  userId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/admin-system/users/${userId}/unlock`);
};

// ============================================================================
// ROLES
// ============================================================================

/**
 * Create role
 */
export const createRole = async (
  data: {
    name: string;
    description: string;
    permissions: string[];
  }
): Promise<AxiosResponse<Role>> => {
  return axiosClient.post('/admin-system/roles', data);
};

/**
 * Get all roles
 */
export const getRoles = async (): Promise<AxiosResponse<{ roles: Role[] }>> => {
  return axiosClient.get('/admin-system/roles');
};

/**
 * Get role by ID
 */
export const getRoleById = async (
  roleId: string
): Promise<AxiosResponse<Role>> => {
  return axiosClient.get(`/admin-system/roles/${roleId}`);
};

/**
 * Update role
 */
export const updateRole = async (
  roleId: string,
  data: Partial<Role>
): Promise<AxiosResponse<Role>> => {
  return axiosClient.patch(`/admin-system/roles/${roleId}`, data);
};

/**
 * Get role permissions
 */
export const getRolePermissions = async (
  roleId: string
): Promise<AxiosResponse<{ permissions: Permission[] }>> => {
  return axiosClient.get(`/admin-system/roles/${roleId}/permissions`);
};

/**
 * Add permissions to role
 */
export const addRolePermissions = async (
  roleId: string,
  permissions: string[]
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/admin-system/roles/${roleId}/permissions`, { permissions });
};

// ============================================================================
// PERMISSIONS
// ============================================================================

/**
 * Create permission
 */
export const createPermission = async (
  data: {
    name: string;
    description: string;
    resource: string;
    action: string;
  }
): Promise<AxiosResponse<Permission>> => {
  return axiosClient.post('/admin-system/permissions', data);
};

/**
 * Get all permissions
 */
export const getPermissions = async (): Promise<AxiosResponse<{ permissions: Permission[] }>> => {
  return axiosClient.get('/admin-system/permissions');
};

/**
 * Update permission
 */
export const updatePermission = async (
  permissionId: string,
  data: Partial<Permission>
): Promise<AxiosResponse<Permission>> => {
  return axiosClient.patch(`/admin-system/permissions/${permissionId}`, data);
};

// ============================================================================
// ROLE ASSIGNMENTS
// ============================================================================

/**
 * Assign role to user
 */
export const assignRole = async (
  userId: string,
  roleId: string,
  expiresAt?: string
): Promise<AxiosResponse<RoleAssignment>> => {
  return axiosClient.post(`/admin-system/users/${userId}/roles`, {
    role_id: roleId,
    expires_at: expiresAt
  });
};

/**
 * Get user roles
 */
export const getUserRoles = async (
  userId: string
): Promise<AxiosResponse<{ roles: Role[] }>> => {
  return axiosClient.get(`/admin-system/users/${userId}/roles`);
};

/**
 * Remove role assignment
 */
export const removeRoleAssignment = async (
  assignmentId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/admin-system/role-assignments/${assignmentId}`);
};

// ============================================================================
// SYSTEM CONFIG
// ============================================================================

/**
 * Create config
 */
export const createConfig = async (
  data: {
    key: string;
    value: any;
    description?: string;
    category?: string;
    is_public?: boolean;
  }
): Promise<AxiosResponse<SystemConfig>> => {
  return axiosClient.post('/admin-system/config', data);
};

/**
 * Get all configs
 */
export const getConfigs = async (
  params?: {
    category?: string;
    is_public?: boolean;
  }
): Promise<AxiosResponse<{ configs: SystemConfig[] }>> => {
  return axiosClient.get('/admin-system/config', { params });
};

/**
 * Get config by key
 */
export const getConfigByKey = async (
  key: string
): Promise<AxiosResponse<SystemConfig>> => {
  return axiosClient.get(`/admin-system/config/${key}`);
};

/**
 * Update config
 */
export const updateConfig = async (
  key: string,
  value: any
): Promise<AxiosResponse<SystemConfig>> => {
  return axiosClient.patch(`/admin-system/config/${key}`, { value });
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Create feature flag
 */
export const createFeatureFlag = async (
  data: {
    key: string;
    enabled: boolean;
    description?: string;
    rollout_percentage?: number;
  }
): Promise<AxiosResponse<FeatureFlag>> => {
  return axiosClient.post('/admin-system/feature-flags', data);
};

/**
 * Get all feature flags
 */
export const getFeatureFlags = async (): Promise<AxiosResponse<{ flags: FeatureFlag[] }>> => {
  return axiosClient.get('/admin-system/feature-flags');
};

/**
 * Get feature flag by key
 */
export const getFeatureFlagByKey = async (
  key: string
): Promise<AxiosResponse<FeatureFlag>> => {
  return axiosClient.get(`/admin-system/feature-flags/${key}`);
};

/**
 * Update feature flag
 */
export const updateFeatureFlag = async (
  key: string,
  data: Partial<FeatureFlag>
): Promise<AxiosResponse<FeatureFlag>> => {
  return axiosClient.patch(`/admin-system/feature-flags/${key}`, data);
};

/**
 * Check feature flag for user
 */
export const checkFeatureFlag = async (
  key: string,
  userId: string
): Promise<AxiosResponse<{ enabled: boolean }>> => {
  return axiosClient.get(`/admin-system/feature-flags/${key}/check/${userId}`);
};

// ============================================================================
// SECURITY
// ============================================================================

/**
 * Create security incident
 */
export const createSecurityIncident = async (
  data: Partial<SecurityIncident>
): Promise<AxiosResponse<SecurityIncident>> => {
  return axiosClient.post('/admin-system/security-incidents', data);
};

/**
 * Get security incidents
 */
export const getSecurityIncidents = async (
  params?: {
    status?: string;
    severity?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ incidents: SecurityIncident[]; pagination: any }>> => {
  return axiosClient.get('/admin-system/security-incidents', { params });
};

/**
 * Get security incident by ID
 */
export const getSecurityIncidentById = async (
  incidentId: string
): Promise<AxiosResponse<SecurityIncident>> => {
  return axiosClient.get(`/admin-system/security-incidents/${incidentId}`);
};

/**
 * Update security incident
 */
export const updateSecurityIncident = async (
  incidentId: string,
  data: Partial<SecurityIncident>
): Promise<AxiosResponse<SecurityIncident>> => {
  return axiosClient.patch(`/admin-system/security-incidents/${incidentId}`, data);
};

// ============================================================================
// CHANGE REQUESTS
// ============================================================================

/**
 * Create change request
 */
export const createChangeRequest = async (
  data: Partial<ChangeRequest>
): Promise<AxiosResponse<ChangeRequest>> => {
  return axiosClient.post('/admin-system/change-requests', data);
};

/**
 * Get change requests
 */
export const getChangeRequests = async (
  params?: {
    status?: string;
    type?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ changes: ChangeRequest[]; pagination: any }>> => {
  return axiosClient.get('/admin-system/change-requests', { params });
};

/**
 * Approve change request
 */
export const approveChangeRequest = async (
  changeId: string,
  notes?: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/admin-system/change-requests/${changeId}/approve`, { notes });
};

// ============================================================================
// SYSTEM STATS
// ============================================================================

/**
 * Get system statistics
 */
export const getSystemStats = async (): Promise<AxiosResponse<SystemStats>> => {
  return axiosClient.get('/admin-system/stats');
};

export default {
  // Users
  createAdminUser,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  lockAdminUser,
  unlockAdminUser,
  
  // Roles
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  getRolePermissions,
  addRolePermissions,
  
  // Permissions
  createPermission,
  getPermissions,
  updatePermission,
  
  // Role Assignments
  assignRole,
  getUserRoles,
  removeRoleAssignment,
  
  // Config
  createConfig,
  getConfigs,
  getConfigByKey,
  updateConfig,
  
  // Feature Flags
  createFeatureFlag,
  getFeatureFlags,
  getFeatureFlagByKey,
  updateFeatureFlag,
  checkFeatureFlag,
  
  // Security
  createSecurityIncident,
  getSecurityIncidents,
  getSecurityIncidentById,
  updateSecurityIncident,
  
  // Change Requests
  createChangeRequest,
  getChangeRequests,
  approveChangeRequest,
  
  // Stats
  getSystemStats,
};
