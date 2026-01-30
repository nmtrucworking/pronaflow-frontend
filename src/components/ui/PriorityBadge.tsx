import React from 'react';
import { cn } from '@/lib/utils';
import type { ProjectPriority } from '../../types/project';

const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: 'Nghiêm trọng', color: 'text-red-700', bg: 'bg-red-100' },
  HIGH: { label: 'Cao', color: 'text-orange-700', bg: 'bg-orange-100' },
  MEDIUM: { label: 'Trung bình', color: 'text-blue-700', bg: 'bg-blue-100' },
  LOW: { label: 'Thấp', color: 'text-slate-600', bg: 'bg-slate-100' },
};

export const PriorityBadge = ({ priority }: { priority: ProjectPriority }) => {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide", 
      config.bg, config.color
    )}>
      {config.label}
    </span>
  );
};