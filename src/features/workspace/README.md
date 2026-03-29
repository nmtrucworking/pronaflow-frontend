# PronaFlow Workspace Feature - Complete Implementation Guide

## 📋 Overview

The PronaFlow Workspace feature provides a complete workspace management system with:
- Workspace creation, listing, and management
- Team member management with role-based access control
- Workspace invitations with email integration
- Workspace settings and configuration
- Access logging and audit trails
- Responsive React/TypeScript UI
- Full type safety and validation

## 🏗️ Architecture

### Technology Stack

```
Frontend:
├── React 18.3.1+ (UI framework)
├── TypeScript (type safety)
├── Vite (build tool)
├── React Router v6 (routing)
├── TanStack Query v5 (server state)
├── Zustand (client state)
├── React Hook Form (form management)
├── Zod (validation)
├── Radix UI (headless components)
├── Tailwind CSS (styling)
├── Lucide React (icons)
└── Sonner (notifications)

Backend:
├── Python 3.10+
├── FastAPI (API framework)
├── SQLAlchemy (ORM)
├── Pydantic (validation)
├── PostgreSQL (database)
└── Alembic (migrations)
```

### Feature Modules

```
workspace/
├── components/           # Reusable UI components
│   ├── WorkspaceCard.tsx
│   ├── MemberCard.tsx
│   └── InvitationCard.tsx
├── forms/                # Form components with validation
│   └── WorkspaceForms.tsx
├── pages/                # Page components
│   ├── WorkspaceListPage.tsx
│   ├── WorkspaceDetailPage.tsx
│   └── index.ts
├── routes.tsx            # Route definitions
├── index.ts              # Module exports
└── INTEGRATION_GUIDE.ts  # Integration documentation
```

### Data Flow

```
User Action
    ↓
React Component
    ↓
Custom Hook (useWorkspace, etc)
    ↓
React Query (TanStack Query)
    ↓
API Service (workspaceService)
    ↓
Backend API (FastAPI)
    ↓
Database (PostgreSQL)
    ↓
Response → Query Cache → Component State → UI Update
```

## 📦 Components

### WorkspaceCard
Display individual workspace with dropdown actions.

**Props:**
- `workspace: Workspace` - Workspace data
- `role: WorkspaceRole` - Current user's role
- `onSelect: (workspace) => void` - Handle selection
- `onEdit?: (id) => void` - Edit workspace
- `onDelete?: (id) => void` - Delete workspace
- `onManageMembers?: (id) => void` - Manage members
- `onManageSettings?: (id) => void` - Manage settings

**Features:**
- Role badge display
- Timestamp formatting
- Dropdown menu with actions
- Status indicator
- Responsive design

### MemberCard
Display workspace member with management options.

**Props:**
- `member: WorkspaceMember` - Member data
- `currentUserRole: WorkspaceRole` - Current user's role
- `onChangeRole: (role) => void` - Update member role
- `onRemove: () => void` - Remove member

**Features:**
- Avatar display
- Role color-coding
- Join date display
- Action buttons
- Status indicator

### InvitationCard
Display pending invitation with action options.

**Props:**
- `invitation: WorkspaceInvitation` - Invitation data
- `onCancel?: () => void` - Cancel invitation
- `onResend?: () => void` - Resend invitation

**Features:**
- Email display
- Expiry countdown
- Copy email button
- Resend/cancel actions
- Status indicators

## 🎯 Forms

### CreateWorkspaceForm
Create new workspace with validation.

**Fields:**
- `name: string` (required, max 50 chars)
- `description: string` (optional)

**Validation:**
- Name is required
- Name max length is 50
- Description optional

### UpdateWorkspaceForm
Update existing workspace.

**Fields:**
- `name: string` (optional)
- `description: string` (optional)

**Validation:**
- Same as CreateWorkspaceForm
- All fields optional for PATCH request

### InviteUserForm
Send invitation to user.

**Fields:**
- `email: string` (required, valid email)
- `invited_role: WorkspaceRole` (required)

**Validation:**
- Email is required and valid
- Role is required

### WorkspaceSettingsForm
Update workspace settings.

**Fields:**
- `timezone: string` (optional)
- `work_days: number[]` (optional)
- `work_hours: object` (optional)
- `logo_url: string` (optional)

**Validation:**
- Valid timezone
- Valid day numbers (0-6)
- Valid work hours format
- Valid URL format for logo

## 🪝 Custom Hooks

All hooks use React Query for caching and automatic synchronization.

### Data Query Hooks

```typescript
// List all user workspaces
const { data, isLoading, error } = useWorkspaces(page, limit);

// Get single workspace
const { data, isLoading, error } = useWorkspace(id);

// List workspace members
const { data, isLoading, error } = useWorkspaceMembers(id, page, limit);

// List pending invitations
const { data, isLoading, error } = useInvitations(id, page, limit);

// Get workspace settings
const { data, isLoading, error } = useWorkspaceSettings(id);

// Get access logs
const { data, isLoading, error } = useAccessLogs(id, page, limit);
```

