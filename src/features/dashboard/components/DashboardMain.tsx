import * as Progress from '@radix-ui/react-progress';
import { Clock, CalendarDays, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GroupedTasks, DensityMode, DashboardConfig } from '../types/dashboard-types';
import { TaskRow } from './TaskRow';
import { TaskGroup, StatCard, EmptyState } from './DashboardCard';
import { FilterMenu } from './FilterMenu';

interface DashboardMainProps {
  user: { username: string };
  groupedTasks: GroupedTasks;
  density: DensityMode;
  config: DashboardConfig;
  onToggleTask: (id: string) => void;
  onNavigate: (type: string) => void;
}

export const DashboardMain: React.FC<DashboardMainProps> = ({
  user,
  groupedTasks,
  density,
  config,
  onToggleTask,
  onNavigate,
}) => {
  return (
    <main className="px-6 pb-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Task Lists */}
      <div
        className={cn(
          'space-y-2 transition-all duration-300',
          config.showCalendar || config.showActivity ? 'lg:col-span-8' : 'lg:col-span-12'
        )}
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm z-30 py-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            />
          </div>

          <FilterMenu />
        </div>

        <TaskGroup
          title="Quá hạn"
          count={groupedTasks.overdue.length}
          type="danger"
          onSeeAll={() => onNavigate('overdue')}
        >
          {groupedTasks.overdue.map(task => (
            <TaskRow
              key={task.task_id}
              task={task}
              density={density}
              onToggle={onToggleTask}
            />
          ))}
        </TaskGroup>

        <TaskGroup
          title="Hôm nay"
          count={groupedTasks.today.length}
          type="info"
          onSeeAll={() => onNavigate('today')}
        >
          {groupedTasks.today.length > 0 ? (
            groupedTasks.today.map(task => (
              <TaskRow
                key={task.task_id}
                task={task}
                density={density}
                onToggle={onToggleTask}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TaskGroup>

        <TaskGroup
          title="Sắp tới"
          count={groupedTasks.upcoming.length}
          type="neutral"
          onSeeAll={() => onNavigate('upcoming')}
        >
          {groupedTasks.upcoming.map(task => (
            <TaskRow
              key={task.task_id}
              task={task}
              density={density}
              onToggle={onToggleTask}
            />
          ))}
        </TaskGroup>

        <div className="pt-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            Đã hoàn thành
            <span className="ml-2 text-[10px] font-normal bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
              RECENT
            </span>
          </h3>
          <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
            {groupedTasks.done.slice(0, 3).map(task => (
              <TaskRow
                key={task.task_id}
                task={task}
                density={density}
                onToggle={onToggleTask}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Sidebar */}
      {(config.showCalendar || config.showActivity) && (
        <aside className="hidden lg:block lg:col-span-4 space-y-6 animate-in slide-in-from-right-8 duration-500">
          {/* Calendar Widget */}
          {config.showCalendar && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm sticky top-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" /> Lịch tháng
                  {new Date().getMonth() + 1}
                </h3>
                <button className="text-xs text-indigo-600 hover:underline">
                  Mở rộng
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                  <span
                    key={day}
                    className="text-[10px] font-bold text-slate-400 uppercase"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 relative group',
                      i === 11
                        ? 'bg-indigo-600 text-white font-bold shadow-indigo-200 shadow-md transform scale-105'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105',
                      [10, 14, 22].includes(i) &&
                        i !== 11 &&
                        'font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50'
                    )}
                  >
                    {i + 1}
                    {[10, 14, 22].includes(i) && (
                      <div className="absolute bottom-1 w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Widget */}
          {config.showActivity && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold mb-4 text-slate-900 dark:text-white">
                Hoạt động gần đây
              </h3>
              <div className="relative pl-2 border-l border-slate-100 dark:border-slate-800 space-y-6">
                <div className="relative pl-4 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500 shadow-sm group-hover:scale-125 transition-transform" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Sarah
                    </span>{' '}
                    đã hoàn thành task{' '}
                    <span className="font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-1 rounded">
                      MKT-88
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">10 phút trước</p>
                </div>
                <div className="relative pl-4 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 shadow-sm group-hover:scale-125 transition-transform" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Hệ thống
                    </span>{' '}
                    đã gán bạn vào{' '}
                    <span className="font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-1 rounded">
                      DOCS-205
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">1 giờ trước</p>
                </div>
                <div className="relative pl-4 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-600 shadow-sm group-hover:scale-125 transition-transform" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Bạn
                    </span>{' '}
                    đã bình luận trong{' '}
                    <span className="font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-1 rounded">
                      PFLOW-101
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">3 giờ trước</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </main>
  );
};
