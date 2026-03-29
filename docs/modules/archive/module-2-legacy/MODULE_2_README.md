# 📖 Module 2: Workspace Management
## Implementation Guide - PronaFlow Frontend

**Version**: 1.1  
**Status**: ⚠️ Functionally Complete (Conditional)  
**Last Updated**: March 29, 2026

---

## 🎯 Overview

This is a **functionally complete implementation of PronaFlow's Functional Module 2 (Workspace Management)**, providing enterprise-grade multi-tenancy workspace management, team collaboration, and access control for the frontend application.

Current release status is **conditional** pending test coverage and final sign-off.

### What's Included
- ✅ Workspace Service (22 API methods)
- ✅ 12 Custom React Hooks
- ✅ Complete workspace UI components
- ✅ Member management with role-based control
- ✅ Invitation system with token validation
- ✅ Workspace settings configuration
- ✅ Access logging and audit trails
- ✅ TypeScript types & validation
- ✅ Comprehensive Documentation

---

## 🚀 Quick Start

### 1. Installation

```bash
# Dependencies are already installed
npm install
```

### 2. Environment Setup

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Use Workspace Features

```typescript
import { 
  useWorkspaces, 
  useCreateWorkspace, 
  useWorkspaceMembers,
  useWorkspaceSettings 
} from '@/hooks/useWorkspace';

function WorkspaceDashboard() {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { mutate: createWorkspace } = useCreateWorkspace();
  
  return (
    <div>
      <h1>Workspaces</h1>
      {workspaces?.items.map(ws => (
        <div key={ws.id}>{ws.name}</div>
      ))}
    </div>
  );
}
```

### 4. Manage Workspace Members

```typescript
import { useWorkspaceMembers, useSendInvitation } from '@/hooks/useWorkspace';

function MembersPanel({ workspaceId }) {
  const { data: members } = useWorkspaceMembers(workspaceId);
  const { mutate: sendInvitation } = useSendInvitation(workspaceId);
  
  const handleInvite = (email: string, role: string) => {
    sendInvitation({ email, invited_role: role });
  };
  
  return (
    <>
      <h2>Team Members</h2>
      {members?.map(m => (
        <div key={m.id}>{m.user?.email} - {m.role}</div>
      ))}
    </>
  );
}
```

### 5. Configure Workspace Settings

```typescript
import { useWorkspaceSettings, useUpdateSettings } from '@/hooks/useWorkspace';

function SettingsPage({ workspaceId }) {
  const { data: settings } = useWorkspaceSettings(workspaceId);
  const { mutate: updateSettings } = useUpdateSettings(workspaceId);
  
  const handleSave = (newSettings: any) => {
    updateSettings(newSettings);
  };
  
  return <div>{/* Settings form */}</div>;
}
```

---

## 📁 File Structure

```
src/
├── services/
│   └── workspaceService.ts                    # Workspace API service
│       ├── 22 methods for workspace operations
│       ├── Member management
│       ├── Invitation handling
│       ├── Settings management
│       └── Access logging
│
├── hooks/
│   └── useWorkspace.ts                        # Workspace custom hooks
│       ├── useWorkspaces() - List workspaces
│       ├── useWorkspace() - Get single workspace
│       ├── useCreateWorkspace() - Create workspace
│       ├── useUpdateWorkspace() - Update workspace
│       ├── useDeleteWorkspace() - Delete workspace
│       ├── useWorkspaceMembers() - Get members
│       ├── useAddMember() - Add member
│       ├── useUpdateMember() - Update member role
│       ├── useRemoveMember() - Remove member
│       ├── useInvitations() - Get invitations
│       ├── useSendInvitation() - Send invitation
│       ├── useCancelInvitation() - Cancel invitation
│       ├── useWorkspaceSettings() - Get settings
│       ├── useUpdateSettings() - Update settings
│       ├── useAccessLogs() - Get access logs
│       ├── useLogAccess() - Log workspace access
│       └── useWorkspaceComplete() - Get all data
│
├── types/
│   └── workspace.ts                           # TypeScript interfaces
│       ├── Workspace entity
│       ├── WorkspaceMember entity
│       ├── WorkspaceInvitation entity
│       ├── WorkspaceSetting entity
│       └── DTOs for API requests
│
├── features/workspace/
│   ├── components/
│   │   ├── WorkspaceCard.tsx                  # Workspace card display
│   │   ├── MemberCard.tsx                     # Member card display
│   │   ├── InvitationCard.tsx                 # Invitation card display
│   │   └── Setting_workspace.tsx              # Settings component
│   │
│   ├── forms/
│   │   └── WorkspaceForms.tsx                 # Form components
│   │       ├── CreateWorkspaceForm
│   │       ├── UpdateWorkspaceForm
│   │       ├── InviteUserForm
│   │       └── WorkspaceSettingsForm
│   │
│   ├── pages/
│   │   ├── WorkspaceListPage.tsx              # Workspaces listing
│   │   ├── WorkspaceDetailPage.tsx            # Workspace detail view
│   │   ├── Member.tsx                         # Member management page
│   │   └── GanttChartEnhanced.tsx             # Project timeline view
│   │
│   ├── routes.tsx                             # Route configuration
│   ├── index.ts                               # Module exports
│   ├── README.md                              # Component documentation
│   └── INTEGRATION_GUIDE.ts                   # Integration examples
```

