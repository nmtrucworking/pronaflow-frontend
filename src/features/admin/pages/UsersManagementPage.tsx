/**
 * Users Management Page
 * Module 14: System Administration
 */

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Lock, Unlock, MoreHorizontal } from 'lucide-react';
import type { AdminUser } from '@/types/admin';
import { formatDate } from '@/lib/localeFormatters';

const UsersManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const mockUsers: AdminUser[] = [
    {
      admin_user_id: 'user_1',
      email: 'admin@pronaflow.com',
      username: 'super_admin',
      full_name: 'Super Admin',
      status: 'active',
      roles: ['super_admin'],
      last_login: '2024-03-29T10:30:00Z',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      admin_user_id: 'user_2',
      email: 'john@pronaflow.com',
      username: 'john_dev',
      full_name: 'John Developer',
      status: 'active',
      roles: ['system_admin'],
      last_login: '2024-03-28T15:45:00Z',
      created_at: '2024-01-15T00:00:00Z',
    },
    {
      admin_user_id: 'user_3',
      email: 'sarah@pronaflow.com',
      username: 'sarah_sec',
      full_name: 'Sarah Security',
      status: 'active',
      roles: ['security_admin'],
      last_login: '2024-03-27T08:20:00Z',
      created_at: '2024-02-01T00:00:00Z',
    },
    {
      admin_user_id: 'user_4',
      email: 'inactive@pronaflow.com',
      username: 'inactive_user',
      full_name: 'Inactive User',
      status: 'suspended',
      roles: ['system_admin'],
      last_login: '2024-01-10T12:00:00Z',
      created_at: '2024-01-20T00:00:00Z',
    },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.email.includes(searchQuery) ||
      user.full_name.includes(searchQuery) ||
      user.username.includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'suspended':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      case 'locked':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage system users and their roles
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 font-medium transition-colors">
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by email, name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                  Last Login
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.admin_user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        @{user.username}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                      {user.roles[0]?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(user.last_login)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit size={16} className="text-slate-600 dark:text-slate-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Lock user' : 'Unlock user'}
                      >
                        {user.status === 'active' ? (
                          <Lock size={16} className="text-slate-600 dark:text-slate-400" />
                        ) : (
                          <Unlock size={16} className="text-slate-600 dark:text-slate-400" />
                        )}
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;
