/**
 * Integration Ecosystem Service
 * Handles API calls for Module 12: Integrations
 */

import axios, { AxiosInstance } from 'axios';
import type {
  ApiToken,
  CreateApiTokenDTO,
  ApiTokenResponse,
  ApiUsageLog,
  WebhookEndpoint,
  CreateWebhookDTO,
  UpdateWebhookDTO,
  WebhookDelivery,
  OAuthApp,
  OAuthConnection,
  Plugin,
  PluginInstallation,
  InstallPluginDTO,
  IntegrationsListResponse,
  PluginMarketplaceResponse,
} from '@/types/integration';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class IntegrationService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== API Tokens ====================
  
  async listApiTokens(userId: string): Promise<ApiToken[]> {
    const response = await this.api.get(`/users/${userId}/api-tokens`);
    return response.data;
  }

  async createApiToken(userId: string, data: CreateApiTokenDTO): Promise<ApiTokenResponse> {
    const response = await this.api.post(`/users/${userId}/api-tokens`, data);
    return response.data;
  }

  async revokeApiToken(userId: string, tokenId: string): Promise<void> {
    await this.api.delete(`/users/${userId}/api-tokens/${tokenId}`);
  }

  async getApiTokenUsage(userId: string, tokenId: string, params?: {
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<ApiUsageLog[]> {
    const response = await this.api.get(`/users/${userId}/api-tokens/${tokenId}/usage`, { params });
    return response.data;
  }

  // ==================== Webhooks ====================
  
  async listWebhooks(workspaceId: string): Promise<WebhookEndpoint[]> {
    const response = await this.api.get(`/workspaces/${workspaceId}/webhooks`);
    return response.data;
  }

  async createWebhook(data: CreateWebhookDTO): Promise<WebhookEndpoint> {
    const response = await this.api.post(`/workspaces/${data.workspace_id}/webhooks`, data);
    return response.data;
  }

  async updateWebhook(
    workspaceId: string,
    webhookId: string,
    data: UpdateWebhookDTO
  ): Promise<WebhookEndpoint> {
    const response = await this.api.patch(`/workspaces/${workspaceId}/webhooks/${webhookId}`, data);
    return response.data;
  }

  async deleteWebhook(workspaceId: string, webhookId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/webhooks/${webhookId}`);
  }

  async getWebhookDeliveries(
    workspaceId: string,
    webhookId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<WebhookDelivery[]> {
    const response = await this.api.get(
      `/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries`,
      { params }
    );
    return response.data;
  }

  async retryWebhookDelivery(
    workspaceId: string,
    webhookId: string,
    deliveryId: string
  ): Promise<void> {
    await this.api.post(
      `/workspaces/${workspaceId}/webhooks/${webhookId}/deliveries/${deliveryId}/retry`
    );
  }

  // ==================== OAuth Connections ====================
  
  async listOAuthApps(): Promise<OAuthApp[]> {
    const response = await this.api.get('/oauth/apps');
    return response.data;
  }

  async listOAuthConnections(userId: string): Promise<OAuthConnection[]> {
    const response = await this.api.get(`/users/${userId}/oauth-connections`);
    return response.data;
  }

  async initiateOAuthFlow(appId: string, redirectUri: string): Promise<{ auth_url: string }> {
    const response = await this.api.post(`/oauth/apps/${appId}/authorize`, { redirect_uri: redirectUri });
    return response.data;
  }

  async revokeOAuthConnection(userId: string, connectionId: string): Promise<void> {
    await this.api.delete(`/users/${userId}/oauth-connections/${connectionId}`);
  }

  async syncOAuthConnection(userId: string, connectionId: string): Promise<void> {
    await this.api.post(`/users/${userId}/oauth-connections/${connectionId}/sync`);
  }

  // ==================== Plugins ====================
  
  async listPluginMarketplace(params?: {
    category?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<PluginMarketplaceResponse> {
    const response = await this.api.get('/plugins/marketplace', { params });
    return response.data;
  }

  async getPluginDetails(pluginId: string): Promise<Plugin> {
    const response = await this.api.get(`/plugins/${pluginId}`);
    return response.data;
  }

  async listInstalledPlugins(workspaceId: string): Promise<PluginInstallation[]> {
    const response = await this.api.get(`/workspaces/${workspaceId}/plugins`);
    return response.data;
  }

  async installPlugin(data: InstallPluginDTO): Promise<PluginInstallation> {
    const response = await this.api.post(`/workspaces/${data.workspace_id}/plugins`, data);
    return response.data;
  }

  async uninstallPlugin(workspaceId: string, installationId: string): Promise<void> {
    await this.api.delete(`/workspaces/${workspaceId}/plugins/${installationId}`);
  }

  async togglePlugin(workspaceId: string, installationId: string, enabled: boolean): Promise<void> {
    await this.api.patch(`/workspaces/${workspaceId}/plugins/${installationId}`, {
      is_enabled: enabled,
    });
  }

  async updatePluginConfig(
    workspaceId: string,
    installationId: string,
    config: Record<string, any>
  ): Promise<void> {
    await this.api.patch(`/workspaces/${workspaceId}/plugins/${installationId}/config`, { config });
  }

  // ==================== All Integrations Overview ====================
  
  async getIntegrationsOverview(userId: string, workspaceId: string): Promise<IntegrationsListResponse> {
    const response = await this.api.get(`/integrations/overview`, {
      params: { user_id: userId, workspace_id: workspaceId },
    });
    return response.data;
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
