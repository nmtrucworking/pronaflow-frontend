/**
 * Admin Layout Component
 * Module 14: System Administration
 * 
 * Main layout wrapper for admin dashboard pages
 */

import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNav from './AdminNav';
import { useAdminAccess } from '../hooks/useAdminAccess';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';

export const AdminLayout = () => {
  const { isAdmin } = useAdminAccess();

  // 保护路由：只有管理员才能访问
  if (!isAdmin()) {
    return <Navigate to={ROUTES.root} replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Nav */}
        <AdminNav />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
