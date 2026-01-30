import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  MoreHorizontal,
  RotateCcw,
  Info,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Trash,
} from 'lucide-react';
import type { ArchiveItem } from '../types';
import { STATUS_THEME, TYPE_CONFIG } from '../constants';

interface ArchiveTableProps {
  pagedData: ArchiveItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSelectItem: (item: ArchiveItem) => void;
  sortConfig: { key: keyof ArchiveItem; direction: 'asc' | 'desc' };
  onSort: (key: keyof ArchiveItem) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ArchiveTable: React.FC<ArchiveTableProps> = ({
  pagedData,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onSelectItem,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-100">
    <div className="grid grid-cols-12 px-6 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest items-center">
      <div className="col-span-1 flex justify-center">
        <input
          type="checkbox"
          checked={selectedIds.length === pagedData.length && pagedData.length > 0}
          onChange={onSelectAll}
          className="custom-checkbox"
        />
      </div>
      <div className="col-span-4 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('name')}>
        Tên bản lưu <SortIcon active={sortConfig.key === 'name'} dir={sortConfig.direction} />
      </div>
      <div className="col-span-2">Phân loại</div>
      <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => onSort('archived_at')}>
        Thời điểm <SortIcon active={sortConfig.key === 'archived_at'} dir={sortConfig.direction} />
      </div>
      <div className="col-span-2">Retention</div>
      <div className="col-span-1 text-right pr-2">Actions</div>
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar-y overflow-x-hidden">
      {pagedData.length > 0 ? (
        pagedData.map((item, idx) => (
          <div
            key={item.id}
            onDoubleClick={() => onSelectItem(item)}
            className={`grid grid-cols-12 px-6 py-3.5 items-center border-b border-slate-50 dark:border-slate-800 last:border-0 group cursor-default transition-all duration-300 animate-in fade-in slide-in-from-left duration-500 ${
              selectedIds.includes(item.id)
                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
            }`}
            style={{ animationDelay: `${idx * 20}ms` }}
          >
            <div className="col-span-1 flex justify-center">
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => onToggleSelect(item.id)}
                className="custom-checkbox"
              />
            </div>
            <div className="col-span-4 flex items-center gap-4">
              <div className={`p-2 rounded-lg ${TYPE_CONFIG[item.type].bg} ${TYPE_CONFIG[item.type].color} shrink-0 transition-transform group-hover:scale-105`}>
                {React.createElement(TYPE_CONFIG[item.type].icon, { size: 16 })}
              </div>
              <div className="flex flex-col overflow-hidden pr-4">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">{item.name}</span>
                <span className="text-[10px] font-medium text-slate-400 truncate flex items-center gap-1 uppercase tracking-tight italic">
                  {item.id} • {item.size}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{item.type}</span>
            </div>

            <div className="col-span-2 flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.archived_at}</span>
              <span className="text-[10px] text-slate-400 font-medium italic opacity-70">By: {item.archived_by.split(' ')[0]}</span>
            </div>

            <div className="col-span-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-tighter shadow-sm ${STATUS_THEME[item.status]}`}>
                {item.status === 'Expiring' ? 'Sắp tiêu hủy' : item.expiry_date}
              </span>
            </div>

            <div className="col-span-1 text-right pr-2">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 group-hover:opacity-100 opacity-0 active:scale-90 shadow-sm">
                    <MoreHorizontal size={16} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="w-48 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200 outline-none">
                    <DropdownMenuItem icon={RotateCcw} label="Khôi phục" color="text-blue-600" />
                    <DropdownMenuItem icon={Info} label="Xem thông số kỹ thuật" onClick={() => onSelectItem(item)} />
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                    <DropdownMenuItem icon={Trash2} label="Tiêu hủy vĩnh viễn" color="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-20 grayscale">
          <div className="mb-4">
            <ArchiveEmptyIcon />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em]">Kho lưu trữ trống</p>
        </div>
      )}
    </div>

    <footer className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/20 flex items-center justify-between shrink-0">
      <div className="flex items-center min-h-[40px]">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/50 shadow-sm animate-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-100 dark:border-slate-800">
              <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-[10px] font-black text-white rounded-md">{selectedIds.length}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase">Đã chọn</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-black text-blue-600 rounded-md transition-all uppercase">
                <RotateCcw size={12} /> Khôi phục
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-[10px] font-black text-red-500 rounded-md transition-all uppercase">
                <Trash size={12} /> Tiêu hủy
              </button>
            </div>
            <button onClick={onClearSelection} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400">
              <Trash2 size={12} />
            </button>
          </div>
        ) : (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 opacity-70">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Hệ thống lưu trữ an toàn (SOC2 Compliant)
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <PaginationBtn icon={ChevronLeft} onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase mr-2 ml-1">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${
                p === currentPage
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <PaginationBtn icon={ChevronRight} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
      </div>
    </footer>
  </div>
);

const ArchiveEmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-slate-400">
    <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SortIcon: React.FC<{ active: boolean; dir: 'asc' | 'desc' }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown size={12} className="opacity-20" />;
  return dir === 'asc' ? <ArrowUpNarrowWide size={12} className="text-blue-600" /> : <ArrowDownWideNarrow size={12} className="text-blue-600" />;
};

const PaginationBtn: React.FC<{ icon: any; onClick: () => void; disabled: boolean }> = ({ icon: Icon, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 disabled:grayscale transition-all active:scale-90 shadow-sm">
    <Icon size={14} strokeWidth={2.5} />
  </button>
);

const DropdownMenuItem: React.FC<{ icon: any; label: string; onClick?: () => void; color?: string }> = ({ icon: Icon, label, onClick, color }) => (
  <DropdownMenu.Item onClick={onClick} className={`flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold ${color || 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600'} rounded-lg outline-none cursor-pointer transition-all`}>
    <Icon size={14} strokeWidth={2.5} /> {label}
  </DropdownMenu.Item>
);

export default ArchiveTable;
