/**
 * Admin Sidebar Component
 * Module 14: System Administration
 */

import { NavLink } from 'react-router-dom';
import {
  Users,
  Shield,
  Settings,
  Flag,
  AlertTriangle,
  FileText,
  LayoutDashboard,
  Lock,
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';
import { useAdminAccess } from '../hooks/useAdminAccess';
import { clsx } from 'clsx';

const AdminSidebar = () => {
  const { hasPermission } = useAdminAccess();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: ROUTES.admin.dashboard,
      permission: 'admin:all',
    },
    {
      label: 'Users',
      icon: Users,
      href: ROUTES.admin.users,
      permission: 'users:manage',
    },
    {
      label: 'Roles & Permissions',
      icon: Shield,
      href: ROUTES.admin.roles,
      permission: 'roles:manage',
    },
    {
      label: 'System Config',
      icon: Settings,
      href: ROUTES.admin.systemConfig,
      permission: 'system:config',
    },
    {
      label: 'Feature Flags',
      icon: Flag,
      href: ROUTES.admin.featureFlags,
      permission: 'feature:flags',
    },
    {
      label: 'Security Incidents',
      icon: AlertTriangle,
      href: ROUTES.admin.securityIncidents,
      permission: 'security:incidents',
    },
    {
      label: 'Audit Logs',
      icon: FileText,
      href: ROUTES.admin.auditLogs,
      permission: 'audit:logs',
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white">PronaFlow</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          // Kiểm tra quyền
          if (!hasPermission(item.permission)) {
            return null;
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <Lock size={16} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Super Admin
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
