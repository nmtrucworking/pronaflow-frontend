/**
 * Admin Workspaces Management Page
 * Module 2: Multi-tenancy Workspace Governance - Back-office
 * Allows system admins to manage deleted workspaces
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  RefreshCw,
  RotateCcw,
  Trash2,
  AlertCircle,
  Loader,
  ChevronDown,
} from 'lucide-react';
import { formatDate } from '@/lib/localeFormatters';
import workspaceService from '@/services/workspaceService';
import { Workspace } from '@/types/workspace';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface DeletedWorkspace extends Workspace {
  deleted_at?: string;
  owner_name?: string;
}

const AdminWorkspacesPage: React.FC = () => {
  const [deletedWorkspaces, setDeletedWorkspaces] = useState<DeletedWorkspace[]>([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState<DeletedWorkspace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<DeletedWorkspace | null>(null);
  const [actionType, setActionType] = useState<'restore' | 'delete'>('restore');

  // Fetch deleted workspaces
  const loadDeletedWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call admin API to list deleted workspaces
      // Assuming there's an admin endpoint: GET /admin/workspaces/deleted
      const response = await workspaceService.api.get<DeletedWorkspace[]>(
        '/admin/workspaces/deleted'
      );
      
      setDeletedWorkspaces(response.data || []);
      setFilteredWorkspaces(response.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load deleted workspaces';
      setError(errorMsg);
      console.error('Error loading deleted workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedWorkspaces();
  }, []);

  // Filter workspaces by search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWorkspaces(deletedWorkspaces);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = deletedWorkspaces.filter(
        (ws) =>
          ws.name.toLowerCase().includes(query) ||
          ws.id.toLowerCase().includes(query) ||
          ws.owner_name?.toLowerCase().includes(query)
      );
      setFilteredWorkspaces(filtered);
    }
  }, [searchQuery, deletedWorkspaces]);

  // Handle restore workspace
  const handleRestore = async () => {
    if (!selectedWorkspace) return;

    try {
      setIsLoading(true);

      // Call admin API to restore
      await workspaceService.api.put(
        `/admin/workspaces/${selectedWorkspace.id}/restore`
      );

      // Remove from list
      setDeletedWorkspaces(
        deletedWorkspaces.filter((ws) => ws.id !== selectedWorkspace.id)
      );

      setShowConfirmDialog(false);
      setSelectedWorkspace(null);

      // Show success message
      // (In a real app, use toast notification)
      alert(`Workspace "${selectedWorkspace.name}" restored successfully`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to restore workspace';
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle hard delete workspace
  const handleHardDelete = async () => {
    if (!selectedWorkspace) return;

    try {
      setIsLoading(true);

      // Call admin API to hard delete
      await workspaceService.api.delete(
        `/admin/workspaces/${selectedWorkspace.id}/hard-delete`
      );

      // Remove from list
      setDeletedWorkspaces(
        deletedWorkspaces.filter((ws) => ws.id !== selectedWorkspace.id)
      );

      setShowConfirmDialog(false);
      setSelectedWorkspace(null);

      // Show success message
      alert(`Workspace "${selectedWorkspace.name}" permanently deleted`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete workspace';
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionDialog = (workspace: DeletedWorkspace, action: 'restore' | 'delete') => {
    setSelectedWorkspace(workspace);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deleted Workspaces</h1>
          <p className="text-gray-600 mt-1">
            Manage and recover deleted workspaces (soft-deleted, expires after 30 days)
          </p>
        </div>
        <button
          onClick={loadDeletedWorkspaces}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by workspace name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && deletedWorkspaces.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredWorkspaces.length === 0 && (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600">No deleted workspaces found</p>
        </div>
      )}

      {/* Workspaces Table */}
      {!isLoading && filteredWorkspaces.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Workspace Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Workspace ID
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Owner
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Deleted Date
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkspaces.map((workspace) => (
                <tr key={workspace.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{workspace.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">
                    {workspace.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{workspace.owner_name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {workspace.deleted_at
                      ? formatDate(new Date(workspace.deleted_at))
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content align="end">
                        <DropdownMenu.Item
                          onClick={() => openActionDialog(workspace, 'restore')}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-blue-600 flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          onClick={() => openActionDialog(workspace, 'delete')}
                          className="cursor-pointer px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hard Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog.Root open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {actionType === 'restore' ? 'Restore Workspace' : 'Permanently Delete Workspace'}
            </Dialog.Title>

            <p className="text-gray-600 mb-6">
              {actionType === 'restore'
                ? `Are you sure you want to restore "${selectedWorkspace?.name}"? Users will regain access to all projects and data.`
                : `Are you sure you want to permanently delete "${selectedWorkspace?.name}"? This action cannot be undone and all associated data will be lost.`}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={actionType === 'restore' ? handleRestore : handleHardDelete}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'restore'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {isLoading ? 'Processing...' : actionType === 'restore' ? 'Restore' : 'Delete'}
              </button>
            </div>

            <Dialog.Close />
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default AdminWorkspacesPage;
