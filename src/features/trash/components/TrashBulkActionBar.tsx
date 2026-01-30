import React from 'react';
import { Trash2, Undo2, X } from 'lucide-react';

interface TrashBulkActionBarProps {
  selectedCount: number;
  onRestoreSelected: () => void;
  onClose: () => void;
}

const TrashBulkActionBar: React.FC<TrashBulkActionBarProps> = ({ selectedCount, onRestoreSelected, onClose }) => (
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-4 z-50">
    <span className="text-sm font-medium text-slate-700">{selectedCount} mục đã chọn</span>
    <div className="h-4 w-px bg-slate-200"></div>
    <div className="flex gap-2">
      <button onClick={onRestoreSelected} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
        <Undo2 className="w-3.5 h-3.5" /> Khôi phục
      </button>
      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors">
        <Trash2 className="w-3.5 h-3.5" /> Xóa vĩnh viễn
      </button>
    </div>
    <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default TrashBulkActionBar;
