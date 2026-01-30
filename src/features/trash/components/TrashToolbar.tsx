import React from 'react';
import { CheckSquare, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TrashToolbarProps {
  filterType: string;
  onFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSelectionMode: boolean;
  onToggleSelectionMode: () => void;
}

const FILTERS = ['ALL', 'TASK', 'PROJECT', 'FILE'];

const TrashToolbar: React.FC<TrashToolbarProps> = ({
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isSelectionMode,
  onToggleSelectionMode,
}) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
      {FILTERS.map((type) => (
        <button
          key={type}
          onClick={() => onFilterChange(type)}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
            filterType === type
              ? 'bg-white text-indigo-600 shadow-sm font-semibold'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {type === 'ALL' ? 'Tất cả' : type === 'TASK' ? 'Công việc' : type === 'PROJECT' ? 'Dự án' : 'Tài liệu'}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Tìm kiếm mục đã xóa..."
          className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        onClick={onToggleSelectionMode}
        className={cn(
          'p-2 rounded-lg border transition-colors',
          isSelectionMode
            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
        )}
        title="Chọn nhiều mục"
      >
        <CheckSquare className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default TrashToolbar;
