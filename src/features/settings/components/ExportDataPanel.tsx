import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Download, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import archiveService from '@/services/archiveService';
import type { DataExportRequest, ExportStatus } from '@/types/archive';

const RESOURCE_OPTIONS: DataExportRequest['resources'] = [
  'project',
  'task',
  'user',
  'attachment',
  'comment',
];

interface ExportDataPanelProps {
  workspaceId?: string;
}

interface RequestDisabledInput {
  selectedResourcesCount: number;
  isRequesting: boolean;
  isPollingStatus: boolean;
  exportStatus?: ExportStatus['status'];
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string; message?: string } } }).response;
    return response?.data?.detail || response?.data?.message || fallback;
  }
  return fallback;
}

export function normalizeStatus(
  data: { export_id: string; status: string; download_url?: string } | undefined,
  previousProgress: number
): ExportStatus | null {
  if (!data) {
    return null;
  }

  const safeStatus: ExportStatus['status'] =
    data.status === 'queued' || data.status === 'processing' || data.status === 'ready' || data.status === 'failed'
      ? data.status
      : 'processing';

  let progress = previousProgress;
  if (safeStatus === 'queued') {
    progress = Math.max(previousProgress, 5);
  } else if (safeStatus === 'processing') {
    progress = Math.min(95, Math.max(previousProgress + 10, 15));
  } else if (safeStatus === 'ready') {
    progress = 100;
  }

  return {
    export_id: data.export_id,
    status: safeStatus,
    progress_percent: progress,
    download_url: data.download_url,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function isExportRequestDisabled(input: RequestDisabledInput): boolean {
  const hasActiveExport =
    input.exportStatus === 'queued' ||
    input.exportStatus === 'processing' ||
    input.isPollingStatus;

  return input.selectedResourcesCount === 0 || input.isRequesting || hasActiveExport;
}

const ExportDataPanel: React.FC<ExportDataPanelProps> = ({ workspaceId = 'default' }) => {
  const [selectedResources, setSelectedResources] = useState<DataExportRequest['resources']>(['project', 'task']);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [currentExportId, setCurrentExportId] = useState<string | null>(null);
  const [lastProgress, setLastProgress] = useState(0);

  const requestPayload = useMemo(
    () => ({
      workspace_id: workspaceId,
      include_archived: true,
      include_deleted: includeDeleted,
      format: exportFormat,
      resources: selectedResources,
    }),
    [workspaceId, includeDeleted, exportFormat, selectedResources]
  );

  const { mutate: requestExport, isPending: isRequesting } = useMutation({
    mutationFn: () => archiveService.requestDataExport(requestPayload),
    onSuccess: (response) => {
      setCurrentExportId(response.data.export_id);
      setLastProgress(5);
      toast.success('Yeu cau xuat du lieu da duoc gui. He thong dang xu ly.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Khong the tao yeu cau xuat du lieu.'));
    },
  });

  const {
    data: exportStatusResponse,
    isFetching: isPollingStatus,
  } = useQuery({
    queryKey: ['data-export-status', currentExportId],
    queryFn: () => archiveService.getExportStatus(currentExportId!),
    enabled: !!currentExportId,
    refetchInterval: (query) => {
      const status = (query.state.data?.data?.status ?? '').toString();
      if (status === 'ready' || status === 'failed') {
        return false;
      }
      return 2000;
    },
  });

  const exportStatus = useMemo(() => {
    return normalizeStatus(exportStatusResponse?.data, lastProgress);
  }, [exportStatusResponse?.data, lastProgress]);

  useEffect(() => {
    if (exportStatus && exportStatus.progress_percent !== lastProgress) {
      setLastProgress(exportStatus.progress_percent);
    }
  }, [exportStatus, lastProgress]);

  const requestDisabled = isExportRequestDisabled({
    selectedResourcesCount: selectedResources.length,
    isRequesting,
    isPollingStatus,
    exportStatus: exportStatus?.status,
  });
  const canRequestExport = !requestDisabled;

  const handleToggleResource = (resource: DataExportRequest['resources'][number]) => {
    setSelectedResources((prev) => {
      if (prev.includes(resource)) {
        return prev.filter((item) => item !== resource) as DataExportRequest['resources'];
      }
      return [...prev, resource] as DataExportRequest['resources'];
    });
  };

  const handleDownload = async () => {
    if (!currentExportId) {
      return;
    }

    try {
      const response = await archiveService.downloadExport(currentExportId);
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pronaflow-export-${currentExportId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Da bat dau tai file xuat.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the tai file xuat.'));
    }
  };

  const handleResetExport = () => {
    setCurrentExportId(null);
    setLastProgress(0);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Xuat du lieu</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tai xuong du lieu workspace theo yeu cau portability (JSON/CSV).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5 shadow-sm">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tai nguyen can xuat</label>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RESOURCE_OPTIONS.map((resource) => (
              <label key={resource} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <input
                  type="checkbox"
                  checked={selectedResources.includes(resource)}
                  onChange={() => handleToggleResource(resource)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-200 capitalize">{resource}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Dinh dang</label>
            <select
              value={exportFormat}
              onChange={(event) => setExportFormat(event.target.value as 'json' | 'csv')}
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="json">JSON (khuyen nghi)</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(event) => setIncludeDeleted(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Bao gom du lieu da xoa mem
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => requestExport()}
            disabled={!canRequestExport}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Yeu cau xuat du lieu
          </button>

          <button
            onClick={handleDownload}
            disabled={!exportStatus || exportStatus.status !== 'ready'}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Tai xuong
          </button>

          {(exportStatus?.status === 'ready' || exportStatus?.status === 'failed') && (
            <button
              onClick={handleResetExport}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Tao phien xuat moi
            </button>
          )}
        </div>
      </div>

      {exportStatus && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Trang thai xuat: {exportStatus.status}</p>
            {(isPollingStatus || exportStatus.status === 'processing' || exportStatus.status === 'queued') && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">Ma phien xuat: {exportStatus.export_id}</p>
          <div>
            <div className="h-2 w-full rounded-full bg-blue-100 dark:bg-blue-900/40 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${exportStatus.progress_percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-blue-800 dark:text-blue-300">{exportStatus.progress_percent}% completed</p>
          </div>
          {exportStatus.status === 'failed' && exportStatus.error_message && (
            <p className="text-xs text-red-600">{exportStatus.error_message}</p>
          )}
          {exportStatus.status === 'ready' && (
            <p className="text-xs text-blue-800 dark:text-blue-300">
              Tep san sang den: {new Date(exportStatus.expires_at).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportDataPanel;
