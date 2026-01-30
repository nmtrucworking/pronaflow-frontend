/**
 * Workspace Feature Usage Examples
 * Demonstrates how to use all components, hooks, and dialogs
 * 
 * This file serves as both documentation and a reference implementation
 */

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Hooks
import {
  useWorkspaces,
  useWorkspace,
  useCreateWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
  useWorkspaceMembers,
  useAddMember,
  useUpdateMember,
  useRemoveMember,
  useInvitations,
  useSendInvitation,
  useCancelInvitation,
  useWorkspaceSettings,
  useUpdateSettings,
  useAccessLogs,
  useLogAccess,
} from '@/hooks/useWorkspace';

// State Management
import { useWorkspaceStore } from '@/store/features/workspaceStore';

// Components
import {
  WorkspaceCard,
  MemberCard,
  InvitationCard,
} from '@/features/workspace/components';

// Forms
import {
  CreateWorkspaceForm,
  UpdateWorkspaceForm,
  InviteUserForm,
  WorkspaceSettingsForm,
} from '@/features/workspace/forms/WorkspaceForms';

// Dialogs
import {
  EditWorkspaceDialog,
  DeleteWorkspaceDialog,
  InviteUserDialog,
  ChangeMemberRoleDialog,
  RemoveMemberDialog,
  CancelInvitationDialog,
  BatchOperationsDialog,
} from '@/features/workspace/dialogs/WorkspaceDialogs';

// Types
import { Workspace, CreateWorkspaceDTO, WorkspaceRole, WorkspaceMember } from '@/types/workspace';

/**
 * EXAMPLE 1: List Workspaces
 * Shows how to fetch and display workspaces
 */
export const ExampleListWorkspaces: React.FC = () => {
  const { data, isLoading, error } = useWorkspaces(0, 10);

  if (isLoading) return <div>Loading workspaces...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.items?.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          role="member"
          onSelect={(ws) => console.log('Selected:', ws.id)}
          onEdit={(id) => console.log('Edit:', id)}
          onDelete={(id) => console.log('Delete:', id)}
        />
      ))}
    </div>
  );
};

/**
 * EXAMPLE 2: Create Workspace
 * Shows how to create a new workspace with form validation
 */
