import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES, toChildPath } from './routes/paths';
import { MainLayout } from './components/layout/MainLayout';
import { HelpLayout } from './components/layout/HelpLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthBootstrap } from './hooks/useAuth';
import { useCurrentWorkspaceId } from './store/features/workspaceStore';
import { useLastAccessedWorkspace } from './hooks/useWorkspace';

// Import Auth Pages
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordConfirmPage,
  VerifyEmailPage,
  UnauthorizedPage,
} from './features/auth';

// Import pages
import { LandingPage, PricingPage, DesktopDownloadPage } from './features/landing';
import { DashboardPage } from './features/dashboard';
import { AllProjectsPage } from './features/projects';
import { TasksPage } from './features/tasks';
import { InboxPage } from './features/inbox';
import { SettingsPage } from './features/settings';
import { HelperCenterPage, ApiPage, ChangelogPage, ContactSupportPage, LegalPage, PrivacyPage, StatusPage, TermsPage } from './features/helper';
import { CalendarPage } from './features/calendar';
import { GanttChartPage } from './features/workspace/pages';

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
import { isEditableTarget } from './lib/keyboardShortcuts';

// Import Admin Pages (Module 14)
import {
  AdminLayout,
  AdminDashboardPage,
  UsersManagementPage,
  RolesManagementPage,
} from './features/admin';
import SecurityIncidentsPage from './features/admin/pages/SecurityIncidentsPage';

// Import Error Pages
import { Error404Page, Error500Page } from './features/error';

// Import Agentation
import { Agentation } from 'agentation';

const LegacyWorkspaceSettingsRedirect = () => {
  const currentWorkspaceId = useCurrentWorkspaceId();
  const {
    data: lastAccessedWorkspace,
    isLoading: isLoadingLastWorkspace,
  } = useLastAccessedWorkspace();

  if (!currentWorkspaceId) {
    if (isLoadingLastWorkspace) {
      return null;
    }

    if (lastAccessedWorkspace?.workspace_id) {
      return <Navigate to={ROUTES.workspace.settings(lastAccessedWorkspace.workspace_id)} replace />;
    }

    return <Navigate to={ROUTES.workspace.list} replace />;
  }

  return <Navigate to={ROUTES.workspace.settings(currentWorkspaceId)} replace />;
};

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
    path: ROUTES.desktopDownload,
    element: <DesktopDownloadPage />,
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
    path: ROUTES.auth.forgotPassword,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.auth.resetConfirm,
    element: <ResetPasswordConfirmPage />,
  },
  {
    path: ROUTES.auth.verifyEmail,
    element: <VerifyEmailPage />,
  },
  {
    path: ROUTES.auth.unauthorized,
    element: <UnauthorizedPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ), // Bọc các trang nội bộ trong Layout có Sidebar
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
      { path: toChildPath(ROUTES.app.workspaceSettings), element: <LegacyWorkspaceSettingsRedirect /> },
      { path: toChildPath(ROUTES.app.members) , element: <Navigate to={ROUTES.workspace.list} replace /> },
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
  // Admin Routes (Module 14)
  {
    element: <AdminLayout />,
    errorElement: <Error500Page />,
    children: [
      { path: ROUTES.admin.dashboard, element: <AdminDashboardPage /> },
      { path: ROUTES.admin.users, element: <UsersManagementPage /> },
      { path: ROUTES.admin.roles, element: <RolesManagementPage /> },
      { path: ROUTES.admin.securityIncidents, element: <SecurityIncidentsPage /> },
    ],
  },
  {
    path: ROUTES.notFound,
    element: <Error404Page />,
  }
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  useAuthBootstrap();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isModifierPressed = e.metaKey || e.ctrlKey;
      const canUsePlainKey = !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey;

      // Command Palette: Cmd/Ctrl + K
      if (isModifierPressed && key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // Sidebar Toggle: Cmd/Ctrl + B
      if (isModifierPressed && key === 'b') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('pronaflow-sidebar-toggle'));
        return;
      }

      // Keyboard Shortcuts: ?
      if (e.key === '?' && canUsePlainKey && !isEditableTarget(e.target)) {
        e.preventDefault();
        setIsShortcutsModalOpen(true);
        return;
      }

      // Required FM9 binding: C for create-task flow
      if (key === 'c' && canUsePlainKey && !isEditableTarget(e.target)) {
        e.preventDefault();

        if (window.location.pathname.includes(ROUTES.app.tasks)) {
          window.dispatchEvent(new CustomEvent('pronaflow-create-task'));
          return;
        }

        window.location.href = `${ROUTES.app.tasks}?create=1`;
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