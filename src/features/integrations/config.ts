import { ROUTES } from '@/routes/paths';

export interface IntegrationCategoryConfig {
  id: 'api-tokens' | 'webhooks' | 'connected-apps' | 'plugins';
  title: string;
  description: string;
  color: string;
  route: string;
}

export interface IntegrationQuickActionConfig {
  id: 'create-token' | 'create-webhook' | 'connect-app';
  title: string;
  description: string;
}

export const INTEGRATION_CATEGORIES: IntegrationCategoryConfig[] = [
  {
    id: 'api-tokens',
    title: 'API Access Tokens',
    description: 'Quản lý Personal Access Tokens cho việc tích hợp tự động',
    color: 'bg-indigo-500',
    route: ROUTES.integrations.apiTokens,
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Cấu hình thông báo sự kiện theo thời gian thực',
    color: 'bg-orange-500',
    route: ROUTES.integrations.webhooks,
  },
  {
    id: 'connected-apps',
    title: 'Connected Apps',
    description: 'Kết nối với Google Calendar, GitHub, Slack và các dịch vụ khác',
    color: 'bg-emerald-500',
    route: ROUTES.integrations.connectedApps,
  },
  {
    id: 'plugins',
    title: 'Plugin Marketplace',
    description: 'Khám phá và cài đặt các tiện ích mở rộng',
    color: 'bg-purple-500',
    route: ROUTES.integrations.plugins,
  },
];

export const INTEGRATION_QUICK_ACTIONS: IntegrationQuickActionConfig[] = [
  {
    id: 'create-token',
    title: 'Tạo API Token mới',
    description: 'Khởi tạo token để tích hợp với hệ thống bên ngoài',
  },
  {
    id: 'create-webhook',
    title: 'Thêm Webhook',
    description: 'Đăng ký nhận thông báo sự kiện',
  },
  {
    id: 'connect-app',
    title: 'Kết nối ứng dụng',
    description: 'Liên kết với Google, GitHub, Slack...',
  },
];