### Mutation Hooks

```typescript
// Create workspace
const mutation = useCreateWorkspace();
await mutation.mutateAsync({ name, description });

// Update workspace
const mutation = useUpdateWorkspace(id);
await mutation.mutateAsync({ name, description });

// Delete workspace
const mutation = useDeleteWorkspace(id);
await mutation.mutateAsync();

// Add member
const mutation = useAddMember(id);
await mutation.mutateAsync({ userId, role });

// Update member role
const mutation = useUpdateMember(id);
await mutation.mutateAsync({ userId, role });

// Remove member
const mutation = useRemoveMember(id);
await mutation.mutateAsync({ userId });

// Send invitation
const mutation = useSendInvitation(id);
await mutation.mutateAsync({ email, invited_role });

// Cancel invitation
const mutation = useCancelInvitation(id);
await mutation.mutateAsync({ invitationId });

// Update settings
const mutation = useUpdateSettings(id);
await mutation.mutateAsync(settings);

// Log access event
const mutation = useLogAccess(id);
await mutation.mutateAsync();
```

## 🔄 State Management

### Zustand Store

Manages client-side workspace state:

```typescript
import { useWorkspaceStore } from '@/store/features/workspaceStore';

// State access
const workspace = useWorkspaceStore(state => state.currentWorkspace);
const workspaceId = useWorkspaceStore(state => state.currentWorkspaceId);
const role = useWorkspaceStore(state => state.currentUserRole);

// Actions
const { setCurrentWorkspace, clearCurrentWorkspace } = useWorkspaceStore();

// Selectors (permission checks)
const isOwner = useWorkspaceStore(state => state.useIsOwner());
const canManageMembers = useWorkspaceStore(state => state.useCanManageMembers());
const canDeleteWorkspace = useWorkspaceStore(state => state.useCanDeleteWorkspace());
```

### React Query Cache

Automatic caching with invalidation:

```typescript
// Cache expires after specified stale time
- Workspaces: 5 minutes
- Members: 2 minutes
- Settings: 5 minutes
- Access Logs: 1 minute

// Automatic invalidation on mutations
- Create workspace → invalidate list
- Update workspace → invalidate detail + list
- Delete workspace → invalidate list
- Add member → invalidate members list
- etc.
```

## 📄 Pages

### WorkspaceListPage
Display all user workspaces with management options.

**Route:** `/workspaces`

**Features:**
- Workspace grid display
- Pagination
- Create workspace modal
- Search and filters (can be added)
- Empty state
- Load more

### WorkspaceDetailPage
Display workspace details with tabs.

**Routes:**
- `/workspaces/:id` - Members tab
- `/workspaces/:id/members` - Members tab
- `/workspaces/:id/settings` - Settings tab

**Tabs:**
1. **Members** - List and manage members
2. **Invitations** - Manage pending invitations
3. **Settings** - Edit workspace configuration

**Features:**
- Tabbed interface
- Real-time data updates
- Action buttons
- Empty states
- Loading indicators

## 🔑 API Service

Singleton pattern for API requests with automatic auth handling.

```typescript
import { workspaceService } from '@/services/workspaceService';

// Workspaces
await workspaceService.createWorkspace(data);
await workspaceService.listWorkspaces(skip, limit);
await workspaceService.getWorkspace(id);
await workspaceService.updateWorkspace(id, data);
await workspaceService.deleteWorkspace(id);

// Members
await workspaceService.addMember(id, userId, role);
await workspaceService.listMembers(id, skip, limit);
await workspaceService.updateMember(id, userId, role);
await workspaceService.removeMember(id, userId);

// Invitations
await workspaceService.sendInvitation(id, email, role);
await workspaceService.listInvitations(id, skip, limit);
await workspaceService.cancelInvitation(id, invitationId);
await workspaceService.resendInvitation(id, invitationId);

// Settings
await workspaceService.getSettings(id);
await workspaceService.updateSettings(id, settings);

// Access Logs
await workspaceService.logAccess(id);
await workspaceService.listAccessLogs(id, skip, limit);
```

## 🛠️ Integration Steps

### 1. Install Dependencies

```bash
npm install
```

All dependencies should already be in package.json.

### 2. Configure Environment

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Add Routes

In your main router configuration:

```typescript
import { workspaceRoutes } from '@/features/workspace';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      ...workspaceRoutes,
      // other routes
    ],
  },
];
```

### 4. Add Navigation

Add links to workspace pages in your navigation component:

```typescript
<Link to="/workspaces">Workspaces</Link>
```

### 5. Setup Backend

Ensure backend is running:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

## 🧪 Usage Examples

### Navigate to Workspaces

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/workspaces')}>
      My Workspaces
    </button>
  );
}
```

### Create Workspace

```typescript
import { useCreateWorkspace } from '@/hooks/useWorkspace';

