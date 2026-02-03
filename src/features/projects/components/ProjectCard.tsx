import React, { useState, useRef } from 'react';
import { Zap, Layers, ArrowUpRight, MoreHorizontal, Copy, Edit2, Trash2, ArchiveIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/project';

import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';

interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
  compact?: boolean;
  onDoubleClick?: (project: Project) => void;
  isDraggable?: boolean;
}

export const ProjectCard = ({ project, onProjectClick, onDoubleClick, compact = false, isDraggable = false }: ProjectCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const doubleClickTimer = useRef<NodeJS.Timeout | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prev => prev + 1);

    if (doubleClickTimer.current) {
      clearTimeout(doubleClickTimer.current);
    }

    doubleClickTimer.current = setTimeout(() => {
      if (clickCount === 1) {
        onProjectClick?.(project);
      }
      setClickCount(0);
    }, 300);
  };

  const handleDoubleClick = () => {
    if (doubleClickTimer.current) {
      clearTimeout(doubleClickTimer.current);
    }
    setClickCount(0);
    onDoubleClick?.(project);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(project));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowContextMenu(true);
  };

  const isAgile = project.type === 'AGILE';
  const bgGradient = isAgile 
    ? 'from-purple-500 via-purple-400 to-pink-500' 
    : 'from-blue-500 via-blue-400 to-cyan-500';

  return (
    <div 
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onDragStart={isDraggable ? handleDragStart : undefined}
      onDragEnd={isDraggable ? handleDragEnd : undefined}
      draggable={isDraggable}
      className={cn(
        "group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden h-full",
        isDraggable && "cursor-move",
        "select-none",
        isDragging && "opacity-50 scale-95 border-indigo-500 bg-indigo-50",
        compact && "hover:-translate-y-1 hover:shadow-lg"
      )}
    >
      {/* Right-click Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute right-0 top-0 z-50 w-48 bg-white border border-slate-200 rounded-lg shadow-xl animate-in fade-in scale-in-95 origin-top-right duration-200"
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <div className="p-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 text-sm hover:bg-slate-100 transition-colors group/item">
              <Edit2 className="w-4 h-4 text-slate-500 group-hover/item:text-indigo-600" />
              <span>Chỉnh sửa</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 text-sm hover:bg-slate-100 transition-colors group/item">
              <Copy className="w-4 h-4 text-slate-500 group-hover/item:text-indigo-600" />
              <span>Nhân bản</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 text-sm hover:bg-slate-100 transition-colors group/item">
              <ArchiveIcon className="w-4 h-4 text-slate-500 group-hover/item:text-amber-600" />
              <span>Lưu trữ</span>
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 text-sm hover:bg-red-50 transition-colors group/item">
              <Trash2 className="w-4 h-4" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      )}
      {/* Animated Top Stripe */}
      <div className={cn(
        "w-full opacity-70 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r transform",
        bgGradient,
        compact ? "h-1" : "h-1.5"
      )} />
      
      <div className={cn("flex flex-col flex-1", compact ? "p-3" : "p-6")}>
        {/* Header with Icon and Actions */}
        <div className={cn("flex justify-between items-start", compact ? "mb-2" : "mb-4")}>
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12",
              isAgile 
                ? "bg-purple-50 text-purple-600" 
                : "bg-blue-50 text-blue-600",
              compact ? "p-1.5" : "p-2"
            )}>
              {isAgile ? <Zap className={cn(compact ? "w-4 h-4" : "w-5 h-5")} /> : <Layers className={cn(compact ? "w-4 h-4" : "w-5 h-5")} />}
            </div>
            <span className={cn(
              "font-mono text-slate-500 bg-slate-50 rounded font-semibold",
              compact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
            )}>
              {project.key}
            </span>
          </div>
          {!compact && (
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Title and Description */}
        <h3 className={cn(
          "font-semibold text-slate-900 group-hover:text-indigo-700 line-clamp-2 transition-colors",
          compact ? "text-sm mb-1" : "text-base mb-2"
        )}>
          {project.name}
        </h3>
        <p className={cn(
          "text-slate-500 line-clamp-2 flex-1",
          compact ? "text-xs mb-2" : "text-sm mb-4"
        )}>
          {project.description}
        </p>

        {/* Metadata Row */}
        <div className={cn("flex items-center gap-2", compact ? "mb-2" : "mb-5")}>
          <PriorityBadge priority={project.priority} size={compact ? "sm" : "default"} />
          {!compact && (
            <>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {project.type === 'AGILE' ? '🔄 Agile' : '📊 Waterfall'}
              </span>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className={cn(compact ? "mb-2" : "mb-6")}>
          <div className={cn("flex justify-between items-center", compact ? "mb-1" : "mb-2")}>
            <span className={cn("text-slate-600 font-medium", compact ? "text-[10px]" : "text-xs")}>Tiến độ</span>
            <span className={cn("font-semibold text-indigo-600", compact ? "text-[10px]" : "text-xs")}>{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} size={compact ? "sm" : "default"} />
        </div>

        {/* Footer: Status and Members */}
        <div className={cn(
          "flex items-center justify-between border-t border-slate-100",
          compact ? "pt-2" : "pt-5"
        )}>
          <div className="flex-1">
            <StatusBadge status={project.status} size={compact ? "sm" : "default"} />
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack users={project.members} maxVisible={compact ? 2 : 3} size={compact ? "sm" : "default"} />
            {!compact && (
              <button className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 p-1.5 hover:bg-slate-100 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-indigo-600 to-purple-600 pointer-events-none transition-opacity duration-300" />
    </div>
  );
};