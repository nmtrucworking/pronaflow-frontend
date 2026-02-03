/**
 * RBAC (Role-Based Access Control) Utilities
 * Module 1: Identity and Access Management
 * 
 * Permission checking and authorization utilities
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

// ============================================================================
// Role Definitions
// ============================================================================

export enum WorkspaceRole {
  OWNER = 'workspace_owner',
  ADMIN = 'workspace_admin',
  MEMBER = 'workspace_member',
  GUEST = 'workspace_guest',
}

export enum ProjectRole {
  OWNER = 'project_owner',
  LEAD = 'project_lead',
  MEMBER = 'project_member',
  VIEWER = 'project_viewer',
}

// ============================================================================
// Permission Map
// ============================================================================

export const rolePermissions: Record<string, string[]> = {
  [WorkspaceRole.OWNER]: [
    'manage_workspace',
    'manage_billing',
    'manage_members',
    'create_project',
    'edit_project',
    'delete_project',
    'manage_settings',
    'view_analytics',
    'manage_roles',
  ],
  [WorkspaceRole.ADMIN]: [
    'manage_members',
    'create_project',
    'edit_project',
    'delete_project',
    'manage_settings',
    'view_analytics',
  ],
  [WorkspaceRole.MEMBER]: [
    'create_project',
    'edit_project',
    'view_analytics',
    'create_task',
    'edit_task',
  ],
  [WorkspaceRole.GUEST]: [
    'view_project',
    'view_task',
    'add_comment',
  ],
};

// ============================================================================
// useRBAC Hook
// ============================================================================

export const useRBAC = () => {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.roles) return false;

    return user.roles.some((role) => {
      const permissions = rolePermissions[role] || [];
      return permissions.includes(permission);
    });
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles?.includes(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.every((role) => user.roles?.includes(role));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((perm) => hasPermission(perm));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((perm) => hasPermission(perm));
  };

  const isWorkspaceOwner = (): boolean => hasRole(WorkspaceRole.OWNER);
  const isWorkspaceAdmin = (): boolean => hasAnyRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN]);
  const isWorkspaceMember = (): boolean =>
    hasAnyRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER]);

  return {
    user,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    isWorkspaceOwner,
    isWorkspaceAdmin,
    isWorkspaceMember,
  };
};

// ============================================================================
// Permission Guard Function
// ============================================================================

export const canPerformAction = (
  userRoles: string[] | undefined,
  permission: string
): boolean => {
  if (!userRoles) return false;

  return userRoles.some((role) => {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
  });
};

// ============================================================================
// Helper Components
// ============================================================================

interface RoleGuardProps {
  roles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RoleGuard = ({ roles, fallback, children }: RoleGuardProps) => {
  const { hasAnyRole } = useRBAC();

  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard = ({ permission, fallback, children }: PermissionGuardProps) => {
  const { hasPermission } = useRBAC();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
