import React, { useState } from 'react';
import { MoreHorizontal, Edit, Archive, Trash2 } from 'lucide-react';
import { Popover } from '@/components/ui/Popover'; // Base UI component

export const ProjectActionsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const menuItems = [
    { label: 'Chỉnh sửa', icon: Edit, onClick: () => {}, color: 'text-slate-700' },
    { label: 'Lưu trữ', icon: Archive, onClick: () => {}, color: 'text-slate-700' },
    { label: 'Xóa dự án', icon: Trash2, onClick: () => {}, color: 'text-red-600', isDanger: true },
  ];

  return (
    <div onClick={handleMenuClick}>
      <Popover
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        trigger={
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        }
        content={
          <div className="w-40 p-1">
            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tùy chọn</div>
            {menuItems.map((item, idx) => (
              <React.Fragment key={item.label}>
                {item.isDanger && <div className="h-px bg-slate-100 my-1" />}
                <button className={`w-full text-left px-2 py-2 text-sm rounded transition-colors flex items-center gap-2 hover:bg-indigo-50 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        }
      />
    </div>
  );
};