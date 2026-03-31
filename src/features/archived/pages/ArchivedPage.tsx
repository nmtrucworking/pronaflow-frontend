import React, { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ArchiveItem } from '../types';
import archiveService from '@/services/archiveService';
import ArchiveHeader from '../components/ArchiveHeader';
import ArchiveStats from '../components/ArchiveStats';
import ArchiveTable from '../components/ArchiveTable';
import ArchiveDetailModal from '../components/ArchiveDetailModal';

/**
 * PRONAFLOW ARCHIVED STORE v1.4 - ACCESSIBILITY FIXED
 * - Fixed: Added Dialog.Title and Dialog.Description for Radix UI compliance.
 * - Layout: Bulk Action Bar integrated into Footer (Left side) for a clean UI.
 * - Standardized Radius: Optimized to rounded-xl (12px) and rounded-lg (8px).
 * - UX: Integrated context helpers and double-click interactions.
 */

const ArchivedStorePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ArchiveItem; direction: 'asc' | 'desc' }>({
    key: 'archived_at',
    direction: 'desc',
  });

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

  const mapArchivedType = (resourceType: 'project' | 'task' | 'workspace') => {
    if (resourceType === 'project') {
      return 'Project';
    }
    if (resourceType === 'task') {
      return 'Task';
    }
    return 'Workspace';
  };

  const getArchiveStatus = (expiryDate?: string): ArchiveItem['status'] => {
    if (!expiryDate) {
      return 'Safe';
    }

    const expiryTime = new Date(expiryDate).getTime();
    if (Number.isNaN(expiryTime)) {
      return 'Safe';
    }

    const daysLeft = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) {
      return 'Expiring';
    }
    return 'Safe';
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['archived-items'],
    queryFn: () => archiveService.getArchivedItems({ resource_type: 'project' }),
    staleTime: 60 * 1000,
  });

  const { mutate: restoreProject, isPending: isRestoring } = useMutation({
    mutationFn: (projectId: string) => archiveService.restoreProject(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['archived-items'] });
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      await refetch();
      toast.success('Dự án đã được khôi phục');
    },
    onError: (mutationError) => {
      toast.error(getErrorMessage(mutationError, 'Không thể khôi phục dự án'));
    },
  });

  const archiveData: ArchiveItem[] = useMemo(() => {
    const rawItems = data?.data?.items ?? [];
    return rawItems.map((item) => {
      const metadata = (item.metadata ?? {}) as { expiry_date?: string; size?: string; status?: ArchiveItem['status'] };
      const expiryDate = metadata.expiry_date ?? '-';
      return {
        id: item.archive_id,
        name: item.resource_name,
        type: mapArchivedType(item.resource_type),
        archived_at: item.archived_at,
        expiry_date: expiryDate,
        size: metadata.size ?? '--',
        archived_by: item.archived_by,
        reason: item.reason || 'Không có lý do chi tiết.',
        status: metadata.status ?? getArchiveStatus(metadata.expiry_date),
      };
    });
  }, [data]);

  // Selection Logic
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pagedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pagedData.map(item => item.id));
    }
  };

  // Filter & Sort Logic
  const processedData = useMemo(() => {
    let result = archiveData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'all' || item.type === typeFilter;
      return matchSearch && matchType;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [archiveData, searchQuery, typeFilter, sortConfig]);

  const pagedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSort = (key: keyof ArchiveItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRestoreItem = (item: ArchiveItem) => {
    const rawItem = (data?.data?.items ?? []).find((entry) => entry.archive_id === item.id);
    if (!rawItem) {
      toast.error('Không tìm thấy dữ liệu lưu trữ tương ứng để khôi phục.');
      return;
    }

    if (rawItem.resource_type !== 'project') {
      toast.info('Hiện chỉ hỗ trợ khôi phục project từ kho lưu trữ.');
      return;
    }

    restoreProject(rawItem.resource_id, {
      onSuccess: () => {
        if (selectedItem?.id === item.id) {
          setSelectedItem(null);
        }
      },
    });
  };

  const handleRestoreSelected = (ids: string[]) => {
    ids.forEach((id) => {
      const item = archiveData.find((entry) => entry.id === id);
      if (item) {
        handleRestoreItem(item);
      }
    });
    setSelectedIds([]);
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 p-8">
        <div className="bg-white border border-red-200 rounded-xl p-6 max-w-lg w-full">
          <h2 className="text-lg font-semibold text-red-700">Không thể tải dữ liệu lưu trữ</h2>
          <p className="text-sm text-slate-600 mt-2">{getErrorMessage(error, 'Đã có lỗi khi tải dữ liệu lưu trữ.')}</p>
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
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans select-none transition-all duration-500">
      <ArchiveHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <main className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        {(isLoading || isRestoring) && (
          <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            {isLoading ? 'Đang tải dữ liệu lưu trữ...' : 'Đang khôi phục dữ liệu...'}
          </div>
        )}

        <ArchiveStats archiveCount={archiveData.length} />

        <ArchiveTable
          pagedData={pagedData}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onClearSelection={() => setSelectedIds([])}
          onSelectItem={setSelectedItem}
          onRestoreItem={handleRestoreItem}
          onRestoreSelected={handleRestoreSelected}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <ArchiveDetailModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onRestore={handleRestoreItem}
      />

      <style>{`
        .custom-scrollbar-y::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-y::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-y::-webkit-scrollbar-thumb { background: var(--color-neutral-300); border-radius: 10px; }
        .dark .custom-scrollbar-y::-webkit-scrollbar-thumb { background: var(--color-neutral-700); }
        
        .custom-checkbox {
          appearance: none;
          background-color: transparent;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 14px;
          height: 14px;
          border: 1.5px solid var(--color-neutral-300);
          border-radius: 4px;
          display: grid;
          place-content: center;
          cursor: pointer;
        }
        .custom-checkbox::before {
          content: "";
          width: 8px;
          height: 8px;
          transform: scale(0);
          transition: 120ms transform ease-in-out;
          box-shadow: inset 1em 1em var(--color-primary-600);
          border-radius: 2px;
        }
        .custom-checkbox:checked::before {
          transform: scale(1);
        }
        .custom-checkbox:checked {
          border-color: var(--color-primary-600);
        }
        .dark .custom-checkbox { border-color: var(--color-neutral-600); }
        .dark .custom-checkbox:checked { border-color: var(--color-primary-600); }
      `}</style>
    </div>
  );
};

export default ArchivedStorePage;