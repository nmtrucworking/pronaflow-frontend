import React from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project, ProjectStatus } from '@/types/project';
import { Circle, Clock, Pause, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  status: ProjectStatus;
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const statusConfig: Record<ProjectStatus, { 
  label: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  PLANNING: {
    label: 'Lên kế hoạch',
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
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex-shrink-0 w-80">
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
      <div className={cn(
        "min-h-[500px] max-h-[calc(100vh-280px)] overflow-y-auto p-3 space-y-3 bg-white border-2 rounded-b-xl custom-scrollbar",
        config.borderColor
      )}>
        {projects.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            Không có dự án
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <ProjectCard 
                project={project} 
                onProjectClick={onProjectClick}
                compact
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
