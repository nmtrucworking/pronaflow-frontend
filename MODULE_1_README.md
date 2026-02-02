# 📖 Module 1: Identity & Access Management (IAM)
## Implementation Guide - PronaFlow Frontend

**Version**: 1.0  
**Status**: ✅ Complete & Production Ready  
**Last Updated**: February 2, 2026

---

## 🎯 Overview

This is a **complete implementation of PronaFlow's Functional Module 1 (Identity & Access Management)**, providing enterprise-grade authentication, authorization, and session management for the frontend application.

### What's Included
- ✅ Authentication Service (21 API methods)
- ✅ 9 Custom React Hooks
- ✅ Redux Store with middleware
- ✅ Login Component with MFA & Social Auth
- ✅ Role-Based Access Control (RBAC)
- ✅ Protected Routes
- ✅ TypeScript types
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
```

### 3. Use Authentication

```typescript
import { useAuth } from '@/hooks/useAuth';
import { useLogin } from '@/hooks/useAuth';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { login } = useLogin();

  return (
    <>
      {isAuthenticated ? (
        <Dashboard user={user} />
      ) : (
        <Login onLogin={login} />
      )}
    </>
  );
}
```

### 4. Protect Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<ProtectedRoute requiredRoles={['workspace_admin']}>
  <AdminPanel />
</ProtectedRoute>
```

### 5. Check Permissions

```typescript
import { useRBAC } from '@/hooks/useRBAC';

function ProjectActions() {
  const { hasPermission, isWorkspaceOwner } = useRBAC();

  return (
    <>
      {hasPermission('delete_project') && <DeleteButton />}
      {isWorkspaceOwner() && <OwnerFeatures />}
    </>
  );
}
```

---

## 📁 File Structure

```
src/
├── services/
│   └── authService.ts                    # Main authentication service
│       └── 21 methods for all auth operations
│
├── hooks/
│   ├── useAuth.ts                        # 9 authentication-related hooks
│   │   ├── useAuth() - Get auth state
│   │   ├── useLogin() - Handle login
│   │   ├── useRegister() - Handle registration
│   │   ├── useVerifyEmail() - Email verification
│   │   ├── usePasswordReset() - Password reset
│   │   ├── useMFA() - MFA management
│   │   ├── useSessions() - Session management
│   │   ├── useLogout() - Logout
│   │   └── useCurrentUser() - Fetch current user
│   │
│   └── useRBAC.ts                        # Role-based access control
│       ├── useRBAC() - Permission checking
│       ├── RoleGuard - Component wrapper
│       ├── PermissionGuard - Component wrapper
│       └── Permission utilities
│
├── store/
│   ├── features/
│   │   └── authSlice.ts                  # Redux auth slice
│   │
│   ├── middleware.ts                     # Auth middleware
│   ├── rootReducer.ts                    # Root reducer
│   └── index.ts                          # Store configuration
│
├── features/
│   └── auth/
│       └── pages/
│           └── Login.tsx                 # Login page component
│
├── components/
│   └── ProtectedRoute.tsx                # Protected route wrapper
│
└── types/
    └── user.ts                           # User type definitions

docs/
├── MODULE_1_IMPLEMENTATION.md            # Detailed implementation guide
├── DEPLOYMENT_SUMMARY.md                 # Vietnamese summary
└── IMPLEMENTATION_VISUAL_SUMMARY.md      # Visual architecture & summary
```

---

## 🔑 Key Features

### 1. Authentication Service
```typescript
// Register
authService.register({
  email: 'user@example.com',
  username: 'johndoe',
  password: 'SecurePass123!@#',
  full_name: 'John Doe'
})

// Login
authService.login({
  email: 'user@example.com',
  password: 'SecurePass123!@#'
})

// Verify Email
authService.verifyEmail({
  user_id: 'uuid',
  token: 'verification-token'
})

// Get Current User
authService.getCurrentUser()

// Logout
authService.logout()
```

