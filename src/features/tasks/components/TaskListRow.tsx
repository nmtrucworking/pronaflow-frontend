
import { CalendarDays } from 'lucide-react';
import type { DensityMode, TaskEntity } from '../types';
import { STATUS_CONFIG } from '../constants';
import { cn } from '../utils';
import { TaskActionsMenu } from './TaskActionsMenu';
import { PriorityBadge } from './PriorityBadge';
import { ProjectTag } from './ProjectTag';
import { AssigneeAvatarGroup } from './AssigneeAvatarGroup';

export const TaskListRow = ({ task, density = 'COMFORTABLE', onViewDetails }: { task: TaskEntity; density?: DensityMode; onViewDetails: () => void }) => {
  const StatusIcon = STATUS_CONFIG[task.status].icon;
  const isCompact = density === 'COMPACT';
  const isDone = task.status === 'DONE';

  return (
    <div className={cn("group flex items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-all duration-200 px-4 relative overflow-hidden cursor-default", isCompact ? "py-2.5" : "py-4")}> 
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 -translate-x-full group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
      <button className="flex-shrink-0 mr-4 text-slate-400 hover:text-indigo-600 transition-colors active:scale-90 duration-200 transform focus:outline-none"><StatusIcon className={cn("w-5 h-5 transition-all duration-300", isDone ? "text-emerald-500" : "group-hover:stroke-[2.5px]")} /></button>
      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-6 md:col-span-5 pr-4 cursor-pointer" onClick={onViewDetails}>
          <div className="flex items-center gap-2 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity"><span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">{task.key}</span><PriorityBadge priority={task.priority} /></div>
          <h4 className={cn("font-medium text-slate-900 truncate transition-colors duration-200 group-hover:text-indigo-700", isCompact ? "text-sm" : "text-[15px]", isDone && "text-slate-400 line-through decoration-slate-300")}>{task.title}</h4>
        </div>
        <div className="hidden md:block col-span-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300"><ProjectTag project={task.project} /></div>
        <div className="col-span-6 md:col-span-4 flex items-center justify-end space-x-6">
          <div className="flex items-center gap-3">
             <div className="opacity-70 group-hover:opacity-100 transition-opacity"><AssigneeAvatarGroup users={task.assignees} /></div>
             <div className={cn("flex items-center text-xs px-2 py-1 rounded transition-colors duration-200 whitespace-nowrap", new Date(task.dueDate) < new Date() && !isDone ? "text-red-600 font-bold bg-red-50" : "text-slate-500 group-hover:bg-white group-hover:shadow-sm")}> 
                <CalendarDays className={cn("w-3.5 h-3.5 mr-1.5", new Date(task.dueDate) < new Date() && !isDone && "animate-pulse")} />{new Date(task.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </div>
          </div>
          <TaskActionsMenu onViewDetails={onViewDetails} />
        </div>
      </div>
    </div>
  );
};
