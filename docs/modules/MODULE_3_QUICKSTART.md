# Module 3: Quick Start Guide

## Getting Started with Project Lifecycle Management

### Installation & Setup

No additional packages needed - all dependencies already installed in your project:
- ✅ React 18+
- ✅ React Query (TanStack Query)
- ✅ Zustand
- ✅ Axios
- ✅ TypeScript

### Import Structure

```typescript
// API Service
import { projectService } from '@/services/projectService';

// Custom Hooks
import {
  useProjects,
  useProject,
  useCreateProject,
  useProjectMembers,
  useProjectTemplates,
  useChangeRequests,
  useProjectMetrics,
  // ... and 10+ more hooks
} from '@/hooks/projectHooks';

// Types
import {
  Project,
  ProjectMember,
  CreateProjectDTO,
  ProjectMetrics,
  ChangeRequest,
  // ... and 25+ more types
} from '@/types/project';

// State Store
import { useProjectStore } from '@/features/projects/store/projectStore';

// Utilities
import {
  generateProjectKey,
  isProjectOverdue,
  getStatusLabel,
  sortProjects,
  filterProjects,
} from '@/features/projects/utils/projectUtils';
```

---

## 5-Minute Examples

### Example 1: Display Projects List

```typescript
import { useProjects } from '@/hooks/projectHooks';
import { ProjectCard } from '@/features/projects/components/ProjectCard';

export function MyProjectsList() {
  const { data, isLoading, error } = useProjects('workspace-id');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.projects.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>
  );
}
```

### Example 2: Create New Project

```typescript
import { useCreateProject } from '@/hooks/projectHooks';
import { useForm } from 'react-hook-form';
import { CreateProjectDTO } from '@/types/project';

export function CreateProjectForm() {
  const { register, handleSubmit } = useForm<CreateProjectDTO>();
  const { mutate: createProject, isPending } = useCreateProject();

  const onSubmit = (data: CreateProjectDTO) => {
    createProject(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Project name" />
      <input {...register('workspace_id')} type="hidden" value="ws-123" />
      <select {...register('type')}>
        <option value="AGILE">Agile</option>
        <option value="WATERFALL">Waterfall</option>
      </select>
      <button type="submit" disabled={isPending}>
        Create
      </button>
    </form>
  );
}
```

### Example 3: View Project Details with Metrics

```typescript
import { useProjectComplete } from '@/hooks/projectHooks';

export function ProjectDashboard({ projectId }: { projectId: string }) {
  const { data, isLoading } = useProjectComplete(projectId);

  if (isLoading) return <div>Loading...</div>;

  const { project, metrics, members, settings } = data;

  return (
    <div>
      <h1>{project?.name}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3>Status</h3>
          <p>{project?.status}</p>
          <p>Progress: {project?.progress}%</p>
        </div>
        <div>
          <h3>Health</h3>
          <p>{metrics?.health_status}</p>
          <p>Members: {members?.length}</p>
        </div>
      </div>
    </div>
  );
}
```

