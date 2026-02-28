/**
 * Workspace List Page
 * Display all user's workspaces with management options
 */

// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspaces, useCreateWorkspace, useDeleteWorkspace, useLogAccess } from '@/hooks/useWorkspace';
import { useWorkspaceStore } from '@/store/features/workspaceStore';
import { ROUTES } from '@/routes/paths';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { CreateWorkspaceForm } from '../forms/WorkspaceForms';
import * as Dialog from '@radix-ui/react-dialog';
import { Workspace, CreateWorkspaceDTO } from '@/types/workspace';

export const WorkspaceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(0);

  // API Calls
  const { data: workspacesData, isLoading } = useWorkspaces(page * 10, 10);
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace('');
  const logAccessMutation = useLogAccess('');

  // Store
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

  const handleSelectWorkspace = async (workspace: Workspace) => {
    setCurrentWorkspace(workspace, 'member'); // TODO: Get actual role from API
    await logAccessMutation.mutateAsync();
    navigate(ROUTES.workspace.detail(workspace.id));
  };

  const handleCreateWorkspace = async (data: CreateWorkspaceDTO) => {
    await createWorkspaceMutation.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      await deleteWorkspaceMutation.mutateAsync();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-500 mt-2">Manage your workspaces and team collaborations</p>
          </div>

          <Dialog.Root open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <Dialog.Trigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Workspace
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-[600px] z-50">
                <div className="space-y-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold text-slate-900">
                      Create New Workspace
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-slate-600 mt-1">
                      Create a new workspace to collaborate with your team
                    </Dialog.Description>
                  </div>
                  <CreateWorkspaceForm
                    onSubmit={handleCreateWorkspace}
                    isLoading={createWorkspaceMutation.isPending}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Workspaces Grid */}
        {!isLoading && workspacesData?.items && workspacesData.items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspacesData.items.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  role="member"
                  onSelect={handleSelectWorkspace}
                  onDelete={handleDeleteWorkspace}
                  onManageMembers={(id) => navigate(ROUTES.workspace.members(id))}
                  onManageSettings={(id) => navigate(ROUTES.workspace.settings(id))}
                />
              ))}
            </div>

            {/* Pagination */}
            {workspacesData.total > 10 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  disabled={page === 0}
                  onClick={() => setPage(Math.max(0, page - 1))}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page + 1} of {Math.ceil(workspacesData.total / 10)}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= Math.ceil(workspacesData.total / 10) - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : !isLoading ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No workspaces yet</h3>
            <p className="text-gray-500 mt-2">Create your first workspace to get started</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WorkspaceListPage;
