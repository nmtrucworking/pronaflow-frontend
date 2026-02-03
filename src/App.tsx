import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { HelpLayout } from './components/layout/HelpLayout';

// Import Auth Pages
import { LoginPage, RegisterPage } from './features/auth';

// Import pages
import { LandingPage } from './features/landing';
import { DashboardPage } from './features/dashboard';
import { AllProjectsPage } from './features/projects';
import { TasksPage } from './features/tasks';
import { InboxPage } from './features/inbox';
import { SettingsPage } from './features/settings';
import { HelperCenterPage, ApiPage, ChangelogPage, ContactSupportPage, LegalPage, PrivacyPage, StatusPage, TermsPage } from './features/helper';
import { CalendarPage } from './features/calendar';
import { GanttChartPage, WorkspaceMemberPage } from './features/workspace/pages';

import WorkspaceSetting from './features/workspace/components/Setting_workspace';

// Import Workspace Feature Routes
import { workspaceRoutes } from './features/workspace';

// Import Trash and Archived Pages
import { TrashPage } from './features/trash';
import { ArchivedPage } from './features/archived';

// Import Integration Pages (Module 12)
import IntegrationsPage from './features/integrations/pages/IntegrationsPage';
import ApiTokensPage from './features/integrations/pages/ApiTokensPage';
import WebhooksPage from './features/integrations/pages/WebhooksPage';
import ConnectedAppsPage from './features/integrations/pages/ConnectedAppsPage';
import PluginMarketplacePage from './features/integrations/pages/PluginMarketplacePage';

// Import Module 9 Components
import CommandPalette from './components/CommandPalette';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';

// Import Error Pages
import { Error404Page, Error500Page } from './features/error';

// Import Agentation
import { Agentation } from 'agentation';

/*
 * Configure routing for the application using React Router v6.
 * The MainLayout component wraps around internal pages to provide consistent layout with Sidebar.
 */
const router = createBrowserRouter([
  { path: '/',
    element: <LandingPage />,
    errorElement: <Error500Page />,
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    element: <MainLayout />, // Bọc các trang nội bộ trong Layout có Sidebar
    errorElement: <Error500Page />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'projects', element: <AllProjectsPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'inbox', element: <InboxPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'account-settings', element: <SettingsPage /> },
      { path: 'trash', element: <TrashPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'gantt', element: <GanttChartPage /> },
      { path: 'workspace-settings', element: <WorkspaceSetting /> },
      { path: 'members' , element: <WorkspaceMemberPage /> },
      { path: 'archive', element: <ArchivedPage /> },
      // Integration routes (Module 12)
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'integrations/api-tokens', element: <ApiTokensPage /> },
      { path: 'integrations/webhooks', element: <WebhooksPage /> },
      { path: 'integrations/connected-apps', element: <ConnectedAppsPage /> },
      { path: 'integrations/plugins', element: <PluginMarketplacePage /> },
      // Workspace routes
      ...workspaceRoutes,
      // Điều hướng mặc định nếu vào /
      { path: 'home', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    element: <HelpLayout />,
    children: [
      { path: '/help', element: <HelperCenterPage /> },
      { path: '/help/api', element: <ApiPage /> },
      { path: '/help/changelog', element: <ChangelogPage /> },
      { path: '/help/contact', element: <ContactSupportPage /> },
      { path: '/help/legal', element: <LegalPage /> },
      { path: '/help/privacy', element: <PrivacyPage /> },
      { path: '/help/status', element: <StatusPage /> },
      { path: '/help/terms', element: <TermsPage /> },
    ],
  },
  {
    path: '*',
    element: <Error404Page />,
  }
]);

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      // Keyboard Shortcuts: ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        // Don't open if user is typing in an input field
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsShortcutsModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
      <Agentation />
    </>
  );
}

export default App;