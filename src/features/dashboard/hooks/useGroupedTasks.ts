import { useMemo } from 'react';
import type { TaskEntity, GroupedTasks } from '../types/dashboard-types';

interface UseGroupedTasksParams {
  tasks: TaskEntity[];
}

export const useGroupedTasks = ({ tasks }: UseGroupedTasksParams): GroupedTasks => {
  return useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();

    return {
      overdue: tasks.filter(
        t =>
          new Date(t.planned_end) < now &&
          new Date(t.planned_end).toDateString() !== today &&
          t.status !== 'DONE'
      ),
      today: tasks.filter(
        t =>
          new Date(t.planned_end).toDateString() === today &&
          t.status !== 'DONE'
      ),
      upcoming: tasks.filter(
        t =>
          new Date(t.planned_end) > now &&
          new Date(t.planned_end).toDateString() !== today &&
          t.status !== 'DONE'
      ),
      done: tasks.filter(t => t.status === 'DONE'),
    };
  }, [tasks]);
};
