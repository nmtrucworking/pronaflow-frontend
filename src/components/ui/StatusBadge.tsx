import React from 'react';
import { FilePlus, Calendar, Zap, Activity, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ProjectStatus } from '../../types/project';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; icon: any; border: string }> = {
  ON_HOLD: { label: 'Khởi tạo', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: FilePlus },
  NOT_STARTED: { label: 'Lập kế hoạch', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200', icon: Calendar },
  IN_PROGRESS: { label: 'Thực thi', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', icon: Zap },
  IN_REVIEW: { label: 'Kiểm soát', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Activity },
  DONE: { label: 'Hoàn thành', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 }
};

export const StatusBadge = ({ status, className }: { status: ProjectStatus; className?: string }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors", 
      config.bg, config.color, config.border, className
    )}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};