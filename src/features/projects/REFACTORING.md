# Projects Feature - Refactoring Documentation

## Tổng quan cấu trúc đã phân rã

Trang `/projects` đã được tái cấu trúc theo React best practices:

```
src/features/projects/
├── pages/
│   ├── AllProjectPage.tsx       # Main page component
│   └── index.ts                 # Page exports
├── components/
│   ├── ProjectHeader.tsx        # Header với search, filter, view switcher
│   ├── ProjectList.tsx          # List container (Grid/List/Kanban views)
│   ├── ProjectLayout.tsx        # Layout wrapper với sidebar
│   ├── ProjectDetailsView.tsx   # Full page details view
│   ├── ProjectCard.tsx          # Grid view card
│   ├── ProjectRow.tsx           # List view row
│   ├── ProjectDetails.tsx       # (Existing)
│   ├── ProjectDetailsSidebar.tsx # (Existing)
│   └── index.ts                 # Component exports
├── hooks/
│   ├── useFilteredProjects.ts   # Logic lọc & sắp xếp
│   ├── useProjectSelection.ts   # Logic chọn project
│   └── index.ts                 # Hooks exports
├── constants/
│   ├── viewModes.ts             # VIEW_MODES & SORT_OPTIONS constants
│   └── index.ts                 # Constants exports
├── store/                        # (Existing)
├── services/                     # (Existing)
├── types/                        # (Existing)
├── utils/                        # (Existing)
└── index.ts                      # Feature module exports
```

## Nguyên tắc phân rã

### 1. **Separation of Concerns**
- **Pages**: Chỉ contain điểm nhập chính
- **Components**: Reusable UI components
- **Hooks**: Business logic & state management
- **Constants**: Magic strings, enums, configuration
- **Services**: API calls & external data fetching

### 2. **Component Hierarchy**
```
AllProjectsPage (Container/Smart Component)
├── ProjectLayout (Layout wrapper)
│   ├── ProjectHeader (Search, Filter, View switcher)
│   ├── ProjectList (View renderer)
│   │   ├── ProjectCard (Grid item)
│   │   └── ProjectRow (List item)
│   └── ProjectDetailsSidebar (Sidebar)
└── ProjectDetailsView (Full page when selected)
```

### 3. **State Management**
- **View State**: `viewMode`, `searchQuery`, `statusFilter`, `sortOption` → AllProjectsPage
- **Selection State**: `selectedProject`, `showSidebar`, `showFullPage` → `useProjectSelection` hook
- **Filtered Data**: `filteredProjects` → `useFilteredProjects` hook

## Lợi ích của refactoring

✅ **Dễ bảo trì**: Mỗi component có một trách nhiệm duy nhất  
✅ **Tái sử dụng**: Components có thể dùng ở nhiều nơi  
✅ **Testability**: Logic tách biệt dễ unit test  
✅ **Scalability**: Dễ thêm features mới (filter modal, create modal, etc)  
✅ **Performance**: Dễ optimize individual components  
✅ **Type Safety**: Clear props interfaces cho mỗi component  

## File thay đổi chính

### AllProjectPage.tsx (Before → After)
**Before**: 174 lines, tất cả logic trong 1 file  
**After**: 69 lines, logic tách ra hooks

### New Files
- `ProjectHeader.tsx` - 68 lines (UI + Search + Filter buttons)
- `ProjectList.tsx` - 48 lines (View renderer)
- `ProjectLayout.tsx` - 43 lines (Layout wrapper)
- `ProjectDetailsView.tsx` - 17 lines (Full page wrapper)
- `useFilteredProjects.ts` - 33 lines (Filter/Sort logic)
- `useProjectSelection.ts` - 45 lines (Selection state management)
- `constants/viewModes.ts` - 12 lines (Constants & types)

## Hướng dẫn sử dụng

### Import từ feature
```tsx
import { 
  AllProjectsPage,
  useFilteredProjects,
  useProjectSelection,
  VIEW_MODES
} from '@/features/projects';
```

### Extend hoặc tùy chỉnh
```tsx
// Extend ProjectHeader
import { ProjectHeader } from '@/features/projects/components';

// Use hooks elsewhere
import { useFilteredProjects } from '@/features/projects/hooks';
```

### Thêm features mới
1. **Filter Modal**: Tạo `FilterModal.tsx` component
2. **Create Modal**: Tạo `CreateProjectModal.tsx` component
3. **Bulk Actions**: Thêm `useBulkSelection` hook

## Next Steps

- [ ] Implement filter modal integration
- [ ] Implement create modal integration
- [ ] Add Kanban view implementation
- [ ] Add unit tests for hooks
- [ ] Add integration tests for components
- [ ] Add error boundary
- [ ] Add loading skeleton states
