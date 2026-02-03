/**
 * Analytics & Reports Types
 * Module 9: Reports & Analytics
 */

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
}
