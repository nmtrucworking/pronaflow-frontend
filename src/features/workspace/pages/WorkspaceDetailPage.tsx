/**
 * Workspace Detail Page
 * Display workspace with tabs for members, invitations, and settings
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Settings, Users, Mail, Search, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Tabs from '@radix-ui/react-tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useWorkspace,
  useWorkspaceMembers,
  useInvitations,
  useUpdateMember,
  useRemoveMember,
  useCancelInvitation,
  useResendInvitation,
  useUpdateSettings,
  useWorkspaceSettings,
} from '@/hooks/useWorkspace';
import { useWorkspaceStore } from '@/store/features/workspaceStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/paths';
import { MemberCard } from '../components/MemberCard';
import { InvitationCard } from '../components/InvitationCard';
import { WorkspaceSettingsForm } from '../forms/WorkspaceForms';
import type {
  WorkspaceMember,
  WorkspaceInvitation,
  WorkspaceRole,
  UpdateSettingsDTO,
} from '@/types/workspace';

export const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workspaceId = id ?? '';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<WorkspaceRole | 'all'>('all');
  const [memberSort, setMemberSort] = useState<'joined_at' | 'name'>('joined_at');
  const [invitationSearch, setInvitationSearch] = useState('');
  const [invitationFilter, setInvitationFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [invitationSort, setInvitationSort] = useState<'created_at' | 'expires_at'>('created_at');

  // Hooks
  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const { data: membersData } = useWorkspaceMembers(workspaceId, 0, 50);
  const { data: invitationsData } = useInvitations(workspaceId, 0, 50);
  const { data: settings } = useWorkspaceSettings(workspaceId);
  const updateMemberMutation = useUpdateMember(workspaceId, '');
  const removeMemberMutation = useRemoveMember(workspaceId, '');
  const cancelInvitationMutation = useCancelInvitation(workspaceId);
  const resendInvitationMutation = useResendInvitation(workspaceId);
  const updateSettingsMutation = useUpdateSettings(workspaceId);
  const { setCurrentWorkspace, currentUserRole } = useWorkspaceStore();
  const { user } = useAuth();

  const members: WorkspaceMember[] = membersData || [];
  const invitations: WorkspaceInvitation[] = invitationsData || [];

  const filteredMembers = members
    .filter((member) => {
      const normalizedSearch = memberSearch.trim().toLowerCase();
      const username = member.user?.username?.toLowerCase() || '';
      const email = member.user?.email?.toLowerCase() || '';
      const matchesSearch =
        normalizedSearch.length === 0 ||
        username.includes(normalizedSearch) ||
        email.includes(normalizedSearch);

      const matchesRole = memberRoleFilter === 'all' || member.role === memberRoleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((left, right) => {
      if (memberSort === 'name') {
        const leftName = left.user?.username || left.user?.email || left.user_id;
        const rightName = right.user?.username || right.user?.email || right.user_id;
        return leftName.localeCompare(rightName);
      }

      return new Date(right.joined_at).getTime() - new Date(left.joined_at).getTime();
    });

  const filteredInvitations = invitations
    .filter((invitation) => {
      const normalizedSearch = invitationSearch.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 || invitation.email.toLowerCase().includes(normalizedSearch);

      const isExpired = new Date(invitation.expires_at) < new Date();
      const matchesFilter =
        invitationFilter === 'all' ||
        (invitationFilter === 'active' && !isExpired) ||
        (invitationFilter === 'expired' && isExpired);

      return matchesSearch && matchesFilter;
    })
    .sort((left, right) => {
      const leftValue = new Date(left[invitationSort]).getTime();
      const rightValue = new Date(right[invitationSort]).getTime();
      return rightValue - leftValue;
    });

  const handleChangeRole = async (member: WorkspaceMember, role: WorkspaceRole) => {
    await updateMemberMutation.mutateAsync({
      userId: member.user_id,
      data: { role },
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMemberMutation.mutateAsync(memberId);
  };

  const handleCancelInvitation = async (invitationId: string) => {
    await cancelInvitationMutation.mutateAsync(invitationId);
  };

  const handleResendInvitation = async (invitationId: string) => {
    const invitation = invitations.find((item) => item.id === invitationId);
    if (!invitation) {
      return;
    }

    await resendInvitationMutation.mutateAsync({
      email: invitation.email,
      invited_role: invitation.invited_role,
    });
  };

  const handleUpdateSettings = async (data: UpdateSettingsDTO) => {
    await updateSettingsMutation.mutateAsync(data);
  };

  useEffect(() => {
    if (workspace) {
      const resolvedRole = members.find((member) => member.user_id === user?.user_id)?.role
        ?? (workspace.owner_id === user?.user_id ? 'owner' : 'member');
      setCurrentWorkspace(workspace, resolvedRole);
    }
  }, [workspace, members, user?.user_id, setCurrentWorkspace]);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Workspace ID is missing</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Workspace not found</p>
        <Button onClick={() => navigate(ROUTES.workspace.list)}>Back to Workspaces</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.workspace.list)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
              {workspace.description && (
                <p className="text-sm text-gray-500 mt-1">{workspace.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md">
              <Users className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              <span className="font-medium">{members.length} members</span>
            </div>
            <div className="group inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <Sparkles className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" />
              <span className="font-semibold uppercase tracking-[0.22em]">{workspace.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="py-8">
          <Tabs.List className="flex border-b border-gray-200 px-4">
            <Tabs.Trigger
              value="members"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Users className="w-4 h-4" />
              Members ({members.length})
            </Tabs.Trigger>

            <Tabs.Trigger
              value="invitations"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Mail className="w-4 h-4" />
              Invitations ({invitations.length})
            </Tabs.Trigger>

            <Tabs.Trigger
              value="settings"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Tabs.Trigger>
          </Tabs.List>

          {/* Members Tab */}
          <Tabs.Content value="members" className="py-6 px-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="md">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Member Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setMemberRoleFilter('all')}>
                    <span className="flex-1">All roles</span>
                    {memberRoleFilter === 'all' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMemberRoleFilter('owner')}>
                    <span className="flex-1">Owner</span>
                    {memberRoleFilter === 'owner' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMemberRoleFilter('admin')}>
                    <span className="flex-1">Admin</span>
                    {memberRoleFilter === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMemberRoleFilter('member')}>
                    <span className="flex-1">Member</span>
                    {memberRoleFilter === 'member' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMemberRoleFilter('viewer')}>
                    <span className="flex-1">Viewer</span>
                    {memberRoleFilter === 'viewer' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setMemberSort('joined_at')}>
                    <span className="flex-1">Newest joined</span>
                    {memberSort === 'joined_at' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMemberSort('name')}>
                    <span className="flex-1">Name A-Z</span>
                    {memberSort === 'name' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.length > 0 ? filteredMembers.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  currentUserRole={currentUserRole || 'member'}
                  onChangeRole={handleChangeRole}
                  onRemove={handleRemoveMember}
                />
              )) : (
                <p className="text-gray-500 col-span-full">No members match the current filter</p>
              )}
            </div>
          </Tabs.Content>

          {/* Invitations Tab */}
          <Tabs.Content value="invitations" className="py-6 px-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={invitationSearch}
                  onChange={(event) => setInvitationSearch(event.target.value)}
                  placeholder="Search invitations..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="md">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Invitation Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setInvitationFilter('all')}>
                    <span className="flex-1">All invitations</span>
                    {invitationFilter === 'all' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInvitationFilter('active')}>
                    <span className="flex-1">Active only</span>
                    {invitationFilter === 'active' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInvitationFilter('expired')}>
                    <span className="flex-1">Expired only</span>
                    {invitationFilter === 'expired' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setInvitationSort('created_at')}>
                    <span className="flex-1">Newest invited</span>
                    {invitationSort === 'created_at' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInvitationSort('expires_at')}>
                    <span className="flex-1">Nearest expiry</span>
                    {invitationSort === 'expires_at' && <Check className="w-4 h-4 text-blue-600" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvitations.length > 0 ? filteredInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onCancel={handleCancelInvitation}
                  onResend={handleResendInvitation}
                />
              )) : (
                <p className="text-gray-500 col-span-full">No invitations match the current filter</p>
              )}
            </div>
          </Tabs.Content>

          {/* Settings Tab */}
          <Tabs.Content value="settings" className="py-6 px-4">
            <div className="max-w-2xl">
              <WorkspaceSettingsForm
                defaultValues={settings || undefined}
                onSubmit={handleUpdateSettings}
                isLoading={updateSettingsMutation.isPending}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
