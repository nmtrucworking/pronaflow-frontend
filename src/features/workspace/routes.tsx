/**
 * Workspace Routes Configuration
 * Define all workspace-related routes
 */

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load components
const WorkspaceListPage = lazy(() => 
  import('./pages/WorkspaceListPage').then(m => ({ default: m.WorkspaceListPage }))
);

const WorkspaceDetailPage = lazy(() => 
  import('./pages/WorkspaceDetailPage').then(m => ({ default: m.WorkspaceDetailPage }))
);

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
  </div>
);

// Routes definition
export const workspaceRoutes = [
  {
    path: '/workspaces',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspaceListPage />
      </Suspense>
    ),
  },
  {
    path: '/workspaces/:id',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspaceDetailPage />
      </Suspense>
    ),
  },
  {
    path: '/workspaces/:id/members',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspaceDetailPage />
      </Suspense>
    ),
  },
  {
    path: '/workspaces/:id/settings',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <WorkspaceDetailPage />
      </Suspense>
    ),
  },
];

export default workspaceRoutes;
