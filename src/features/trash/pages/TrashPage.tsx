import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import type { TrashItemEntity } from '../types';
import { MOCK_TRASH_ITEMS } from '../constants';
import TrashHeader from '../components/TrashHeader';
import TrashToolbar from '../components/TrashToolbar';
import TrashTable from '../components/TrashTable';
import TrashBulkActionBar from '../components/TrashBulkActionBar';
import TrashDialog from '../components/TrashDialog';
import TrashToast from '../components/TrashToast';

export default function TrashBinPage() {
  const [items, setItems] = useState<TrashItemEntity[]>(MOCK_TRASH_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  
  const [toast, setToast] = useState<{ open: boolean, title: string, desc: string, type: 'success' | 'danger' }>({ 
    open: false, title: '', desc: '', type: 'success' 
  });
  
  const [dialogConfig, setDialogConfig] = useState<{ open: boolean, title: string, desc: string, actionLabel: string, isDanger: boolean, onConfirm: () => void }>({
    open: false, title: '', desc: '', actionLabel: '', isDanger: false, onConfirm: () => {}
  });

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Auto close toast
  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.open]);

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.original_location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || item.entity_type === filterType;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, filterType]);

  // Actions
  const showToast = (title: string, desc: string, type: 'success' | 'danger') => {
    setToast({ open: true, title, desc, type });
  };

  const confirmAction = (title: string, desc: string, actionLabel: string, isDanger: boolean, onConfirm: () => void) => {
    setDialogConfig({ open: true, title, desc, actionLabel, isDanger, onConfirm });
  };

  const handleRestore = (id: string) => {
    const item = items.find(i => i.trash_id === id);
    setItems(prev => prev.filter(i => i.trash_id !== id));
    showToast('Đã khôi phục thành công', `"${item?.name}" đã được đưa trở lại vị trí cũ.`, 'success');
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.trash_id === id);
    confirmAction(
      "Xóa vĩnh viễn?",
      `Bạn có chắc chắn muốn xóa "${item?.name}"? Hành động này không thể hoàn tác.`,
      "Xóa ngay",
      true,
      () => {
        setItems(prev => prev.filter(i => i.trash_id !== id));
        setDialogConfig(prev => ({ ...prev, open: false }));
        showToast('Đã xóa vĩnh viễn', `"${item?.name}" không thể khôi phục được nữa.`, 'danger');
      }
    );
  };

  const handleEmptyTrash = () => {
    confirmAction(
      "Dọn sạch thùng rác?",
      "Hành động này sẽ xóa vĩnh viễn tất cả các mục trong thùng rác. Bạn sẽ KHÔNG thể hoàn tác hành động này.",
      "Xóa tất cả",
      true,
      () => {
        setItems([]);
        setDialogConfig(prev => ({ ...prev, open: false }));
        showToast('Đã dọn sạch thùng rác', 'Tất cả dữ liệu đã được xóa an toàn.', 'danger');
      }
    );
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleRestoreSelected = () => {
    setItems(prev => prev.filter(i => !selectedIds.has(i.trash_id)));
    showToast('Khôi phục hàng loạt', `${selectedIds.size} mục đã được khôi phục.`, 'success');
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <TrashHeader hasItems={items.length > 0} onEmptyTrash={handleEmptyTrash} />

      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        <TrashToolbar
          filterType={filterType}
          onFilterChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={() => setIsSelectionMode(!isSelectionMode)}
        />

        <TrashTable
          items={filteredItems}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onRestore={handleRestore}
          onDelete={handleDelete}
        />

        {isSelectionMode && selectedIds.size > 0 && (
          <TrashBulkActionBar
            selectedCount={selectedIds.size}
            onRestoreSelected={handleRestoreSelected}
            onClose={() => {
              setIsSelectionMode(false);
              setSelectedIds(new Set());
            }}
          />
        )}
      </main>

      <TrashDialog
        isOpen={dialogConfig.open}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        title={dialogConfig.title}
        description={dialogConfig.desc}
        isDanger={dialogConfig.isDanger}
      >
        <button
          onClick={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          onClick={dialogConfig.onConfirm}
          className={cn(
            'px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all active:scale-95',
            dialogConfig.isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {dialogConfig.actionLabel}
        </button>
      </TrashDialog>

      <TrashToast
        isOpen={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        title={toast.title}
        desc={toast.desc}
        type={toast.type}
      />
    </div>
  );
}