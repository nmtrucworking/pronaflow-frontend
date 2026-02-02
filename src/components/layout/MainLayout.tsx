import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const MOCK_WORKSPACE = { workspace_id: 'ws-1', name: 'PronaFlow Team' };

export const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Điều hướng chính */}
      <Sidebar 
        currentWorkspace={MOCK_WORKSPACE} 
        // Sidebar cần cập nhật để dùng NavLink của React Router
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          {/* Outlet là nơi các page con được render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};