---

## 🔌 API Service Methods

### Workspace CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| `createWorkspace()` | POST `/workspaces` | Create new workspace |
| `listWorkspaces()` | GET `/workspaces` | List user's workspaces |
| `getWorkspace()` | GET `/workspaces/{id}` | Get workspace details |
| `updateWorkspace()` | PUT `/workspaces/{id}` | Update workspace |
| `deleteWorkspace()` | DELETE `/workspaces/{id}` | Soft delete workspace |

### Member Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `listMembers()` | GET `/workspaces/{id}/members` | Get workspace members |
| `addMember()` | POST `/workspaces/{id}/members` | Add member to workspace |
| `updateMember()` | PUT `/workspaces/{id}/members/{user_id}` | Update member role |
| `removeMember()` | DELETE `/workspaces/{id}/members/{user_id}` | Remove member |
| `addMultipleMembers()` | - | Add multiple members (batch) |

### Invitation System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `listInvitations()` | GET `/workspaces/{id}/invitations` | List pending invitations |
| `sendInvitation()` | POST `/workspaces/{id}/invitations` | Send invitation |
| `cancelInvitation()` | DELETE `/workspaces/{id}/invitations/{inv_id}` | Cancel invitation |
| `sendBulkInvitations()` | - | Send multiple invitations (batch) |

### Settings Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getSettings()` | GET `/workspaces/{id}/settings` | Get workspace settings |
| `updateSettings()` | PUT `/workspaces/{id}/settings` | Update workspace settings |

### Access & Audit

| Method | Endpoint | Description |
|--------|----------|-------------|
| `logAccess()` | POST `/workspaces/{id}/access` | Log workspace access |
| `getAccessLogs()` | GET `/workspaces/{id}/access-logs` | Get access history |

---

## 🎣 Custom Hooks

### useWorkspaces()
Fetch all workspaces for the current user.

```typescript
const { data, isLoading, error } = useWorkspaces(skip, limit);

// data: WorkspaceListResponse
// isLoading: boolean
// error: Error | null
```

### useWorkspace(workspaceId)
Fetch a single workspace with full details.

```typescript
const { data: workspace, isLoading } = useWorkspace(workspaceId);

// workspace: WorkspaceDetail
// isLoading: boolean
```

### useCreateWorkspace()
Create a new workspace.

```typescript
const { mutate, isPending } = useCreateWorkspace();

mutate({
  name: 'My Team',
  description: 'Development team',
  workspace_type: 'team',
  logo_url: 'https://...'
});
```

### useWorkspaceMembers(workspaceId)
Fetch members of a workspace.

```typescript
const { data: members, isLoading } = useWorkspaceMembers(workspaceId);

// members: WorkspaceMember[]
```

### useSendInvitation(workspaceId)
Send invitation to join workspace.

```typescript
const { mutate } = useSendInvitation(workspaceId);

mutate({
  email: 'user@example.com',
  role: 'member',
  message: 'Welcome!'
});
```

### useWorkspaceSettings(workspaceId)
Fetch workspace settings.

```typescript
const { data: settings } = useWorkspaceSettings(workspaceId);

// settings: WorkspaceSetting
```

### useUpdateSettings(workspaceId)
Update workspace settings.

```typescript
const { mutate } = useUpdateSettings(workspaceId);

mutate({
  timezone: 'Asia/Ho_Chi_Minh',
  work_days: 'Mon-Fri',
  allow_public_access: false
});
```

---

## 🎨 UI Components

### WorkspaceCard
Display workspace information with actions.

```typescript
<WorkspaceCard 
  workspace={workspace}
  role="owner"
  onSelect={handleSelect}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onManageMembers={handleManage}
  onManageSettings={handleSettings}
/>
```

### MemberCard
Display member information with role management.

```typescript
<MemberCard
  member={member}
  onPromote={handlePromote}
  onDemote={handleDemote}
  onRemove={handleRemove}
  canManage={isAdmin}
/>
```

