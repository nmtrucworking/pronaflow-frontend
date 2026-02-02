/**
 * API Tokens Management Page
 * Module 12: Personal Access Token (PAT) Management
 */

import React, { useState } from 'react';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Clock,
  Shield,
  Activity,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useApiTokens, useCreateApiToken, useRevokeApiToken } from '@/hooks/useIntegrations';
import type { ApiScope, CreateApiTokenDTO, ApiTokenResponse } from '@/types/integration';
import { format } from 'date-fns';
import { toast } from 'sonner';

const API_SCOPES: { value: ApiScope; label: string; description: string }[] = [
  { value: 'read:tasks', label: 'Read Tasks', description: 'Xem thông tin tác vụ' },
  { value: 'write:tasks', label: 'Write Tasks', description: 'Tạo và chỉnh sửa tác vụ' },
  { value: 'delete:tasks', label: 'Delete Tasks', description: 'Xóa tác vụ' },
  { value: 'read:projects', label: 'Read Projects', description: 'Xem thông tin dự án' },
  { value: 'write:projects', label: 'Write Projects', description: 'Tạo và chỉnh sửa dự án' },
  { value: 'delete:projects', label: 'Delete Projects', description: 'Xóa dự án' },
  { value: 'read:workspace', label: 'Read Workspace', description: 'Xem thông tin workspace' },
  { value: 'write:workspace', label: 'Write Workspace', description: 'Chỉnh sửa workspace' },
  { value: 'admin:all', label: 'Admin Access', description: 'Toàn quyền quản trị' },
];

const ApiTokensPage: React.FC = () => {
  const userId = localStorage.getItem('user_id') || '';
  const { data: tokens = [], isLoading } = useApiTokens(userId);
  const createToken = useCreateApiToken(userId);
  const revokeToken = useRevokeApiToken(userId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTokenData, setNewTokenData] = useState<ApiTokenResponse | null>(null);
  const [showToken, setShowToken] = useState(false);

  const [formData, setFormData] = useState<CreateApiTokenDTO>({
    name: '',
    scopes: [],
    expires_in_days: 365,
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên token');
      return;
    }
    if (formData.scopes.length === 0) {
      toast.error('Vui lòng chọn ít nhất một scope');
      return;
    }

    try {
      const result = await createToken.mutateAsync(formData);
      setNewTokenData(result);
      setFormData({ name: '', scopes: [], expires_in_days: 365 });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleRevoke = async (tokenId: string, tokenName: string) => {
    if (confirm(`Bạn có chắc muốn thu hồi token "${tokenName}"? Hành động này không thể hoàn tác.`)) {
      try {
        await revokeToken.mutateAsync(tokenId);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép vào clipboard');
  };

  const toggleScope = (scope: ApiScope) => {
    setFormData(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            API Access Tokens
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Quản lý Personal Access Tokens (PAT) cho việc tích hợp API
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Token mới
        </button>
      </div>

      {/* Security Warning */}
      <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
              Bảo mật Token
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Token chỉ hiển thị một lần sau khi tạo. Hãy sao chép và lưu trữ an toàn. 
              Không chia sẻ token với bất kỳ ai và không commit vào source code.
            </p>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-4">
        {tokens.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center">
            <Key className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Chưa có API Token nào
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Tạo token đầu tiên để bắt đầu tích hợp với API của PronaFlow
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Tạo Token mới
            </button>
          </div>
        ) : (
          tokens.map((token) => (
            <div
              key={token.token_id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {token.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Created {format(new Date(token.created_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {token.is_active ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      <XCircle className="w-3 h-3" />
                      Revoked
                    </span>
                  )}
                  <button
                    onClick={() => handleRevoke(token.token_id, token.name)}
                    disabled={!token.is_active}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Last used: {token.last_used_at ? format(new Date(token.last_used_at), 'MMM dd, HH:mm') : 'Never'}
                  </span>
                </div>
                {token.expires_at && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Expires: {format(new Date(token.expires_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  SCOPES ({token.scopes.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {token.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Token Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Tạo Personal Access Token mới
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tên Token *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., CI/CD Pipeline, Mobile App API"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Thời hạn (ngày)
                </label>
                <select
                  value={formData.expires_in_days}
                  onChange={(e) => setFormData({ ...formData, expires_in_days: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={30}>30 ngày</option>
                  <option value={90}>90 ngày</option>
                  <option value={180}>180 ngày</option>
                  <option value={365}>1 năm</option>
                  <option value={0}>Không giới hạn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Scopes * (Chọn quyền hạn)
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                  {API_SCOPES.map((scope) => (
                    <label
                      key={scope.value}
                      className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.scopes.includes(scope.value)}
                        onChange={() => toggleScope(scope.value)}
                        className="mt-1 accent-indigo-600"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">
                          {scope.label}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {scope.description}
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
                  setFormData({ name: '', scopes: [], expires_in_days: 365 });
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                disabled={createToken.isPending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {createToken.isPending ? 'Đang tạo...' : 'Tạo Token'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Token Created Modal */}
      {newTokenData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Token created successfully!</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hãy sao chép token này ngay. Token sẽ không thể xem lại sau khi đóng cửa sổ này.
              </p>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    YOUR PERSONAL ACCESS TOKEN
                  </span>
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showToken ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                    {showToken ? newTokenData.token : '•'.repeat(64)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(newTokenData.token)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex gap-2">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Lưu ý bảo mật:</strong> Token này có toàn quyền truy cập theo scopes đã chọn. 
                    Không chia sẻ công khai hoặc commit vào Git.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setNewTokenData(null);
                  setShowCreateModal(false);
                  setShowToken(false);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Đã sao chép, đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTokensPage;