export const ExampleCreateWorkspace: React.FC = () => {
  const mutation = useCreateWorkspace();

  const handleSubmit = async (data: CreateWorkspaceDTO) => {
    try {
      await mutation.mutateAsync(data);
      console.log('Workspace created successfully');
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  return (
    <CreateWorkspaceForm
      onSubmit={handleSubmit}
      isLoading={mutation.isPending}
    />
  );
};

/**
 * EXAMPLE 3: Workspace Detail with Members
 * Shows how to display workspace and manage members
 */
export const ExampleWorkspaceDetail: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: membersData } = useWorkspaceMembers(workspaceId, 0, 50);
  const addMemberMutation = useAddMember(workspaceId);
  const updateMemberMutation = useUpdateMember(workspaceId);
  const removeMemberMutation = useRemoveMember(workspaceId);

  const handleAddMember = async (email: string) => {
    // First get user ID from email (this would be done by backend)
    // Then add as member
    await addMemberMutation.mutateAsync({
      user_id: 'user-123',
      role: 'member' as WorkspaceRole,
    });
  };

  const handleChangeRole = async (member: WorkspaceMember, newRole: WorkspaceRole) => {
    await updateMemberMutation.mutateAsync({
      user_id: member.user_id,
      role: newRole,
    });
  };

  const handleRemoveMember = async (member: WorkspaceMember) => {
    await removeMemberMutation.mutateAsync({
      user_id: member.user_id,
    });
  };

  return (
    <div>
      {workspace && <h1>{workspace.name}</h1>}
      <h2>Members</h2>
      <div className="grid grid-cols-3 gap-4">
        {membersData?.items?.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserRole="admin"
            onChangeRole={(role) => handleChangeRole(member, role)}
            onRemove={() => handleRemoveMember(member)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 4: Manage Invitations
 * Shows how to send and manage invitations
 */
export const ExampleManageInvitations: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const { data: invitationsData } = useInvitations(workspaceId, 0, 50);
  const sendInvitationMutation = useSendInvitation(workspaceId);
  const cancelInvitationMutation = useCancelInvitation(workspaceId);

  const handleSendInvitation = async (email: string, role: WorkspaceRole) => {
    await sendInvitationMutation.mutateAsync({
      invited_email: email,
      invited_role: role,
    });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    await cancelInvitationMutation.mutateAsync({
      invitation_id: invitationId,
    });
  };

  return (
    <div>
      <h2>Pending Invitations</h2>
      <div className="grid grid-cols-3 gap-4">
        {invitationsData?.items?.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            onCancel={() => handleCancelInvitation(invitation.id)}
            onResend={() => handleSendInvitation(invitation.invited_email, invitation.invited_role)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * EXAMPLE 5: Use Zustand Store for State
 * Shows how to access and update workspace state
 */
export const ExampleUseWorkspaceStore: React.FC = () => {
  // Access state
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const currentUserRole = useWorkspaceStore((state) => state.currentUserRole);

  // Use permission selectors
  const isOwner = useWorkspaceStore((state) => state.useIsOwner());
  const canManageMembers = useWorkspaceStore((state) => state.useCanManageMembers());
  const canDeleteWorkspace = useWorkspaceStore((state) => state.useCanDeleteWorkspace());

  // Actions
  const { setCurrentWorkspace, clearCurrentWorkspace } = useWorkspaceStore();

  const handleSelectWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace, 'member');
  };

  return (
    <div>
      {currentWorkspace && (
        <div>
          <h2>Current Workspace: {currentWorkspace.name}</h2>
          <p>Your Role: {currentUserRole}</p>
          {isOwner && <button>Owner Action</button>}
          {canManageMembers && <button>Manage Members</button>}
          {canDeleteWorkspace && <button>Delete Workspace</button>}
        </div>
      )}
      <button onClick={() => clearCurrentWorkspace()}>Clear Selection</button>
    </div>
  );
};

/**
 * EXAMPLE 6: Using Dialogs
 * Shows how to use the dialog components
 */
export const ExampleWorkspaceDialogs: React.FC<{ workspace: Workspace }> = ({
  workspace,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember | null>(null);

  const updateMutation = useUpdateWorkspace(workspace.id);
  const deleteMutation = useDeleteWorkspace(workspace.id);
  const sendInvitationMutation = useSendInvitation(workspace.id);
  const updateMemberMutation = useUpdateMember(workspace.id);

  return (
    <div>
      {/* Edit Dialog */}
      <EditWorkspaceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        workspace={workspace}
        onSubmit={(data) => updateMutation.mutateAsync(data)}
        isLoading={updateMutation.isPending}
      />

      {/* Delete Dialog */}
      <DeleteWorkspaceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        workspace={workspace}
        onConfirm={() => deleteMutation.mutateAsync()}
        isLoading={deleteMutation.isPending}
      />

      {/* Invite User Dialog */}
      <InviteUserDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        workspaceId={workspace.id}
        onSubmit={(data) =>
          sendInvitationMutation.mutateAsync({
            invited_email: data.email,
            invited_role: data.invited_role,
          })
        }
        isLoading={sendInvitationMutation.isPending}
      />

      {/* Change Role Dialog */}
      {selectedMember && (
        <ChangeMemberRoleDialog
          open={changeRoleDialogOpen}
          onOpenChange={setChangeRoleDialogOpen}
          member={selectedMember}
          currentRole={selectedMember.role}
          onConfirm={(newRole) =>
            updateMemberMutation.mutateAsync({
              user_id: selectedMember.user_id,
              role: newRole,
            })
          }
          isLoading={updateMemberMutation.isPending}
        />
      )}

      {/* Buttons to Open Dialogs */}
      <div className="flex gap-2">
        <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
        <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        <Button onClick={() => setInviteDialogOpen(true)}>Invite</Button>
      </div>
    </div>
  );
};

/**
 * EXAMPLE 7: Access Logs and Audit Trail
 * Shows how to track workspace access
 */
export const ExampleAccessLogs: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const { data: logsData } = useAccessLogs(workspaceId, 0, 50);
  const logAccessMutation = useLogAccess(workspaceId);

  const handleLogAccess = async () => {
    await logAccessMutation.mutateAsync();
  };

  return (
    <div>
      <h2>Access History</h2>
      <Button onClick={handleLogAccess}>Log Current Access</Button>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logsData?.items?.map((log) => (
            <tr key={log.id}>
              <td>{log.user_id}</td>
              <td>{log.action}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * EXAMPLE 8: Workspace Settings
 * Shows how to update workspace configuration
 */
export const ExampleWorkspaceSettings: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: settings } = useWorkspaceSettings(workspaceId);
  const updateSettingsMutation = useUpdateSettings(workspaceId);

  const handleUpdateSettings = async (newSettings: any) => {
    await updateSettingsMutation.mutateAsync(newSettings);
  };

  return (
    <div>
      <h2>Workspace Settings</h2>
      {workspace && (
        <WorkspaceSettingsForm
          workspace={workspace}
          onSubmit={handleUpdateSettings}
          isLoading={updateSettingsMutation.isPending}
        />
      )}
    </div>
  );
};

/**
 * EXAMPLE 9: Complete Workspace Management Page
 * Shows how to combine everything into a single page
 */
export const ExampleCompleteWorkspacePage: React.FC<{ workspaceId: string }> = ({
  workspaceId,
}) => {
  const [tab, setTab] = useState<'members' | 'invitations' | 'settings'>('members');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTab('members')}>Members</button>
        <button onClick={() => setTab('invitations')}>Invitations</button>
        <button onClick={() => setTab('settings')}>Settings</button>
      </div>

      {tab === 'members' && (
        <ExampleWorkspaceDetail workspaceId={workspaceId} />
      )}

      {tab === 'invitations' && (
        <ExampleManageInvitations workspaceId={workspaceId} />
      )}

      {tab === 'settings' && (
        <ExampleWorkspaceSettings workspaceId={workspaceId} />
      )}
    </div>
  );
};

/**
 * How to Use These Examples:
 *
 * 1. Import the example you need:
 *    import { ExampleListWorkspaces } from '@/features/workspace/examples';
 *
 * 2. Use it in your component:
 *    <ExampleListWorkspaces />
 *
 * 3. Customize as needed for your use case
 *
 * For complete integration guide, see: INTEGRATION_GUIDE.ts
 * For component documentation, see: README.md
 */
