import { cn } from '@/lib/utils';
import type { TaskPriority } from '../types/dashboard-types';
import { PRIORITY_CONFIG } from '../constants/dashboard-constants';

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border shadow-sm', config.color)}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};
