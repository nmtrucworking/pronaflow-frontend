# Inbox Feature - Refactoring Documentation

## Tổng quan cấu trúc đã phân rã

Trang `/inbox` đã được tái cấu trúc theo React best practices:

```
src/features/inbox/
├── pages/
│   ├── InboxPage.tsx           # Main page component (refactored)
│   └── index.ts                # Page exports
├── components/
│   ├── InboxHeader.tsx         # Header với filter, search, mark as read
│   ├── NotificationList.tsx    # List container với scroll area
│   ├── NotificationDetail.tsx  # Detail view với attachments
│   ├── NotificationIcon.tsx    # Type-based icon component
│   ├── RelativeTime.tsx        # Relative time formatter
│   ├── EmptyState.tsx          # Empty state UI
│   ├── PreviewModal.tsx        # File preview modal
│   └── index.ts                # Component exports
├── hooks/
│   ├── useFilteredNotifications.ts # Filter + search logic
│   ├── useNotificationSelection.ts # Selection state
│   ├── useNotificationActions.ts   # CRUD operations
│   └── index.ts                    # Hooks exports
├── types/
│   ├── inbox-types.ts          # Type definitions
│   └── index.ts                # Types exports
├── constants/
│   ├── inbox-constants.ts      # Constants & enums
│   └── index.ts                # Constants exports
├── store/                       # (Existing)
├── services/                    # (Existing)
└── index.ts                     # Feature module exports
```

## Nguyên tắc phân rã

### 1. **Component Hierarchy**
```
InboxPage (Container/Smart Component)
├── InboxHeader (Filters, search, actions)
├── NotificationList (Scrollable list)
│   ├── NotificationIcon
│   └── RelativeTime
├── NotificationDetail (Detail pane)
│   ├── Attachments display
│   └── Contextual actions
└── PreviewModal (Global modal)
```

### 2. **State Management**
- **Filter & Search**: `filter`, `searchQuery` → InboxPage
- **Selection**: `selectedId` → `useNotificationSelection` hook
- **Data**: `notifications` → InboxPage
- **Preview**: `previewAttachment` → InboxPage

### 3. **Custom Hooks**
- **useFilteredNotifications**: Filter + search logic (useMemo)
- **useNotificationSelection**: Selection state management
- **useNotificationActions**: CRUD operations (mark read, delete)

### 4. **Separation of Concerns**
- **Components**: UI rendering chỉ
- **Hooks**: Business logic & state
- **Types**: Type definitions
- **Constants**: Enum values, constants

## Lợi ích

✅ **Dễ bảo trì** - Mỗi component 1 trách nhiệm  
✅ **Tái sử dụng** - Components & hooks dùng ở nhiều nơi  
✅ **Testability** - Logic tách biệt dễ unit test  
✅ **Performance** - useMemo optimization cho filtering  
✅ **Flexibility** - Dễ thêm features (batch actions, archive, etc)  
✅ **Type Safety** - Strong typing cho tất cả  

## File thay đổi chính

### InboxPage.tsx (Before → After)
**Before**: 561 lines, tất cả logic trong 1 file  
**After**: 96 lines, logic tách ra hooks/components  

### New Components
- `InboxHeader.tsx` - 62 lines (Filters + Search)
- `NotificationList.tsx` - 94 lines (List renderer)
- `NotificationDetail.tsx` - 147 lines (Detail view)
- `NotificationIcon.tsx` - 30 lines (Icon switcher)
- `RelativeTime.tsx` - 19 lines (Time formatter)
- `EmptyState.tsx` - 14 lines (Empty state)
- `PreviewModal.tsx` - 65 lines (File preview)

### New Hooks
- `useFilteredNotifications.ts` - 32 lines (Filter logic)
- `useNotificationSelection.ts` - 40 lines (Selection state)
- `useNotificationActions.ts` - 39 lines (CRUD operations)

## Hướng dẫn sử dụng

### Import từ feature
```tsx
import {
  InboxPage,
  useFilteredNotifications,
  useNotificationSelection,
  NOTIFICATION_FILTERS,
  type NotificationEntity,
} from '@/features/inbox';
```

### Extend hoặc customize
```tsx
// Use hooks elsewhere
import { useNotificationActions } from '@/features/inbox/hooks';

// Extend components
import { NotificationList } from '@/features/inbox/components';
```

## Next Steps

- [ ] Mock data → API integration (axios)
- [ ] Batch actions (select multiple, bulk delete)
- [ ] Archive notifications
- [ ] Real-time updates (WebSocket)
- [ ] Search debounce optimization
- [ ] Unit tests for hooks
- [ ] Integration tests for components
- [ ] Error boundaries
- [ ] Loading skeleton states
- [ ] Notification preferences settings

## Key Improvements

### Performance
- ✅ useMemo for filtered notifications
- ✅ useCallback for event handlers
- ✅ Separated concerns reduce re-renders

### Code Quality
- ✅ Clear separation of UI and logic
- ✅ Reusable components & hooks
- ✅ Strong TypeScript typing
- ✅ Consistent naming conventions

### Developer Experience
- ✅ Easy to understand component flow
- ✅ Modular structure for team collaboration
- ✅ Clear props interfaces (IntelliSense support)
- ✅ Easy to add new features
