
import { PRIORITY_CONFIG } from '../constants';
import type { TaskPriority } from '../types';
import { cn } from '../utils';

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border whitespace-nowrap", 
      config.bg, 
      config.color
    )}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};
