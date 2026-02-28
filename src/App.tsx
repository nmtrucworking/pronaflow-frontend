import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES, toChildPath } from './routes/paths';
import { MainLayout } from './components/layout/MainLayout';
import { HelpLayout } from './components/layout/HelpLayout';

// Import Auth Pages
import { LoginPage, RegisterPage } from './features/auth';

// Import pages
import { LandingPage, PricingPage } from './features/landing';
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

// Import Billing and Analytics Pages
import { PublicBillingPage, PrivateBillingPage } from './features/billing';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';

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
  { path: ROUTES.root,
    element: <LandingPage />,
    errorElement: <Error500Page />,
  },
  {
    path: ROUTES.pricing,
    element: <PricingPage />,
  },
  {
    path: ROUTES.auth.login,
    element: <LoginPage />
  },
  {
    path: ROUTES.auth.register,
    element: <RegisterPage />
  },
  {
    element: <MainLayout />, // Bọc các trang nội bộ trong Layout có Sidebar
    errorElement: <Error500Page />,
    children: [
      { path: toChildPath(ROUTES.app.dashboard), element: <DashboardPage /> },
      { path: toChildPath(ROUTES.app.projects), element: <AllProjectsPage /> },
      { path: toChildPath(ROUTES.app.tasks), element: <TasksPage /> },
      { path: toChildPath(ROUTES.app.inbox), element: <InboxPage /> },
      { path: toChildPath(ROUTES.app.settings), element: <SettingsPage /> },
      { path: toChildPath(ROUTES.app.accountBilling), element: <PrivateBillingPage /> },
      { path: toChildPath(ROUTES.app.trash), element: <TrashPage /> },
      { path: toChildPath(ROUTES.app.calendar), element: <CalendarPage /> },
      { path: toChildPath(ROUTES.app.gantt), element: <GanttChartPage /> },
      { path: toChildPath(ROUTES.app.workspaceSettings), element: <WorkspaceSetting /> },
      { path: toChildPath(ROUTES.app.members) , element: <WorkspaceMemberPage /> },
      { path: toChildPath(ROUTES.app.archive), element: <ArchivedPage /> },
      // Integration routes (Module 12)
      { path: toChildPath(ROUTES.integrations.root), element: <IntegrationsPage /> },
      { path: toChildPath(ROUTES.integrations.apiTokens), element: <ApiTokensPage /> },
      { path: toChildPath(ROUTES.integrations.webhooks), element: <WebhooksPage /> },
      { path: toChildPath(ROUTES.integrations.connectedApps), element: <ConnectedAppsPage /> },
      { path: toChildPath(ROUTES.integrations.plugins), element: <PluginMarketplacePage /> },
      // Public billing and Analytics routes
      { path: toChildPath(ROUTES.app.billing), element: <PublicBillingPage /> },
      { path: toChildPath(ROUTES.app.analytics), element: <AnalyticsPage /> },
      // Workspace routes
      ...workspaceRoutes,
      // Điều hướng mặc định nếu vào /
      { path: toChildPath(ROUTES.app.home), element: <Navigate to={ROUTES.app.dashboard} replace /> },
    ],
  },
  {
    element: <HelpLayout />,
    children: [
      { path: ROUTES.help.root, element: <HelperCenterPage /> },
      { path: ROUTES.help.api, element: <ApiPage /> },
      { path: ROUTES.help.changelog, element: <ChangelogPage /> },
      { path: ROUTES.help.contact, element: <ContactSupportPage /> },
      { path: ROUTES.help.legal, element: <LegalPage /> },
      { path: ROUTES.help.privacy, element: <PrivacyPage /> },
      { path: ROUTES.help.status, element: <StatusPage /> },
      { path: ROUTES.help.terms, element: <TermsPage /> },
    ],
  },
  {
    path: ROUTES.notFound,
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