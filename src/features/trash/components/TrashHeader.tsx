import React from 'react';
import { Trash2 } from 'lucide-react';

interface TrashHeaderProps {
  hasItems: boolean;
  onEmptyTrash: () => void;
}

const TrashHeader: React.FC<TrashHeaderProps> = ({ hasItems, onEmptyTrash }) => (
  <header className="px-8 py-6 bg-white border-b border-slate-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg text-red-600">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thùng rác</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-11">
          Quản lý các mục đã xóa. Dữ liệu sẽ tự động bị xóa vĩnh viễn sau 30 ngày (Module 8).
        </p>
      </div>

      <div className="flex items-center gap-3">
        {hasItems && (
          <button
            onClick={onEmptyTrash}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors active:scale-95"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Dọn sạch thùng rác
          </button>
        )}
      </div>
    </div>
  </header>
);

export default TrashHeader;
