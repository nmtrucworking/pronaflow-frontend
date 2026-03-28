import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { MOCK_WORKSPACES } from '@/mocks';

const MOCK_WORKSPACE = {
  workspace_id: MOCK_WORKSPACES[0]?.id ?? 'ws-1',
  name: MOCK_WORKSPACES[0]?.name ?? 'PronaFlow Team',
};

export const MainLayout = () => {
  return (
    <div className="token-page-shell flex h-screen overflow-hidden">
      {/* Sidebar - Điều hướng chính */}
      <Sidebar 
        currentWorkspace={MOCK_WORKSPACE} 
        // Sidebar cần cập nhật để dùng NavLink của React Router
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50 dark:bg-slate-950">
          {/* Outlet là nơi các page con được render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};