/**
 * Workspace List Page
 * Display all user's workspaces with management options
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, SlidersHorizontal, Search, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspaces, useCreateWorkspace, useDeleteWorkspace, useLogAccess } from '@/hooks/useWorkspace';
import { useWorkspaceStore } from '@/store/features/workspaceStore';
import { ROUTES } from '@/routes/paths';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { CreateWorkspaceForm, InviteUserForm } from '@/features/workspace/forms/WorkspaceForms';
import * as Dialog from '@radix-ui/react-dialog';
import { Workspace, CreateWorkspaceDTO, CreateInvitationDTO } from '@/types/workspace';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import workspaceService from '@/services/workspaceService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceMembers, useInvitations, useCancelInvitation } from '@/hooks/useWorkspace';
import { Mail } from 'lucide-react';

type WorkspaceStatusFilter = 'all' | 'ACTIVE' | 'SOFT_DELETED';
type WorkspaceSortField = 'name' | 'created_at' | 'updated_at';
type SortOrder = 'asc' | 'desc';

/**
 * Wrapper component to fetch member data and pass real role to WorkspaceCard
 */
interface WorkspaceCardWithDataProps {
  workspace: Workspace;
  currentUserId?: string;
  onSelect?: (workspace: Workspace) => void;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspaceId: string) => void;
  onInviteMember?: (workspaceId: string) => void;
  onLeaveWorkspace?: (workspace: Workspace) => void;
  onViewInvitations?: (workspace: Workspace) => void;
  onManageMembers?: (workspaceId: string) => void;
  onManageSettings?: (workspaceId: string) => void;
}

const WorkspaceCardWithData: React.FC<WorkspaceCardWithDataProps> = ({
  workspace,
  currentUserId,
  onSelect,
  onEdit,
  onDelete,
  onInviteMember,
  onLeaveWorkspace,
  onViewInvitations,
  onManageMembers,
  onManageSettings,
}) => {
  const { data: membersData } = useWorkspaceMembers(workspace.id, 0, 50);
  const { data: invitationsData } = useInvitations(workspace.id, 0, 50);

  // Determine user role from members data
  let userRole: 'owner' | 'admin' | 'member' | 'viewer' | 'guest' = 'member';
  if (currentUserId && membersData) {
    const userMember = (membersData as any[]).find((m) => m.user_id === currentUserId);
    if (userMember) {
      userRole = userMember.role;
    } else if (workspace.owner_id === currentUserId) {
      userRole = 'owner';
    }
  } else if (workspace.owner_id === currentUserId) {
    userRole = 'owner';
  }

  const invitationsCount = Array.isArray(invitationsData) ? invitationsData.length : 0;

  return (
    <WorkspaceCard
      workspace={workspace}
      role={userRole}
      invitationsCount={invitationsCount}
      onSelect={onSelect}
      onEdit={onEdit}
      onDelete={onDelete}
      onInviteMember={onInviteMember}
      onLeaveWorkspace={onLeaveWorkspace}
      onViewInvitations={onViewInvitations}
      onManageMembers={onManageMembers}
      onManageSettings={onManageSettings}
    />
  );
};

/**
 * Invitations viewer dialog content
 */
interface ViewInvitationsDialogProps {
  workspace: Workspace | null;
}

