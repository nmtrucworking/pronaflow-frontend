import React from 'react';
import { cn } from '@/lib/utils';
import COLORS from '@/config/colors';
import { getColorWithOpacity } from '@/config/colorUtils';
import type { ProjectPriority } from '../../types/project';

const PRIORITY_CONFIG: Record<ProjectPriority, { label: string; color: string; bg: string }> = {
  URGENT: { label: 'Khẩn cấp', color: COLORS.priority.urgent, bg: getColorWithOpacity('priority', 'urgent', 0.15) },
  HIGH: { label: 'Cao', color: COLORS.priority.high, bg: getColorWithOpacity('priority', 'high', 0.15) },
  MEDIUM: { label: 'Trung bình', color: COLORS.priority.medium, bg: getColorWithOpacity('priority', 'medium', 0.15) },
  LOW: { label: 'Thấp', color: COLORS.priority.low, bg: getColorWithOpacity('priority', 'low', 0.15) },
};

export const PriorityBadge = ({ priority, size = 'default' }: { priority: ProjectPriority; size?: 'sm' | 'default' }) => {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.MEDIUM;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-bold uppercase tracking-wide",
        size === 'sm' ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'
      )}
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
};