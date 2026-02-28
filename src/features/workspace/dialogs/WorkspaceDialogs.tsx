// @ts-nocheck
/**
 * Workspace Action Dialogs
 * Common dialogs for workspace operations: edit, delete, manage members, invitations
 */

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Workspace, WorkspaceRole, CreateWorkspaceDTO, WorkspaceMember } from '@/types/workspace';
import { UpdateWorkspaceForm, InviteUserForm } from './WorkspaceForms';

/**
 * Edit Workspace Dialog
 */
interface EditWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace;
  onSubmit: (data: CreateWorkspaceDTO) => Promise<void>;
  isLoading: boolean;
}

export const EditWorkspaceDialog: React.FC<EditWorkspaceDialogProps> = ({
  open,
  onOpenChange,
  workspace,
  onSubmit,
  isLoading,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="sm:max-w-[600px]">
      <Dialog.Header>
        <Dialog.Title>Edit Workspace</Dialog.Title>
        <Dialog.Description>
          Update workspace details and information
        </Dialog.Description>
      </Dialog.Header>
      <UpdateWorkspaceForm
        workspace={workspace}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Dialog.Content>
  </Dialog.Root>
);

/**
 * Delete Workspace Confirmation Dialog
 */
interface DeleteWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const DeleteWorkspaceDialog: React.FC<DeleteWorkspaceDialogProps> = ({
  open,
  onOpenChange,
  workspace,
  onConfirm,
  isLoading,
}) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Content className="sm:max-w-[400px]">
      <AlertDialog.Header>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <AlertDialog.Title>Delete Workspace?</AlertDialog.Title>
            <AlertDialog.Description className="mt-2">
              Are you sure you want to delete <strong>{workspace.name}</strong>?
              This action cannot be undone.
            </AlertDialog.Description>
          </div>
        </div>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Workspace'
            )}
          </Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

/**
 * Invite User Dialog
 */
interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onSubmit: (data: { email: string; invited_role: WorkspaceRole }) => Promise<void>;
  isLoading: boolean;
}

export const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Content className="sm:max-w-[600px]">
      <Dialog.Header>
        <Dialog.Title>Invite User to Workspace</Dialog.Title>
        <Dialog.Description>
          Send an invitation to a user to join your workspace
        </Dialog.Description>
      </Dialog.Header>
      <InviteUserForm
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Dialog.Content>
  </Dialog.Root>
);

/**
 * Change Member Role Dialog
 */
interface ChangeMemberRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: WorkspaceMember;
  currentRole: WorkspaceRole;
  onConfirm: (newRole: WorkspaceRole) => Promise<void>;
  isLoading: boolean;
}

export const ChangeMemberRoleDialog: React.FC<ChangeMemberRoleDialogProps> = ({
  open,
  onOpenChange,
  member,
  currentRole,
  onConfirm,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole>(currentRole);
  const roles: WorkspaceRole[] = ['member', 'admin', 'owner'];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="sm:max-w-[400px]">
        <Dialog.Header>
          <Dialog.Title>Change Member Role</Dialog.Title>
          <Dialog.Description>
            Update the role for {member.user_id}
          </Dialog.Description>
        </Dialog.Header>
        <div className="py-4">
          <label className="text-sm font-medium">New Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as WorkspaceRole)}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <Dialog.Footer>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedRole)}
            disabled={isLoading || selectedRole === currentRole}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Role'
            )}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

/**
 * Remove Member Confirmation Dialog
 */
interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: WorkspaceMember;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const RemoveMemberDialog: React.FC<RemoveMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onConfirm,
  isLoading,
}) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Content className="sm:max-w-[400px]">
      <AlertDialog.Header>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <AlertDialog.Title>Remove Member?</AlertDialog.Title>
            <AlertDialog.Description className="mt-2">
              Are you sure you want to remove <strong>{member.user_id}</strong> from this workspace?
            </AlertDialog.Description>
          </div>
        </div>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              'Remove Member'
            )}
          </Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

/**
 * Cancel Invitation Dialog
 */
interface CancelInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const CancelInvitationDialog: React.FC<CancelInvitationDialogProps> = ({
  open,
  onOpenChange,
  email,
  onConfirm,
  isLoading,
}) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Content className="sm:max-w-[400px]">
      <AlertDialog.Header>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <AlertDialog.Title>Cancel Invitation?</AlertDialog.Title>
            <AlertDialog.Description className="mt-2">
              Cancel the invitation for <strong>{email}</strong>?
            </AlertDialog.Description>
          </div>
        </div>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel asChild>
          <Button variant="outline">Keep Invitation</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              'Cancel Invitation'
            )}
          </Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

/**
 * Batch Operations Dialog (export, delete multiple)
 */
interface BatchOperationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  operationType: 'delete' | 'export' | 'archive';
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const BatchOperationsDialog: React.FC<BatchOperationsDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  operationType,
  onConfirm,
  isLoading,
}) => {
  const messages = {
    delete: `Delete ${selectedCount} workspace${selectedCount > 1 ? 's' : ''}?`,
    export: `Export ${selectedCount} workspace${selectedCount > 1 ? 's' : ''}?`,
    archive: `Archive ${selectedCount} workspace${selectedCount > 1 ? 's' : ''}?`,
  };

  const isDestructive = operationType === 'delete';

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content className="sm:max-w-[400px]">
        <AlertDialog.Header>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className={`w-6 h-6 ${isDestructive ? 'text-red-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <AlertDialog.Title>
                {messages[operationType]}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2">
                {isDestructive
                  ? 'This action cannot be undone.'
                  : `Proceed with ${operationType}?`}
              </AlertDialog.Description>
            </div>
          </div>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              variant={isDestructive ? 'destructive' : 'default'}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                operationType.charAt(0).toUpperCase() + operationType.slice(1)
              )}
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default {
  EditWorkspaceDialog,
  DeleteWorkspaceDialog,
  InviteUserDialog,
  ChangeMemberRoleDialog,
  RemoveMemberDialog,
  CancelInvitationDialog,
  BatchOperationsDialog,
};
