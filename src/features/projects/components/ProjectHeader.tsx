import { LayoutGrid, List as ListIcon, Kanban as KanbanIcon, Search, Plus, Settings2, X, Clipboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from '../constants/viewModes';
import type { ProjectStatus, ProjectPriority } from '@/types/project';
import * as Popover from '@radix-ui/react-popover';

interface ProjectHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFilterPopover: boolean;
  onFilterClick: () => void;
  statusFilter: ProjectStatus | 'ALL';
  priorityFilter: ProjectPriority | 'ALL';
  onStatusFilterChange: (status: ProjectStatus | 'ALL') => void;
  onPriorityFilterChange: (priority: ProjectPriority | 'ALL') => void;
  onCreateClick: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  showFilterPopover,
  onFilterClick,
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onCreateClick,
}) => {
  const statusOptions: Array<{ value: ProjectStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tất cả trạng thái' },
    { value: 'NOT_STARTED', label: 'Chưa bắt đầu' },
    { value: 'IN_PROGRESS', label: 'Đang thực hiện' },
    { value: 'ON_HOLD', label: 'Tạm dừng' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'ARCHIVED', label: 'Lưu trữ' },
  ];

  const priorityOptions: Array<{ value: ProjectPriority | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'Tất cả ưu tiên' },
    { value: 'CRITICAL', label: '🔴 Khẩn cấp' },
    { value: 'HIGH', label: '🟠 Cao' },
    { value: 'MEDIUM', label: '🟡 Trung bình' },
    { value: 'LOW', label: '🟢 Thấp' },
  ];

  const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL';
  return (
    <header className="px-6 py-6 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 flex-shrink-0 z-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              <Clipboard className="w-8 h-8 text-indigo-600" />
              Tất cả dự án
            </h1>
            <p className="text-slate-600 mt-1">Quản lý, theo dõi tiến độ và cộng tác trên các dự án của bạn</p>
          </div>

          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
            {/* Create Button - Primary Action */}
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 group"
              aria-label="Create new project"
            >
              <Plus className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" />
              <span className="hidden md:inline">Tạo dự án</span>
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
          <div className="flex-1 flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Tìm dự án, từ khóa, người quản lý..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 hover:border-slate-300 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter and Sort Button */}
            <Popover.Root open={showFilterPopover} onOpenChange={onFilterClick}>
              <Popover.Trigger asChild>
                <button
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-2 rounded-lg transition-all duration-200 active:scale-95 group relative",
                    hasActiveFilters
                      ? "text-indigo-700 bg-indigo-50 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-100"
                      : "text-slate-700 bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                  aria-label="Filter and sort"
                >
                  <Settings2 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="hidden sm:inline">Lọc</span>
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="z-50 w-80 bg-white rounded-xl border-2 border-slate-200 shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                  sideOffset={8}
                  align="end"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <h3 className="text-sm font-bold text-slate-900">Bộ lọc & Sắp xếp</h3>
                      {hasActiveFilters && (
                        <button
                          onClick={() => {
                            onStatusFilterChange('ALL');
                            onPriorityFilterChange('ALL');
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                        Trạng thái
                      </label>
                      <div className="space-y-1">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => onStatusFilterChange(option.value)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                              statusFilter === option.value
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority Filter */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                        Độ ưu tiên
                      </label>
                      <div className="space-y-1">
                        {priorityOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => onPriorityFilterChange(option.value)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                              priorityFilter === option.value
                                ? "bg-indigo-100 text-indigo-700 font-semibold"
                                : "text-slate-700 hover:bg-slate-100"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1.5 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <button
              onClick={() => onViewModeChange('GRID')}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm group',
                viewMode === 'GRID'
                  ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
              aria-label="Grid view"
              title="Chế độ lưới"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Lưới</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button
              onClick={() => onViewModeChange('LIST')}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm group',
                viewMode === 'LIST'
                  ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
              aria-label="List view"
              title="Chế độ danh sách"
            >
              <ListIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Danh sách</span>
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button
              onClick={() => onViewModeChange('KANBAN')}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 font-medium text-sm group',
                viewMode === 'KANBAN'
                  ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
              aria-label="Kanban view"
              title="Chế độ Kanban"
            >
              <KanbanIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Kanban</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
