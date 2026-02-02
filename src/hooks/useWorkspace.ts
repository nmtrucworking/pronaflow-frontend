/**
 * Workspace React Hooks
 * Custom hooks for workspace operations using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import workspaceService from '@/services/workspaceService';
import {
  Workspace,
  WorkspaceDetail,
  WorkspaceMember,
  WorkspaceInvitation,
  WorkspaceSetting,
  WorkspaceAccessLog,
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  AddMemberDTO,
  UpdateMemberDTO,
  CreateInvitationDTO,
  UpdateSettingsDTO,
} from '@/types/workspace';

// ============================================================================
// Workspace Hooks
// ============================================================================

/**
 * Hook to create a new workspace
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDTO) => workspaceService.createWorkspace(data),
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(`Workspace "${workspace.name}" created successfully!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create workspace';
      toast.error(message);
    },
  });
};

/**
 * Hook to fetch list of user's workspaces
 */
export const useWorkspaces = (skip: number = 0, limit: number = 10) => {
  return useQuery({
    queryKey: ['workspaces', skip, limit],
    queryFn: () => workspaceService.listWorkspaces(skip, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch single workspace details
 */
export const useWorkspace = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspaceService.getWorkspace(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Hook to update workspace
 */
export const useUpdateWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateWorkspaceDTO) =>
      workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update workspace';
      toast.error(message);
    },
  });
};

/**
 * Hook to delete workspace
 */
export const useDeleteWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete workspace';
      toast.error(message);
    },
  });
};

// ============================================================================
// Member Hooks
// ============================================================================

/**
 * Hook to fetch workspace members
 */
export const useWorkspaceMembers = (workspaceId: string, skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['workspace-members', workspaceId, skip, limit],
    queryFn: () => workspaceService.listMembers(workspaceId, skip, limit),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to add member to workspace
 */
export const useAddMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberDTO) => workspaceService.addMember(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      toast.success('Member added successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to add member';
      toast.error(message);
    },
  });
};

/**
 * Hook to update member role
 */
export const useUpdateMember = (workspaceId: string, userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberDTO) =>
      workspaceService.updateMember(workspaceId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      toast.success('Member updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update member';
      toast.error(message);
    },
  });
};

/**
 * Hook to remove member from workspace
 */
export const useRemoveMember = (workspaceId: string, userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceService.removeMember(workspaceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
      toast.success('Member removed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to remove member';
      toast.error(message);
    },
  });
};

// ============================================================================
// Invitation Hooks
// ============================================================================

/**
 * Hook to fetch pending invitations
 */
export const useInvitations = (workspaceId: string, skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['invitations', workspaceId, skip, limit],
    queryFn: () => workspaceService.listInvitations(workspaceId, skip, limit),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to send invitation
 */
export const useSendInvitation = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvitationDTO) =>
      workspaceService.sendInvitation(workspaceId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
      toast.success(`Invitation sent to ${data.email}!`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to send invitation';
      toast.error(message);
    },
  });
};

/**
 * Hook to cancel invitation
 */
export const useCancelInvitation = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      workspaceService.cancelInvitation(workspaceId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
      toast.success('Invitation cancelled!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to cancel invitation';
      toast.error(message);
    },
  });
};

/**
 * Hook to accept workspace invitation
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => workspaceService.acceptInvitation(token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(`Successfully joined workspace: ${data.workspace_name}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to accept invitation';
      toast.error(message);
    },
  });
};

/**
 * Hook to get last accessed workspace
 */
export const useLastAccessedWorkspace = () => {
  return useQuery({
    queryKey: ['last-accessed-workspace'],
    queryFn: () => workspaceService.getLastAccessedWorkspace(),
    staleTime: 60 * 1000, // 1 minute
  });
};

// ============================================================================
// Settings Hooks
// ============================================================================

/**
 * Hook to fetch workspace settings
 */
export const useWorkspaceSettings = (workspaceId: string) => {
  return useQuery({
    queryKey: ['workspace-settings', workspaceId],
    queryFn: () => workspaceService.getSettings(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update workspace settings
 */
export const useUpdateSettings = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsDTO) =>
      workspaceService.updateSettings(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-settings', workspaceId] });
      toast.success('Settings updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update settings';
      toast.error(message);
    },
  });
};

// ============================================================================
// Access Log Hooks
// ============================================================================

/**
 * Hook to fetch access logs
 */
export const useAccessLogs = (
  workspaceId: string,
  userId?: string,
  skip: number = 0,
  limit: number = 50
) => {
  return useQuery({
    queryKey: ['access-logs', workspaceId, userId, skip, limit],
    queryFn: () => workspaceService.getAccessLogs(workspaceId, userId, skip, limit),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to log workspace access
 */
export const useLogAccess = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workspaceService.logAccess(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['access-logs', workspaceId] });
    },
  });
};

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to refresh all workspace data
 */
export const useRefreshWorkspace = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] });
    queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] });
    queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] });
    queryClient.invalidateQueries({ queryKey: ['workspace-settings', workspaceId] });
  }, [queryClient, workspaceId]);
};

/**
 * Combined hook to fetch workspace with all related data
 */
export const useWorkspaceComplete = (workspaceId?: string) => {
  const workspace = useWorkspace(workspaceId);
  const members = useWorkspaceMembers(workspaceId || '');
  const invitations = useInvitations(workspaceId || '');
  const settings = useWorkspaceSettings(workspaceId || '');

  return {
    workspace: workspace.data,
    members: members.data,
    invitations: invitations.data,
    settings: settings.data,
    isLoading:
      workspace.isLoading ||
      members.isLoading ||
      invitations.isLoading ||
      settings.isLoading,
    error: workspace.error || members.error || invitations.error || settings.error,
  };
};
