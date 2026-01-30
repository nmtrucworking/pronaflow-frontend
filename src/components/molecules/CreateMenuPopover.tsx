import React, { useState } from 'react';
import { Plus, Briefcase, FilePlus, Upload } from 'lucide-react';
import { Popover } from '../ui/Popover';

interface CreateMenuProps {
  onOpenCreateModal: () => void;
}

export const CreateMenuPopover = ({ onOpenCreateModal }: CreateMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (callback: () => void) => {
    callback();
    setIsOpen(false);
  };

  return (
    <Popover 
      isOpen={isOpen} 
      setIsOpen={setIsOpen}
      trigger={
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 font-medium text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Dự án mới</span>
        </button>
      }
      content={
        <div className="w-56 p-1.5">
          <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khởi tạo</div>
          
          {/* Option: Dự án trống */}
          <button 
            onClick={() => handleAction(onOpenCreateModal)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"
          >
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-200 transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">Dự án trống</div>
              <div className="text-[10px] text-slate-500 font-normal">Tạo từ đầu</div>
            </div>
          </button>

          {/* Option: Dùng mẫu */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group mt-1">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md group-hover:bg-emerald-200 transition-colors">
              <FilePlus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-medium">Dùng mẫu</div>
              <div className="text-[10px] text-slate-500 font-normal">Từ thư viện template</div>
            </div>
          </button>

          <div className="h-px bg-slate-100 my-1.5" />

          {/* Option: Nhập file */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors group">
            <Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            <span>Nhập từ Excel/CSV</span>
          </button>
        </div>
      }
    />
  );
};