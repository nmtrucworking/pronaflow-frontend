import * as Checkbox from '@radix-ui/react-checkbox';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Check, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskEntity, DensityMode } from '../types/dashboard-types';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskActionsMenu } from './TaskActionsMenu';

interface TaskRowProps {
  task: TaskEntity;
  density: DensityMode;
  onToggle: (id: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, density, onToggle }) => {
  const isOverdue =
    new Date(task.planned_end) < new Date() &&
    new Date(task.planned_end).toDateString() !== new Date().toDateString() &&
    task.status !== 'DONE';

  const paddingClass = density === 'comfortable' ? 'py-3' : 'py-1.5';
  const titleSize = density === 'comfortable' ? 'text-sm' : 'text-xs';

  return (
    <div
      className={cn(
        'group flex items-center border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200 px-4 relative overflow-hidden',
        paddingClass
      )}
    >
      {/* Selection Highlight Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex-shrink-0 mr-3 z-10">
        <Checkbox.Root
          className="flex h-5 w-5 appearance-none items-center justify-center rounded border border-slate-300 bg-white hover:border-indigo-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-900 transition-all duration-200 active:scale-90"
          id={`task-${task.task_id}`}
          checked={task.status === 'DONE'}
          onCheckedChange={() => onToggle(task.task_id)}
        >
          <Checkbox.Indicator>
            <Check className="h-3.5 w-3.5 text-white animate-in zoom-in duration-200" />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center z-10">
        <div className="col-span-12 md:col-span-6">
          <div className="flex items-center space-x-2">
            <span className="flex-shrink-0 text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
              {task.project.key}-{task.task_number}
            </span>
            <TaskPriorityBadge priority={task.priority} />
          </div>
          <p
            className={cn(
              'font-medium text-slate-900 dark:text-slate-100 truncate mt-1 cursor-pointer group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200',
              titleSize,
              task.status === 'DONE' &&
                'line-through text-slate-400 decoration-slate-400 group-hover:text-slate-500'
            )}
          >
            {task.title}
          </p>
        </div>

        <div className="hidden md:block col-span-3">
          <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-default">
            {task.project.name}
          </span>
        </div>

        <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end space-x-4">
          <div
            className={cn(
              'flex items-center text-xs whitespace-nowrap transition-colors duration-200',
              isOverdue
                ? 'text-red-600 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/50'
                : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
            )}
          >
            <CalendarIcon className="w-3 h-3 mr-1.5" />
            {new Date(task.planned_end).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
            })}
          </div>

          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300">
              {task.assignees.map(user => (
                <Tooltip.Provider key={user.user_id}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 grayscale-[0.2] hover:grayscale-0 hover:ring-indigo-100 dark:hover:ring-indigo-900 hover:scale-110 transition-all duration-200 z-0 hover:z-10 shadow-sm"
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Content
                      className="px-2 py-1 text-xs bg-slate-900 text-white rounded shadow-md z-50 animate-in fade-in zoom-in-95 duration-200"
                      sideOffset={5}
                    >
                      {user.username}
                      <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Tooltip.Provider>
              ))}
            </div>

            <TaskActionsMenu />
          </div>
        </div>
      </div>
    </div>
  );
};
