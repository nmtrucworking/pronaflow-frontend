/**
 * Workspace Zustand Store
 * Global state management for workspace
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceFilterOptions,
  MemberFilterOptions,
} from '@/types/workspace';

// ============================================================================
// Type Definitions
// ============================================================================

interface WorkspaceState {
  // Current workspace context
  currentWorkspaceId: string | null;
  currentWorkspace: Workspace | null;
  currentUserRole: WorkspaceRole | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Filters
  workspaceFilters: WorkspaceFilterOptions;
  memberFilters: MemberFilterOptions;

  // Actions
  setCurrentWorkspace: (workspace: Workspace | null, role?: WorkspaceRole) => void;
  setCurrentWorkspaceId: (id: string | null) => void;
  clearCurrentWorkspace: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWorkspaceFilters: (filters: Partial<WorkspaceFilterOptions>) => void;
  setMemberFilters: (filters: Partial<MemberFilterOptions>) => void;
  resetFilters: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialWorkspaceFilters: WorkspaceFilterOptions = {
  search: '',
  status: 'ACTIVE',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const initialMemberFilters: MemberFilterOptions = {
  search: '',
  is_active: true,
  sortBy: 'joined_at',
  sortOrder: 'desc',
};

// ============================================================================
// Zustand Store
// ============================================================================

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
    persist(
      (set) => ({
        // State
        currentWorkspaceId: null,
        currentWorkspace: null,
        currentUserRole: null,
        isLoading: false,
        error: null,
        workspaceFilters: initialWorkspaceFilters,
        memberFilters: initialMemberFilters,

        // Actions
        setCurrentWorkspace: (workspace, role) =>
          set({
            currentWorkspace: workspace,
            currentWorkspaceId: workspace?.id || null,
            currentUserRole: role || null,
          }),

        setCurrentWorkspaceId: (id) =>
          set({
            currentWorkspaceId: id,
          }),

        clearCurrentWorkspace: () =>
          set({
            currentWorkspace: null,
            currentWorkspaceId: null,
            currentUserRole: null,
          }),

        setLoading: (loading) =>
          set({
            isLoading: loading,
          }),

        setError: (error) =>
          set({
            error,
          }),

        setWorkspaceFilters: (filters) =>
          set((state) => ({
            workspaceFilters: {
              ...state.workspaceFilters,
              ...filters,
            },
          })),

        setMemberFilters: (filters) =>
          set((state) => ({
            memberFilters: {
              ...state.memberFilters,
              ...filters,
            },
          })),

        resetFilters: () =>
          set({
            workspaceFilters: initialWorkspaceFilters,
            memberFilters: initialMemberFilters,
          }),
      }),
      {
        name: 'workspace-store',
        partialize: (state) => ({
          currentWorkspaceId: state.currentWorkspaceId,
          currentUserRole: state.currentUserRole,
        }),
      }
    )
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const useCurrentWorkspace = () =>
  useWorkspaceStore((state) => state.currentWorkspace);

export const useCurrentWorkspaceId = () =>
  useWorkspaceStore((state) => state.currentWorkspaceId);

export const useCurrentUserRole = () =>
  useWorkspaceStore((state) => state.currentUserRole);

export const useWorkspaceLoading = () =>
  useWorkspaceStore((state) => state.isLoading);

export const useWorkspaceError = () =>
  useWorkspaceStore((state) => state.error);

export const useWorkspaceFilters = () =>
  useWorkspaceStore((state) => state.workspaceFilters);

export const useMemberFilters = () =>
  useWorkspaceStore((state) => state.memberFilters);

// ============================================================================
// Permission Helpers
// ============================================================================

/**
 * Check if user can manage workspace (owner or admin)
 */
export const useCanManageWorkspace = () => {
  const role = useCurrentUserRole();
  return role === 'owner' || role === 'admin';
};

/**
 * Check if user can manage members
 */
export const useCanManageMembers = () => {
  const role = useCurrentUserRole();
  return role === 'owner' || role === 'admin';
};

/**
 * Check if user can manage invitations
 */
export const useCanManageInvitations = () => {
  const role = useCurrentUserRole();
  return role === 'owner' || role === 'admin';
};

/**
 * Check if user can view analytics
 */
export const useCanViewAnalytics = () => {
  const role = useCurrentUserRole();
  return role === 'owner' || role === 'admin' || role === 'member';
};

/**
 * Check if user is owner
 */
export const useIsOwner = () => {
  const role = useCurrentUserRole();
  return role === 'owner';
};
