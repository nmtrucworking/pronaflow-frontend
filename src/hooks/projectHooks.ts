/**
 * Project Hooks
 * Module 3: Project Lifecycle Management
 * Custom React hooks for project operations with React Query integration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { projectService } from '@/services/projectService';
import {
  Project,
  ProjectMember,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectTemplate,
  ChangeRequest,
  ProjectMetrics,
  ProjectSettings,
  ProjectListResponse,
} from '@/types/project';

// Query keys
const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...projectQueryKeys.lists(), { ...filters }] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
  members: () => [...projectQueryKeys.all, 'members'] as const,
  membersList: (projectId: string) => [...projectQueryKeys.members(), projectId] as const,
  templates: () => [...projectQueryKeys.all, 'templates'] as const,
  templatesList: () => [...projectQueryKeys.templates()] as const,
  changeRequests: () => [...projectQueryKeys.all, 'changeRequests'] as const,
  changeRequestsList: (projectId: string) => [...projectQueryKeys.changeRequests(), projectId] as const,
  metrics: () => [...projectQueryKeys.all, 'metrics'] as const,
  projectMetrics: (projectId: string) => [...projectQueryKeys.metrics(), projectId] as const,
  settings: () => [...projectQueryKeys.all, 'settings'] as const,
  projectSettings: (projectId: string) => [...projectQueryKeys.settings(), projectId] as const,
};

// ========================================================================
// Project List & Detail Hooks
// ========================================================================

/**
 * Fetch list of projects with filtering and pagination
 */
export function useProjects(
  workspaceId?: string,
  status?: string,
  page: number = 1,
  pageSize: number = 20,
  sortBy: string = 'created_at',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: projectQueryKeys.list({ workspaceId, status, page, pageSize, sortBy }),
    queryFn: () =>
      projectService.listProjects(workspaceId, status, page, pageSize, sortBy),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch single project details
 */
export function useProject(projectId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.detail(projectId || ''),
    queryFn: () => projectService.getProject(projectId!),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Create new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectDTO) => projectService.createProject(data),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    },
  });
}

/**
 * Update project information
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectDTO }) =>
      projectService.updateProject(projectId, data),
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(updatedProject.project_id) });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update project';
      toast.error(message);
    },
  });
}

/**
 * Update project status
 */
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      status,
      completionDate,
    }: {
      projectId: string;
      status: string;
      completionDate?: string;
    }) => projectService.updateProjectStatus(projectId, status, completionDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.detail(variables.projectId),
      });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project status updated');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
    },
  });
}

/**
 * Delete project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
    },
  });
}

/**
 * Clone project
 */
export function useCloneProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      newName,
      copyTasks,
      copyMembers,
    }: {
      projectId: string;
      newName: string;
      copyTasks?: boolean;
      copyMembers?: boolean;
    }) => projectService.cloneProject(projectId, newName, copyTasks, copyMembers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project cloned successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to clone project';
      toast.error(message);
    },
  });
}

// ========================================================================
// Project Member Hooks
// ========================================================================

/**
 * Fetch project members
 */
export function useProjectMembers(projectId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.membersList(projectId || ''),
    queryFn: () => projectService.listProjectMembers(projectId!),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Add member to project
 */
export function useAddProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
      role,
    }: {
      projectId: string;
      userId: string;
      role?: string;
    }) => projectService.addProjectMember(projectId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.membersList(variables.projectId),
      });
      toast.success('Member added to project');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);
    },
  });
}

/**
 * Update project member role
 */
export function useUpdateProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
      role,
    }: {
      projectId: string;
      userId: string;
      role: string;
    }) => projectService.updateProjectMemberRole(projectId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.membersList(variables.projectId),
      });
      toast.success('Member role updated');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update member';
      toast.error(message);
    },
  });
}

/**
 * Remove member from project
 */
export function useRemoveProjectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => projectService.removeProjectMember(projectId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.membersList(variables.projectId),
      });
      toast.success('Member removed from project');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    },
  });
}

/**
 * Add multiple members to project
 */
export function useAddMultipleProjectMembers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      members,
    }: {
      projectId: string;
      members: Array<{ userId: string; role: string }>;
    }) => projectService.addMultipleProjectMembers(projectId, members),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.membersList(variables.projectId),
      });
      toast.success('Members added successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add members';
      toast.error(message);
    },
  });
}

// ========================================================================
// Project Template Hooks
// ========================================================================

/**
 * Fetch project templates
 */
