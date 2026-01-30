import React from 'react';
import {
  ArrowUpRight,
  Archive,
  CheckSquare,
  Clock,
  File,
  Folder,
  Trash2,
  Undo2,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { EntityType, TrashItemEntity } from '../types';
import TrashTooltip from './TrashTooltip';

interface TrashTableProps {
  items: TrashItemEntity[];
  isSelectionMode: boolean;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const TrashTable: React.FC<TrashTableProps> = ({ items, isSelectionMode, selectedIds, onToggleSelection, onRestore, onDelete }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
    {items.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Thùng rác trống</h3>
        <p className="text-slate-500 max-w-sm mt-1">Tuyệt vời! Không có dữ liệu rác nào. Hệ thống sẽ tự động dọn dẹp các mục cũ sau 30 ngày.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {isSelectionMode && <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-slate-300 accent-indigo-600" /></th>}
              <th className="px-6 py-3 font-semibold text-slate-500">Tên mục</th>
              <th className="px-6 py-3 font-semibold text-slate-500">Vị trí gốc</th>
              <th className="px-6 py-3 font-semibold text-slate-500">Người xóa</th>
              <th className="px-6 py-3 font-semibold text-slate-500">Ngày xóa</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-right">Lưu trữ</th>
              <th className="px-6 py-3 font-semibold text-slate-500 text-right w-24">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.trash_id} className="group hover:bg-slate-50 transition-colors">
                {isSelectionMode && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.trash_id)}
                      onChange={() => onToggleSelection(item.trash_id)}
                      className="rounded border-slate-300 accent-indigo-600 w-4 h-4 cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <EntityIcon type={item.entity_type} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                        {item.name}
                        {item.entity_type === 'FILE' && <span className="text-xs text-slate-400 font-normal border border-slate-200 px-1 rounded">{item.size}</span>}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.entity_type}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-slate-500">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {item.original_location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <TrashTooltip content={item.deleted_by.name}>
                      <img src={item.deleted_by.avatar} alt={item.deleted_by.name} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                    </TrashTooltip>
                    <span className="text-slate-600">{item.deleted_by.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{new Date(item.deleted_at).toLocaleDateString('vi-VN')}</span>
                    <span>{new Date(item.deleted_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <RetentionBadge purgeDate={item.purge_after} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashTooltip content="Khôi phục">
                      <button onClick={() => onRestore(item.trash_id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Undo2 className="w-4 h-4" />
                      </button>
                    </TrashTooltip>

                    <TrashTooltip content="Xóa vĩnh viễn">
                      <button onClick={() => onDelete(item.trash_id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </TrashTooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const EntityIcon = ({ type }: { type: EntityType }) => {
  switch (type) {
    case 'TASK':
      return <CheckSquare className="w-4 h-4 text-emerald-600" />;
    case 'PROJECT':
      return <Folder className="w-4 h-4 text-blue-600" />;
    case 'FILE':
      return <File className="w-4 h-4 text-orange-600" />;
    case 'NOTE':
      return <Archive className="w-4 h-4 text-purple-600" />;
    default:
      return <File className="w-4 h-4 text-slate-500" />;
  }
};

const RetentionBadge = ({ purgeDate }: { purgeDate: string }) => {
  const daysLeft = Math.ceil((new Date(purgeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Xóa vĩnh viễn trong {daysLeft} ngày
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
      <Clock className="w-3 h-3 mr-1" />
      Còn {daysLeft} ngày
    </span>
  );
};

export default TrashTable;
