# 📦 Module 12: Integration Ecosystem - Frontend Implementation

**Version**: 1.0  
**Last Updated**: February 3, 2026  
**Status**: ✅ Complete

---

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
3. [Tính năng đã triển khai](#tính-năng-đã-triển-khai)
4. [API Reference](#api-reference)
5. [Components](#components)
6. [Hooks](#hooks)
7. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
8. [Best Practices](#best-practices)

---

## 🎯 Tổng quan

Module Integration Ecosystem cung cấp khả năng kết nối PronaFlow với các hệ thống bên ngoài thông qua:

- **API Access Tokens (PAT)**: Personal Access Tokens với scopes-based permissions
- **Webhooks**: Event-driven notifications với HMAC signing
- **OAuth Connections**: Kết nối với Google, GitHub, Slack, và các dịch vụ khác
- **Plugin Marketplace**: Cài đặt và quản lý plugins mở rộng

---

## 📁 Cấu trúc thư mục

```
src/
├── features/integrations/
│   ├── pages/
│   │   ├── IntegrationsPage.tsx          # Dashboard tổng quan
│   │   ├── ApiTokensPage.tsx             # Quản lý PAT
│   │   ├── WebhooksPage.tsx              # Quản lý Webhooks
│   │   ├── ConnectedAppsPage.tsx         # OAuth Connections
│   │   └── PluginMarketplacePage.tsx     # Plugin Marketplace
│   └── index.ts                          # Exports
├── hooks/
│   └── useIntegrations.ts                # Custom React Query hooks
├── services/
│   └── integrationService.ts             # API client
└── types/
    └── integration.ts                    # TypeScript types
```

---

## ✅ Tính năng đã triển khai

### 1. API Access Tokens (PAT)

#### ✓ Features
- [x] Tạo Personal Access Token với scopes
- [x] Danh sách tokens hiện có
- [x] Thu hồi (revoke) token
- [x] Copy token một lần sau khi tạo
- [x] Xem lịch sử sử dụng
- [x] Cấu hình expiration date

#### 🎨 UI Components
- Token creation modal với scope selector
- Token list với status badges (Active/Revoked)
- Security warnings
- One-time token display với copy button

#### 📊 Scopes Available
- `read:tasks`, `write:tasks`, `delete:tasks`
- `read:projects`, `write:projects`, `delete:projects`
- `read:workspace`, `write:workspace`
- `admin:all`

---

### 2. Webhooks

#### ✓ Features
- [x] Tạo webhook endpoint
- [x] Cấu hình event subscriptions
- [x] HMAC secret key generation
- [x] Enable/Disable webhooks
- [x] Xem delivery history
- [x] Retry failed deliveries

#### 🎨 UI Components
- Webhook configuration modal
- Event selector với descriptions
- Secret key display với copy
- Delivery logs viewer

#### 📡 Supported Events
- `task.created`, `task.updated`, `task.status_changed`, `task.deleted`
- `comment.created`
- `project.created`, `project.updated`
- `member.added`, `member.removed`

---

### 3. Connected Apps (OAuth)

#### ✓ Features
- [x] Danh sách ứng dụng khả dụng
- [x] OAuth2 authorization flow
- [x] Revoke connections
- [x] Sync data manually
- [x] View connection status

#### 🎨 UI Components
- App cards với verified badges
- Connection status indicators
- Sync buttons
- OAuth flow redirect handling

#### 🔗 Supported Providers
- Google Calendar 📅
- GitHub 🐙
- GitLab 🦊
- Slack 💬
- Figma 🎨
- Microsoft 365 🏢

---

### 4. Plugin Marketplace

#### ✓ Features
- [x] Browse plugin marketplace
- [x] Search và filter theo category
- [x] Install/Uninstall plugins
- [x] Enable/Disable plugins
- [x] View installed plugins
- [x] Plugin ratings và downloads

#### 🎨 UI Components
- Plugin cards với banners
- Marketplace tabs (Browse/Installed)
- Category filters
- Search bar
- Install progress indicators

#### 🔌 Plugin Categories
- Productivity, Reporting, Communication
- Analytics, AI/ML, Visualization
- Automation, Security, Utilities

---

## 🔌 API Reference

### IntegrationService

#### API Tokens
```typescript
integrationService.listApiTokens(userId: string): Promise<ApiToken[]>
integrationService.createApiToken(userId: string, data: CreateApiTokenDTO): Promise<ApiTokenResponse>
integrationService.revokeApiToken(userId: string, tokenId: string): Promise<void>
integrationService.getApiTokenUsage(userId: string, tokenId: string): Promise<ApiUsageLog[]>
```

#### Webhooks
```typescript
integrationService.listWebhooks(workspaceId: string): Promise<WebhookEndpoint[]>
integrationService.createWebhook(data: CreateWebhookDTO): Promise<WebhookEndpoint>
integrationService.updateWebhook(workspaceId: string, webhookId: string, data: UpdateWebhookDTO): Promise<WebhookEndpoint>
integrationService.deleteWebhook(workspaceId: string, webhookId: string): Promise<void>
integrationService.getWebhookDeliveries(workspaceId: string, webhookId: string): Promise<WebhookDelivery[]>
```

#### OAuth Connections
```typescript
integrationService.listOAuthApps(): Promise<OAuthApp[]>
integrationService.listOAuthConnections(userId: string): Promise<OAuthConnection[]>
integrationService.initiateOAuthFlow(appId: string, redirectUri: string): Promise<{ auth_url: string }>
integrationService.revokeOAuthConnection(userId: string, connectionId: string): Promise<void>
integrationService.syncOAuthConnection(userId: string, connectionId: string): Promise<void>
```

#### Plugins
```typescript
integrationService.listPluginMarketplace(params?: {...}): Promise<PluginMarketplaceResponse>
integrationService.getPluginDetails(pluginId: string): Promise<Plugin>
integrationService.listInstalledPlugins(workspaceId: string): Promise<PluginInstallation[]>
integrationService.installPlugin(data: InstallPluginDTO): Promise<PluginInstallation>
integrationService.uninstallPlugin(workspaceId: string, installationId: string): Promise<void>
integrationService.togglePlugin(workspaceId: string, installationId: string, enabled: boolean): Promise<void>
```

---

## 🎣 Hooks

### API Tokens
```typescript
const { data: tokens } = useApiTokens(userId);
const createToken = useCreateApiToken(userId);
const revokeToken = useRevokeApiToken(userId);
const { data: usage } = useApiTokenUsage(userId, tokenId);
```

### Webhooks
```typescript
const { data: webhooks } = useWebhooks(workspaceId);
const createWebhook = useCreateWebhook();
const updateWebhook = useUpdateWebhook(workspaceId);
const deleteWebhook = useDeleteWebhook(workspaceId);
const { data: deliveries } = useWebhookDeliveries(workspaceId, webhookId);
const retryDelivery = useRetryWebhookDelivery(workspaceId, webhookId);
```

### OAuth Connections
```typescript
const { data: apps } = useOAuthApps();
const { data: connections } = useOAuthConnections(userId);
const revokeConnection = useRevokeOAuthConnection(userId);
const syncConnection = useSyncOAuthConnection(userId);
```

### Plugins
```typescript
const { data: marketplace } = usePluginMarketplace(params);
const { data: plugin } = usePluginDetails(pluginId);
const { data: installed } = useInstalledPlugins(workspaceId);
const installPlugin = useInstallPlugin();
const uninstallPlugin = useUninstallPlugin(workspaceId);
const togglePlugin = useTogglePlugin(workspaceId);
```

---

## 📖 Hướng dẫn sử dụng

### 1. Tạo API Token

```typescript
import { useCreateApiToken } from '@/hooks/useIntegrations';

const CreateTokenExample = () => {
  const userId = localStorage.getItem('user_id');
  const createToken = useCreateApiToken(userId);

  const handleCreate = async () => {
    const result = await createToken.mutateAsync({
      name: 'CI/CD Pipeline',
      scopes: ['read:tasks', 'write:tasks'],
      expires_in_days: 365
    });
    
    // result.token chỉ hiển thị 1 lần
    console.log('Token:', result.token);
  };
};
```

### 2. Tạo Webhook

```typescript
import { useCreateWebhook } from '@/hooks/useIntegrations';

const CreateWebhookExample = () => {
  const workspaceId = localStorage.getItem('current_workspace_id');
  const createWebhook = useCreateWebhook();

  const handleCreate = async () => {
    await createWebhook.mutateAsync({
      workspace_id: workspaceId,
      name: 'Slack Notifications',
      target_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL',
      events: ['task.created', 'task.status_changed']
    });
  };
};
```

### 3. Kết nối OAuth App

```typescript
import { integrationService } from '@/services/integrationService';

const ConnectGoogleCalendar = async () => {
  const appId = 'google-calendar-app-id';
  const redirectUri = `${window.location.origin}/integrations/oauth/callback`;
  
  const { auth_url } = await integrationService.initiateOAuthFlow(appId, redirectUri);
  
  // Redirect to OAuth provider
  window.location.href = auth_url;
};
```

### 4. Install Plugin

```typescript
import { useInstallPlugin } from '@/hooks/useIntegrations';

const InstallPluginExample = () => {
  const workspaceId = localStorage.getItem('current_workspace_id');
  const installPlugin = useInstallPlugin();

  const handleInstall = async (pluginId: string) => {
    await installPlugin.mutateAsync({
      plugin_id: pluginId,
      workspace_id: workspaceId,
      config: {
        // Plugin-specific configuration
      }
    });
  };
};
```

---

## 🛡️ Best Practices

### Security

1. **API Tokens**
   - Luôn sử dụng scopes tối thiểu cần thiết (Principle of Least Privilege)
   - Set expiration date cho tokens
   - Rotate tokens định kỳ
   - Không commit tokens vào Git

2. **Webhooks**
   - Verify HMAC signature trong webhook handler
   - Sử dụng HTTPS cho webhook endpoints
   - Implement idempotency trong webhook handler
   - Log và monitor webhook failures

3. **OAuth**
   - Không lưu access tokens ở localStorage
   - Implement token refresh logic
   - Handle token expiration gracefully
   - Review permissions trước khi grant

### Performance

1. **Lazy Loading**
   - Load plugin marketplace on demand
   - Paginate webhook delivery history
   - Cache OAuth app list

2. **Error Handling**
   - Retry failed webhook deliveries với exponential backoff
   - Show user-friendly error messages
   - Log errors cho debugging

### UX

1. **Feedback**
   - Toast notifications cho mọi actions
   - Loading states trong buttons
   - Confirmation dialogs cho destructive actions

2. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Color contrast compliance

---

## 🔗 Routes

```typescript
/integrations                    // Dashboard overview
/integrations/api-tokens         // API Token management
/integrations/webhooks           // Webhook configuration
/integrations/connected-apps     // OAuth connections
/integrations/plugins            // Plugin marketplace
```

---

## 🎨 Design System Compliance

Tất cả components tuân thủ PronaFlow Design System:

- **Colors**: Indigo (API), Orange (Webhooks), Emerald (OAuth), Purple (Plugins)
- **Typography**: Inter font family
- **Spacing**: 4px grid system
- **Dark Mode**: Full support với dark: variants
- **Icons**: Lucide React icons
- **Animations**: Tailwind transitions

---

## 📊 Related Documentation

- [API Documentation V1.2](../../../docs/API_DOCUMENTATION_V1.2.md)
- [Functional Requirements](../../../docs/docs%20-%20PronaFlow%20React&FastAPI/01-Requirements/Functional-Modules/12%20-%20Integration%20Ecosystem.md)
- [Entity Relationship Diagram](../../../docs/docs%20-%20PronaFlow%20React&FastAPI/02-Architeture/Entity%20Relationship%20Diagram%20-%20Details/Functional%20Module%2012%20-%20Integration%20Ecosystem.md)

---

## 🚀 Deployment Status

| Feature | Status | Notes |
|---------|--------|-------|
| API Tokens UI | ✅ Complete | Full CRUD operations |
| Webhooks UI | ✅ Complete | Event subscriptions & deliveries |
| Connected Apps UI | ✅ Complete | OAuth2 flow |
| Plugin Marketplace UI | ✅ Complete | Browse & install |
| Routes | ✅ Complete | Integrated in App.tsx |
| Sidebar Navigation | ✅ Complete | "Integrations" menu item |
| TypeScript Types | ✅ Complete | Full type coverage |
| API Service | ✅ Complete | All endpoints implemented |
| React Query Hooks | ✅ Complete | All hooks with error handling |

---

**Prepared by**: PronaFlow Development Team  
**Module Owner**: Integration Team  
**Support**: integration@pronaflow.com