const ViewInvitationsDialog: React.FC<ViewInvitationsDialogProps> = ({ workspace }) => {
  const { data: invitationsData, isLoading } = useInvitations(workspace?.id || '', 0, 50);
  const cancelInvitationMutation = useCancelInvitation(workspace?.id || '');
  const queryClient = useQueryClient();

  const handleCancelInvitation = async (invitationId: string) => {
    if (!workspace) return;
    try {
      await cancelInvitationMutation.mutateAsync(invitationId);
      queryClient.invalidateQueries({ queryKey: ['invitations', workspace.id] });
      toast.success('Invitation cancelled');
    } catch {
      toast.error('Failed to cancel invitation');
    }
  };

  const invitations = Array.isArray(invitationsData) ? invitationsData : [];

  return (
    <div className="space-y-4">
      <Dialog.Title className="text-lg font-semibold text-slate-900">Pending Invitations</Dialog.Title>
      <Dialog.Description className="text-sm text-slate-600">
        {workspace?.name} - {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
      </Dialog.Description>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      ) : invitations.length > 0 ? (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {invitations.map((invitation) => {
            const isExpired = new Date(invitation.expires_at) < new Date();
            return (
              <div key={invitation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{invitation.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {invitation.invited_role}
                    </span>
                    {isExpired && (
                      <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Expired</span>
                    )}
                  </div>
                </div>
                {!isExpired && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancelInvitation(invitation.id)}
                    disabled={cancelInvitationMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-4">No pending invitations</p>
      )}
    </div>
  );
};

export const WorkspaceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkspaceStatusFilter>('all');
  const [sortBy, setSortBy] = useState<WorkspaceSortField>('updated_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [invitingWorkspace, setInvitingWorkspace] = useState<Workspace | null>(null);
  const [leavingWorkspace, setLeavingWorkspace] = useState<Workspace | null>(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState<Workspace | null>(null);
  const [viewingInvitationsWorkspace, setViewingInvitationsWorkspace] = useState<Workspace | null>(null);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // API Calls
  const { data: workspacesData, isLoading } = useWorkspaces(page * 10, 10);
  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace('');
  const logAccessMutation = useLogAccess('');
  const inviteWorkspaceMemberMutation = useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: string; data: CreateInvitationDTO }) =>
      workspaceService.sendInvitation(workspaceId, data),
    onSuccess: (invitation, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
      toast.success(`Invitation sent to ${invitation.email}!`);
      setInvitingWorkspace(null);
    },
    onError: () => {
      toast.error('Failed to send invitation');
    },
  });
  const leaveWorkspaceMutation = useMutation({
    mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
      workspaceService.removeMember(workspaceId, userId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('You left the workspace successfully');
      setLeavingWorkspace(null);
    },
    onError: () => {
      toast.error('Failed to leave workspace');
    },
  });

  // Store
  const setCurrentWorkspace = useWorkspaceStore((state) => state.setCurrentWorkspace);

  const handleSelectWorkspace = async (workspace: Workspace) => {
    setCurrentWorkspace(workspace, 'member'); // TODO: Get actual role from API
    await logAccessMutation.mutateAsync(workspace.id);
    navigate(ROUTES.workspace.detail(workspace.id));
  };

  const handleCreateWorkspace = async (data: CreateWorkspaceDTO) => {
    await createWorkspaceMutation.mutateAsync(data);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    await deleteWorkspaceMutation.mutateAsync(workspaceId);
    setDeletingWorkspace(null);
  };

  const handleInviteWorkspaceMember = async (data: CreateInvitationDTO) => {
    if (!invitingWorkspace) {
      return;
    }

    await inviteWorkspaceMemberMutation.mutateAsync({
      workspaceId: invitingWorkspace.id,
      data,
    });
  };

  const handleLeaveWorkspace = async () => {
    if (!leavingWorkspace || !user?.user_id) {
      toast.error('Unable to identify current user');
      return;
    }

    await leaveWorkspaceMutation.mutateAsync({
      workspaceId: leavingWorkspace.id,
      userId: user.user_id,
    });
  };

  const workspaces = workspacesData?.items || [];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleWorkspaces = workspaces
    .filter((workspace) => {
      const matchesStatus = statusFilter === 'all' || workspace.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        workspace.name.toLowerCase().includes(normalizedSearch) ||
        (workspace.description || '').toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    })
    .sort((left, right) => {
      const direction = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'name') {
        return left.name.localeCompare(right.name) * direction;
      }

      const leftTime = new Date(left[sortBy]).getTime();
      const rightTime = new Date(right[sortBy]).getTime();
      return (leftTime - rightTime) * direction;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workspaces</h1>
            <p className="text-gray-500 mt-2">Manage your workspaces and team collaborations</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search workspaces..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="md">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    View Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    <span className="flex-1">All workspaces</span>
                    {statusFilter === 'all' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('ACTIVE')}>
                    <span className="flex-1">Active only</span>
                    {statusFilter === 'ACTIVE' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('SOFT_DELETED')}>
                    <span className="flex-1">Archived only</span>
                    {statusFilter === 'SOFT_DELETED' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortBy('updated_at')}>
                    <span className="flex-1">Last updated</span>
                    {sortBy === 'updated_at' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('created_at')}>
                    <span className="flex-1">Created date</span>
                    {sortBy === 'created_at' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    <span className="flex-1">Name</span>
                    {sortBy === 'name' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Order</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSortOrder('desc')}>
                    <span className="flex-1">Descending</span>
                    {sortOrder === 'desc' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder('asc')}>
                    <span className="flex-1">Ascending</span>
                    {sortOrder === 'asc' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Showing {visibleWorkspaces.length} of {workspaces.length} workspaces on this page</span>
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Workspaces Grid */}
        {!isLoading && visibleWorkspaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleWorkspaces.map((workspace) => (
                <WorkspaceCardWithData
                  key={workspace.id}
                  workspace={workspace}
                  currentUserId={user?.user_id}
                  onSelect={handleSelectWorkspace}
                  onDelete={() => setDeletingWorkspace(workspace)}
                  onInviteMember={() => setInvitingWorkspace(workspace)}
                  onLeaveWorkspace={setLeavingWorkspace}
                  onViewInvitations={() => setViewingInvitationsWorkspace(workspace)}
                  onManageMembers={(id) => navigate(ROUTES.workspace.members(id))}
                  onManageSettings={(id) => navigate(ROUTES.workspace.settings(id))}
                />
              ))}
            </div>

            {/* Pagination */}
            {workspacesData && workspacesData.total > 10 && (
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

      <Dialog.Root open={!!invitingWorkspace} onOpenChange={(open) => !open && setInvitingWorkspace(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl z-50">
            <div className="space-y-4">
              <div>
                <Dialog.Title className="text-xl font-bold text-slate-900">Invite member</Dialog.Title>
                <Dialog.Description className="text-sm text-slate-600 mt-1">
                  {invitingWorkspace
                    ? `Invite a teammate to ${invitingWorkspace.name}`
                    : 'Invite a teammate to this workspace'}
                </Dialog.Description>
              </div>
              <InviteUserForm
                onSubmit={handleInviteWorkspaceMember}
                isLoading={inviteWorkspaceMemberMutation.isPending}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!leavingWorkspace} onOpenChange={(open) => !open && setLeavingWorkspace(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl z-50">
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-amber-100 p-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-slate-900">Leave workspace?</Dialog.Title>
                  <Dialog.Description className="text-sm text-slate-600 mt-1">
                    {leavingWorkspace
                      ? `You will lose access to ${leavingWorkspace.name} until you are invited again.`
                      : 'You will lose access to this workspace until invited again.'}
                  </Dialog.Description>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLeavingWorkspace(null)}
                  disabled={leaveWorkspaceMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLeaveWorkspace}
                  disabled={leaveWorkspaceMutation.isPending}
                >
                  {leaveWorkspaceMutation.isPending ? 'Leaving...' : 'Leave workspace'}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!deletingWorkspace} onOpenChange={(open) => !open && setDeletingWorkspace(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl z-50">
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-red-100 p-2">
                  <AlertTriangle className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-slate-900">Delete workspace?</Dialog.Title>
                  <Dialog.Description className="text-sm text-slate-600 mt-1">
                    {deletingWorkspace
                      ? `This will archive ${deletingWorkspace.name}. This action cannot be undone.`
                      : 'This action cannot be undone.'}
                  </Dialog.Description>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeletingWorkspace(null)}
                  disabled={deleteWorkspaceMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deletingWorkspace && handleDeleteWorkspace(deletingWorkspace.id)}
                  disabled={deleteWorkspaceMutation.isPending || !deletingWorkspace}
                >
                  {deleteWorkspaceMutation.isPending ? 'Deleting...' : 'Delete workspace'}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={!!viewingInvitationsWorkspace} onOpenChange={(open) => !open && setViewingInvitationsWorkspace(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <ViewInvitationsDialog workspace={viewingInvitationsWorkspace} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default WorkspaceListPage;
