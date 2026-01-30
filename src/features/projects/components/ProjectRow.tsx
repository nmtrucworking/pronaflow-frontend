import React from 'react';
import { Calendar, Zap, Layers } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/project';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';
import { ProjectActionsMenu } from './ProjectActionsMenu';

interface ProjectRowProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
}

export function ProjectRow({ project, onProjectClick }: ProjectRowProps) {
  const handleClick = () => {
    onProjectClick?.(project);
  };

  return (
    <div onClick={handleClick} className="group flex items-center p-4 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="w-10 mr-4 flex-shrink-0 text-center">
        <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-transform group-hover:scale-110",
            project.type === 'AGILE' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
        )}>
            {project.type === 'AGILE' ? <Zap className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </div>
      </div>
      
      <div className="flex-1 min-w-[200px] pr-4">
        <div className="flex items-center gap-2 mb-0.5">
            <span className="text-micro font-mono text-slate-400 border border-slate-200 px-1 rounded">{project.key}</span>
            <h4 className="text-subheading text-slate-900 group-hover:text-indigo-700 truncate">{project.name}</h4>
        </div>
        <div className="text-caption text-slate-500">QL: {project.manager.name}</div>
      </div>

      <div className="w-32 px-4 flex-shrink-0">
        <StatusBadge status={project.status} />
      </div>

      <div className="w-32 px-4 flex-shrink-0">
        <ProgressBar progress={project.progress} showLabel={false} />
      </div>

      <div className="w-32 px-4 flex-shrink-0 flex justify-center">
        <AvatarStack users={project.members} />
      </div>

      <div className="w-32 px-4 flex-shrink-0 text-right text-xs text-slate-500">
        <div className="flex items-center justify-end gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(project.end_date).toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div className="w-10 flex-shrink-0 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <ProjectActionsMenu />
      </div>
    </div>
  );
};