# Frontend API Integration Guide

## 📚 Overview

The PronaFlow Frontend is built with React + Vite and integrates with the FastAPI backend through a comprehensive set of API services. This document details how API communication is handled.

## 🏗️ Architecture

```
React Frontend
    ↓
Service Layer (API Clients)
    ↓
Axios HTTP Client
    ↓
FastAPI Backend
    ↓
Database & External Services
```

## 🔌 API Services

### 1. Authentication Service (`authService.ts`)

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify-email` - Email verification
- `POST /auth/request-password-reset` - Password reset request
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update user profile
- `POST /auth/mfa/verify` - Verify MFA code

**Usage:**
```typescript
import { authService } from '@/services';

// Login
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Save token
localStorage.setItem('access_token', result.access_token);

// Get current user
const user = await authService.getCurrentUser();
```

### 2. Workspace Service (`workspaceService.ts`)

**Endpoints:**
- `GET /workspaces` - List all workspaces
- `POST /workspaces` - Create workspace
- `GET /workspaces/{id}` - Get workspace details
- `PUT /workspaces/{id}` - Update workspace
- `DELETE /workspaces/{id}` - Delete workspace
- `GET /workspaces/{id}/members` - Get workspace members
- `POST /workspaces/{id}/members` - Invite member
- `DELETE /workspaces/{id}/members/{member_id}` - Remove member

**Usage:**
```typescript
import { workspaceService } from '@/services';

// Create workspace
const workspace = await workspaceService.createWorkspace({
  name: 'My Workspace',
  description: 'Team workspace'
});

// Get workspace members
const members = await workspaceService.getMembers(workspace.id);

// Invite member
await workspaceService.inviteMember(workspace.id, 'user@example.com');
```

### 3. Project Service (`projectService.ts`)

**Endpoints:**
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/{id}` - Get project details
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project
- `GET /projects/{id}/tasks` - Get project tasks
- `GET /projects/{id}/analytics` - Get project analytics

**Usage:**
```typescript
import { projectService } from '@/services';

// Create project
const project = await projectService.createProject({
  workspace_id: 'ws-123',
  name: 'New Project',
  description: 'Project description'
});

// Get project tasks
const tasks = await projectService.getTasks(project.id);

// Get analytics
const analytics = await projectService.getAnalytics(project.id);
```

### 4. Task Service (`taskService.ts`)

**Endpoints:**
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/{id}` - Get task details
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task
- `PUT /tasks/{id}/status` - Update task status
- `POST /tasks/{id}/subtasks` - Create subtask
- `PUT /tasks/{id}/assign` - Assign task

**Usage:**
```typescript
import { taskService } from '@/services';

// Create task
const task = await taskService.createTask({
  project_id: 'proj-123',
  title: 'Implement feature',
  description: 'Feature description',
  priority: 'high'
});

// Update status
await taskService.updateStatus(task.id, 'in_progress');

// Assign task
await taskService.assignTask(task.id, 'user-123');
```

### 5. Notification Service (`notificationService.ts`)

**Endpoints:**
- `GET /notifications` - Get notifications
- `POST /notifications/{id}/read` - Mark as read
- `DELETE /notifications/{id}` - Delete notification
- `GET /notifications/preferences` - Get preferences
- `PUT /notifications/preferences` - Update preferences

**Usage:**
```typescript
import { notificationService } from '@/services';

// Get notifications
const notifications = await notificationService.getNotifications({
  limit: 20,
  offset: 0
});

// Mark as read
await notificationService.markAsRead(notification.id);

// Update preferences
await notificationService.updatePreferences({
  email_notifications: true,
  push_notifications: true
});
```

### 6. Analytics Service (`analyticsService.ts`)

**Endpoints:**
- `GET /analytics/projects` - Project metrics
- `GET /analytics/tasks` - Task metrics
- `GET /analytics/team` - Team performance
- `GET /analytics/custom` - Custom reports

**Usage:**
```typescript
import { analyticsService } from '@/services';

// Get project metrics
const metrics = await analyticsService.getProjectMetrics(project.id);

// Get team performance
const teamStats = await analyticsService.getTeamPerformance(workspace.id);
```

### 7. Integration Service (`integrationService.ts`)

**Endpoints:**
- `GET /integrations` - List integrations
- `POST /integrations` - Add integration
- `DELETE /integrations/{id}` - Remove integration
- `POST /integrations/{id}/sync` - Sync integration
- `GET /integrations/webhooks` - Get webhooks

**Usage:**
```typescript
import { integrationService } from '@/services';

