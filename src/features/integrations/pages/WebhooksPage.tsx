/**
 * Webhooks Management Page
 * Module 12: Outbound Webhook Configuration
 */

import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  Trash2,
  Power,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Activity
} from 'lucide-react';
import { useWebhooks, useCreateWebhook, useUpdateWebhook, useDeleteWebhook, useWebhookDeliveries } from '@/hooks/useIntegrations';
import type { CreateWebhookDTO, UpdateWebhookDTO, WebhookEventType } from '@/types/integration';
import { format } from 'date-fns';
import { toast } from 'sonner';

const WEBHOOK_EVENTS: { value: WebhookEventType; label: string; description: string }[] = [
  { value: 'task.created', label: 'Task Created', description: 'Khi tác vụ mới được tạo' },
  { value: 'task.updated', label: 'Task Updated', description: 'Khi tác vụ được cập nhật' },
  { value: 'task.status_changed', label: 'Task Status Changed', description: 'Khi trạng thái tác vụ thay đổi' },
  { value: 'task.deleted', label: 'Task Deleted', description: 'Khi tác vụ bị xóa' },
  { value: 'comment.created', label: 'Comment Created', description: 'Khi có bình luận mới' },
  { value: 'project.created', label: 'Project Created', description: 'Khi dự án mới được tạo' },
  { value: 'project.updated', label: 'Project Updated', description: 'Khi dự án được cập nhật' },
  { value: 'member.added', label: 'Member Added', description: 'Khi thành viên mới được thêm' },
  { value: 'member.removed', label: 'Member Removed', description: 'Khi thành viên bị xóa' },
];

const WebhooksPage: React.FC = () => {
  const workspaceId = localStorage.getItem('current_workspace_id') || '';
  const { data: webhooks = [], isLoading } = useWebhooks(workspaceId);
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook(workspaceId);
  const deleteWebhook = useDeleteWebhook(workspaceId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateWebhookDTO>({
    workspace_id: workspaceId,
    name: '',
    target_url: '',
    events: [],
  });

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.target_url.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (formData.events.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sự kiện');
      return;
    }

    try {
      await createWebhook.mutateAsync(formData);
      setShowCreateModal(false);
      setFormData({
        workspace_id: workspaceId,
        name: '',
        target_url: '',
        events: [],
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  const toggleEvent = (event: WebhookEventType) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const toggleWebhookStatus = async (webhookId: string, currentStatus: boolean) => {
    await updateWebhook.mutateAsync({
      webhookId,
      data: { is_active: !currentStatus }
    });
  };

  const handleDelete = async (webhookId: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa webhook "${name}"?`)) {
      await deleteWebhook.mutateAsync(webhookId);
    }
  };

  const copySecretKey = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast.success('Secret key đã được sao chép');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Webhooks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Cấu hình thông báo sự kiện theo thời gian thực
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm Webhook
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Event-Driven Architecture
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Webhooks gửi HTTP POST requests đến server của bạn khi có sự kiện xảy ra. 
              Payload được ký bằng HMAC-SHA256 với secret key để đảm bảo tính toàn vẹn.
            </p>
          </div>
        </div>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        {webhooks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <Webhook className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Chưa có Webhook nào
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Tạo webhook để nhận thông báo real-time từ PronaFlow
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Thêm Webhook đầu tiên
            </button>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <div
              key={webhook.webhook_id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                    <Webhook className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {webhook.name}
                      </h3>
                      {webhook.is_active ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-xs">
                        {webhook.target_url}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500">
                      Created {format(new Date(webhook.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWebhookStatus(webhook.webhook_id, webhook.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      webhook.is_active
                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title={webhook.is_active ? 'Disable' : 'Enable'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedWebhook(webhook.webhook_id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Deliveries"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(webhook.webhook_id, webhook.name)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    SECRET KEY (HMAC Signing)
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-xs bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                      {webhook.secret_key}
                    </code>
                    <button
                      onClick={() => copySecretKey(webhook.secret_key)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    SUBSCRIBED EVENTS ({webhook.events.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="text-xs font-mono bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded border border-orange-200 dark:border-orange-800"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Thêm Webhook mới
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tên Webhook *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Slack Notification, Payment Processor"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Payload URL *
                </label>
                <input
                  type="url"
                  value={formData.target_url}
                  onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                  placeholder="https://your-server.com/webhooks/pronaflow"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Endpoint nhận HTTP POST requests. Phải sử dụng HTTPS.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Subscribe to Events * (Chọn sự kiện)
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                  {WEBHOOK_EVENTS.map((event) => (
                    <label
                      key={event.value}
                      className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event.value)}
                        onChange={() => toggleEvent(event.value)}
                        className="mt-1 accent-orange-600"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {event.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {event.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    workspace_id: workspaceId,
                    name: '',
                    target_url: '',
                    events: [],
                  });
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={createWebhook.isPending}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {createWebhook.isPending ? 'Đang tạo...' : 'Tạo Webhook'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;
