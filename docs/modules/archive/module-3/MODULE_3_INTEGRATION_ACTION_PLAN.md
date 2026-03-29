# Module 3 Frontend - Integration Action Plan

**Date**: March 29, 2026  
**Status**: UI Complete ✅ | Backend Integration Missing ❌  
**Priority**: CRITICAL - Must fix before production

---

## Quick Summary

### The Problem
```
📚 Services Layer: ✅ Complete (20 methods)
🪝 Hooks Layer: ✅ Complete (21 hooks)
🧩 Types Layer: ✅ Complete (25+ types)
🎨 UI Components: ✅ Complete (12+ components)
    ↓
🔗 MISSING CONNECTION
    ↓
📄 Pages: ❌ Using mock data instead of hooks
```

### Current State
- AllProjectPage uses `MOCK_PROJECTS` (mock data)
- All mutations use `useState` (local state only)
- React Query hooks defined but never imported/used
- No backend API calls happening

### Expected State
- AllProjectPage should fetch from `useProjects()`
- Create should use `useCreateProject()` mutation
- Update should use `useUpdateProjectStatus()` mutation
- All data synced with backend via React Query

---

## Step-by-Step Fix Guide

### Step 1: Remove Type-Check Bypass (15 minutes)

**File 1: src/features/projects/components/ProjectCard.tsx**
```diff
- // @ts-nocheck
```

**File 2: src/features/projects/components/ProjectList.tsx**
```diff
- // @ts-nocheck
```

**File 3: src/features/projects/pages/AllProjectPage.tsx**
```diff
- // @ts-nocheck
```

**File 4: src/mocks/projects.ts**
```diff
- // @ts-nocheck
```

Then fix any TypeScript errors that appear.

---

### Step 2: Integrate React Query into AllProjectPage (45 minutes)

**File**: `src/features/projects/pages/AllProjectPage.tsx`

#### 2.1 Remove Mock Data
```diff
- import { MOCK_PROJECTS } from '@/mocks/projects';
+ import { useProjects, useCreateProject, useUpdateProjectStatus, useDeleteProject } from '@/hooks/projectHooks';
```

#### 2.2 Replace useState for projects with useProjects hook
```typescript
// BEFORE:
const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

// AFTER:
const { data: projects = [], isLoading, error } = useProjects(workspaceId);
```

#### 2.3 Update handleCreateProject to use mutation
```typescript
// BEFORE:
const handleCreateProject = (projectData: any) => {
  const newProject: Project = {
    id: `PRJ-${Date.now()}`,
    ...projectData,
    // ... more props
  };
  setProjects([...projects, newProject]);
};

// AFTER:
const { mutate: createProject, isPending: isCreating } = useCreateProject();

const handleCreateProject = (projectData: CreateProjectDTO) => {
  createProject(projectData, {
    onSuccess: () => {
      // Toast notification will be handled by hook
    }
  });
};
```

#### 2.4 Update handleStatusChange to use mutation
```typescript
// BEFORE:
const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
  setProjects(projects.map(project => 
    project.id === projectId 
      ? { ...project, status: newStatus }
      : project
  ));
};

// AFTER:
const { mutate: updateStatus } = useUpdateProjectStatus();

const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
  updateStatus({ projectId, status: newStatus });
};
```

#### 2.5 Add loading state handling
```typescript
// Show loading spinner during data fetch
if (isLoading) {
  return <LoadingSpinner />;
}

// Show error if fetch fails
if (error) {
  return <ErrorBoundary error={error} />;
}
```

---

### Step 3: Fix Type Errors (30 minutes)

#### Issue 1: Replace `any` type
```diff
- const handleCreateProject = (projectData: any) => {
+ const handleCreateProject = (projectData: CreateProjectDTO) => {
```

#### Issue 2: Add CreateProjectDTO import
```typescript
import type { CreateProjectDTO, UpdateProjectDTO } from '@/types/project';
```

#### Issue 3: Fix component prop types
```typescript
// Ensure all components have proper type props
<ProjectCard 
  project={project}  // Project type
  onProjectClick={selectProject}  // (project: Project) => void
  // ...
/>
```

---

### Step 4: Add Error Handling (20 minutes)

**Add Error Boundary component wrapper**:
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

return (
  <ErrorBoundary>
    <ProjectLayout>
      {/* content */}
    </ProjectLayout>
  </ErrorBoundary>
);
```

**Handle mutation errors**:
```typescript
const { mutate: createProject } = useCreateProject();

