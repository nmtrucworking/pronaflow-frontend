import { CheckCircle2, Database, FileText, FolderLock } from 'lucide-react';
import type { ArchiveItem } from './types';

export const TYPE_CONFIG: Record<ArchiveItem['type'], { icon: any; color: string; bg: string }> = {
  Project: { icon: FolderLock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  Task: { icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  Document: { icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  Workspace: { icon: Database, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
};

export const STATUS_THEME: Record<ArchiveItem['status'], string> = {
  Safe: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100',
  Expiring: 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-100 animate-pulse',
  Locked: 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200',
};
