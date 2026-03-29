import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  schedulingService,
  type SchedulingGanttFilter,
  type SimulationSessionStartDTO,
  type TaskBaselineCreateDTO,
  type ResourceLevelingRequestDTO,
} from '@/services/schedulingService';

export const schedulingQueryKeys = {
  all: ['scheduling'] as const,
  gantt: () => [...schedulingQueryKeys.all, 'gantt'] as const,
  ganttChart: (filters: SchedulingGanttFilter) => [...schedulingQueryKeys.gantt(), filters] as const,
  criticalPath: () => [...schedulingQueryKeys.all, 'criticalPath'] as const,
  criticalPathByProject: (projectId: string) => [...schedulingQueryKeys.criticalPath(), projectId] as const,
  baseline: () => [...schedulingQueryKeys.all, 'baseline'] as const,
  baselineByTask: (taskId: string) => [...schedulingQueryKeys.baseline(), taskId] as const,
  simulation: () => [...schedulingQueryKeys.all, 'simulation'] as const,
  simulationById: (simulationId: string) => [...schedulingQueryKeys.simulation(), simulationId] as const,
  plan: () => [...schedulingQueryKeys.all, 'plan'] as const,
  planByProject: (projectId: string) => [...schedulingQueryKeys.plan(), projectId] as const,
};

export function useSchedulingGantt(params?: SchedulingGanttFilter) {
  return useQuery({
    queryKey: schedulingQueryKeys.ganttChart(params || ({ project_id: '' } as SchedulingGanttFilter)),
    queryFn: () => schedulingService.getGanttChart(params as SchedulingGanttFilter),
    enabled: !!params?.project_id,
    staleTime: 30 * 1000,
  });
}

export function useCriticalPath(projectId?: string) {
  return useQuery({
    queryKey: schedulingQueryKeys.criticalPathByProject(projectId || ''),
    queryFn: () => schedulingService.getCriticalPath(projectId || ''),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

export function useTaskBaseline(taskId?: string) {
  return useQuery({
    queryKey: schedulingQueryKeys.baselineByTask(taskId || ''),
    queryFn: () => schedulingService.getLatestTaskBaseline(taskId || ''),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

export function useCreateTaskBaseline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskBaselineCreateDTO) => schedulingService.createTaskBaseline(payload),
    onSuccess: (baseline) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.baselineByTask(baseline.task_id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.gantt() });
    },
  });
}

export function useSimulation() {
  const queryClient = useQueryClient();

  const startSimulation = useMutation({
    mutationFn: (payload: SimulationSessionStartDTO) => schedulingService.startSimulation(payload),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.gantt() });
    },
  });

  const applySimulation = useMutation({
    mutationFn: (simulationId: string) => schedulingService.applySimulation(simulationId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.simulationById(result.id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.gantt() });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.criticalPath() });
    },
  });

  const discardSimulation = useMutation({
    mutationFn: (simulationId: string) => schedulingService.discardSimulation(simulationId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.simulationById(result.id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.gantt() });
    },
  });

  return {
    startSimulation,
    applySimulation,
    discardSimulation,
  };
}

export function usePlanState(projectId?: string) {
  return useQuery({
    queryKey: schedulingQueryKeys.planByProject(projectId || ''),
    queryFn: () => schedulingService.getPlanState(projectId || ''),
    enabled: !!projectId,
    staleTime: 30 * 1000,
  });
}

export function useSubmitPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => schedulingService.submitPlan(projectId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
    },
  });
}

export function useApprovePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, notes }: { projectId: string; notes?: string }) =>
      schedulingService.approvePlan(projectId, notes),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.gantt() });
    },
  });
}

export function useLockPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => schedulingService.lockPlan(projectId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: schedulingQueryKeys.planByProject(result.project_id) });
    },
  });
}

export function useResourceLeveling() {
  return useMutation({
    mutationFn: (payload: ResourceLevelingRequestDTO) => schedulingService.levelResources(payload),
  });
}

export function useImpactAnalysis() {
  return useMutation({
    mutationFn: (taskId: string) => schedulingService.analyzeImpact(taskId),
  });
}
