/**
 * Integration Ecosystem Types
 * Module 12: API Tokens, Webhooks, OAuth Connections, Plugins
 */

// ==================== API Token Types ====================
export type ApiScope = 
  | 'read:tasks' 
  | 'write:tasks' 
  | 'delete:tasks'
  | 'read:projects' 
  | 'write:projects' 
  | 'delete:projects'
  | 'read:workspace' 
  | 'write:workspace'
  | 'admin:all';

export interface ApiToken {
  token_id: string;
  user_id: string;
  workspace_id?: string;
  name: string;
  token_hash: string;
  last_used_at?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  scopes: ApiScope[];
}

export interface CreateApiTokenDTO {
  name: string;
  workspace_id?: string;
  scopes: ApiScope[];
  expires_in_days?: number; // Optional expiration
}

export interface ApiTokenResponse {
  token_id: string;
  name: string;
  token: string; // Plain token shown ONLY once
  scopes: ApiScope[];
  expires_at?: string;
  created_at: string;
}

export interface ApiUsageLog {
  log_id: string;
  token_id: string;
  endpoint: string;
  http_method: string;
  status_code: number;
  request_at: string;
  ip_address?: string;
  user_agent?: string;
}

// ==================== Webhook Types ====================
export type WebhookEventType = 
  | 'task.created'
  | 'task.updated'
  | 'task.status_changed'
  | 'task.deleted'
  | 'comment.created'
  | 'project.created'
  | 'project.updated'
  | 'member.added'
  | 'member.removed';

export interface WebhookEndpoint {
  webhook_id: string;
  workspace_id: string;
  name: string;
  target_url: string;
  secret_key: string; // HMAC signing secret
  is_active: boolean;
  created_at: string;
  updated_at: string;
  events: WebhookEventType[];
}

export interface CreateWebhookDTO {
  workspace_id: string;
  name: string;
  target_url: string;
  events: WebhookEventType[];
}

export interface UpdateWebhookDTO {
  name?: string;
  target_url?: string;
  is_active?: boolean;
  events?: WebhookEventType[];
}

export interface WebhookDelivery {
  delivery_id: string;
  webhook_id: string;
  event_type: WebhookEventType;
  payload: Record<string, any>;
  response_code?: number;
  response_body?: string;
  error_message?: string;
  attempt_count: number;
  delivered_at?: string;
  created_at: string;
}

// ==================== OAuth Connection Types ====================
export type OAuthProvider = 
  | 'google' 
  | 'github' 
  | 'gitlab' 
  | 'slack'
  | 'figma'
  | 'microsoft';

export interface OAuthApp {
  app_id: string;
  provider: OAuthProvider;
  name: string;
  description: string;
  icon_url: string;
  website_url: string;
  client_id: string;
  // client_secret is never exposed to frontend
  scopes: string[];
  is_verified: boolean; // PronaFlow verified
}

export interface OAuthConnection {
  connection_id: string;
  user_id: string;
  app_id: string;
  provider: OAuthProvider;
  access_token: string; // Encrypted
  refresh_token?: string;
  token_expires_at?: string;
  scopes: string[];
  is_active: boolean;
  connected_at: string;
  last_synced_at?: string;
  app?: OAuthApp;
}

export interface IntegrationBinding {
  binding_id: string;
  connection_id: string;
  internal_entity: 'task' | 'project' | 'event';
  internal_id: string;
  external_entity: string;
  external_id: string;
  sync_direction: 'one_way' | 'bi_directional';
  created_at: string;
}

// ==================== Plugin Types ====================
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  repository?: string;
  license: string;
  entry_url: string;
  permissions: string[];
  ui_anchors: string[]; // Where plugin can render: 'task_detail_sidebar', 'project_header', etc.
  config_schema?: Record<string, any>;
}

export interface Plugin {
  plugin_id: string;
  name: string;
  slug: string;
  version: string;
  author: string;
  description: string;
  icon_url?: string;
  banner_url?: string;
  manifest: PluginManifest;
  is_verified: boolean; // PronaFlow verified
  is_published: boolean;
  download_count: number;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface PluginInstallation {
  installation_id: string;
  plugin_id: string;
  workspace_id: string;
  user_id: string;
  config: Record<string, any>;
  is_enabled: boolean;
  installed_at: string;
  plugin?: Plugin;
}

export interface InstallPluginDTO {
  plugin_id: string;
  workspace_id: string;
  config?: Record<string, any>;
}

// ==================== Consent Types ====================
export interface ConsentGrant {
  consent_id: string;
  user_id: string;
  app_id: string;
  scopes: string[];
  granted_at: string;
  expires_at?: string;
}

// ==================== API Response Types ====================
export interface IntegrationsListResponse {
  api_tokens: ApiToken[];
  webhooks: WebhookEndpoint[];
  oauth_connections: OAuthConnection[];
  plugins: PluginInstallation[];
}

export interface PluginMarketplaceResponse {
  plugins: Plugin[];
  total: number;
  page: number;
  page_size: number;
  categories: string[];
}
