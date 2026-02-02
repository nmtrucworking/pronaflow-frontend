/**
 * Integrations Overview Page
 * Module 12: Integration Ecosystem - Main Dashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Key, 
  Webhook, 
  Link as LinkIcon, 
  Puzzle,
  Plus,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import { useIntegrationsOverview } from '@/hooks/useIntegrations';

const IntegrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id') || '';
  const workspaceId = localStorage.getItem('current_workspace_id') || '';
  
  const { data: overview, isLoading } = useIntegrationsOverview(userId, workspaceId);

  const integrationCategories = [
    {
      id: 'api-tokens',
      title: 'API Access Tokens',
      description: 'Quản lý Personal Access Tokens cho việc tích hợp tự động',
      icon: <Key className="w-6 h-6" />,
      color: 'bg-indigo-500',
      count: overview?.api_tokens?.length || 0,
      route: '/integrations/api-tokens',
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'Cấu hình thông báo sự kiện theo thời gian thực',
      icon: <Webhook className="w-6 h-6" />,
      color: 'bg-orange-500',
      count: overview?.webhooks?.length || 0,
      route: '/integrations/webhooks',
    },
    {
      id: 'connected-apps',
      title: 'Connected Apps',
      description: 'Kết nối với Google Calendar, GitHub, Slack và các dịch vụ khác',
      icon: <LinkIcon className="w-6 h-6" />,
      color: 'bg-emerald-500',
      count: overview?.oauth_connections?.length || 0,
      route: '/integrations/connected-apps',
    },
    {
      id: 'plugins',
      title: 'Plugin Marketplace',
      description: 'Khám phá và cài đặt các tiện ích mở rộng',
      icon: <Puzzle className="w-6 h-6" />,
      color: 'bg-purple-500',
      count: overview?.plugins?.length || 0,
      route: '/integrations/plugins',
    },
  ];

  const quickActions = [
    {
      title: 'Tạo API Token mới',
      description: 'Khởi tạo token để tích hợp với hệ thống bên ngoài',
      icon: <Plus className="w-5 h-5" />,
      action: () => navigate('/integrations/api-tokens?action=create'),
    },
    {
      title: 'Thêm Webhook',
      description: 'Đăng ký nhận thông báo sự kiện',
      icon: <Webhook className="w-5 h-5" />,
      action: () => navigate('/integrations/webhooks?action=create'),
    },
    {
      title: 'Kết nối ứng dụng',
      description: 'Liên kết với Google, GitHub, Slack...',
      icon: <LinkIcon className="w-5 h-5" />,
      action: () => navigate('/integrations/connected-apps'),
    },
  ];

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Bảo mật cao',
      description: 'OAuth2, HMAC signing, rate limiting',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Thời gian thực',
      description: 'Event-driven webhooks với delivery guarantee',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Mở rộng dễ dàng',
      description: 'Plugin marketplace với sandboxed execution',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Integration Ecosystem
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Kết nối PronaFlow với các công cụ và hệ thống bên ngoài để tối ưu quy trình làm việc
        </p>
      </div>

      {/* Features Banner */}
      <div className="mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Platform Integration Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {integrationCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(category.route)}
            className="group cursor-pointer bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${category.color} p-3 rounded-lg text-white`}>
                {category.icon}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold">{category.count}</span>
                <span>active</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {category.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              {category.description}
            </p>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:gap-2 transition-all">
              <span>Quản lý</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.action}
              className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                {action.icon}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                  {action.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Documentation Link */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <Settings className="w-6 h-6 text-slate-400 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                API Documentation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tài liệu chi tiết về các endpoint, authentication và best practices
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/help/api')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Xem tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
