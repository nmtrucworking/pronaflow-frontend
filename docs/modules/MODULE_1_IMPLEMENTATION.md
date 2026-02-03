# Module 1: Identity & Access Management (IAM) - Implementation Guide

**Version**: 1.0  
**Last Updated**: February 2, 2026  
**Status**: Core Implementation Complete

---

## Overview

This document outlines the implementation of Functional Module 1 (Identity & Access Management) for PronaFlow. The module handles user registration, authentication, session management, and multi-factor authentication (MFA).

---

## Architecture

### Service Layer

#### `authService.ts`
Location: `src/services/authService.ts`

**Responsibilities**:
- User registration and login
- Email verification workflow
- Password reset management
- MFA setup and verification
- Session management
- Token management (access & refresh tokens)

**Key Methods**:
```typescript
register(data: RegisterRequest)           // POST /auth/register
login(data: LoginRequest)                 // POST /auth/login
verifyEmail(data: VerifyEmailRequest)     // POST /auth/verify-email
resendVerification(data)                  // POST /auth/resend-verification
getCurrentUser()                          // GET /auth/me
logout()                                  // POST /auth/logout
requestPasswordReset(data)                // POST /auth/password-reset
confirmPasswordReset(data)                // POST /auth/password-reset/confirm
enableMFA()                               // POST /auth/mfa/enable
confirmMFA(data)                          // POST /auth/mfa/confirm
verifyMFACode(data)                       // POST /auth/mfa/verify
disableMFA(data)                          // POST /auth/mfa/disable
getAllSessions()                          // GET /auth/sessions
revokeSession(data)                       // POST /auth/sessions/revoke
revokeAllSessions()                       // POST /auth/sessions/revoke-all
```

### React Hooks

Location: `src/hooks/useAuth.ts`

**Available Hooks**:

1. **useAuth()** - Get current authentication state
   ```typescript
   const { user, isAuthenticated, isLoading, error } = useAuth();
   ```

2. **useLogin()** - Handle user login
   ```typescript
   const { login, isLoading, error, mfaRequired } = useLogin();
   const result = await login({ email, password });
   ```

3. **useRegister()** - Handle user registration
   ```typescript
   const { register, isLoading, error } = useRegister();
   ```

4. **useVerifyEmail()** - Handle email verification
   ```typescript
   const { verifyEmail, resendVerification } = useVerifyEmail();
   ```

5. **usePasswordReset()** - Handle password reset
   ```typescript
   const { requestReset, confirmReset } = usePasswordReset();
   ```

6. **useMFA()** - Handle MFA setup and verification
   ```typescript
   const { enableMFA, confirmMFA, verifyMFACode, disableMFA, getBackupCodes } = useMFA();
   ```

7. **useSessions()** - Manage user sessions
   ```typescript
   const { fetchSessions, revokeSession, revokeAll } = useSessions();
   ```

8. **useLogout()** - Handle logout
   ```typescript
   const { logout } = useLogout();
   ```

9. **useCurrentUser()** - Fetch current user data
   ```typescript
   const { user, isLoading, error } = useCurrentUser();
   ```

### Redux State Management

Location: `src/store/features/authSlice.ts`

**State Structure**:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  pendingEmail: string | null;
}
```

**Actions**:
- `setUser` - Set authenticated user
- `clearAuth` - Clear auth state
- `setLoading` - Set loading state
- `setError` - Set error message
- `setMFARequired` - Set MFA requirement flag
- `setPendingEmail` - Set pending email for verification
- `clearError` - Clear error message

### Components

#### Login Component
Location: `src/features/auth/pages/Login.tsx`

**Features**:
- Email/password validation
- Remember me functionality
- 2FA code verification
- Social login buttons (Google, GitHub)
- Account lockout after 5 failed attempts
- Password visibility toggle
- Forgot password link

**Form Validation**:
- Email: Valid email format
- Password: Minimum 8 characters
- 2FA Code: Exactly 6 digits

#### Protected Route Component
Location: `src/components/ProtectedRoute.tsx`

**Usage**:
```typescript
<ProtectedRoute requiredRoles={['workspace_member']}>
  <Dashboard />
</ProtectedRoute>
```

### Authorization & Permissions

Location: `src/hooks/useRBAC.ts`

**Role Hierarchy**:
1. **Workspace Owner** - Full access including billing
2. **Workspace Admin** - Manage members and projects
3. **Workspace Member** - Create and edit projects/tasks
4. **Workspace Guest** - Read-only access

**Permission Checking**:
```typescript
const { hasRole, hasPermission, hasAnyRole, isWorkspaceOwner } = useRBAC();

if (hasPermission('manage_workspace')) {
  // Allow action
}
```

**Permission Guard Component**:
```typescript
<PermissionGuard permission="delete_project" fallback={<p>No access</p>}>
  <DeleteButton />
