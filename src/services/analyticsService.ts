/**
 * Analytics & Reports Service
 * Module 9: Reports & Analytics
 * 
 * Handles all analytics and reporting API calls
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface ProjectMetrics {
  project_id: string;
  health_status: 'green' | 'amber' | 'red';
  metrics: {
    schedule_health: {
      status: 'green' | 'amber' | 'red';
      progress: number;
      on_track: boolean;
    };
    budget_health: {
      status: 'green' | 'amber' | 'red';
      spent_percentage: number;
      spent: number;
    };
    resource_health: {
      status: 'green' | 'amber' | 'red';
      utilization: number;
    };
  };
}

export interface TaskMetrics {
  task_id: string;
  completion_rate: number;
  time_spent: number;
  overdue_count: number;
  upcoming_count: number;
}

export interface WorkspaceAnalytics {
  workspace_id: string;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_tasks: number;
  completed_tasks: number;
  total_members: number;
  active_members: number;
  period: string;
}

export interface Report {
  report_id: string;
  name: string;
  type: 'project' | 'task' | 'team' | 'time' | 'custom';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_by: string;
  created_at: string;
  completed_at?: string;
  file_url?: string;
}

export interface CreateReportRequest {
  name: string;
  type: 'project' | 'task' | 'team' | 'time' | 'custom';
  workspace_id: string;
  project_id?: string;
  date_from?: string;
  date_to?: string;
  filters?: Record<string, any>;
  format?: 'pdf' | 'excel' | 'csv';
}

export interface DashboardMetrics {
  workspace_id: string;
  overview: {
    total_projects: number;
    active_tasks: number;
    team_members: number;
    completion_rate: number;
  };
  recent_activity: Array<{
    activity_id: string;
    type: string;
    description: string;
    user: string;
    timestamp: string;
  }>;
  charts: {
    project_status: Record<string, number>;
    task_priority: Record<string, number>;
    team_workload: Array<{
      user: string;
      tasks_count: number;
    }>;
  };
}

export interface TimeMetrics {
  total_logged: number;
  billable_hours: number;
  non_billable_hours: number;
  by_user: Array<{
    user_id: string;
    user_name: string;
    hours: number;
  }>;
  by_project: Array<{
    project_id: string;
    project_name: string;
    hours: number;
  }>;
}

// ============================================================================
// SERVICE METHODS
// ============================================================================

/**
 * Get project metrics and health status
 */
export const getProjectMetrics = async (
  projectId: string
): Promise<AxiosResponse<ProjectMetrics>> => {
  return axiosClient.get(`/projects/${projectId}/metrics`);
};

/**
 * Get task metrics
 */
export const getTaskMetrics = async (
  projectId: string
): Promise<AxiosResponse<TaskMetrics>> => {
  return axiosClient.get(`/projects/${projectId}/task-metrics`);
};

/**
 * Get workspace analytics
 */
export const getWorkspaceAnalytics = async (
  workspaceId: string,
  params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    date_from?: string;
    date_to?: string;
  }
): Promise<AxiosResponse<WorkspaceAnalytics>> => {
  return axiosClient.get(`/analytics/workspaces/${workspaceId}`, { params });
};

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (
  workspaceId: string
): Promise<AxiosResponse<DashboardMetrics>> => {
  return axiosClient.get(`/analytics/workspaces/${workspaceId}/dashboard`);
};

/**
 * Get time tracking metrics
 */
export const getTimeMetrics = async (
  workspaceId: string,
  params?: {
    project_id?: string;
    user_id?: string;
    date_from?: string;
    date_to?: string;
  }
): Promise<AxiosResponse<TimeMetrics>> => {
  return axiosClient.get(`/analytics/workspaces/${workspaceId}/time-metrics`, { params });
};

/**
 * Create a new report
 */
export const createReport = async (
  data: CreateReportRequest
): Promise<AxiosResponse<Report>> => {
  return axiosClient.post('/reports', data);
};

/**
 * Get list of reports
 */
export const getReports = async (
  params?: {
    workspace_id?: string;
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ reports: Report[]; pagination: any }>> => {
  return axiosClient.get('/reports', { params });
};

/**
 * Get report details
 */
export const getReportById = async (
  reportId: string
): Promise<AxiosResponse<Report>> => {
  return axiosClient.get(`/reports/${reportId}`);
};

/**
 * Download report
 */
export const downloadReport = async (
  reportId: string
): Promise<AxiosResponse<Blob>> => {
  return axiosClient.get(`/reports/${reportId}/download`, {
    responseType: 'blob'
  });
};

/**
 * Delete report
 */
export const deleteReport = async (
  reportId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/reports/${reportId}`);
};

/**
 * Get team productivity metrics
 */
export const getTeamProductivity = async (
  workspaceId: string,
  params?: {
    date_from?: string;
    date_to?: string;
  }
): Promise<AxiosResponse<any>> => {
  return axiosClient.get(`/analytics/workspaces/${workspaceId}/team-productivity`, { params });
};

/**
 * Export analytics data
 */
export const exportAnalytics = async (
  workspaceId: string,
  params: {
    type: 'projects' | 'tasks' | 'time' | 'team';
    format: 'csv' | 'excel';
    date_from?: string;
    date_to?: string;
  }
): Promise<AxiosResponse<Blob>> => {
  return axiosClient.post(
    `/analytics/workspaces/${workspaceId}/export`,
    params,
    { responseType: 'blob' }
  );
};

export default {
  getProjectMetrics,
  getTaskMetrics,
  getWorkspaceAnalytics,
  getDashboardMetrics,
  getTimeMetrics,
  createReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
  getTeamProductivity,
  exportAnalytics,
};
