import React, { useState } from 'react';
import { Filter, ArrowUpDown, Flag, Calendar, Check } from 'lucide-react';
import { Popover } from '../ui/Popover';
import type { ProjectStatus, ProjectType } from '../../types/project';

type SortOption = 'NAME_ASC' | 'PRIORITY_DESC';

interface FilterSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  statusFilter: ProjectStatus | 'ALL';
  onStatusFilterChange: (s: ProjectStatus | 'ALL') => void;
}

export const FilterSortPopover = ({ 
  currentSort, 
  onSortChange, 
  statusFilter, 
  onStatusFilterChange 
}: FilterSortProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 text-sm font-medium shadow-sm transition-all active:scale-95">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Lọc & Sắp xếp</span>
        </button>
      }
      content={
        <div className="p-2 space-y-3">
          {/* Section: Sắp xếp */}
          <div>
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase mb-1">Sắp xếp</div>
            {[
              { id: 'NAME_ASC', label: 'Tên (A-Z)', icon: ArrowUpDown },
              { id: 'PRIORITY_DESC', label: 'Độ ưu tiên', icon: Flag },
              { id: 'DUE_DATE_ASC', label: 'Hạn chót', icon: Calendar }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => onSortChange(opt.id as SortOption)}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg ${currentSort === opt.id ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"}`}
              >
                <span className="flex items-center gap-2"><opt.icon className="w-3.5 h-3.5"/> {opt.label}</span>
                {currentSort === opt.id && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
};