/**
 * Integration Ecosystem Custom Hooks
 * React Query hooks for API Tokens, Webhooks, OAuth, Plugins
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationService } from '@/services/integrationService';
import type {
  CreateApiTokenDTO,
  CreateWebhookDTO,
  UpdateWebhookDTO,
  InstallPluginDTO,
} from '@/types/integration';
import { toast } from 'sonner';

// ==================== API Tokens ====================

export const useApiTokens = (userId: string) => {
  return useQuery({
    queryKey: ['api-tokens', userId],
    queryFn: () => integrationService.listApiTokens(userId),
    enabled: !!userId,
  });
};

export const useCreateApiToken = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateApiTokenDTO) => integrationService.createApiToken(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens', userId] });
      toast.success('Personal Access Token created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create token');
    },
  });
};

export const useRevokeApiToken = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tokenId: string) => integrationService.revokeApiToken(userId, tokenId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-tokens', userId] });
      toast.success('Token revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke token');
    },
  });
};

export const useApiTokenUsage = (userId: string, tokenId: string) => {
  return useQuery({
    queryKey: ['api-token-usage', userId, tokenId],
    queryFn: () => integrationService.getApiTokenUsage(userId, tokenId),
    enabled: !!userId && !!tokenId,
  });
};

// ==================== Webhooks ====================

export const useWebhooks = (workspaceId: string) => {
  return useQuery({
    queryKey: ['webhooks', workspaceId],
    queryFn: () => integrationService.listWebhooks(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWebhookDTO) => integrationService.createWebhook(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', variables.workspace_id] });
      toast.success('Webhook created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create webhook');
    },
  });
};

export const useUpdateWebhook = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ webhookId, data }: { webhookId: string; data: UpdateWebhookDTO }) =>
      integrationService.updateWebhook(workspaceId, webhookId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', workspaceId] });
      toast.success('Webhook updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update webhook');
    },
  });
};

export const useDeleteWebhook = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (webhookId: string) => integrationService.deleteWebhook(workspaceId, webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', workspaceId] });
      toast.success('Webhook deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete webhook');
    },
  });
};

export const useWebhookDeliveries = (workspaceId: string, webhookId: string) => {
  return useQuery({
    queryKey: ['webhook-deliveries', workspaceId, webhookId],
    queryFn: () => integrationService.getWebhookDeliveries(workspaceId, webhookId),
    enabled: !!workspaceId && !!webhookId,
  });
};

export const useRetryWebhookDelivery = (workspaceId: string, webhookId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deliveryId: string) =>
      integrationService.retryWebhookDelivery(workspaceId, webhookId, deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries', workspaceId, webhookId] });
      toast.success('Delivery retry initiated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to retry delivery');
    },
  });
};

// ==================== OAuth Connections ====================

export const useOAuthApps = () => {
  return useQuery({
    queryKey: ['oauth-apps'],
    queryFn: () => integrationService.listOAuthApps(),
  });
};

export const useOAuthConnections = (userId: string) => {
  return useQuery({
    queryKey: ['oauth-connections', userId],
    queryFn: () => integrationService.listOAuthConnections(userId),
    enabled: !!userId,
  });
};

export const useRevokeOAuthConnection = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (connectionId: string) => integrationService.revokeOAuthConnection(userId, connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-connections', userId] });
      toast.success('Connection revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to revoke connection');
    },
  });
};

export const useSyncOAuthConnection = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (connectionId: string) => integrationService.syncOAuthConnection(userId, connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oauth-connections', userId] });
      toast.success('Sync initiated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to sync');
    },
  });
};

// ==================== Plugins ====================

export const usePluginMarketplace = (params?: {
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery({
    queryKey: ['plugin-marketplace', params],
    queryFn: () => integrationService.listPluginMarketplace(params),
  });
};

export const usePluginDetails = (pluginId: string) => {
  return useQuery({
    queryKey: ['plugin-details', pluginId],
    queryFn: () => integrationService.getPluginDetails(pluginId),
    enabled: !!pluginId,
  });
};

export const useInstalledPlugins = (workspaceId: string) => {
  return useQuery({
    queryKey: ['installed-plugins', workspaceId],
    queryFn: () => integrationService.listInstalledPlugins(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useInstallPlugin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InstallPluginDTO) => integrationService.installPlugin(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['installed-plugins', variables.workspace_id] });
      toast.success('Plugin installed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to install plugin');
    },
  });
};

export const useUninstallPlugin = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (installationId: string) =>
      integrationService.uninstallPlugin(workspaceId, installationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['installed-plugins', workspaceId] });
      toast.success('Plugin uninstalled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to uninstall plugin');
    },
  });
};

export const useTogglePlugin = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ installationId, enabled }: { installationId: string; enabled: boolean }) =>
      integrationService.togglePlugin(workspaceId, installationId, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['installed-plugins', workspaceId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to toggle plugin');
    },
  });
};

// ==================== Overview ====================

export const useIntegrationsOverview = (userId: string, workspaceId: string) => {
  return useQuery({
    queryKey: ['integrations-overview', userId, workspaceId],
    queryFn: () => integrationService.getIntegrationsOverview(userId, workspaceId),
    enabled: !!userId && !!workspaceId,
  });
};
