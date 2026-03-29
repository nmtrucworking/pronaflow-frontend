/**
 * Admin System - Quick Start Guide
 * Module 14: System Administration
 * 
 * This guide explains how to access and use the admin dashboard.
 */

# PronaFlow Admin System

Complete system administration dashboard for managing users, roles, security incidents, and system configuration.

## 🚀 Accessing Admin Dashboard

### URL
```
/admin/dashboard
```

Direct link: `http://localhost:5173/admin/dashboard`

## 🔐 Authentication & Authorization

### Admin Roles

The admin system supports three role levels:

1. **Super Admin** (`super_admin`)
   - Full system access
   - Manage users, roles, permissions
   - System configuration
   - Feature flags
   - Security incidents & audit logs

2. **System Admin** (`system_admin`)
   - Manage users and roles
   - System configuration
   - Feature flags
   - View security incidents & audit logs

3. **Security Admin** (`security_admin`)
   - Monitor security incidents
   - View audit logs
   - View users (read-only)

### Setting Admin Role (Development)

In mock/development mode, you can set your admin role:

```javascript
// In browser console:
localStorage.setItem('user_admin_role', 'super_admin');
// Reload page to activate
location.reload();
```

Available roles: `super_admin`, `system_admin`, `security_admin`

## 📋 Admin Sections

### 1. Dashboard
- **URL**: `/admin/dashboard`
- System overview with key metrics
- Recent security incidents
- Quick actions panel
- System health status

### 2. Users Management
- **URL**: `/admin/users`
- List all system users
- Search users by email, name, username
- View user details
- Change user status (active, suspended, locked)
- Edit user roles
- Delete users

### 3. Roles & Permissions
- **URL**: `/admin/roles`
- View system roles
- Manage permissions
- Create custom roles
- Assign permissions to roles

### 4. Security Incidents
- **URL**: `/admin/security-incidents`
- Monitor security issues
- View incident details
- Track incident status
- View actions taken

## 🛠️ Implementation Details

### File Structure
```
src/features/admin/
├── components/
│   ├── AdminLayout.tsx      # Main admin layout wrapper
│   ├── AdminSidebar.tsx     # Navigation sidebar
│   └── AdminNav.tsx         # Top navigation bar
├── hooks/
│   └── useAdminAccess.ts    # RBAC access control hook
├── pages/
│   ├── AdminDashboardPage.tsx
│   ├── UsersManagementPage.tsx
│   ├── RolesManagementPage.tsx
│   ├── SecurityIncidentsPage.tsx
│   └── (more pages to be added)
└── index.ts                 # Feature exports
```

### Key Components

#### AdminLayout
Protected wrapper that checks admin access before rendering child pages.

```typescript
import { AdminLayout } from '@/features/admin';

// Routes automatically protected by AdminLayout
<AdminLayout>
  <Outlet />
</AdminLayout>
```

#### useAdminAccess Hook
RBAC control hook for permission checking.

```typescript
import { useAdminAccess } from '@/features/admin';

const MyComponent = () => {
  const { isAdmin, hasPermission, isSuperAdmin } = useAdminAccess();
  
  if (!hasPermission('users:manage')) {
    return <p>Access Denied</p>;
  }
  
  return <div>User Management Panel</div>;
};
```

### Routes

All admin routes registered in `src/routes/paths.ts`:

```typescript
admin: {
  root: '/admin',
  dashboard: '/admin/dashboard',
  users: '/admin/users',
  roles: '/admin/roles',
  permissions: '/admin/permissions',
  systemConfig: '/admin/system-config',
  featureFlags: '/admin/feature-flags',
  securityIncidents: '/admin/security-incidents',
  auditLogs: '/admin/audit-logs',
}
```

## 🔧 Extending Admin System

### Adding New Admin Page

1. Create component in `src/features/admin/pages/`

```typescript
// src/features/admin/pages/MyAdminPage.tsx
import { useAdminAccess } from '../hooks/useAdminAccess';

const MyAdminPage = () => {
  const { hasPermission } = useAdminAccess();
  
  if (!hasPermission('my:permission')) {
    return <p>Access denied</p>;
  }
  
  return (
    <div>
      <h1>My Admin Page</h1>
    </div>
  );
};

export default MyAdminPage;
```

2. Add route to `src/routes/paths.ts`

```typescript
admin: {
  // ...existing routes
  myPage: '/admin/my-page',
}
```

3. Add to `src/App.tsx` routes

```typescript
{ path: ROUTES.admin.myPage, element: <MyAdminPageComponent /> }
```

4. Add menu item to `AdminSidebar.tsx`

```typescript
{
  label: 'My Page',
  icon: MyIcon,
  href: ROUTES.admin.myPage,
  permission: 'my:permission',
}
```

### Adding New Permission

Define new permission in `useAdminAccess.ts`:

```typescript
const ADMIN_ROLES: Record<string, AdminRole> = {
  my_admin: {
    name: 'My Admin',
    permissions: [
      'my:permission',
      'my:action',
    ],
  },
};
```

## 📊 Mock Data

Current implementation uses mock data for demonstration. To connect to real API:

1. Create `adminService.ts` to handle API calls
2. Replace mock data in components with API calls using React Query
3. Update types from `src/types/admin.ts` as needed

```typescript
// Example service
import { API_BASE_URL } from '@/lib/axiosClient';

export const adminService = {
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    return response.json();
  },
  // ...more methods
};
```

## 🔒 Security Considerations

- ✅ RBAC protected routes
- ✅ Permission checks on components
- ✅ Admin role stored in localStorage (mock)
- ⚠️ Production: Implement JWT token with admin claims
- ⚠️ Production: Validate permissions on backend API

## 📱 Responsive Design

Admin panel is fully responsive with:
- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Hidden sidebar with hamburger menu

(Hamburger menu component can be added as needed)

## 🎨 Styling

- Tailwind CSS for styling
- Dark mode support via `dark:` classes
- Color scheme: Indigo (primary), Red (danger), Emerald (success)

## 🚀 Future Enhancements

- [ ] Audit logs page
- [ ] System configuration page
- [ ] Feature flags management
- [ ] User activity logs
- [ ] Email templates management
- [ ] API integration
- [ ] Bulk operations
- [ ] Export/Import functionality
- [ ] Admin notifications
- [ ] System health metrics

## 📚 Related Documentation

- [Admin Types](../../../types/admin.ts)
- [Routes Configuration](../../../routes/paths.ts)
- [RBAC Hook](./hooks/useAdminAccess.ts)

## 💡 Tips

- Use browser DevTools to simulate different user roles
- Check sidebar for available permissions
- Admin dashboard auto-protects routes
- All data is currently mocked for demo purposes

---

**Last Updated**: March 29, 2026
**Module**: 14 - System Administration