</PermissionGuard>
```

---

## Implementation Checklist

### Core Authentication (✅ Completed)
- [x] Auth Service with all endpoints
- [x] Login/Logout functionality
- [x] Token management (access & refresh)
- [x] Session tracking

### User Registration (⏳ In Progress)
- [ ] Registration form component
- [ ] Email verification workflow
- [ ] Password strength validation
- [ ] Welcome email setup

### Password Recovery (⏳ Not Started)
- [ ] Password reset request form
- [ ] Reset confirmation page
- [ ] Email token validation

### Multi-Factor Authentication (⏳ Not Started)
- [ ] MFA setup flow with QR code
- [ ] TOTP verification
- [ ] Backup codes generation & storage
- [ ] MFA settings UI

### Session Management (⏳ Not Started)
- [ ] Active sessions display
- [ ] Device detection
- [ ] Remote logout functionality
- [ ] Impossible travel detection

### Role-Based Access Control (✅ Completed)
- [x] Role definitions and hierarchy
- [x] Permission system
- [x] RBAC hooks
- [x] Permission guard components

---

## API Integration

### Environment Variables
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Token Storage
- **Access Token**: LocalStorage (30-minute expiration)
- **Refresh Token**: LocalStorage (7-day expiration)

### Error Handling
- 401 Unauthorized: Redirect to login
- 403 Forbidden: Show permission denied message
- 429 Too Many Requests: Show rate limit warning
- 500 Server Error: Show error notification

---

## Security Features

### Password Security
- Minimum 12 characters
- Requires uppercase, lowercase, digit, special character
- One-way hashing on backend (bcrypt recommended)
- Never transmitted in plain text over HTTP

### Session Security
- JWT-based authentication
- HTTPS required in production
- CORS configured for allowed origins
- Rate limiting on authentication endpoints

### MFA Features
- Standard TOTP (Time-based One-Time Password)
- Support for Google Authenticator, Microsoft Authenticator
- 10 backup codes for recovery
- MFA backup codes stored securely

### Brute-Force Protection
- Maximum 5 failed login attempts
- 15-minute account lockout
- Security alert email on suspicious activity

### Impossible Travel Detection
- Geographic validation
- Time-based location verification
- Re-authentication required for suspicious logins

---

## Usage Examples

### Login Example
```typescript
import { useLogin } from '@/hooks/useAuth';

function LoginPage() {
  const { login, isLoading, error } = useLogin();

  const handleLogin = async (email: string, password: string) => {
    const result = await login({ email, password });
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    // Login form JSX
  );
}
```

### Protected Route Example
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRBAC } from '@/hooks/useRBAC';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['workspace_owner']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Permission Check Example
```typescript
function ProjectActions() {
  const { hasPermission } = useRBAC();

  return (
    <div>
      {hasPermission('delete_project') && (
        <button onClick={handleDelete}>Delete Project</button>
      )}
      {hasPermission('edit_project') && (
        <button onClick={handleEdit}>Edit Project</button>
      )}
    </div>
  );
}
```

---

## File Structure

```
src/
├── services/
│   └── authService.ts              # Auth API service
├── hooks/
│   ├── useAuth.ts                  # Auth hooks
│   └── useRBAC.ts                  # RBAC utilities
├── store/
│   ├── features/
│   │   └── authSlice.ts            # Auth Redux slice
│   ├── middleware.ts               # Auth middleware
│   ├── rootReducer.ts              # Root reducer
│   └── index.ts                    # Store config
├── features/
│   └── auth/
│       └── pages/
│           └── Login.tsx           # Login page
├── components/
│   └── ProtectedRoute.tsx          # Protected route component
└── types/
    └── user.ts                     # User type definitions
```

---

## Next Steps

1. **Register Component** - Create user registration form
2. **Password Recovery** - Implement password reset flow
3. **MFA Setup** - Create MFA setup and verification UI
4. **Session Management** - Build active sessions management page
5. **Social Auth** - Implement OAuth integration
6. **Testing** - Add unit and integration tests
7. **Documentation** - Create API documentation

---

## Support & Resources

- **API Docs**: `/docs` (Swagger UI)
- **Health Check**: `/health`
- **OpenAPI Schema**: `/openapi.json`

---

## Notes for Developers

### Token Refresh
The auth service automatically includes the access token in all requests via the axios interceptor. Implement token refresh logic in the middleware when tokens expire.

### Error Codes
- `400`: Validation error
- `401`: Unauthorized (invalid/expired token)
- `403`: Forbidden (insufficient permissions)
- `409`: Conflict (email already exists)
- `429`: Too many requests (rate limited)

### Rate Limiting
- General: 100 requests/minute
- Auth endpoints: 5 attempts per 10 minutes
- Public endpoints: 30 requests/minute
