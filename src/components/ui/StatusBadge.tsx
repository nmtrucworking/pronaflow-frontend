// @ts-nocheck
import React from 'react';
import { FilePlus, Calendar, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import COLORS from '@/config/colors';
import { hexToRgb } from '@/config/colorUtils';
import type { ProjectStatus } from '../../types/project';

const DEFAULT_STATUS: ProjectStatus = 'ON_HOLD';

const normalizeStatus = (status: string | undefined | null): ProjectStatus => {
  const value = String(status ?? '').trim().toUpperCase();

  switch (value) {
    case 'ACTIVE':
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'IN_REVIEW':
      return 'IN_REVIEW';
    case 'DONE':
    case 'COMPLETED':
      return 'DONE';
    case 'ARCHIVED':
      return 'ARCHIVED';
    case 'NOT_STARTED':
    case 'PLANNED':
      return 'NOT_STARTED';
    case 'ON_HOLD':
    case 'PENDING':
      return 'ON_HOLD';
    default:
      return DEFAULT_STATUS;
  }
};

const toRgba = (color: string, opacity: number): string => {
  if (color.includes('rgb(')) {
    return color.replace('/ 1', `/ ${opacity}`);
  }
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : color;
  }
  return color;
};

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; icon: React.ElementType; border: string }> = {
  ON_HOLD: {
    label: 'Khởi tạo',
    color: COLORS.ui.text.muted,
    bg: COLORS.ui.background.secondary,
    border: COLORS.ui.border.medium,
    icon: FilePlus,
  },
  NOT_STARTED: {
    label: 'Lập kế hoạch',
    color: COLORS.semantic.info[500],
    bg: toRgba(COLORS.semantic.info[500], 0.12),
    border: toRgba(COLORS.semantic.info[500], 0.3),
    icon: Calendar,
  },
  IN_PROGRESS: {
    label: 'Thực thi',
    color: COLORS.primary[600],
    bg: toRgba(COLORS.primary[600], 0.12),
    border: toRgba(COLORS.primary[600], 0.3),
    icon: Zap,
  },
  IN_REVIEW: {
    label: 'Kiểm soát',
    color: COLORS.semantic.warning[600],
    bg: toRgba(COLORS.semantic.warning[600], 0.12),
    border: toRgba(COLORS.semantic.warning[600], 0.3),
    icon: Activity,
  },
  DONE: {
    label: 'Hoàn thành',
    color: COLORS.semantic.success[600],
    bg: toRgba(COLORS.semantic.success[600], 0.12),
    border: toRgba(COLORS.semantic.success[600], 0.3),
    icon: CheckCircle2,
  },
  ARCHIVED: {
    label: 'Lưu trữ',
    color: COLORS.ui.text.muted,
    bg: COLORS.ui.background.secondary,
    border: COLORS.ui.border.medium,
    icon: FilePlus,
  },
};

export const StatusBadge = ({ status, className, size = 'default' }: { status: ProjectStatus | string; className?: string; size?: 'sm' | 'default' }) => {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG[DEFAULT_STATUS];
  const Icon = config?.icon ?? FilePlus;
  const label = config?.label ?? 'Khởi tạo';
  const color = config?.color ?? COLORS.ui.text.muted;
  const bg = config?.bg ?? COLORS.ui.background.secondary;
  const border = config?.border ?? COLORS.ui.border.medium;
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium border transition-colors",
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        className
      )}
      style={{ color, backgroundColor: bg, borderColor: border }}
    >
      <Icon className={cn(size === 'sm' ? 'w-2.5 h-2.5 mr-0.5' : 'w-3 h-3 mr-1')} />
      {label}
    </span>
  );
};