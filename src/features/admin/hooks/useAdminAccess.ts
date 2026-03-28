/**
 * Admin Access Control Hook
 * Module 14: System Administration
 * 
 * Provides role-based access control for admin features
 */

import { useAuth } from '@/hooks/useAuth';

export interface AdminRole {
  name: string;
  permissions: string[];
}

const ADMIN_ROLES: Record<string, AdminRole> = {
  super_admin: {
    name: 'Super Admin',
    permissions: [
      'admin:all',
      'users:manage',
      'roles:manage',
      'permissions:manage',
      'system:config',
      'feature:flags',
      'security:incidents',
      'audit:logs',
    ],
  },
  system_admin: {
    name: 'System Admin',
    permissions: [
      'users:manage',
      'roles:manage',
      'system:config',
      'feature:flags',
      'security:incidents',
      'audit:logs',
    ],
  },
  security_admin: {
    name: 'Security Admin',
    permissions: [
      'security:incidents',
      'audit:logs',
      'users:view',
    ],
  },
};

export const useAdminAccess = () => {
  const auth = useAuth();
  
  // 获取当前用户的管理员角色
  const getAdminRole = (): AdminRole | null => {
    // TODO: 从用户数据获取实际的管理员角色
    // 现在从localStorage mock数据
    const userAdminRole = localStorage.getItem('user_admin_role');
    return userAdminRole ? ADMIN_ROLES[userAdminRole] || null : null;
  };

  // 检查用户是否为管理员
  const isAdmin = (): boolean => {
    return getAdminRole() !== null;
  };

  // 检查用户是否为超级管理员
  const isSuperAdmin = (): boolean => {
    const role = getAdminRole();
    return role?.name === 'Super Admin';
  };

  // 检查用户是否有特定权限
  const hasPermission = (permission: string): boolean => {
    const role = getAdminRole();
    if (!role) return false;
    return role.permissions.includes(permission);
  };

  // 检查用户是否有任何指定权限
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  // 检查用户是否有所有指定权限
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    getAdminRole,
    isAdmin,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
