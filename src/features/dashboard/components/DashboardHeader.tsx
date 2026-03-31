import * as Progress from '@radix-ui/react-progress';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Plus, CalendarDays, Clock, EyeOff, LayoutGrid, List as ListIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/localeFormatters';
import type { DensityMode, DashboardConfig, GroupedTasks } from '../types/dashboard-types';
import { StatCard } from './DashboardCard';
import { DashboardCustomizer } from './DashboardCustomizer';

interface DashboardHeaderProps {
  user: { username: string };
  density: DensityMode;
  config: DashboardConfig;
  groupedTasks: GroupedTasks;
  onDensityChange: (mode: DensityMode) => void;
  onConfigToggle: (key: keyof DashboardConfig) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  density,
  config,
  groupedTasks,
  onDensityChange,
  onConfigToggle,
}) => {
  return (
    <header className="px-6 py-6 md:py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Chào buổi sáng, {user.username} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center">
            <CalendarDays className="w-4 h-4 mr-1.5" />
            {formatDate(new Date(), {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
          <DashboardCustomizer config={config} onToggle={onConfigToggle} />

          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => onDensityChange('comfortable')}
                    className={cn(
                      'p-1.5 rounded transition-all active:scale-95',
                      density === 'comfortable'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className="px-2 py-1 text-xs bg-slate-900 text-white rounded" sideOffset={5}>
                  Chế độ Thoải mái
                </Tooltip.Content>
              </Tooltip.Root>

              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => onDensityChange('compact')}
                    className={cn(
                      'p-1.5 rounded transition-all active:scale-95',
                      density === 'compact'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Content className="px-2 py-1 text-xs bg-slate-900 text-white rounded" sideOffset={5}>
                  Chế độ Thu gọn
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>

          <button className="flex items-center justify-center w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Zone */}
      {config.showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-500 ease-out">
          <StatCard
            label="Quá hạn"
            value={groupedTasks.overdue.length.toString()}
            subtext="Cần xử lý ngay"
            type={groupedTasks.overdue.length > 0 ? 'danger' : undefined}
          />
          <StatCard
            label="Hôm nay"
            value={groupedTasks.today.length.toString()}
            subtext="Khoảng 4.5 giờ làm việc"
          />
          <StatCard
            label="Sắp tới"
            value={groupedTasks.upcoming.length.toString()}
            subtext="Trong 7 ngày tới"
          />

          {config.showWeeklyProgress ? (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-4 rounded-xl text-white shadow-lg flex flex-col justify-between hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Clock className="w-16 h-16 transform rotate-12" />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                  Hiệu suất tuần
                </span>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-bold">85%</span>
                  <span className="text-xs opacity-90 font-medium bg-white/20 px-2 py-0.5 rounded-full">
                    Xuất sắc
                  </span>
                </div>
                <Progress.Root
                  className="relative overflow-hidden bg-black/20 rounded-full w-full h-1.5"
                  value={85}
                >
                  <Progress.Indicator
                    className="bg-white w-full h-full transition-transform duration-[1000ms] ease-out"
                    style={{ transform: `translateX(-${100 - 85}%)` }}
                  />
                </Progress.Root>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-400 text-xs hover:border-slate-300 transition-colors">
              <span className="flex items-center gap-2">
                <EyeOff className="w-3 h-3" /> Widget ẩn
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
