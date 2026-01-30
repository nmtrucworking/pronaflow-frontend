import React, { useState, useMemo } from 'react';
import type { ArchiveItem } from '../types';
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

  // Mock Data
  const archiveData: ArchiveItem[] = useMemo(() => [
    {
      id: 'ARC-001',
      name: 'Chiến dịch Marketing Mùa Đông 2023',
      type: 'Project',
      archived_at: '2024-12-20',
      expiry_date: '2026-12-20',
      size: '1.2 GB',
      archived_by: 'Trần Thế Tường',
      reason: 'Dự án đã hoàn thành và nghiệm thu đầy đủ các hạng mục.',
      status: 'Safe'
    },
    {
      id: 'ARC-002',
      name: 'Tài liệu API Version 1.0 (Deprecated)',
      type: 'Document',
      archived_at: '2025-01-05',
      expiry_date: '2025-06-05',
      size: '45 MB',
      archived_by: 'Lê Minh Hạnh',
      reason: 'Thay thế bằng phiên bản 2.0 ổn định hơn.',
      status: 'Expiring'
    },
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `ARC-0${i+3}`,
      name: `Bản sao lưu hệ thống định kỳ ${i+3}`,
      type: (i % 3 === 0 ? 'Task' : i % 3 === 1 ? 'Document' : 'Project') as any,
      archived_at: '2024-11-15',
      expiry_date: '2027-01-01',
      size: '120 KB',
      archived_by: 'System Bot',
      reason: 'Lưu trữ tự động theo chính sách hàng tháng.',
      status: 'Safe' as any
    }))
  ], []);

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

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans select-none transition-all duration-500">
      <ArchiveHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <main className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        <ArchiveStats archiveCount={archiveData.length} />

        <ArchiveTable
          pagedData={pagedData}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onClearSelection={() => setSelectedIds([])}
          onSelectItem={setSelectedItem}
          sortConfig={sortConfig}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      <ArchiveDetailModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />

      <style>{`
        .custom-scrollbar-y::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-y::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-y::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar-y::-webkit-scrollbar-thumb { background: #334155; }
        
        .custom-checkbox {
          appearance: none;
          background-color: transparent;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 14px;
          height: 14px;
          border: 1.5px solid #cbd5e1;
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
          box-shadow: inset 1em 1em #3b82f6;
          border-radius: 2px;
        }
        .custom-checkbox:checked::before {
          transform: scale(1);
        }
        .custom-checkbox:checked {
          border-color: #3b82f6;
        }
        .dark .custom-checkbox { border-color: #475569; }
        .dark .custom-checkbox:checked { border-color: #3b82f6; }
      `}</style>
    </div>
  );
};

export default ArchivedStorePage;