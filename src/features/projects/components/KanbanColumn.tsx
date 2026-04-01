// @ts-nocheck
import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project, ProjectStatus } from '@/types/project';
import { Circle, Clock, ClipboardCheck, Pause, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type KanbanStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'ON_HOLD' | 'DONE';

interface KanbanColumnProps {
  status: KanbanStatus;
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onStatusChange?: (projectId: string, newStatus: ProjectStatus) => void;
}

const statusConfig: Record<KanbanStatus, { 
  label: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  NOT_STARTED: {
    label: 'Chưa bắt đầu',
    icon: Circle,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
  },
  IN_PROGRESS: {
    label: 'Đang thực hiện',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  IN_REVIEW: {
    label: 'Đang rà soát',
    icon: ClipboardCheck,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
  },
  ON_HOLD: {
    label: 'Tạm dừng',
    icon: Pause,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  projects,
  onProjectClick,
  onStatusChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only set to false if leaving the actual drop zone, not to child elements
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const projectData = e.dataTransfer.getData('application/json');
      if (projectData) {
        const project = JSON.parse(projectData);
        // Only update if status is different
        if (project.status !== status) {
          onStatusChange?.(project.project_id, status);
        }
      }
    } catch (error) {
      console.error('Failed to parse dropped project data:', error);
    }
  };

  return (
    <div className="flex-shrink-0 w-[18rem] sm:w-80">
      {/* Column Header */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-3 rounded-t-xl border-2 border-b-0",
        config.bgColor,
        config.borderColor
      )}>
        <Icon className={cn("w-4 h-4", config.color)} />
        <h3 className={cn("font-semibold text-sm", config.color)}>
          {config.label}
        </h3>
        <span className={cn(
          "ml-auto px-2 py-0.5 text-xs font-bold rounded-full",
          config.bgColor,
          config.color
        )}>
          {projects.length}
        </span>
      </div>

      {/* Column Content */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto p-3 space-y-3 bg-white border-2 rounded-b-xl custom-scrollbar transition-all duration-200",
          config.borderColor,
          isDragOver && "bg-gradient-to-b from-indigo-50 to-white border-indigo-400 shadow-inset"
        )}
      >
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-36 text-slate-400 text-sm text-center px-4">
            <div className="mb-2 rounded-full border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              Trống
            </div>
            <p>Chưa có dự án ở trạng thái này</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.project_id}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <ProjectCard 
                project={project} 
                onProjectClick={onProjectClick}
                compact
                isDraggable={true}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
