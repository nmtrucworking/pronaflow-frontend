/**
 * Workspace Feature Module Index
 * Central export point for all workspace-related components, hooks, and utilities
 */

// Pages
export { WorkspaceListPage, WorkspaceDetailPage } from './pages';

// Components
export { WorkspaceCard } from './components/WorkspaceCard';
export { MemberCard } from './components/MemberCard';
export { InvitationCard } from './components/InvitationCard';

// Forms
export { CreateWorkspaceForm, UpdateWorkspaceForm, InviteUserForm, WorkspaceSettingsForm } from './forms/WorkspaceForms';

// Routes
export { workspaceRoutes } from './routes';

/**
 * Usage:
 * 
 * In main router file:
 * import { workspaceRoutes } from '@/features/workspace';
 * 
 * // Add to routes array
 * routes: [
 *   ...workspaceRoutes,
 *   // other routes
 * ]
 */
