# Projects Feature - Refactoring Documentation

## T?ng quan c?u tr�c d� ph�n r�

Trang `/projects` d� du?c t�i c?u tr�c theo React best practices:

```
src/features/projects/
+-- pages/
�   +-- AllProjectPage.tsx       # Main page component
�   +-- index.ts                 # Page exports
+-- components/
�   +-- ProjectHeader.tsx        # Header v?i search, filter, view switcher
�   +-- ProjectList.tsx          # List container (Grid/List/Kanban views)
�   +-- ProjectLayout.tsx        # Layout wrapper v?i sidebar
�   +-- ProjectDetailsView.tsx   # Full page details view
�   +-- ProjectCard.tsx          # Grid view card
�   +-- ProjectRow.tsx           # List view row
�   +-- ProjectDetails.tsx       # (Existing)
�   +-- ProjectDetailsSidebar.tsx # (Existing)
�   +-- index.ts                 # Component exports
+-- hooks/
�   +-- useFilteredProjects.ts   # Logic l?c & s?p x?p
�   +-- useProjectSelection.ts   # Logic ch?n project
�   +-- index.ts                 # Hooks exports
+-- constants/
�   +-- viewModes.ts             # VIEW_MODES & SORT_OPTIONS constants
�   +-- index.ts                 # Constants exports
+-- store/                        # (Existing)
+-- services/                     # (Existing)
+-- types/                        # (Existing)
+-- utils/                        # (Existing)
+-- index.ts                      # Feature module exports
```

## Nguy�n t?c ph�n r�

### 1. **Separation of Concerns**
- **Pages**: Ch? contain di?m nh?p ch�nh
- **Components**: Reusable UI components
- **Hooks**: Business logic & state management
- **Constants**: Magic strings, enums, configuration
- **Services**: API calls & external data fetching

### 2. **Component Hierarchy**
```
AllProjectsPage (Container/Smart Component)
+-- ProjectLayout (Layout wrapper)
�   +-- ProjectHeader (Search, Filter, View switcher)
�   +-- ProjectList (View renderer)
�   �   +-- ProjectCard (Grid item)
�   �   +-- ProjectRow (List item)
�   +-- ProjectDetailsSidebar (Sidebar)
+-- ProjectDetailsView (Full page when selected)
```

### 3. **State Management**
- **View State**: `viewMode`, `searchQuery`, `statusFilter`, `sortOption` ? AllProjectsPage
- **Selection State**: `selectedProject`, `showSidebar`, `showFullPage` ? `useProjectSelection` hook
- **Filtered Data**: `filteredProjects` ? `useFilteredProjects` hook

## L?i �ch c?a refactoring

? **D? b?o tr�**: M?i component c� m?t tr�ch nhi?m duy nh?t  
? **T�i s? d?ng**: Components c� th? d�ng ? nhi?u noi  
? **Testability**: Logic t�ch bi?t d? unit test  
? **Scalability**: D? th�m features m?i (filter modal, create modal, etc)  
? **Performance**: D? optimize individual components  
? **Type Safety**: Clear props interfaces cho m?i component  

## File thay d?i ch�nh

### AllProjectPage.tsx (Before ? After)
**Before**: 174 lines, t?t c? logic trong 1 file  
**After**: 69 lines, logic t�ch ra hooks

### New Files
- `ProjectHeader.tsx` - 68 lines (UI + Search + Filter buttons)
- `ProjectList.tsx` - 48 lines (View renderer)
- `ProjectLayout.tsx` - 43 lines (Layout wrapper)
- `ProjectDetailsView.tsx` - 17 lines (Full page wrapper)
- `useFilteredProjects.ts` - 33 lines (Filter/Sort logic)
- `useProjectSelection.ts` - 45 lines (Selection state management)
- `constants/viewModes.ts` - 12 lines (Constants & types)

## Hu?ng d?n s? d?ng

### Import t? feature
```tsx
import { 
  AllProjectsPage,
  useFilteredProjects,
  useProjectSelection,
  VIEW_MODES
} from '@/features/projects';
```

### Extend ho?c t�y ch?nh
```tsx
// Extend ProjectHeader
import { ProjectHeader } from '@/features/projects/components';

// Use hooks elsewhere
import { useFilteredProjects } from '@/features/projects/hooks';
```

### Th�m features m?i
1. **Filter Modal**: T?o `FilterModal.tsx` component
2. **Create Modal**: T?o `CreateProjectModal.tsx` component
3. **Bulk Actions**: Th�m `useBulkSelection` hook

## Next Steps

- [ ] Implement filter modal integration
- [ ] Implement create modal integration
- [ ] Add Kanban view implementation
- [ ] Add unit tests for hooks
- [ ] Add integration tests for components
- [ ] Add error boundary
- [ ] Add loading skeleton states
