/**
 * Connected Apps Page
 * Module 12: OAuth2 Connection Management
 */

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Unlink,
  RefreshCw,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { useOAuthApps, useOAuthConnections, useRevokeOAuthConnection, useSyncOAuthConnection } from '@/hooks/useIntegrations';
import type { OAuthProvider } from '@/types/integration';
import { format } from 'date-fns';
import { integrationService } from '@/services/integrationService';
import { toast } from 'sonner';

const PROVIDER_INFO: Record<OAuthProvider, { name: string; color: string; logo: string; website: string }> = {
  google: {
    name: 'Google Calendar',
    color: 'bg-red-500',
    logo: '📅',
    website: 'https://calendar.google.com',
  },
  github: {
    name: 'GitHub',
    color: 'bg-gray-800',
    logo: '🐙',
    website: 'https://github.com',
  },
  gitlab: {
    name: 'GitLab',
    color: 'bg-orange-600',
    logo: '🦊',
    website: 'https://gitlab.com',
  },
  slack: {
    name: 'Slack',
    color: 'bg-purple-600',
    logo: '💬',
    website: 'https://slack.com',
  },
  figma: {
    name: 'Figma',
    color: 'bg-pink-500',
    logo: '🎨',
    website: 'https://figma.com',
  },
  microsoft: {
    name: 'Microsoft 365',
    color: 'bg-blue-600',
    logo: '🏢',
    website: 'https://microsoft.com',
  },
};

const ConnectedAppsPage: React.FC = () => {
  const userId = localStorage.getItem('user_id') || '';
  const { data: availableApps = [], isLoading: appsLoading } = useOAuthApps();
  const { data: connections = [], isLoading: connectionsLoading } = useOAuthConnections(userId);
  const revokeConnection = useRevokeOAuthConnection(userId);
  const syncConnection = useSyncOAuthConnection(userId);

  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (appId: string, provider: OAuthProvider) => {
    setConnecting(appId);
    try {
      const redirectUri = `${window.location.origin}/integrations/oauth/callback`;
      const { auth_url } = await integrationService.initiateOAuthFlow(appId, redirectUri);
      
      // Redirect to OAuth provider
      window.location.href = auth_url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate OAuth flow');
      setConnecting(null);
    }
  };

  const handleRevoke = async (connectionId: string, appName: string) => {
    if (confirm(`Bạn có chắc muốn ngắt kết nối với ${appName}?`)) {
      try {
        await revokeConnection.mutateAsync(connectionId);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleSync = async (connectionId: string) => {
    try {
      await syncConnection.mutateAsync(connectionId);
    } catch (error) {
      // Error handled by hook
    }
  };

  const isConnected = (appId: string) => {
    return connections.some(conn => conn.app_id === appId && conn.is_active);
  };

  const getConnection = (appId: string) => {
    return connections.find(conn => conn.app_id === appId && conn.is_active);
  };

  if (appsLoading || connectionsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Connected Apps
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Kết nối PronaFlow với các ứng dụng và dịch vụ bên thứ ba
        </p>
      </div>

      {/* Security Info */}
      <div className="mb-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-1">
              OAuth 2.0 Authorization
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              Tất cả kết nối sử dụng OAuth 2.0 tiêu chuẩn công nghiệp. PronaFlow không bao giờ lưu trữ mật khẩu của bạn. 
              Bạn có thể thu hồi quyền truy cập bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </div>

      {/* Available Apps Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Ứng dụng khả dụng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableApps.map((app) => {
            const connected = isConnected(app.app_id);
            const connection = getConnection(app.app_id);
            const providerInfo = PROVIDER_INFO[app.provider];

            return (
              <div
                key={app.app_id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`${providerInfo.color} p-3 rounded-lg text-white text-2xl`}>
                      {providerInfo.logo}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {app.name}
                      </h3>
                      {app.is_verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified by PronaFlow
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {connected && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {app.description}
                </p>

                {connected && connection ? (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Connected: {format(new Date(connection.connected_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {connection.last_synced_at && (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-3 h-3" />
                          Last synced: {format(new Date(connection.last_synced_at), 'MMM dd, yyyy HH:mm')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(connection.connection_id)}
                        disabled={syncConnection.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </button>
                      <button
                        onClick={() => handleRevoke(connection.connection_id, app.name)}
                        disabled={revokeConnection.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Unlink className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500">
                      Scopes: {app.scopes.join(', ')}
                    </div>
                    <button
                      onClick={() => handleConnect(app.app_id, app.provider)}
                      disabled={connecting === app.app_id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {connecting === app.app_id ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                )}

                <a
                  href={providerInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit {providerInfo.name}
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Connections Summary */}
      {connections.filter(c => c.is_active).length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Kết nối đang hoạt động ({connections.filter(c => c.is_active).length})
          </h2>
          <div className="space-y-3">
            {connections
              .filter(c => c.is_active)
              .map((conn) => {
                const app = availableApps.find(a => a.app_id === conn.app_id);
                if (!app) return null;
                const providerInfo = PROVIDER_INFO[conn.provider];

                return (
                  <div
                    key={conn.connection_id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{providerInfo.logo}</span>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {app.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {conn.scopes.length} permissions granted
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSync(conn.connection_id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Sync"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRevoke(conn.connection_id, app.name)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Disconnect"
                      >
                        <Unlink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAppsPage;
