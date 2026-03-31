// @ts-nocheck
import React from 'react';
import { Calendar, Zap, Layers, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { formatDate } from '@/lib/localeFormatters';
import type { Project } from '../../../types/project';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';

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

  return (
    <div 
      onClick={handleClick} 
      className={cn(
        'group relative md:grid md:grid-cols-12 md:gap-4 md:items-center bg-white border-b border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 cursor-pointer active:scale-95',
        compact ? 'p-2.5 md:px-4 md:py-2.5' : 'p-3 md:px-6 md:py-3.5'
      )}
    >
      {/* Left Decorator */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Project Info */}
      <div className={cn('md:col-span-4 flex items-start pb-2 md:pb-0', compact ? 'gap-2' : 'gap-2.5')}>
        <div className={cn(
          'rounded-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md',
          compact ? 'p-1' : 'p-1.5',
          isAgile 
            ? "bg-purple-100 text-purple-600" 
            : "bg-blue-100 text-blue-600"
        )}>
          {isAgile ? <Zap className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} /> : <Layers className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded bg-slate-50 font-semibold">
              {project.key}
            </span>
            <h4 className={cn('font-semibold text-slate-900 group-hover:text-indigo-700 truncate transition-colors', compact ? 'text-[13px]' : 'text-sm')}>
              {project.name}
            </h4>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>👤</span> {project.manager.name}
          </div>
        </div>
      </div>

      {/* Status - Mobile and Desktop */}
      <div className="md:col-span-2 mb-2 md:mb-0">
        <div className="md:hidden text-xs text-slate-500 font-medium mb-1">Trạng thái</div>
        <StatusBadge status={project.status} size="sm" />
      </div>

      {/* Progress - Mobile and Desktop */}
      <div className="md:col-span-2 mb-2 md:mb-0">
        <div className="md:hidden text-xs text-slate-500 font-medium mb-1">Tiến độ</div>
        <div className="md:hidden">
          <ProgressBar progress={project.progress} showLabel={true} size="sm" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <ProgressBar progress={project.progress} showLabel={false} size="sm" />
          <span className="text-xs font-semibold text-slate-700">{project.progress}%</span>
        </div>
      </div>

      {/* Members - Mobile and Desktop */}
      <div className="md:col-span-2 mb-2 md:mb-0">
        <div className="md:hidden text-xs text-slate-500 font-medium mb-1">Thành viên</div>
        <AvatarStack users={project.members} maxVisible={3} size="sm" />
      </div>

      {/* Due Date - Mobile and Desktop */}
      <div className="md:col-span-2 mb-3 md:mb-0">
        <div className="md:hidden text-xs text-slate-500 font-medium mb-1">Ngày kết thúc</div>
        <div className="flex items-center justify-between md:justify-end gap-2">
          <div className="flex items-center gap-1.5 md:flex-col md:items-end">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="text-sm text-slate-700 font-medium">
              {formatDate(project.end_date, { month: 'short', day: 'numeric' })}
            </div>
            {daysUntilEnd <= 7 && daysUntilEnd > 0 && (
              <span className="hidden md:block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                {daysUntilEnd} ngày
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions - Desktop Only */}
      <div className="hidden md:flex md:col-span-0 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </button>
        <button 
          className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
          aria-label="View details"
        >
          <ArrowUpRight className="w-4 h-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
};