// List integrations
const integrations = await integrationService.getIntegrations();

// Add integration
const integration = await integrationService.addIntegration({
  provider: 'slack',
  api_key: 'xoxb-...'
});
```

## 🔐 Authentication & Security

### Token Management

```typescript
// Token stored in localStorage
const token = localStorage.getItem('access_token');

// Automatically included in requests
axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Token refresh on expiry
if (response.status === 401) {
  // Automatically refresh token and retry
  const newToken = await authService.refreshToken();
  localStorage.setItem('access_token', newToken);
}
```

### CORS Headers

The frontend expects these CORS headers from backend:

```
Access-Control-Allow-Origin: https://app.pronaflow.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 🚀 HTTP Client Configuration

### Axios Client (`lib/axiosClient.ts`)

**Base Configuration:**
```typescript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    throw error;
  }
);

export default axiosClient;
```

## 📤 Request/Response Examples

### GET Request

```typescript
// Fetch workspace
const response = await axiosClient.get(`/workspaces/${wsId}`);

// Response
{
  workspace_id: 'ws-123',
  name: 'Engineering',
  owner_id: 'user-456',
  created_at: '2024-01-15T10:30:00Z',
  members_count: 5
}
```

### POST Request

```typescript
// Create task
const response = await axiosClient.post('/tasks', {
  project_id: 'proj-123',
  title: 'Build login page',
  description: 'Create login authentication',
  priority: 'high',
  due_date: '2024-02-15'
});

// Response
{
  task_id: 'task-789',
  project_id: 'proj-123',
  status: 'todo',
  created_at: '2024-01-15T10:30:00Z'
}
```

### PUT Request

```typescript
// Update task
const response = await axiosClient.put(`/tasks/${taskId}`, {
  status: 'in_progress',
  assigned_to: 'user-456'
});
```

### DELETE Request

```typescript
// Delete notification
await axiosClient.delete(`/notifications/${notificationId}`);
```

## ⚙️ Configuration

### Environment Variables

```env
# Required
VITE_API_URL=https://api.pronaflow.com/api/v1

# Optional
VITE_API_TIMEOUT=30000
VITE_AI_SERVICE_URL=https://ai-service.pronaflow.com/api/v1
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### Runtime Configuration

```typescript
// Get API URL
const apiUrl = import.meta.env.VITE_API_URL;

// Check if feature enabled
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
```

## 🔍 Error Handling

### HTTP Error Responses

```typescript
try {
  await taskService.createTask(data);
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error
    console.error('Validation errors:', error.response.data.details);
  } else if (error.response?.status === 401) {
    // Unauthorized - token expired
  } else if (error.response?.status === 403) {
    // Forbidden - insufficient permissions
  } else if (error.response?.status === 404) {
    // Not found
  } else if (error.response?.status === 500) {
    // Server error
  }
}
```

## 📡 Real-time Features

### WebSocket Integration

For real-time notifications and updates:

```typescript
// Connect to WebSocket
const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    token: localStorage.getItem('access_token')
  }
});

// Listen for notifications
socket.on('notification:new', (data) => {
  console.log('New notification:', data);
});

// Listen for task updates
socket.on('task:updated', (data) => {
  console.log('Task updated:', data);
});
```

## 🧪 Testing API Integration

### Mock API Responses

```typescript
// Mock service for testing
import { vitest } from 'vitest';

vitest.mock('@/services/taskService', () => ({
  createTask: vitest.fn().mockResolvedValue({
    task_id: 'test-123',
    title: 'Test Task',
    status: 'todo'
  })
}));
```

## 📊 API Monitoring

### Logging

```typescript
// Enable debug logging
import { setLogLevel } from '@/lib/logger';
setLogLevel('debug');

// Log requests
axiosClient.interceptors.request.use((config) => {
  console.log('Request:', config);
  return config;
});

// Log responses
axiosClient.interceptors.response.use((response) => {
  console.log('Response:', response);
  return response;
});
```

## 🔗 Related Documentation

- [Backend API Documentation](../../docs/backend)
- [Frontend Architecture](../STRUCTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Configuration](../../configs)
