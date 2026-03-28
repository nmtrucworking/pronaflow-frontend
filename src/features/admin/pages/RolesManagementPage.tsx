/**
 * Roles & Permissions Management Page
 * Module 14: System Administration
 */

import { useState } from 'react';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import type { Role, Permission } from '@/types/admin';

const RolesManagementPage = () => {
  const mockRoles: Role[] = [
    {
      role_id: 'role_1',
      name: 'Super Admin',
      description: 'Full system access and administrative privileges',
      permissions: ['admin:all', 'users:manage', 'roles:manage'],
      is_system_role: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-29T00:00:00Z',
    },
    {
      role_id: 'role_2',
      name: 'System Admin',
      description: 'Manage system configuration and users',
      permissions: ['users:manage', 'system:config', 'feature:flags'],
      is_system_role: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-29T00:00:00Z',
    },
    {
      role_id: 'role_3',
      name: 'Security Admin',
      description: 'Monitor security incidents and audit logs',
      permissions: ['security:incidents', 'audit:logs'],
      is_system_role: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-03-29T00:00:00Z',
    },
  ];

  const mockPermissions: Permission[] = [
    {
      permission_id: 'perm_1',
      name: 'Admin All',
      description: 'Full access to all admin features',
      resource: 'admin',
      action: 'all',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      permission_id: 'perm_2',
      name: 'Manage Users',
      description: 'Create, read, update, delete users',
      resource: 'users',
      action: 'manage',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      permission_id: 'perm_3',
      name: 'Manage Roles',
      description: 'Create, read, update, delete roles',
      resource: 'roles',
      action: 'manage',
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Roles & Permissions
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Configure system roles and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 font-medium transition-colors">
          <Plus size={18} />
          Add Role
        </button>
      </div>

      {/* Roles Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          System Roles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockRoles.map((role) => (
            <div
              key={role.role_id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {role.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  {!role.is_system_role && (
                    <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  PERMISSIONS ({role.permissions.length})
                </p>
                <div className="space-y-1">
                  {role.permissions.map((perm, idx) => (
                    <div
                      key={idx}
                      className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          All Permissions
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Permission
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {mockPermissions.map((perm) => (
                  <tr key={perm.permission_id}>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {perm.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {perm.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {perm.resource}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                        {perm.action}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesManagementPage;
