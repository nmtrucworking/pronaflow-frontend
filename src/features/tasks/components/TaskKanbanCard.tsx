import { useState, type MouseEvent } from 'react';
import { Clock, Flag } from 'lucide-react';
import type { TaskEntity } from '../types';
import { cn } from '../utils';
import { TaskActionsMenu } from './TaskActionsMenu';
import { PriorityBadge } from './PriorityBadge';
import { AssigneeAvatarGroup } from './AssigneeAvatarGroup';

export const TaskKanbanCard = ({
  task,
  compact = false,
  onViewDetails,
  onOpenProject,
}: {
  task: TaskEntity;
  compact?: boolean;
  onViewDetails: () => void;
  onOpenProject?: () => void;
}) => {
  const [isRightClickAnimated, setIsRightClickAnimated] = useState(false);

  const handleContextMenu = () => {
    setIsRightClickAnimated(true);
    window.setTimeout(() => setIsRightClickAnimated(false), 260);
  };

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, [role="menu"]')) {
      return;
    }
    onViewDetails();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 ease-out cursor-grab active:cursor-grabbing group relative overflow-hidden flex-shrink-0 w-full",
        compact ? 'p-2.5 mb-2.5' : 'p-3.5 mb-3',
        isRightClickAnimated && 'ring-2 ring-indigo-200 bg-indigo-50/30 scale-[1.01]'
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", task.project.color)} />
      <div className={cn('flex justify-between items-start', compact ? 'mb-2' : 'mb-2.5')}>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-colors">{task.key}</span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity"><TaskActionsMenu onViewDetails={onViewDetails} /></div>
      </div>
      <h4 className={cn('font-semibold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-700 transition-colors cursor-pointer', compact ? 'text-[13px] mb-2' : 'text-sm mb-3')} onClick={onViewDetails}>{task.title}</h4>
      {task.isMilestone && (
        <div className={cn('inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded', compact ? 'mb-2' : 'mb-3')}>
          <Flag className="w-3 h-3" />
          Milestone
        </div>
      )}
      <button type="button" onClick={onOpenProject} className={cn('text-xs font-medium text-slate-500 hover:text-indigo-700 transition-colors inline-flex max-w-full truncate', compact ? 'mb-2' : 'mb-3')}>{task.project.name}</button>
      <div className={cn('flex items-center justify-between mt-auto border-t border-slate-50 group-hover:border-slate-100 transition-colors', compact ? 'pt-1.5' : 'pt-2')}>
        <div className="flex items-center gap-2"><AssigneeAvatarGroup users={task.assignees} limit={2} /></div>
        <div className="flex items-center gap-2">
          {new Date(task.dueDate) < new Date() && task.status !== 'DONE' && (
            <span className="flex items-center text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
    </div>
  );
};
