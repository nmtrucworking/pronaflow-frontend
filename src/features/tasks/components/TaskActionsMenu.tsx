import { useState } from 'react';
import { CalendarDays, Eye, MoreHorizontal, X } from 'lucide-react';
import { Popover } from './Popover';

export const TaskActionsMenu = ({ onViewDetails }: { onViewDetails: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={
        <button className="opacity-0 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-white hover:shadow-sm hover:text-indigo-600 text-slate-400 transition-all duration-300 ease-out">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      }
      content={
        <div className="w-[180px]">
          <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hành động</div>
          <button onClick={() => { onViewDetails(); setIsOpen(false); }} className="w-full text-left px-2 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium rounded transition-colors flex items-center gap-2"><Eye className="w-3.5 h-3.5"/> Xem chi tiết</button>
          <button className="w-full text-left px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded transition-colors flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5"/> Dời ngày hạn</button>
          <div className="h-px bg-slate-100 my-1"></div>
          <button className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2"><X className="w-3.5 h-3.5"/> Xóa công việc</button>
        </div>
      }
    />
  );
};