const handleCreateProject = (projectData: CreateProjectDTO) => {
  createProject(projectData, {
    onError: (error) => {
      // Error toast already shown by hook
      console.error('Failed to create project:', error);
    }
  });
};
```

---

### Step 5: Add Toast Notifications (15 minutes)

The `projectHooks.ts` already has toast notifications configured, but verify they're showing:

```typescript
// In projectHooks.ts, mutations should have:
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
  toast.success('Project created successfully');  // ✅ Should already be there
},
onError: (error) => {
  const message = error.response?.data?.message || 'Failed to create project';
  toast.error(message);  // ✅ Should already be there
}
```

---

## File-by-File Checklist

### AllProjectPage.tsx
```diff
- [ ] Remove @ts-nocheck
- [ ] Remove MOCK_PROJECTS import
- [ ] Add useProjects hook import
- [ ] Add useMutations hook imports (create, update, delete)
- [ ] Replace useState(MOCK_PROJECTS) with useProjects()
- [ ] Replace handleCreateProject with useCreateProject
- [ ] Replace handleStatusChange with useUpdateProjectStatus
- [ ] Add handleDeleteProject with useDeleteProject
- [ ] Replace any types with proper DTOs
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test with real backend data
```

### ProjectCard.tsx
```diff
- [ ] Remove @ts-nocheck
- [ ] Fix any TypeScript errors
- [ ] Ensure project prop is typed as Project
- [ ] Keep drag-and-drop functionality
```

### ProjectList.tsx
```diff
- [ ] Remove @ts-nocheck
- [ ] Fix any TypeScript errors
- [ ] Ensure projects prop is typed as Project[]
- [ ] Keep view mode switching
```

---

## Testing Checklist

After making changes:

```
[ ] Compilation succeeds (no TypeScript errors)
[ ] Page loads without @ts-nocheck directives
[ ] Search/filter still work with real API
[ ] Create project works
[ ] Update project status works
[ ] Delete project works (if button exists)
[ ] Toast notifications appear on success
[ ] Error notifications appear on failure
[ ] Loading states show during operations
[ ] Empty state shows when no projects
[ ] Data refreshes after mutations
```

---

## Expected Improvements

### Before Integration
- ❌ No real data
- ❌ No persistence
- ❌ No error handling
- ❌ @ts-nocheck in production code
- ❌ `any` types used

### After Integration
- ✅ Real data from backend
- ✅ Data persists to database
- ✅ Comprehensive error handling
- ✅ Full type safety
- ✅ Proper async state management
- ✅ Toast notifications
- ✅ React Query caching

---

## Time Estimate

| Task | Time | Total |
|------|------|-------|
| Step 1: Remove @ts-nocheck | 15min | 15min |
| Step 2: Integrate React Query | 45min | 60min |
| Step 3: Fix Type Errors | 30min | 90min |
| Step 4: Add Error Handling | 20min | 110min |
| Step 5: Add Toast Notifications | 15min | 125min |
| **Testing & QA** | 30min | **155min** |
| | | **~2.5 hours** |

---

## Success Criteria

✅ **Module 3 is production-ready when:**
1. All @ts-nocheck directives removed
2. All `any` types replaced with proper types
3. AllProjectPage uses useProjects() for data
4. Create/Update/Delete use React Query mutations
5. Error handling implemented
6. Toast notifications working
7. All TypeScript errors resolved
8. Tests passing
9. Deployed successfully with real backend

---

## Resources

- Service Layer: `src/services/projectService.ts` (20 API methods)
- Hooks Layer: `src/hooks/projectHooks.ts` (21 React Query hooks)
- Types Layer: `src/types/project.ts` (25+ types)
- Documentation: `docs/modules/MODULE_3_REFERENCE.md`

---

## Questions & Support

For questions about:
- **React Query patterns**: See `projectHooks.ts` for examples
- **Type definitions**: See `types/project.ts`
- **Form handling**: See `CreateProjectModal.tsx`
- **API endpoints**: See `services/projectService.ts`

---

**Priority**: 🔴 **CRITICAL** - Deploy after completing this plan  
**Estimated Completion**: Today (with 2-3 hours of focused work)  
**Next Step**: Start with Step 1 (removing @ts-nocheck directives)