### 2. MFA/2FA Support
```typescript
// Enable MFA
const { secret, qr_code, backup_codes } = await authService.enableMFA()

// Confirm MFA Setup
await authService.confirmMFA({ totp_code: '123456' })

// Verify TOTP During Login
const { access_token } = await authService.verifyMFACode({
  email: 'user@example.com',
  totp_code: '123456'
})

// Disable MFA
await authService.disableMFA({ password: 'user-password' })

// Get Backup Codes
const { backup_codes } = await authService.getMFABackupCodes()
```

### 3. Session Management
```typescript
// Get all active sessions
const { sessions } = await authService.getAllSessions()

// Revoke specific session
await authService.revokeSession({ session_id: 'uuid' })

// Revoke all other sessions
await authService.revokeAllSessions()
```

### 4. Password Management
```typescript
// Request password reset
await authService.requestPasswordReset({
  email: 'user@example.com'
})

// Confirm password reset
await authService.confirmPasswordReset({
  user_id: 'uuid',
  token: 'reset-token',
  new_password: 'NewSecurePass123!@#'
})
```

### 5. Role-Based Access Control
```typescript
const { 
  hasRole,              // Check specific role
  hasPermission,        // Check specific permission
  hasAnyRole,          // Check any of multiple roles
  hasAllRoles,         // Check all roles
  hasAnyPermission,    // Check any permission
  hasAllPermissions,   // Check all permissions
  isWorkspaceOwner,    // Is owner
  isWorkspaceAdmin,    // Is admin or owner
  isWorkspaceMember    // Is member, admin, or owner
} = useRBAC();
```

---

## 🔐 Security Features

### Password Security
- **Minimum Length**: 12 characters
- **Requirements**: Uppercase, lowercase, digit, special character
- **Storage**: Bcrypt hashing on backend
- **Transmission**: HTTPS only (in production)

### Session Security
- **Token Type**: JWT (JSON Web Token)
- **Access Token**: 30-minute expiration
- **Refresh Token**: 7-day expiration
- **Concurrent Sessions**: Maximum 5 per user
- **Device Tracking**: Browser, OS, IP, Location

### Brute-Force Protection
- **Failed Attempts**: Maximum 5 in 10 minutes
- **Lockout Duration**: 15 minutes
- **Email Alert**: Sent on lockout

### Multi-Factor Authentication (MFA)
- **Method**: TOTP (Time-based One-Time Password)
- **Apps Supported**: Google Authenticator, Microsoft Authenticator
- **Backup Codes**: 10 recovery codes
- **Recovery**: One-time use per code

### Additional Security
- **Rate Limiting**: 100 requests/minute per IP
- **CORS**: Restricted to configured origins
- **Impossible Travel**: Detected and requires re-authentication
- **Token Refresh**: Automatic token refresh on expiration

---

## 🎨 Component Examples

### Login Component
```typescript
import Login from '@/features/auth/pages/Login';

// Basic usage
<Login />

// Features:
// - Email/password form with validation
// - Remember me checkbox
// - Forgot password link
// - 2FA verification modal
// - Social login (Google, GitHub)
// - Password visibility toggle
// - Brute-force alerts
// - Loading states
```

### Protected Route Component
```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Dashboard from '@/features/dashboard';
import AdminPanel from '@/features/admin';

<Routes>
  {/* Public route */}
  <Route path="/login" element={<Login />} />

  {/* Protected route - requires authentication */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  {/* Protected route - requires specific role */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRoles={['workspace_owner']}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
</Routes>
```

### Permission Guard Component
```typescript
import { PermissionGuard, RoleGuard } from '@/hooks/useRBAC';

// Permission-based guard
<PermissionGuard permission="delete_project">
  <DeleteButton />
</PermissionGuard>

// Role-based guard
<RoleGuard roles={['workspace_admin']}>
  <AdminFeature />
</RoleGuard>

// With fallback
<PermissionGuard 
  permission="edit_project"
  fallback={<p>You don't have permission</p>}
>
  <EditButton />
</PermissionGuard>
```

---

## 🧪 Testing Guide

