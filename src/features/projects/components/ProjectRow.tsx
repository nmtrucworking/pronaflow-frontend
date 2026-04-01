// @ts-nocheck
import React from 'react';
import { Calendar, Zap, Layers, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatDate } from '@/lib/localeFormatters';
import type { Project } from '../../../types/project';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';
import { PriorityBadge } from '../../../components/ui/PriorityBadge';

interface ProjectRowProps {
  project: Project;
  compact?: boolean;
  onProjectClick?: (project: Project) => void;
}

export function ProjectRow({ project, compact = false, onProjectClick }: ProjectRowProps) {
  const handleClick = () => {
    onProjectClick?.(project);
  };

  const isAgile = project.type === 'AGILE';
  const daysUntilEnd = Math.ceil(
    (new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const managerName = project.manager?.name ?? 'Chưa gán quản lý';

  return (
    <div 
      onClick={handleClick} 
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl active:scale-[0.99]',
        compact ? 'p-3' : 'p-4 md:p-5'
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', isAgile ? 'from-purple-500 via-fuchsia-400 to-pink-500' : 'from-indigo-500 via-sky-400 to-cyan-500')} />

      <div className={cn('flex flex-col gap-4', compact ? 'md:gap-3' : 'md:gap-5')}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className={cn(
              'rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md',
              compact ? 'p-2' : 'p-2.5',
              isAgile ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
            )}>
              {isAgile ? <Zap className={cn(compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5')} /> : <Layers className={cn(compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5')} />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-semibold tracking-wide rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-500">
                  {project.key}
                </span>
                <PriorityBadge priority={project.priority} size="sm" />
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
                  isAgile ? 'bg-purple-50 text-purple-700' : 'bg-sky-50 text-sky-700'
                )}>
                  {isAgile ? 'Agile' : 'Waterfall'}
                </span>
              </div>

              <h4 className={cn(
                'mt-2 font-semibold text-slate-900 transition-colors group-hover:text-indigo-700',
                compact ? 'text-sm leading-snug' : 'text-[15px] leading-snug'
              )}>
                {project.name}
              </h4>

              {project.description && (
                <p className={cn('mt-2 text-slate-500 line-clamp-2', compact ? 'text-xs' : 'text-sm')}>
                  {project.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span>👤</span>
                  {managerName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(project.end_date, { month: 'short', day: 'numeric' })}
                </span>
                {daysUntilEnd <= 7 && daysUntilEnd > 0 && (
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 font-semibold text-orange-700">
                    Còn {daysUntilEnd} ngày
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              className="rounded-lg border border-indigo-200 bg-indigo-50 p-2 text-indigo-600 transition-colors hover:bg-indigo-100"
              aria-label="View details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={cn('grid gap-3', compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4')}>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Trạng thái</div>
            <div className="mt-1.5">
              <StatusBadge status={project.status} size="sm" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Tiến độ</div>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar progress={project.progress} showLabel={false} size="sm" />
              <span className="text-xs font-semibold text-slate-700">{project.progress}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Thành viên</div>
            <div className="mt-2">
              <AvatarStack users={project.members} maxVisible={3} size="sm" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Ngày kết thúc</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(project.end_date, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};