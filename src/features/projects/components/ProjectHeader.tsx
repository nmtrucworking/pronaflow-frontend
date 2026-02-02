import { LayoutGrid, List as ListIcon, Kanban as KanbanIcon, Search, Plus, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from '../constants/viewModes';

interface ProjectHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterClick: () => void;
  onCreateClick: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterClick,
  onCreateClick,
}) => {
  return (
    <header className="px-6 py-6 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 flex-shrink-0 z-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
              📋 Tất cả dự án
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
            <button
              onClick={onFilterClick}
              className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 active:scale-95 group"
              aria-label="Filter and sort"
            >
              <Settings2 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">Lọc</span>
            </button>
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
