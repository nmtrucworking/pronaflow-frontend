/**
 * Scheduling API Service
 * Module 5: Temporal Planning and Scheduling
 */

import type { AxiosInstance } from 'axios';
import { createApiClient } from '@/lib/axiosClient';

export interface SchedulingGanttFilter {
  project_id: string;
  zoom_level?: 'day' | 'week' | 'month' | 'quarter';
  start_date?: string;
  end_date?: string;
  include_milestones?: boolean;
  show_critical_path?: boolean;
  show_baseline?: boolean;
}

export interface SchedulingGanttResponse {
  tasks: Array<Record<string, unknown>>;
  dependencies: Array<Record<string, unknown>>;
  milestones: Array<Record<string, unknown>>;
  baselines: Array<Record<string, unknown>>;
}

export interface CriticalPathAnalysisResponse {
  total_float_hours: number;
  critical_task_ids: string[];
  project_end_date: string;
  updated_at: string;
}

export interface TaskBaselineCreateDTO {
  task_id: string;
  baseline_version?: number;
}

export interface TaskBaselineResponse {
  id: string;
  task_id: string;
  baseline_version: number;
  baseline_start: string;
  baseline_end: string;
  baseline_duration_hours: number;
  actual_start?: string | null;
  actual_end?: string | null;
  actual_duration_hours?: number | null;
  schedule_variance_days?: number | null;
  created_by: string;
  created_at: string;
}

export interface SimulationSessionStartDTO {
  project_id: string;
  notes?: string;
}

export interface SimulationSessionResponse {
  id: string;
  project_id: string;
  created_by: string;
  is_active: boolean;
  delta_project_end_days?: number | null;
  new_critical_path_count?: number | null;
  sla_at_risk_count?: number | null;
  resource_overload_increase?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImpactAnalysisResponse {
  delta_project_end_days: number;
  affected_task_ids: string[];
  new_critical_path_count: number;
  sla_at_risk_count: number;
  resource_overload_increase: number;
}

export interface ResourceLevelingRequestDTO {
  project_id: string;
  strategy?: 'within_slack' | 'minimal_shift' | 'balanced';
  preview_only?: boolean;
}

export interface ResourceLevelingResponse {
  tasks_to_move: string[];
  conflict_reduction_percent: number;
  project_end_date_delta_days: number;
  affected_resources: string[];
}

export interface PlanStateResponse {
  id: string;
  project_id: string;
  state: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'LOCKED';
  submitted_by?: string | null;
  submitted_at?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  locked_by?: string | null;
  locked_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

class SchedulingService {
  private api: AxiosInstance;

  constructor() {
    this.api = createApiClient();
  }

  async getGanttChart(params: SchedulingGanttFilter): Promise<SchedulingGanttResponse> {
    const response = await this.api.get<SchedulingGanttResponse>('/scheduling/gantt', {
      params,
    });
    return response.data;
  }

  async getCriticalPath(projectId: string): Promise<CriticalPathAnalysisResponse> {
    const response = await this.api.get<CriticalPathAnalysisResponse>(`/scheduling/critical-path/${projectId}`);
    return response.data;
  }

  async createTaskBaseline(data: TaskBaselineCreateDTO): Promise<TaskBaselineResponse> {
    const response = await this.api.post<TaskBaselineResponse>('/scheduling/baselines', data);
    return response.data;
  }

  async getLatestTaskBaseline(taskId: string): Promise<TaskBaselineResponse> {
    const response = await this.api.get<TaskBaselineResponse>(`/scheduling/baselines/task/${taskId}/latest`);
    return response.data;
  }

  async startSimulation(data: SimulationSessionStartDTO): Promise<SimulationSessionResponse> {
    const response = await this.api.post<SimulationSessionResponse>('/scheduling/simulations', data);
    return response.data;
  }

  async applySimulation(simulationId: string): Promise<SimulationSessionResponse> {
    const response = await this.api.post<SimulationSessionResponse>(`/scheduling/simulations/${simulationId}/apply`);
    return response.data;
  }

  async discardSimulation(simulationId: string): Promise<SimulationSessionResponse> {
    const response = await this.api.post<SimulationSessionResponse>(`/scheduling/simulations/${simulationId}/discard`);
    return response.data;
  }

  async analyzeImpact(taskId: string): Promise<ImpactAnalysisResponse> {
    const response = await this.api.post<ImpactAnalysisResponse>(`/scheduling/impact-analysis/${taskId}`);
    return response.data;
  }

  async levelResources(data: ResourceLevelingRequestDTO): Promise<ResourceLevelingResponse> {
    const response = await this.api.post<ResourceLevelingResponse>('/scheduling/resource-leveling', data);
    return response.data;
  }

  async getPlanState(projectId: string): Promise<PlanStateResponse> {
    const response = await this.api.get<PlanStateResponse>(`/scheduling/plans/${projectId}/state`);
    return response.data;
  }

  async submitPlan(projectId: string): Promise<PlanStateResponse> {
    const response = await this.api.post<PlanStateResponse>(`/scheduling/plans/${projectId}/submit`);
    return response.data;
  }

  async approvePlan(projectId: string, notes?: string): Promise<PlanStateResponse> {
    const response = await this.api.post<PlanStateResponse>(`/scheduling/plans/${projectId}/approve`, null, {
      params: { notes },
    });
    return response.data;
  }

  async lockPlan(projectId: string): Promise<PlanStateResponse> {
    const response = await this.api.post<PlanStateResponse>(`/scheduling/plans/${projectId}/lock`);
    return response.data;
  }
}

export const schedulingService = new SchedulingService();
export default schedulingService;
