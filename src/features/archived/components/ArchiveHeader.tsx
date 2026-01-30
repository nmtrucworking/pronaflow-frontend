import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Archive, Filter, FolderLock, HelpCircle, Search } from 'lucide-react';

interface ArchiveHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

const FILTER_OPTIONS = ['all', 'Project', 'Document', 'Task'];

const ArchiveHeader: React.FC<ArchiveHeaderProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
}) => (
  <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-40 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
      <div className="bg-slate-900 dark:bg-white p-2 rounded-lg text-white dark:text-slate-900">
        <Archive size={20} strokeWidth={2.5} />
      </div>
      <div>
        <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">Kho lưu trữ</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-70">Module 8: Compliance</p>
      </div>
    </div>

    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right duration-700">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Tìm bản ghi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-transparent border-none text-sm font-semibold focus:ring-0 w-48 lg:w-64 outline-none transition-all"
          />
        </div>

        <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-1" />

        <Popover.Root>
          <Popover.Trigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all relative">
              <Filter size={13} />
              Lọc
              {typeFilter !== 'all' && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content sideOffset={8} align="end" className="w-64 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200 outline-none">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Loại thực thể</label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_OPTIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => onTypeFilterChange(t)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        typeFilter === t
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      {t === 'all' ? 'Tất cả' : t}
                    </button>
                  ))}
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
              <HelpCircle size={18} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="bottom" className="w-64 bg-slate-900 text-white p-4 rounded-lg text-xs font-medium shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2 text-center lg:text-left">
                <p className="font-black text-blue-400 uppercase tracking-widest mb-1">Quy tắc tuân thủ</p>
                <p>Mọi thao tác khôi phục hoặc tiêu hủy bản ghi đều được ghi lại vào nhật ký Audit Log hệ thống.</p>
              </div>
              <Tooltip.Arrow className="fill-slate-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all uppercase tracking-widest">
        <FolderLock size={14} strokeWidth={3} /> Thiết lập lưu trữ
      </button>
    </div>
  </header>
);

export default ArchiveHeader;