function CreateWorkspace() {
  const mutation = useCreateWorkspace();
  
  const handleSubmit = async (data) => {
    await mutation.mutateAsync(data);
  };
  
  return (
    <CreateWorkspaceForm
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
}
```

### List Workspaces

```typescript
import { useWorkspaces } from '@/hooks/useWorkspace';
import { WorkspaceCard } from '@/features/workspace';

function WorkspacesList() {
  const { data, isLoading } = useWorkspaces(0, 10);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.items?.map(workspace => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          role="member"
          onSelect={(ws) => console.log('Selected:', ws)}
        />
      ))}
    </div>
  );
}
```

### Use Workspace Context

```typescript
import { useWorkspaceStore } from '@/store/features/workspaceStore';

function CurrentWorkspaceInfo() {
  const workspace = useWorkspaceStore(state => state.currentWorkspace);
  const isOwner = useWorkspaceStore(state => state.useIsOwner());
  
  return (
    <div>
      {workspace && <h1>{workspace.name}</h1>}
      {isOwner && <button>Owner Only Action</button>}
    </div>
  );
}
```

## 📊 Data Models

### Workspace
```typescript
{
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
```

### WorkspaceMember
```typescript
{
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  updated_at: string;
}
```

### WorkspaceInvitation
```typescript
{
  id: string;
  workspace_id: string;
  invited_email: string;
  invited_role: 'owner' | 'admin' | 'member';
  token: string;
  status: 'pending' | 'accepted' | 'declined';
  expires_at: string;
  created_at: string;
}
```

## 🔐 Role-Based Access Control

### Roles
- **Owner**: Full control, can delete workspace
- **Admin**: Manage members and invitations
- **Member**: View and use workspace

### Permission Helpers

```typescript
const { useWorkspaceStore } = require('@/store/features/workspaceStore');

const store = useWorkspaceStore();

// Check if user is owner
store.useIsOwner();

// Check if can manage members
store.useCanManageMembers();

// Check if can manage workspace
store.useCanManageWorkspace();

// Check if can delete workspace
store.useCanDeleteWorkspace();

// Check if can edit workspace
store.useCanEditWorkspace();

// Check if can manage settings
store.useCanManageSettings();
```

## 📚 API Reference

### Workspace Endpoints

```
POST   /workspaces              # Create
GET    /workspaces              # List (paginated)
GET    /workspaces/{id}         # Get
PATCH  /workspaces/{id}         # Update
DELETE /workspaces/{id}         # Delete
```

### Member Endpoints

```
GET    /workspaces/{id}/members                    # List
POST   /workspaces/{id}/members                    # Add
PATCH  /workspaces/{id}/members/{user_id}         # Update role
DELETE /workspaces/{id}/members/{user_id}         # Remove
```

### Invitation Endpoints

```
GET    /workspaces/{id}/invitations                    # List
POST   /workspaces/{id}/invitations                    # Send
DELETE /workspaces/{id}/invitations/{invitation_id}   # Cancel
POST   /workspaces/{id}/invitations/{invitation_id}/resend  # Resend
```

### Settings Endpoints

```
GET    /workspaces/{id}/settings         # Get settings
PATCH  /workspaces/{id}/settings         # Update settings
```

### Access Log Endpoints

```
GET  /workspaces/{id}/access-logs        # List (paginated)
POST /workspaces/{id}/access-logs        # Log access
```

## 🚀 Performance Optimization

### Query Caching
- Workspaces: 5-minute stale time
- Members: 2-minute stale time
- Settings: 5-minute stale time
- Access Logs: 1-minute stale time

### Code Splitting
- Pages lazy-loaded with React.lazy()
- Components bundled together
- Suspense fallback for loading

### Memoization
- Components wrapped with React.memo (can be added)
- Selector functions memoized in Zustand
- Hook dependencies optimized

## ⚠️ Error Handling

All operations include:
- Try-catch blocks
- Error state management
- Toast error notifications
- User-friendly error messages
- Type-safe error types

## 📝 Logging

Enable debug logging:

```typescript
// In environment
VITE_DEBUG=true

// In code
console.log('Workspace action:', action, result);
```

## 🐛 Common Issues

### Issue: "Workspace not found"
- Check workspace ID is correct
- Ensure user has access to workspace
- Verify workspace hasn't been deleted

### Issue: "Unauthorized"
- Check auth token is valid
- Verify user role has required permissions
- Clear browser cache and re-login

### Issue: "Form validation error"
- Check field values match schema
- Review field error messages
- Check Zod schema definition

## 📞 Support

For issues or questions:
1. Check integration guide: `INTEGRATION_GUIDE.ts`
2. Review component documentation in code
3. Check backend API documentation
4. Review test examples in repo

## 📄 License

PronaFlow - Proprietary

---

**Last Updated:** 2024
**Version:** 1.0.0
**Author:** PronaFlow Team
