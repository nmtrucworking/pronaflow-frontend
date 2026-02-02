/**
 * Project Store
 * Module 3: Project Lifecycle Management
 * Zustand store for project-related client state
 */

import { create } from 'zustand';
import { Project, ProjectMember, ChangeRequest } from '@/types/project';

interface ProjectFilters {
  workspaceId?: string;
  status?: string;
  priority?: string;
  searchQuery?: string;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'progress';
  sortOrder?: 'asc' | 'desc';
}

interface ProjectUIState {
  selectedProjectId: string | null;
  selectedMembers: Set<string>;
  isDetailsModalOpen: boolean;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedDeleteProject: Project | null;
  viewMode: 'grid' | 'list' | 'kanban';
}

interface ProjectStoreState {
  // Data state
  projects: Project[];
  selectedProject: Project | null;
  projectMembers: ProjectMember[];
  changeRequests: ChangeRequest[];

  // Filter & sort state
  filters: ProjectFilters;

  // UI state
  ui: ProjectUIState;

  // Actions
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  setProjectMembers: (members: ProjectMember[]) => void;
  setChangeRequests: (requests: ChangeRequest[]) => void;

  // Filter actions
  setFilters: (filters: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
  clearSearchQuery: () => void;

  // UI actions
  setSelectedProjectId: (id: string | null) => void;
  toggleMemberSelection: (memberId: string) => void;
  clearMemberSelection: () => void;
  setDetailsModalOpen: (open: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setEditModalOpen: (open: boolean) => void;
  setDeleteModalOpen: (open: boolean, project?: Project) => void;
  setViewMode: (mode: 'grid' | 'list' | 'kanban') => void;

  // Computed getters
  getFilteredProjects: () => Project[];
  getProjectStats: () => {
    total: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
}

const defaultFilters: ProjectFilters = {
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const defaultUIState: ProjectUIState = {
  selectedProjectId: null,
  selectedMembers: new Set(),
  isDetailsModalOpen: false,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedDeleteProject: null,
  viewMode: 'grid',
};

export const useProjectStore = create<ProjectStoreState>((set, get) => ({
  // Initial state
  projects: [],
  selectedProject: null,
  projectMembers: [],
  changeRequests: [],
  filters: defaultFilters,
  ui: defaultUIState,

  // Data actions
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  setProjectMembers: (members) => set({ projectMembers: members }),
  setChangeRequests: (requests) => set({ changeRequests: requests }),

  // Filter actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  clearSearchQuery: () =>
    set((state) => ({
      filters: { ...state.filters, searchQuery: undefined },
    })),

  // UI actions
  setSelectedProjectId: (id) =>
    set((state) => ({
      ui: { ...state.ui, selectedProjectId: id },
    })),

  toggleMemberSelection: (memberId) =>
    set((state) => {
      const newSelected = new Set(state.ui.selectedMembers);
      if (newSelected.has(memberId)) {
        newSelected.delete(memberId);
      } else {
        newSelected.add(memberId);
      }
      return {
        ui: { ...state.ui, selectedMembers: newSelected },
      };
    }),

  clearMemberSelection: () =>
    set((state) => ({
      ui: { ...state.ui, selectedMembers: new Set() },
    })),

  setDetailsModalOpen: (open) =>
    set((state) => ({
      ui: { ...state.ui, isDetailsModalOpen: open },
    })),

  setCreateModalOpen: (open) =>
    set((state) => ({
      ui: { ...state.ui, isCreateModalOpen: open },
    })),

  setEditModalOpen: (open) =>
    set((state) => ({
      ui: { ...state.ui, isEditModalOpen: open },
    })),

  setDeleteModalOpen: (open, project) =>
    set((state) => ({
      ui: {
        ...state.ui,
        isDeleteModalOpen: open,
        selectedDeleteProject: project || null,
      },
    })),

  setViewMode: (mode) =>
    set((state) => ({
      ui: { ...state.ui, viewMode: mode },
    })),

  // Computed getters
  getFilteredProjects: () => {
    const state = get();
    const { projects, filters } = state;

    let filtered = [...projects];

    // Apply filters
    if (filters.workspaceId) {
      filtered = filtered.filter((p) => p.workspace_id === filters.workspaceId);
    }

    if (filters.status) {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter((p) => p.priority === filters.priority);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.key.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy || 'created_at'];
      let bValue: any = b[filters.sortBy || 'created_at'];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  },

  getProjectStats: () => {
    const state = get();
    const projects = state.projects;

    return {
      total: projects.length,
      inProgress: projects.filter((p) => p.status === 'IN_PROGRESS').length,
      completed: projects.filter((p) => p.status === 'DONE').length,
      onHold: projects.filter((p) => p.status === 'ON_HOLD').length,
    };
  },
}));
