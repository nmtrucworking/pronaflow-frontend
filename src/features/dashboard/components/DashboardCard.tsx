import { cn } from '@/lib/utils';
import type { TaskGroupType } from '../types/dashboard-types';
import { TASK_GROUP_HEADER_COLORS } from '../constants/dashboard-constants';
import { ChevronRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  type?: 'danger' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, type }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default group">
    <div className="flex justify-between items-start">
      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {label}
      </p>
      {type === 'danger' && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
    </div>
    <div className="mt-2 flex items-baseline">
      <span
        className={cn(
          'text-3xl font-bold tracking-tight',
          type === 'danger'
            ? 'text-red-600 dark:text-red-400'
            : type === 'success'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-900 dark:text-white'
        )}
      >
        {value}
      </span>
    </div>
    <p className="text-xs text-slate-400 mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
      {subtext}
    </p>
  </div>
);

interface TaskGroupProps {
  title: string;
  count: number;
  type: TaskGroupType;
  children: React.ReactNode;
  onSeeAll?: () => void;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({ title, count, type, children, onSeeAll }) => {
  const headerColor = TASK_GROUP_HEADER_COLORS[type];

  if (count === 0) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between mb-3 group/header cursor-pointer" onClick={onSeeAll}>
        <h3
          className={cn(
            'text-sm font-semibold flex items-center uppercase tracking-wider transition-opacity hover:opacity-80',
            headerColor
          )}
        >
          {title}
          <span className="ml-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-0.5 px-2 rounded-full text-xs font-bold shadow-sm">
            {count}
          </span>
        </h3>

        <button className="flex items-center text-xs font-medium text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all opacity-0 group-hover/header:opacity-100 -translate-x-2 group-hover/header:translate-x-0 duration-300">
          Xem tất cả <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 transition-all hover:shadow-md">
        {children}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'All caught up!',
  description = 'Bạn đã hoàn thành hết công việc hôm nay. Thư giãn thôi!',
}) => (
  <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 animate-in zoom-in duration-300">
    <div className="w-16 h-16 mx-auto bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-emerald-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-1">{description}</p>
  </div>
);
