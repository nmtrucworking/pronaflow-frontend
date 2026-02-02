# Module 3: Project Lifecycle Management - Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
5. [Hooks Reference](#hooks-reference)
6. [Components Guide](#components-guide)
7. [State Management](#state-management)
8. [Integration Patterns](#integration-patterns)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

---

## Overview

Module 3 implements Project Lifecycle Management for PronaFlow, enabling users to create, manage, and monitor projects throughout their lifecycle. This module provides comprehensive project management capabilities including:

- **Project CRUD Operations**: Create, read, update, and delete projects
- **Member Management**: Add/remove project members and manage roles
- **Templates**: Create and use project templates for consistency
- **Change Requests**: Track and manage project changes
- **Metrics & Health**: Monitor project health and key metrics
- **Integration**: Seamless integration with Workspace Management (Module 2)

### Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| Project CRUD | Full lifecycle management | ✅ Implemented |
| Member Management | Role-based member management | ✅ Implemented |
| Templates | Reusable project templates | ✅ Implemented |
| Change Requests | Track and approve changes | ✅ Implemented |
| Metrics & Health | Project health monitoring | ✅ Implemented |
| Batch Operations | Bulk member/project operations | ✅ Implemented |
| React Query Integration | Full caching & sync | ✅ Integrated |
| Zustand Store | Client state management | ✅ Integrated |
| TypeScript Types | 100% type-safe | ✅ Complete |
| Error Handling | Comprehensive error handling | ✅ Implemented |

### Technology Stack

- **Frontend Framework**: React 18.3.1+
- **State Management**: React Query v5 + Zustand
- **HTTP Client**: Axios with JWT interceptors
- **Form Handling**: React Hook Form + Zod validation
- **UI Library**: Radix UI + Tailwind CSS
- **Language**: TypeScript (strict mode)
- **Notifications**: Sonner toast library

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│        UI Components & Pages            │
├─────────────────────────────────────────┤
│         Custom React Hooks              │
│      (useProjects, useProject, etc.)    │
├─────────────────────────────────────────┤
│         Service Layer                   │
│      (projectService - API calls)       │
├─────────────────────────────────────────┤
│      HTTP Client (Axios)                │
│      JWT Authentication                 │
└─────────────────────────────────────────┘
```

### Module Dependencies

```
Module 3: Project Lifecycle
    ↓
Module 2: Workspace Management (projects belong to workspaces)
    ↓
Module 1: IAM (authentication & authorization)
    ↓
Module 4: Task Management (tasks belong to projects)
Module 5: Planning & Timeline (uses project dates)
Module 6: Collaboration (projects as collaboration context)
```

### File Structure

```
src/
├── services/
│   └── projectService.ts          # API service (20+ methods)
├── hooks/
│   └── projectHooks.ts            # React Query hooks (18+ hooks)
├── types/
│   └── project.ts                 # TypeScript types (30+ types)
├── features/projects/
│   ├── components/
│   │   ├── ProjectCard.tsx        # Project card display
│   │   ├── ProjectList.tsx        # Project list view
│   │   ├── ProjectDetails.tsx     # Project detail view
│   │   ├── ProjectHeader.tsx      # Project header
│   │   ├── ProjectLayout.tsx      # Layout component
│   │   └── CreateProject/         # Create form
│   ├── pages/
│   │   ├── ProjectListPage.tsx    # List page
│   │   ├── ProjectDetailPage.tsx  # Detail page
│   │   └── ProjectSettingsPage.tsx # Settings page
│   ├── store/
│   │   └── projectStore.ts        # Zustand store
│   ├── utils/
│   │   └── projectUtils.ts        # Utility functions
│   └── types/
│       └── index.ts               # Re-export types
```

---

## Quick Start

### 1. Basic Project List

```typescript
import { useProjects } from '@/hooks/projectHooks';

export function ProjectsList() {
  const { data, isLoading, error } = useProjects(
    'workspace-id', // workspaceId
    undefined,      // status filter (optional)
    1,              // page
    20              // pageSize
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading projects</div>;

  return (
    <div>
      {data?.projects.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>
  );
}
```

### 2. Create New Project

```typescript
import { useCreateProject } from '@/hooks/projectHooks';
import { CreateProjectDTO } from '@/types/project';

export function CreateProjectForm() {
  const { mutate: createProject, isPending } = useCreateProject();

  const handleSubmit = (data: CreateProjectDTO) => {
    createProject(data);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // form handling...
    }}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        Create Project
      </button>
    </form>
  );
}
```

### 3. View Project Details

```typescript
import { useProject, useProjectMetrics } from '@/hooks/projectHooks';

export function ProjectDetailsPage({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useProject(projectId);
  const { data: metrics } = useProjectMetrics(projectId);

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>Status: {project.status}</p>
      {metrics && (
        <div>
          <p>Health: {metrics.health_status}</p>
          <p>Progress: {project.progress}%</p>
        </div>
      )}
    </div>
  );
}
```

### 4. Manage Project Members

```typescript
import {
  useProjectMembers,
  useAddProjectMember,
  useRemoveProjectMember,
} from '@/hooks/projectHooks';

export function ProjectMembersPanel({ projectId }: { projectId: string }) {
  const { data: members } = useProjectMembers(projectId);
  const { mutate: addMember } = useAddProjectMember();
  const { mutate: removeMember } = useRemoveProjectMember();

  return (
    <div>
      <h3>Project Members</h3>
      {members?.map((member) => (
        <div key={member.project_member_id}>
          <span>{member.user?.full_name}</span>
          <span>{member.role}</span>
          <button
            onClick={() =>
              removeMember({
                projectId,
                userId: member.user_id,
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## API Reference

### Service Methods

#### Project CRUD

```typescript
// Create project
await projectService.createProject({
  workspace_id: 'ws-123',
  name: 'New Project',
  type: 'AGILE',
  priority: 'HIGH',
  start_date: '2024-01-01',
});

// List projects
const response = await projectService.listProjects(
  'ws-123',        // workspaceId
  'IN_PROGRESS',   // status filter
  1,               // page
  20,              // pageSize
  'created_at'     // sortBy
);

// Get project details
const project = await projectService.getProject('prj-123');

// Update project
await projectService.updateProject('prj-123', {
  name: 'Updated Name',
  status: 'IN_REVIEW',
  priority: 'MEDIUM',
});

// Update project status
await projectService.updateProjectStatus('prj-123', 'DONE', '2024-12-31');

// Delete project
await projectService.deleteProject('prj-123');

// Clone project
await projectService.cloneProject(
  'prj-123',      // projectId
  'New Project',  // newName
  true,           // copyTasks
  false           // copyMembers
);
```

#### Member Management

```typescript
// List members
const members = await projectService.listProjectMembers('prj-123');

// Add member
await projectService.addProjectMember('prj-123', 'user-456', 'MEMBER');

// Update member role
await projectService.updateProjectMemberRole('prj-123', 'user-456', 'ADMIN');

// Remove member
await projectService.removeProjectMember('prj-123', 'user-456');

// Add multiple members
await projectService.addMultipleProjectMembers('prj-123', [
  { userId: 'user-1', role: 'MEMBER' },
  { userId: 'user-2', role: 'ADMIN' },
]);
```

#### Templates

```typescript
// Create template
await projectService.createTemplate(
  'Agile Sprint Template',
  'Template for agile sprints',
  { /* structure */ }
);

// List templates
const templates = await projectService.listTemplates();

// Create project from template
await projectService.createProjectFromTemplate(
  'template-123',
  'ws-123',
  'My Project',
  '2024-01-01'
);
```

#### Change Requests

```typescript
// Create change request
await projectService.createChangeRequest(
  'prj-123',
  'Add new feature',
  'Description of changes',
  'Scope of changes',
  'Impact analysis',
  { /* requested changes */ }
);

// List change requests
const requests = await projectService.listChangeRequests(
  'prj-123',
  'pending'  // status filter
);

// Approve/Reject change request
await projectService.approveChangeRequest(
  'prj-123',
  'cr-123',
  true,  // approved
  'Notes about decision'
);
```

#### Metrics & Settings

```typescript
// Get project metrics
const metrics = await projectService.getProjectMetrics('prj-123');

// Get project settings
const settings = await projectService.getProjectSettings('prj-123');

// Update project settings
await projectService.updateProjectSettings('prj-123', {
  allow_public_access: true,
  allow_comments: true,
});
```

---

## Hooks Reference

### Project Query Hooks

#### useProjects()

Fetch list of projects with filtering and pagination.

```typescript
const { data, isLoading, error } = useProjects(
  workspaceId,  // string | undefined
  status,       // string | undefined ('IN_PROGRESS', 'DONE', etc.)
  page,         // number (default: 1)
  pageSize,     // number (default: 20)
  sortBy,       // string (default: 'created_at')
  enabled       // boolean (default: true)
);

// Returns: ProjectListResponse with pagination
```

#### useProject()

Fetch single project details.

```typescript
const { data: project, isLoading, error } = useProject(
  projectId,  // string | undefined
  enabled     // boolean (default: true)
);

// Returns: Project | undefined
```

### Project Mutation Hooks

#### useCreateProject()

Create new project.

```typescript
const { mutate: createProject, isPending } = useCreateProject();

createProject({
  workspace_id: 'ws-123',
  name: 'New Project',
  type: 'AGILE',
  start_date: '2024-01-01',
});
```

#### useUpdateProject()

Update project information.

```typescript
const { mutate: updateProject } = useUpdateProject();

updateProject({
  projectId: 'prj-123',
  data: {
    name: 'Updated Name',
    priority: 'HIGH',
  },
});
```

#### useUpdateProjectStatus()

Update project status.

```typescript
const { mutate: updateStatus } = useUpdateProjectStatus();

updateStatus({
  projectId: 'prj-123',
  status: 'DONE',
  completionDate: '2024-12-31',
});
```

#### useDeleteProject()

Delete project.

```typescript
const { mutate: deleteProject } = useDeleteProject();

deleteProject('prj-123');
```

#### useCloneProject()

Clone project.

```typescript
const { mutate: cloneProject } = useCloneProject();

cloneProject({
  projectId: 'prj-123',
  newName: 'Cloned Project',
  copyTasks: true,
  copyMembers: false,
});
```

### Member Hooks

```typescript
// List members
const { data: members } = useProjectMembers(projectId);

// Add member
const { mutate: addMember } = useAddProjectMember();

// Update member role
const { mutate: updateMember } = useUpdateProjectMember();

// Remove member
const { mutate: removeMember } = useRemoveProjectMember();

// Add multiple members
const { mutate: addMultiple } = useAddMultipleProjectMembers();
```

### Template Hooks

```typescript
// List templates
const { data: templates } = useProjectTemplates();

// Create template
const { mutate: createTemplate } = useCreateProjectTemplate();

// Create from template
const { mutate: createFromTemplate } = useCreateProjectFromTemplate();
```

### Change Request Hooks

```typescript
// List change requests
const { data: requests } = useChangeRequests(projectId, status);

// Create change request
const { mutate: createChangeRequest } = useCreateChangeRequest();

// Approve/reject
const { mutate: approveChangeRequest } = useApproveChangeRequest();
```

### Metrics & Settings Hooks

```typescript
// Get project metrics
const { data: metrics } = useProjectMetrics(projectId);

// Get project settings
const { data: settings } = useProjectSettings(projectId);

// Update settings
const { mutate: updateSettings } = useUpdateProjectSettings();
```

### Utility Hooks

```typescript
// Refresh single project
const refresh = useRefreshProject(projectId);
refresh();

// Refresh all projects
const refreshAll = useRefreshProjects();
refreshAll();

// Get complete project data
const { data, isLoading } = useProjectComplete(projectId);

// Archive multiple projects
const { mutate: archiveMultiple } = useArchiveMultipleProjects();
```

---

## Components Guide

### ProjectCard

Displays project summary with actions.

```typescript
<ProjectCard
  project={project}
  onEdit={(project) => { /* handle */ }}
  onViewDetails={(project) => { /* handle */ }}
  onStatusChange={(projectId, status) => { /* handle */ }}
  onDelete={(project) => { /* handle */ }}
  className="w-full"
/>
```

### ProjectList

Displays list of projects.

```typescript
<ProjectList
  projects={projects}
  viewMode="grid" // or 'list', 'kanban'
  onProjectClick={(project) => { /* handle */ }}
  onStatusChange={(id, status) => { /* handle */ }}
  isLoading={isLoading}
/>
```

### ProjectDetails

Shows detailed project information.

```typescript
<ProjectDetails
  projectId="prj-123"
  expandedByDefault={false}
/>
```

---

## State Management

### Zustand Store: useProjectStore

```typescript
import { useProjectStore } from '@/features/projects/store/projectStore';

// Get state
const projects = useProjectStore((state) => state.projects);
const filters = useProjectStore((state) => state.filters);
const ui = useProjectStore((state) => state.ui);

// Update state
const setProjects = useProjectStore((state) => state.setProjects);
const setFilters = useProjectStore((state) => state.setFilters);

// Get computed values
const filtered = useProjectStore((state) => state.getFilteredProjects());
const stats = useProjectStore((state) => state.getProjectStats());

// Usage example
useEffect(() => {
  if (data?.projects) {
    useProjectStore.setState({ projects: data.projects });
  }
}, [data]);

// Render
const projects = useProjectStore((state) => state.projects);
return <ProjectList projects={projects} />;
```

### Store Actions

```typescript
// Data actions
setProjects(projects)
setSelectedProject(project)
setProjectMembers(members)
setChangeRequests(requests)

// Filter actions
setFilters({ status: 'IN_PROGRESS', sortBy: 'created_at' })
resetFilters()
clearSearchQuery()

// UI actions
setSelectedProjectId(id)
toggleMemberSelection(memberId)
clearMemberSelection()
setDetailsModalOpen(open)
setCreateModalOpen(open)
setViewMode('grid' | 'list' | 'kanban')
```

---

## Integration Patterns

### With Module 2: Workspace Management

```typescript
import { useWorkspace } from '@/hooks/useWorkspace';
import { useProjects } from '@/hooks/projectHooks';

export function WorkspaceProjectsView({ workspaceId }: { workspaceId: string }) {
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: projects } = useProjects(workspaceId);

  return (
    <div>
      <h1>{workspace?.name} - Projects</h1>
      <ProjectList projects={projects?.projects || []} />
    </div>
  );
}
```

### With Module 4: Task Management

```typescript
// In Module 4, reference projects:
import { useProject } from '@/hooks/projectHooks';

export function TaskList({ projectId }: { projectId: string }) {
  const { data: project } = useProject(projectId);

  return (
    <div>
      <h1>{project?.name} - Tasks</h1>
      {/* Task list here */}
    </div>
  );
}
```

### With Module 5: Planning & Timeline

```typescript
import { useProject } from '@/hooks/projectHooks';
import { GanttChart } from '@/components/GanttChart';

export function ProjectTimeline({ projectId }: { projectId: string }) {
  const { data: project } = useProject(projectId);

  if (!project) return null;

  const timelineData = {
    name: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    progress: project.progress,
  };

  return <GanttChart data={timelineData} />;
}
```

---

## Error Handling

### Automatic Error Handling

All hooks include built-in error handling with toast notifications:

```typescript
const { mutate, error } = useCreateProject();

// Toast notification automatically shown on error
mutate(projectData);
// If error occurs: toast.error("Failed to create project")
```

### Manual Error Handling

```typescript
const { mutate, isError, error } = useUpdateProject();

mutate(
  { projectId: 'prj-123', data: updateData },
  {
    onSuccess: () => {
      console.log('Success!');
    },
    onError: (error) => {
      console.error('Custom error handling:', error);
    },
  }
);
```

### Error Types

```typescript
// API Error Response
interface APIError {
  status: number;
  response: {
    data: {
      message: string;
      errors?: Record<string, string>;
    };
  };
}

// Usage in error handler
catch (error: any) {
  const message = error.response?.data?.message || 'Unknown error';
  const status = error.response?.status;
  
  if (status === 401) {
    // Unauthorized - handled by interceptor
  } else if (status === 403) {
    // Forbidden
  } else if (status === 404) {
    // Not found
  } else if (status === 400) {
    // Validation error
  }
}
```

---

## Best Practices

### 1. Always Specify Dependencies

```typescript
// ✅ Good: explicit dependencies
const { data } = useProject(projectId, !!projectId);

// ❌ Avoid: undefined projectId without guards
const { data } = useProject(projectId);
```

### 2. Use Query Keys Efficiently

```typescript
// ✅ Good: automatic cache invalidation
const { mutate: updateProject } = useUpdateProject();
// Hook automatically invalidates related queries

// ❌ Avoid: manual cache management
// Let React Query handle it
```

### 3. Handle Loading States

```typescript
// ✅ Good: show loading indicator
const { data, isLoading } = useProjects();

if (isLoading) return <Skeleton />;
return <ProjectList projects={data?.projects} />;

// ❌ Avoid: render without loading check
return <ProjectList projects={data?.projects} />;
```

### 4. Batch Operations

```typescript
// ✅ Good: use batch operations
const { mutate: addMultiple } = useAddMultipleProjectMembers();
addMultiple({
  projectId: 'prj-123',
  members: [
    { userId: 'u1', role: 'MEMBER' },
    { userId: 'u2', role: 'ADMIN' },
  ],
});

// ❌ Avoid: multiple individual calls
mutate1();
mutate2();
```

### 5. Type Safety

```typescript
// ✅ Good: full type coverage
const project: Project = { /* ... */ };
const data: CreateProjectDTO = { /* ... */ };

// ❌ Avoid: using any
const project: any = { /* ... */ };
const data: any = { /* ... */ };
```

### 6. Filter and Sort

```typescript
// ✅ Good: server-side filtering
const { data } = useProjects(workspaceId, 'IN_PROGRESS', 1, 20);

// ❌ Avoid: fetch all and filter client-side
const { data } = useProjects(workspaceId);
const filtered = data?.projects.filter(p => p.status === 'IN_PROGRESS');
```

### 7. Cache Management

```typescript
// ✅ Good: leverage React Query caching
// Queries are automatically cached for 5 minutes
const { data: project1 } = useProject('prj-123');
const { data: project2 } = useProject('prj-123');
// Only one API call made

// ✅ Manual refresh when needed
const refresh = useRefreshProject('prj-123');
refresh(); // Forces refetch
```

---

## Testing

### Unit Tests Example

```typescript
import { renderHook, act } from '@testing-library/react';
import { useProjects } from '@/hooks/projectHooks';
import { projectService } from '@/services/projectService';

jest.mock('@/services/projectService');

describe('useProjects', () => {
  it('should fetch projects', async () => {
    const mockProjects = [
      { project_id: '1', name: 'Project 1', /* ... */ },
    ];

    (projectService.listProjects as jest.Mock).mockResolvedValue({
      projects: mockProjects,
      pagination: { /* ... */ },
    });

    const { result } = renderHook(() => useProjects());

    await act(async () => {
      // Wait for hook to load
    });

    expect(result.current.data?.projects).toEqual(mockProjects);
  });
});
```

---

## Deployment Checklist

- [ ] All services properly configured with correct API URLs
- [ ] JWT token interceptor working correctly
- [ ] Error handling covers all edge cases
- [ ] Loading states implemented
- [ ] Accessibility features (ARIA labels, keyboard navigation)
- [ ] Type safety verified (no `any` types)
- [ ] Performance optimized (query caching, memoization)
- [ ] Error boundaries in place
- [ ] Toast notifications working
- [ ] Navigation routes configured
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Environment variables configured

---

## Support & Resources

- **API Documentation**: See `/docs/API_DOCUMENTATION.md`
- **Module 2 Reference**: See `/docs/MODULE_2_README.md`
- **React Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
