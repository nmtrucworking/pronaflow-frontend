import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BulkUpdateDTO, CreateTaskDTO } from '@/services/taskService';
import { taskService } from '@/services/taskService';

const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...taskQueryKeys.lists(), filters ?? {}] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (taskId: string) => [...taskQueryKeys.details(), taskId] as const,
};

export function useTasks(params?: {
  project_id?: string;
  task_list_id?: string;
  status?: string;
  priority?: string;
  assigned_to?: string;
  due_date_from?: string;
  due_date_to?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
}) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => taskService.getTasks(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useTask(taskId?: string) {
  return useQuery({
    queryKey: taskQueryKeys.detail(taskId || ''),
    queryFn: () => taskService.getTask(taskId || ''),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskDTO) => taskService.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
}

export function useCreateTaskList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { project_id: string; name: string; position?: number }) =>
      taskService.createTaskList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
}

export function useBulkUpdateTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkUpdateDTO) => taskService.bulkUpdateTasks(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
}

export function useBulkDeleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskIds: string[]) => taskService.bulkDeleteTasks(taskIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
    },
  });
}
