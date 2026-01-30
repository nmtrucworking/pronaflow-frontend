import { LayoutGrid, List as ListIcon, Kanban as KanbanIcon, Search } from 'lucide-react';
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
    <header className="px-6 py-5 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-title text-slate-900">Tất cả dự án</h1>
            <p className="text-body text-slate-500">Quản lý và theo dõi tiến độ dự án tổ chức.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm dự án..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            {/* Filter and Sort Button */}
            <button
              onClick={onFilterClick}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100"
              aria-label="Filter and sort"
            >
              Lọc & Sắp xếp
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg border">
              <button
                onClick={() => onViewModeChange('GRID')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'GRID' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('LIST')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'LIST' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('KANBAN')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'KANBAN' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                )}
                aria-label="Kanban view"
              >
                <KanbanIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={onCreateClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              aria-label="Create new project"
            >
              Tạo dự án
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