### Example 4: Manage Project Members

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
      <h3>Team Members ({members?.length})</h3>
      {members?.map((member) => (
        <div key={member.project_member_id} className="flex justify-between">
          <span>{member.user?.full_name}</span>
          <span className="text-sm text-gray-500">{member.role}</span>
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

      <div className="mt-4 p-4 border rounded">
        <h4>Add Team Member</h4>
        <input
          id="new-user-id"
          placeholder="User ID"
          type="text"
        />
        <select id="member-role">
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={() => {
            const userId = (document.getElementById('new-user-id') as HTMLInputElement).value;
            const role = (document.getElementById('member-role') as HTMLSelectElement).value;
            addMember({ projectId, userId, role });
          }}
        >
          Add Member
        </button>
      </div>
    </div>
  );
}
```

### Example 5: Filter & Sort Projects

```typescript
import { useProjects } from '@/hooks/projectHooks';
import { filterProjects, sortProjects } from '@/features/projects/utils/projectUtils';

export function FilteredProjectsList() {
  const { data } = useProjects('ws-123');

  // Filter by status
  const inProgressProjects = filterProjects(data?.projects || [], {
    status: 'IN_PROGRESS',
  });

  // Sort by progress
  const sortedByProgress = sortProjects(inProgressProjects, 'progress', 'desc');

  return (
    <div>
      <h3>Active Projects (sorted by progress)</h3>
      {sortedByProgress.map((project) => (
        <div key={project.project_id}>
          <p>{project.name}</p>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Safe Data Access

```typescript
// ✅ Always check if data exists
const { data } = useProject(projectId);
if (!data) return <div>Project not found</div>;

// ✅ Use optional chaining
const projectName = data?.project?.name;

// ✅ Use nullish coalescing
const priority = project?.priority ?? 'MEDIUM';
```

### Pattern 2: Error Handling

```typescript
const { mutate, error, isPending } = useCreateProject();

mutate(projectData, {
  onSuccess: () => {
    // Automatic toast shown
    console.log('Project created!');
  },
  onError: (error) => {
    console.error('Failed:', error.message);
    // Automatic toast shown
  },
});

// Or check error state
if (error) {
  console.error(error);
}
```

### Pattern 3: Loading States

```typescript
const { data, isLoading, isFetching } = useProjects();

// Initial load
if (isLoading) return <Skeleton />;

// Background refetch
if (isFetching) return <div className="opacity-50">{/* content */}</div>;

// Ready
return <div>{/* content */}</div>;
```

### Pattern 4: Manual Refresh

```typescript
const refresh = useRefreshProject(projectId);

// In button click handler
<button onClick={() => refresh()}>Refresh</button>
```

### Pattern 5: Conditional Queries

```typescript
// Only fetch if projectId exists
const { data } = useProject(projectId, !!projectId);

// Only fetch if user has access
const { data } = useProjects(
  workspaceId,
  undefined,
  1,
  20,
  'created_at',
  isUserLoggedIn && hasAccess
);
```

---

## API Reference (Quick)

### Service Methods

```typescript
// Projects
projectService.createProject(data)
projectService.listProjects(workspaceId, status, page, pageSize)
projectService.getProject(projectId)
projectService.updateProject(projectId, data)
projectService.updateProjectStatus(projectId, status, completionDate)
projectService.deleteProject(projectId)
projectService.cloneProject(projectId, newName, copyTasks, copyMembers)

// Members
projectService.listProjectMembers(projectId)
projectService.addProjectMember(projectId, userId, role)
projectService.updateProjectMemberRole(projectId, userId, role)
projectService.removeProjectMember(projectId, userId)
projectService.addMultipleProjectMembers(projectId, members)

// Templates
projectService.createTemplate(name, description, structure)
projectService.listTemplates()
projectService.createProjectFromTemplate(templateId, workspaceId, projectName, startDate)

// Change Requests
projectService.createChangeRequest(projectId, title, description, scope, analysis, changes)
projectService.listChangeRequests(projectId, status)
projectService.approveChangeRequest(projectId, changeRequestId, approved, notes)

// Metrics & Settings
projectService.getProjectMetrics(projectId)
projectService.getProjectSettings(projectId)
projectService.updateProjectSettings(projectId, settings)

// Batch
projectService.archiveMultipleProjects(projectIds)
```

---

## Hooks Reference (Quick)

```typescript
// Queries
useProjects(workspaceId, status, page, pageSize, sortBy, enabled)
useProject(projectId, enabled)
useProjectMembers(projectId, enabled)
useProjectTemplates(page, pageSize, enabled)
useChangeRequests(projectId, status, enabled)
useProjectMetrics(projectId, enabled)
useProjectSettings(projectId, enabled)
useProjectComplete(projectId, enabled) // All at once

// Mutations
useCreateProject()
useUpdateProject()
useUpdateProjectStatus()
useDeleteProject()
useCloneProject()
useAddProjectMember()
useUpdateProjectMember()
useRemoveProjectMember()
useAddMultipleProjectMembers()
useCreateProjectTemplate()
useCreateProjectFromTemplate()
useCreateChangeRequest()
useApproveChangeRequest()
useUpdateProjectSettings()
useArchiveMultipleProjects()

// Utilities
useRefreshProject(projectId)
useRefreshProjects()
```

---

## Troubleshooting

### Q: My data is not showing up
**A**: Check that:
- Hook has `enabled: true` (default)
- Data is not undefined/null before rendering
- Check browser Network tab for API status

### Q: Changes are not reflecting
**A**: Try:
- Manual refresh: `refresh()` hook
- Check React Query DevTools
- Verify mutation onSuccess is called

### Q: TypeScript errors
**A**: 
- Ensure all imports are from correct modules
- Check type compatibility
- Run `npm run typecheck`

### Q: API calls failing
**A**:
- Check `VITE_API_URL` environment variable
- Verify API server is running
- Check authentication token in Network tab

---

## Files to Study

1. **Service Layer**: `src/services/projectService.ts` - See how API calls are made
2. **Hooks**: `src/hooks/projectHooks.ts` - See React Query patterns
3. **Types**: `src/types/project.ts` - Understand data structures
4. **Utils**: `src/features/projects/utils/projectUtils.ts` - See helper functions
5. **Documentation**: `MODULE_3_README.md` - Complete guide

---

## Key Concepts

### React Query Caching
- Projects: 5 minute cache
- Templates: 10 minute cache
- Metrics: 2 minute cache
- Automatic invalidation on mutations

### TypeScript Safety
- All responses typed
- No `any` types
- Full type inference
- 100% strict mode

### Error Handling
- API errors shown via toast
- User-friendly messages
- Automatic error logging
- Fallback UI states

### State Management
- Server state: React Query
- Client state: Zustand store
- Separation of concerns
- Easy to test

---

## Next Steps

1. ✅ Read `MODULE_3_README.md` for complete guide
2. ✅ Review `MODULE_3_REFERENCE.md` for detailed API docs
3. ✅ Check component examples in `src/features/projects/components/`
4. ✅ Integration test with your backend
5. ✅ Deploy to staging environment

---

**Happy coding! 🚀**

For detailed information, see [MODULE_3_README.md](./MODULE_3_README.md) and [MODULE_3_REFERENCE.md](./MODULE_3_REFERENCE.md)