### Test Login Flow
```typescript
import { useLogin } from '@/hooks/useAuth';

function TestLogin() {
  const { login } = useLogin();

  const handleTest = async () => {
    const result = await login({
      email: 'test@example.com',
      password: 'TestPass123!@#'
    });
    
    console.log('Login result:', result);
    console.log('MFA required:', result.mfaRequired);
  };

  return <button onClick={handleTest}>Test Login</button>;
}
```

### Test Protected Route
```typescript
function TestProtectedRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Not authenticated - should redirect to login</p>;
  }

  return (
    <p>Authenticated as: {user?.email}</p>
  );
}
```

### Test Permissions
```typescript
function TestPermissions() {
  const { hasPermission, isWorkspaceOwner } = useRBAC();

  return (
    <div>
      <p>Has delete_project: {hasPermission('delete_project') ? 'Yes' : 'No'}</p>
      <p>Is workspace owner: {isWorkspaceOwner() ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## 📊 API Reference

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!@#",
  "full_name": "John Doe"
}

Response: 201 Created
{
  "user_id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "status": "pending_verification"
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!@#"
}

Response: 200 OK
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "user_id": "uuid",
    "email": "user@example.com",
    "roles": ["workspace_member"]
  },
  "mfa_required": false
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "user_id": "uuid",
  "token": "verification-token"
}

Response: 200 OK
{
  "message": "Email verified successfully"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}

Response: 200 OK
{
  "user_id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "status": "active",
  "mfa_enabled": false,
  "roles": ["workspace_member"]
}
```

---

## 🔄 Workflow Examples

### Complete Login Flow
```
1. User enters email/password
2. Submit to useLogin hook
3. authService.login() called
4. Backend validates credentials
5. If valid:
   - Tokens returned (access + refresh)
   - Tokens stored in localStorage
   - Redux state updated
   - Navigate to dashboard
6. If MFA required:
   - Show MFA verification modal
   - Wait for TOTP code
   - Call authService.verifyMFACode()
   - Complete login on success
7. If invalid:
   - Show error message
   - Increment failed attempts
   - If 5 attempts: lock account for 15 min
```

### Session Management Workflow
```
1. User opens Settings > Sessions
2. useSessions hook fetches sessions
3. List displayed with:
   - Device name (Chrome on Windows)
   - Location (Ho Chi Minh, Vietnam)
   - Last activity time
   - Current badge
4. User clicks "Log out" on device
5. revokeSession() called with session_id
6. Backend invalidates session
7. That device receives 401 on next request
8. User redirected to login
```

### MFA Setup Workflow
```
1. User goes to Security Settings
2. Click "Enable 2FA"
3. useMFA.enableMFA() called
4. Backend generates secret + QR code
5. QR code displayed to user
6. User scans with authenticator app
7. User enters 6-digit code
8. useMFA.confirmMFA() called
9. Backend validates and enables MFA
10. 10 backup codes generated and displayed
11. MFA now required on login
```

---

## 🚨 Error Handling

### Common Errors

| Error | Code | Meaning | Solution |
|-------|------|---------|----------|
| Invalid credentials | 401 | Wrong email/password | Check credentials |
| Email not verified | 403 | Email unconfirmed | Check email for verification link |
| Account locked | 403 | Too many attempts | Wait 15 minutes or contact support |
| Email exists | 409 | Email already registered | Use different email or login |
| Invalid token | 401 | Token expired/invalid | Refresh token or login again |
| Rate limited | 429 | Too many requests | Wait before retry |

---

## 📝 Notes

- All tokens are stored in localStorage
- Implement token refresh in production
- Handle token expiration gracefully
- Always use HTTPS in production
- Never log sensitive data
- Clear tokens on logout

---

## 🔗 Related Documentation

- [Module 1 Implementation Guide](docs/MODULE_1_IMPLEMENTATION.md)
- [Deployment Summary](DEPLOYMENT_SUMMARY.md)
- [Visual Architecture](IMPLEMENTATION_VISUAL_SUMMARY.md)
- [API Documentation](http://localhost:8000/docs)

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review example components
3. Check error messages
4. Review API response codes

---

## 📄 License

PronaFlow © 2026 - All Rights Reserved

---

**Status**: Production Ready ✅  
**Last Updated**: February 2, 2026  
**Version**: 1.0