### InvitationCard
Display pending invitation with actions.

```typescript
<InvitationCard
  invitation={invitation}
  onCancel={handleCancel}
  onResend={handleResend}
/>
```

---

## 📋 Types & Interfaces

### Workspace
```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: WorkspaceStatus;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
```

### WorkspaceMember
```typescript
interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;  // 'owner' | 'admin' | 'member' | 'viewer'
  is_active: boolean;
  joined_at: string;
  left_at?: string;
  user?: User;
}
```

### WorkspaceInvitation
```typescript
interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  email: string;
  invited_role: WorkspaceRole;
  token_hash: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}
```

### WorkspaceSetting
```typescript
interface WorkspaceSetting {
  workspace_id: string;
  timezone?: string;
  work_days?: string;
  work_hours?: string;
  logo_url?: string;
  allow_public_access?: boolean;
  allow_member_invitations?: boolean;
  default_task_status?: string;
  updated_at: string;
}
```

---

## 🔐 Role-Based Access Control

### Workspace Roles
- **Owner**: Full access, can delete workspace, manage billing
- **Admin**: Manage members, projects, settings
- **Member**: Create and edit projects/tasks
- **Viewer**: Read-only access
- **Guest**: Limited read-only access

### Permission Check Example
```typescript
import { useRBAC } from '@/hooks/useRBAC';

function AdminPanel() {
  const { hasPermission } = useRBAC();
  
  return (
    <>
      {hasPermission('manage_workspace') && (
        <AdminSettings />
      )}
    </>
  );
}
```

---

## 📊 Usage Examples

### Create Workspace
```typescript
function CreateWorkspaceModal() {
  const { mutate, isPending } = useCreateWorkspace();
  
  const handleSubmit = (formData) => {
    mutate(formData);
  };
  
  return <Form onSubmit={handleSubmit} />;
}
```

### List and Manage Members
```typescript
function MembersPage() {
  const { data: members } = useWorkspaceMembers(workspaceId);
  const { mutate: addMember } = useAddMember(workspaceId);
  const { mutate: updateMember } = useUpdateMember(workspaceId, userId);
  const { mutate: removeMember } = useRemoveMember(workspaceId, userId);
  
  return (
    <div>
      {members?.map(member => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
```

### Send Bulk Invitations
```typescript
function BulkInviteForm() {
  const { mutate } = useSendInvitation(workspaceId);
  
  const handleBulkInvite = async (emails: string[]) => {
    for (const email of emails) {
      mutate({ email, role: 'member' });
    }
  };
  
  return <BulkInviteInput onSubmit={handleBulkInvite} />;
}
```

### Access Control & Audit
```typescript
function AuditLogs() {
  const { data: logs } = useAccessLogs(workspaceId);
  
  return (
    <table>
      {logs?.map(log => (
        <tr key={log.id}>
          <td>{log.user_id}</td>
          <td>{log.created_at}</td>
        </tr>
      ))}
    </table>
  );
}
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test -- useWorkspace
npm test -- workspaceService
```

### Integration Tests
```bash
npm test -- src/features/workspace
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🔗 Integration with Other Modules

### Module 1: IAM
- Uses JWT tokens from Module 1 for API authentication
- Relies on user roles and permissions from IAM

### Module 3: Project Lifecycle
- Projects are created within workspaces
- Workspace members can access projects based on their role

### Module 4: Task Execution
- Tasks belong to projects in workspaces
- Task access is controlled by workspace membership

### Module 5: Planning & Scheduling
- Uses workspace settings (timezone, work hours)
- Team scheduling based on workspace members

### Module 6: Collaboration
- Workspace is the collaboration context
- Notifications sent to workspace members

---

## 🚀 Deployment

### Production Build
```bash
npm run build
# Output: dist/
```

### Environment Variables
```env
# Production
VITE_API_URL=https://api.pronaflow.com/api/v1
VITE_API_BASE_URL=https://api.pronaflow.com/api
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📚 Additional Resources

- [API Documentation](./docs/API_DOCUMENTATION.md#module-2-workspace-management)
- [Workspace Architecture](./src/features/workspace/ARCHITECTURE.md)
- [Component Documentation](./src/features/workspace/README.md)
- [Integration Guide](./src/features/workspace/INTEGRATION_GUIDE.ts)

---

## ✅ Checklist

- [x] Service layer with all API methods
- [x] Custom React hooks for all operations
- [x] TypeScript types and interfaces
- [x] UI components
- [x] Form components with validation
- [x] Route configuration
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Access control
- [x] Documentation
- [x] Examples and usage guide

---

## 📝 License

PronaFlow © 2024-2026. All rights reserved.

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