export function useProjectTemplates(page: number = 1, pageSize: number = 20, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.templatesList(),
    queryFn: () => projectService.listTemplates(page, pageSize),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - templates don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Create project template
 */
export function useCreateProjectTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
      structure,
    }: {
      name: string;
      description?: string;
      structure?: Record<string, any>;
    }) => projectService.createTemplate(name, description, structure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.templatesList() });
      toast.success('Template created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create template';
      toast.error(message);
    },
  });
}

/**
 * Create project from template
 */
export function useCreateProjectFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      workspaceId,
      projectName,
      startDate,
    }: {
      templateId: string;
      workspaceId: string;
      projectName: string;
      startDate: string;
    }) =>
      projectService.createProjectFromTemplate(templateId, workspaceId, projectName, startDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Project created from template');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create project from template';
      toast.error(message);
    },
  });
}

// ========================================================================
// Change Request Hooks
// ========================================================================

/**
 * Fetch change requests for project
 */
export function useChangeRequests(projectId?: string, status?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.changeRequestsList(projectId || ''),
    queryFn: () => projectService.listChangeRequests(projectId!, status),
    enabled: enabled && !!projectId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Create change request
 */
export function useCreateChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      title,
      description,
      scope,
      impactAnalysis,
      requestedChanges,
    }: {
      projectId: string;
      title: string;
      description: string;
      scope: string;
      impactAnalysis: string;
      requestedChanges: Record<string, any>;
    }) =>
      projectService.createChangeRequest(
        projectId,
        title,
        description,
        scope,
        impactAnalysis,
        requestedChanges
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.changeRequestsList(variables.projectId),
      });
      toast.success('Change request created');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create change request';
      toast.error(message);
    },
  });
}

/**
 * Approve/Reject change request
 */
export function useApproveChangeRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      changeRequestId,
      approved,
      reviewerNotes,
    }: {
      projectId: string;
      changeRequestId: string;
      approved: boolean;
      reviewerNotes?: string;
    }) =>
      projectService.approveChangeRequest(projectId, changeRequestId, approved, reviewerNotes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.changeRequestsList(variables.projectId),
      });
      toast.success(
        variables.approved
          ? 'Change request approved'
          : 'Change request rejected'
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to review change request';
      toast.error(message);
    },
  });
}

// ========================================================================
// Project Metrics & Health Hooks
// ========================================================================

/**
 * Fetch project metrics and health status
 */
export function useProjectMetrics(projectId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.projectMetrics(projectId || ''),
    queryFn: () => projectService.getProjectMetrics(projectId!),
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes - health updates frequently
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch project settings
 */
export function useProjectSettings(projectId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectQueryKeys.projectSettings(projectId || ''),
    queryFn: () => projectService.getProjectSettings(projectId!),
    enabled: enabled && !!projectId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Update project settings
 */
export function useUpdateProjectSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      settings,
    }: {
      projectId: string;
      settings: Partial<ProjectSettings>;
    }) => projectService.updateProjectSettings(projectId, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectQueryKeys.projectSettings(variables.projectId),
      });
      toast.success('Settings updated');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
    },
  });
}

// ========================================================================
// Utility Hooks
// ========================================================================

/**
 * Refresh project data manually
 */
export function useRefreshProject(projectId?: string) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: projectQueryKeys.detail(projectId || ''),
    });
  }, [projectId, queryClient]);
}

/**
 * Refresh all project lists
 */
export function useRefreshProjects() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
  }, [queryClient]);
}

/**
 * Get project with all related data (members, metrics, settings)
 */
export function useProjectComplete(projectId?: string, enabled: boolean = true) {
  const projectQuery = useProject(projectId, enabled);
  const membersQuery = useProjectMembers(projectId, enabled && !!projectId);
  const metricsQuery = useProjectMetrics(projectId, enabled && !!projectId);
  const settingsQuery = useProjectSettings(projectId, enabled && !!projectId);

  return {
    isLoading: projectQuery.isLoading || membersQuery.isLoading || metricsQuery.isLoading || settingsQuery.isLoading,
    isError: projectQuery.isError || membersQuery.isError || metricsQuery.isError || settingsQuery.isError,
    error:
      projectQuery.error ||
      membersQuery.error ||
      metricsQuery.error ||
      settingsQuery.error,
    data: {
      project: projectQuery.data,
      members: membersQuery.data,
      metrics: metricsQuery.data,
      settings: settingsQuery.data,
    },
  };
}

/**
 * Archive multiple projects
 */
export function useArchiveMultipleProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectIds: string[]) => projectService.archiveMultipleProjects(projectIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      toast.success('Projects archived successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to archive projects';
      toast.error(message);
    },
  });
}
