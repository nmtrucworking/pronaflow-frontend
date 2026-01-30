import React from 'react';
import { Zap, Layers } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/project';

import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';

import { ProjectActionsMenu } from './ProjectActionsMenu';

interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
}

export const ProjectCard = ({ project, onProjectClick }: ProjectCardProps) => {
  const handleClick = () => {
    onProjectClick?.(project);
  };

  return (
    <div onClick={handleClick} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer">
      {/* Visual Stripe: Phân biệt Agile/Waterfall */}
      <div className={cn(
          "h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity bg-gradient-to-r",
          project.type === 'AGILE' ? "from-purple-500 to-pink-500" : "from-blue-500 to-cyan-500"
      )} />
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
             <div className={cn(
                 "p-1.5 rounded-lg", 
                 project.type === 'AGILE' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
             )}>
                {project.type === 'AGILE' ? <Zap className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
             </div>
             <span className="text-caption font-mono text-slate-500">{project.key}</span>
          </div>
          <ProjectActionsMenu />
        </div>

        <h3 className="text-headline text-slate-900 mb-2 group-hover:text-indigo-700 line-clamp-2">
          {project.name}
        </h3>
        <p className="text-body text-slate-500 mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
            <PriorityBadge priority={project.priority} />
            <span className="text-xs text-slate-400">•</span>
            {/* <span className="text-xs text-slate-500">{project.category}</span> */}
        </div>

        <ProgressBar progress={project.progress} className="mb-4" />

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <AvatarStack users={project.members} />
          <StatusBadge status={project.status} />
        </div>
      </div>
    </div>
  );
};