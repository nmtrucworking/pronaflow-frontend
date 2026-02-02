/**
 * Plugin Marketplace Page
 * Module 12: Plugin Discovery and Installation
 */

import React, { useState } from 'react';
import {
  Puzzle,
  Search,
  Download,
  Star,
  Shield,
  Trash2,
  Power,
  Settings as SettingsIcon,
  CheckCircle2,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';
import {
  usePluginMarketplace,
  useInstalledPlugins,
  useInstallPlugin,
  useUninstallPlugin,
  useTogglePlugin
} from '@/hooks/useIntegrations';
import type { Plugin } from '@/types/integration';
import { toast } from 'sonner';

const CATEGORIES = [
  'All',
  'Productivity',
  'Reporting',
  'Communication',
  'Analytics',
  'AI/ML',
  'Visualization',
  'Automation',
  'Security',
  'Utilities',
];

const PluginMarketplacePage: React.FC = () => {
  const workspaceId = localStorage.getItem('current_workspace_id') || '';
  const [activeTab, setActiveTab] = useState<'marketplace' | 'installed'>('marketplace');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: marketplaceData, isLoading: marketplaceLoading } = usePluginMarketplace({
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    search: searchQuery || undefined,
    page: 1,
    page_size: 20,
  });

  const { data: installedPlugins = [], isLoading: installedLoading } = useInstalledPlugins(workspaceId);
  const installPlugin = useInstallPlugin();
  const uninstallPlugin = useUninstallPlugin(workspaceId);
  const togglePlugin = useTogglePlugin(workspaceId);

  const isInstalled = (pluginId: string) => {
    return installedPlugins.some(p => p.plugin_id === pluginId);
  };

  const getInstallation = (pluginId: string) => {
    return installedPlugins.find(p => p.plugin_id === pluginId);
  };

  const handleInstall = async (plugin: Plugin) => {
    try {
      await installPlugin.mutateAsync({
        plugin_id: plugin.plugin_id,
        workspace_id: workspaceId,
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleUninstall = async (installationId: string, pluginName: string) => {
    if (confirm(`Bạn có chắc muốn gỡ cài đặt plugin "${pluginName}"?`)) {
      try {
        await uninstallPlugin.mutateAsync(installationId);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleToggle = async (installationId: string, currentStatus: boolean) => {
    try {
      await togglePlugin.mutateAsync({
        installationId,
        enabled: !currentStatus,
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const renderPluginCard = (plugin: Plugin, installation?: any) => {
    const installed = !!installation;

    return (
      <div
        key={plugin.plugin_id}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        {/* Plugin Banner */}
        {plugin.banner_url && (
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
            <img
              src={plugin.banner_url}
              alt={plugin.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            {plugin.icon_url ? (
              <img
                src={plugin.icon_url}
                alt={plugin.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <Puzzle className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {plugin.name}
                </h3>
                {plugin.is_verified && (
                  <span className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                by {plugin.author}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
            {plugin.description}
          </p>

          <div className="flex items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {plugin.download_count.toLocaleString()}
            </div>
            {plugin.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {plugin.rating.toFixed(1)}
              </div>
            )}
            <div className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
              v{plugin.version}
            </div>
          </div>

          {installed && installation ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Installed
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(installation.installation_id, installation.is_enabled)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    installation.is_enabled
                      ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {installation.is_enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={() => handleUninstall(installation.installation_id, plugin.name)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleInstall(plugin)}
              disabled={installPlugin.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {installPlugin.isPending ? 'Installing...' : 'Install'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Plugin Marketplace
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Khám phá và cài đặt các tiện ích mở rộng cho PronaFlow
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'marketplace'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Marketplace
            {marketplaceData && (
              <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {marketplaceData.total}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'installed'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Installed
            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
              {installedPlugins.length}
            </span>
          </div>
        </button>
      </div>

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search plugins..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Plugin Grid */}
          {marketplaceLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : marketplaceData && marketplaceData.plugins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceData.plugins.map((plugin) => 
                renderPluginCard(plugin, getInstallation(plugin.plugin_id))
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
              <Puzzle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No plugins found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      )}

      {/* Installed Tab */}
      {activeTab === 'installed' && (
        <>
          {installedLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : installedPlugins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {installedPlugins.map((installation) => 
                installation.plugin && renderPluginCard(installation.plugin, installation)
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
              <Puzzle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No plugins installed
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Browse the marketplace to find plugins that enhance your workflow
              </p>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </>
      )}

      {/* Features Banner */}
      <div className="mt-12 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Plugin Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sandboxed Execution</h3>
              <p className="text-sm text-white/80">
                Plugins chạy trong môi trường cô lập để đảm bảo an toàn
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">SDK Bridge</h3>
              <p className="text-sm text-white/80">
                Giao tiếp với PronaFlow Core qua postMessage API
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Community Driven</h3>
              <p className="text-sm text-white/80">
                Cộng đồng phát triển và chia sẻ plugins
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginMarketplacePage;
