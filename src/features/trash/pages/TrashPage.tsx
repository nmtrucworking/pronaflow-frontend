import React, { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../../lib/utils';
import type { TrashItemEntity } from '../types';
import archiveService from '@/services/archiveService';
import TrashHeader from '../components/TrashHeader';
import TrashToolbar from '../components/TrashToolbar';
import TrashTable from '../components/TrashTable';
import TrashBulkActionBar from '../components/TrashBulkActionBar';
import TrashDialog from '../components/TrashDialog';
import TrashToast from '../components/TrashToast';

export default function TrashBinPage() {
  const queryClient = useQueryClient();
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

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const message = (error as { response?: { data?: { detail?: string; message?: string } } }).response?.data?.detail
        || (error as { response?: { data?: { detail?: string; message?: string } } }).response?.data?.message;
      if (message) {
        return message;
      }
    }
    return fallback;
  };

  const mapTrashItem = (item: {
    trash_id: string;
    resource_type: 'project' | 'task' | 'workspace' | 'file';
    resource_id: string;
    resource_name: string;
    deleted_by: string;
    deleted_at: string;
    auto_delete_at: string;
  }): TrashItemEntity => {
    const entity_type = item.resource_type === 'project'
      ? 'PROJECT'
      : item.resource_type === 'task'
        ? 'TASK'
        : item.resource_type === 'file'
          ? 'FILE'
          : 'NOTE';

    return {
      trash_id: item.trash_id,
      entity_type,
      entity_id: item.resource_id,
      name: item.resource_name,
      original_location: `/${item.resource_type}s`,
      deleted_by: {
        id: item.deleted_by,
        name: item.deleted_by,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.deleted_by || 'User')}&background=64748B&color=fff`,
      },
      deleted_at: item.deleted_at,
      purge_after: item.auto_delete_at,
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['trash-items'],
    queryFn: () => archiveService.getTrashItems(),
    staleTime: 30 * 1000,
  });

  const items = useMemo<TrashItemEntity[]>(() => {
    const rawItems = data?.data?.items ?? [];
    return rawItems.map(mapTrashItem);
  }, [data]);

  const { mutate: restoreTrashItem, isPending: isRestoring } = useMutation({
    mutationFn: (trashId: string) => archiveService.restoreFromTrash(trashId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trash-items'] });
      await refetch();
    },
    onError: (mutationError) => {
      showToast('Khôi phục thất bại', getErrorMessage(mutationError, 'Không thể khôi phục mục đã chọn.'), 'danger');
    },
  });

  const { mutate: deleteTrashItem, isPending: isDeleting } = useMutation({
    mutationFn: (trashId: string) => archiveService.permanentlyDeleteTrash(trashId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trash-items'] });
      await refetch();
    },
    onError: (mutationError) => {
      showToast('Xóa thất bại', getErrorMessage(mutationError, 'Không thể xóa vĩnh viễn mục đã chọn.'), 'danger');
    },
  });

  const { mutate: emptyTrash, isPending: isEmptying } = useMutation({
    mutationFn: () => archiveService.emptyTrash(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trash-items'] });
      await refetch();
    },
    onError: (mutationError) => {
      showToast('Dọn thùng rác thất bại', getErrorMessage(mutationError, 'Không thể dọn sạch thùng rác.'), 'danger');
    },
  });

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
    restoreTrashItem(id, {
      onSuccess: () => {
        showToast('Đã khôi phục thành công', `"${item?.name}" đã được đưa trở lại vị trí cũ.`, 'success');
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      },
    });
  };

  const handleDelete = (id: string) => {
    const item = items.find(i => i.trash_id === id);
    confirmAction(
      "Xóa vĩnh viễn?",
      `Bạn có chắc chắn muốn xóa "${item?.name}"? Hành động này không thể hoàn tác.`,
      "Xóa ngay",
      true,
      () => {
        deleteTrashItem(id, {
          onSuccess: () => {
            setDialogConfig(prev => ({ ...prev, open: false }));
            showToast('Đã xóa vĩnh viễn', `"${item?.name}" không thể khôi phục được nữa.`, 'danger');
            setSelectedIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          },
        });
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
        emptyTrash(undefined, {
          onSuccess: () => {
            setDialogConfig(prev => ({ ...prev, open: false }));
            setSelectedIds(new Set());
            setIsSelectionMode(false);
            showToast('Đã dọn sạch thùng rác', 'Tất cả dữ liệu đã được xóa an toàn.', 'danger');
          },
        });
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
    const selectedList = Array.from(selectedIds);
    Promise.allSettled(selectedList.map((id) => archiveService.restoreFromTrash(id)))
      .then(async (results) => {
        const successCount = results.filter((result) => result.status === 'fulfilled').length;
        const failCount = results.length - successCount;
        await queryClient.invalidateQueries({ queryKey: ['trash-items'] });
        await refetch();
        if (successCount > 0) {
          showToast('Khôi phục hàng loạt', `${successCount} mục đã được khôi phục.`, 'success');
        }
        if (failCount > 0) {
          showToast('Khôi phục chưa hoàn tất', `${failCount} mục không thể khôi phục.`, 'danger');
        }
        setSelectedIds(new Set());
        setIsSelectionMode(false);
      });
  };

  if (isError) {
    return (
      <div className="legacy-dark-scope min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center p-8">
        <div className="bg-white border border-red-200 rounded-xl p-6 max-w-lg w-full">
          <h2 className="text-lg font-semibold text-red-700">Không thể tải thùng rác</h2>
          <p className="text-sm text-slate-600 mt-2">{getErrorMessage(error, 'Đã có lỗi khi tải dữ liệu thùng rác.')}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="legacy-dark-scope min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <TrashHeader hasItems={items.length > 0} onEmptyTrash={handleEmptyTrash} />

      <main className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        {isLoading && (
          <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
            Đang đồng bộ dữ liệu thùng rác...
          </div>
        )}

        {(isRestoring || isDeleting || isEmptying) && (
          <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            Đang xử lý thao tác với thùng rác...
          </div>
        )}

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