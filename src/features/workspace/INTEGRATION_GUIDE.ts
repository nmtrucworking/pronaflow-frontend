/**
 * PronaFlow Workspace Feature - Integration Guide
 * 
 * This guide explains how to integrate the workspace feature into your main application.
 * 
 * ## File Structure
 * ```
 * frontend/src/features/workspace/
 * ├── components/              # Reusable UI components
 * │   ├── WorkspaceCard.tsx    # Workspace card display
 * │   ├── MemberCard.tsx       # Member card display
 * │   └── InvitationCard.tsx   # Invitation card display
 * ├── forms/                   # Form components
 * │   └── WorkspaceForms.tsx   # All workspace forms with validation
 * ├── pages/                   # Page components
 * │   ├── WorkspaceListPage.tsx      # List all user workspaces
 * │   ├── WorkspaceDetailPage.tsx    # Workspace detail with tabs
 * │   └── index.ts             # Page exports
 * ├── routes.tsx               # Route definitions
 * └── index.ts                 # Feature index
 * ```
 * 
 * ## Dependencies
 * 
 * ### Core Libraries
 * - React 18.3.1+
 * - React Router v6.x
 * - TypeScript
 * - Vite
 * 
 * ### State Management & Data Fetching
 * - @tanstack/react-query (v5+) - Server state management
 * - zustand - Client state management
 * - axios - HTTP client
 * 
 * ### UI & Forms
 * - radix-ui/* - Headless UI components
 * - tailwindcss - Styling
 * - lucide-react - Icons
 * - react-hook-form - Form state management
 * - zod - Form validation
 * 
 * ### Notifications
 * - sonner - Toast notifications
 * 
 * ## Integration Steps
 * 
 * ### Step 1: Add Routes to Main Router
 * 
 * File: `src/routes/index.ts` or `src/App.tsx`
 * 
 * ```typescript
 * import { workspaceRoutes } from '@/features/workspace';
 * 
 * const router = createBrowserRouter([
 *   {
 *     path: '/',
 *     element: <Layout />,
 *     children: [
 *       ...workspaceRoutes,
 *       // other routes
 *     ],
 *   },
 * ]);
 * ```
 * 
 * ### Step 2: Add Navigation Links
 * 
 * File: `src/components/Navigation.tsx` (or similar)
 * 
 * ```typescript
 * import { Link } from 'react-router-dom';
 * 
 * export const Navigation = () => (
 *   <nav>
 *     <Link to="/workspaces">Workspaces</Link>
 *   </nav>
 * );
 * ```
 * 
 * ### Step 3: Environment Configuration
 * 
 * File: `.env.local`
 * 
 * ```
 * VITE_API_BASE_URL=http://localhost:8000/api/v1
 * ```
 * 
 * ### Step 4: Setup API Authentication
 * 
 * The workspaceService automatically handles:
 * - Bearer token attachment to requests
 * - 401 redirect to login
 * - Response interception
 * 
 * Ensure your auth store provides: `getAuthToken()` and `handleUnauthorized()`
 * 
 * ## Usage Examples
 * 
 * ### Using Workspace Pages
 * 
 * ```typescript
 * // Pages are automatically rendered via routes
 * // Navigate to /workspaces or /workspaces/:id
 * ```
 * 
 * ### Using Components Independently
 * 
 * ```typescript
 * import { WorkspaceCard, MemberCard } from '@/features/workspace';
 * import { useWorkspaces } from '@/hooks/useWorkspace';
 * 
 * function MyComponent() {
 *   const { data } = useWorkspaces(0, 10);
 *   
 *   return (
 *     <div className="grid grid-cols-3 gap-4">
 *       {data?.items?.map(workspace => (
 *         <WorkspaceCard
 *           key={workspace.id}
 *           workspace={workspace}
 *           role="member"
 *           onSelect={handleSelect}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### Using Hooks Directly
 * 
 * ```typescript
 * import { useWorkspaces, useCreateWorkspace } from '@/hooks/useWorkspace';
 * 
 * function MyComponent() {
 *   // Query workspaces
 *   const { data, isLoading } = useWorkspaces(0, 10);
 *   
 *   // Create workspace
 *   const createMutation = useCreateWorkspace();
 *   
 *   const handleCreate = async () => {
 *     await createMutation.mutateAsync({
 *       name: 'New Workspace',
 *       description: 'Optional description',
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       {isLoading && <p>Loading...</p>}
 *       <button onClick={handleCreate}>
 *         Create Workspace
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * ### Using Forms
 * 
 * ```typescript
 * import { CreateWorkspaceForm } from '@/features/workspace';
 * 
 * function CreatePage() {
 *   const handleSubmit = async (data) => {
 *     console.log('Create workspace:', data);
 *   };
 *   
 *   return (
 *     <CreateWorkspaceForm
 *       onSubmit={handleSubmit}
 *       isLoading={false}
 *     />
 *   );
 * }
 * ```
 * 
 * ### Using Zustand Store
 * 
 * ```typescript
 * import { useWorkspaceStore } from '@/store/features/workspaceStore';
 * 
 * function MyComponent() {
 *   const workspace = useWorkspaceStore(state => state.currentWorkspace);
 *   const isOwner = useWorkspaceStore(state => state.useIsOwner());
 *   const canManageMembers = useWorkspaceStore(state => 
 *     state.useCanManageMembers()
 *   );
 *   
 *   return (
 *     <div>
 *       {workspace && <h1>{workspace.name}</h1>}
 *       {isOwner && <button>Owner Actions</button>}
 *       {canManageMembers && <button>Manage Members</button>}
 *     </div>
 *   );
 * }
 * ```
 * 
 * ## API Endpoints Reference
 * 
 * The workspace service exposes the following endpoints:
 * 
 * ### Workspaces
 * - `POST /workspaces` - Create workspace
 * - `GET /workspaces` - List workspaces (paginated)
 * - `GET /workspaces/:id` - Get workspace details
 * - `PATCH /workspaces/:id` - Update workspace
 * - `DELETE /workspaces/:id` - Delete workspace
 * 
 * ### Members
 * - `GET /workspaces/:id/members` - List members (paginated)
 * - `POST /workspaces/:id/members` - Add member
 * - `PATCH /workspaces/:id/members/:userId` - Update member role
 * - `DELETE /workspaces/:id/members/:userId` - Remove member
 * 
 * ### Invitations
 * - `GET /workspaces/:id/invitations` - List invitations (paginated)
 * - `POST /workspaces/:id/invitations` - Send invitation
 * - `DELETE /workspaces/:id/invitations/:invitationId` - Cancel invitation
 * - `POST /workspaces/:id/invitations/:invitationId/resend` - Resend invitation
 * 
 * ### Settings
 * - `GET /workspaces/:id/settings` - Get workspace settings
 * - `PATCH /workspaces/:id/settings` - Update settings
 * 
 * ### Access Logs
 * - `GET /workspaces/:id/access-logs` - Get access history (paginated)
 * - `POST /workspaces/:id/access-logs` - Log access event
 * 
 * ## Features Implemented
 * 
 * ### ✅ Complete
 * - [ ] List all user workspaces with pagination
 * - [ ] Create new workspaces with validation
 * - [ ] View workspace details
 * - [ ] Edit workspace information
 * - [ ] Delete workspaces with confirmation
 * - [ ] Manage workspace members (add, remove, change role)
 * - [ ] Send and manage invitations
 * - [ ] Update workspace settings
 * - [ ] View access logs
 * - [ ] Role-based access control (RBAC)
 * - [ ] Form validation with Zod
 * - [ ] Loading states and error handling
 * - [ ] Toast notifications
 * - [ ] Responsive UI
 * 
 * ## Missing/TODO
 * 
 * - [ ] Email verification integration
 * - [ ] Workspace templates
 * - [ ] Workspace activity feed
 * - [ ] Workspace permissions audit log
 * - [ ] Bulk operations (export, import, delete)
 * - [ ] Advanced search and filtering
 * - [ ] Workspace archival
 * - [ ] Integration with other modules
 * 
 * ## Environment Variables
 * 
 * Required environment variables:
 * 
 * ```
 * VITE_API_BASE_URL=http://localhost:8000/api/v1
 * ```
 * 
 * Optional:
 * ```
 * VITE_WORKSPACE_PAGE_SIZE=10
 * VITE_WORKSPACE_DEFAULT_ROLE=member
 * ```
 * 
 * ## Error Handling
 * 
 * All hooks automatically handle errors with:
 * - Toast notifications (error messages)
 * - Error state in hook return value
 * - Proper TypeScript typing
 * - Fallback UI rendering
 * 
 * Example:
 * ```typescript
 * const { data, error, isLoading } = useWorkspace(id);
 * 
 * if (isLoading) return <Loader />;
 * if (error) return <Error message={error.message} />;
 * return <WorkspaceDetail workspace={data} />;
 * ```
 * 
 * ## Performance Optimizations
 * 
 * - React Query caching (5min for workspaces, 2min for members)
 * - Lazy-loaded pages with Suspense
 * - Zustand selectors for fine-grained reactivity
 * - Pagination for large datasets
 * - Debounced search (can be added)
 * - Memoized components
 * 
 * ## Testing
 * 
 * To test the workspace feature:
 * 
 * 1. Navigate to `/workspaces`
 * 2. Click "New Workspace" to create
 * 3. Fill in name and description
 * 4. Submit form
 * 5. Click workspace card to view details
 * 6. Switch between Members, Invitations, and Settings tabs
 * 7. Perform actions (add member, send invitation, update settings)
 * 
 * ## Troubleshooting
 * 
 * ### Issue: "API request failed"
 * - Check VITE_API_BASE_URL in .env.local
 * - Ensure backend is running
 * - Check browser console for CORS errors
 * 
 * ### Issue: "Authentication error"
 * - Verify auth token is being stored
 * - Check if token is expired
 * - Review auth interceptor in workspaceService
 * 
 * ### Issue: "Form validation fails"
 * - Check field types match Zod schema
 * - Review form component props
 * - Check browser console for validation errors
 * 
 * ## Contributing
 * 
 * When adding new features to the workspace module:
 * 
 * 1. Add TypeScript types to `/types/workspace.ts`
 * 2. Add API methods to `/services/workspaceService.ts`
 * 3. Add hooks to `/hooks/useWorkspace.ts`
 * 4. Add UI components to `/components/`
 * 5. Add pages or update existing ones in `/pages/`
 * 6. Update this documentation
 * 7. Test thoroughly
 * 
 * ## Related Files
 * 
 * - `src/types/workspace.ts` - TypeScript type definitions
 * - `src/services/workspaceService.ts` - API client service
 * - `src/hooks/useWorkspace.ts` - React hooks for data operations
 * - `src/store/features/workspaceStore.ts` - Zustand state management
 * - Backend: `backend/app/api/v1/endpoints/workspaces.py` - API endpoints
 * - Backend: `backend/app/db/models/workspaces.py` - Database models
 * 
 */

export const WORKSPACE_INTEGRATION_GUIDE = {
  version: '1.0.0',
  lastUpdated: '2024',
  author: 'PronaFlow Team',
  description: 'Complete integration guide for the workspace feature module',
};
