import React from 'react';
import { Zap, Layers, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/project';

import { PriorityBadge } from '../../../components/ui/PriorityBadge';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { AvatarStack } from '../../../components/molecules/AvatarStack';

interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
}

export const ProjectCard = ({ project, onProjectClick }: ProjectCardProps) => {
  const handleClick = () => {
    onProjectClick?.(project);
  };

  const isAgile = project.type === 'AGILE';
  const bgGradient = isAgile 
    ? 'from-purple-500 via-purple-400 to-pink-500' 
    : 'from-blue-500 via-blue-400 to-cyan-500';

  return (
    <div 
      onClick={handleClick} 
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer"
    >
      {/* Animated Top Stripe */}
      <div className={cn(
        "h-1.5 w-full opacity-70 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r transform",
        bgGradient
      )} />
      
      <div className="p-6 flex flex-col flex-1">
        {/* Header with Icon and Actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12",
              isAgile 
                ? "bg-purple-50 text-purple-600" 
                : "bg-blue-50 text-blue-600"
            )}>
              {isAgile ? <Zap className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded font-semibold">
              {project.key}
            </span>
          </div>
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Title and Description */}
        <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 line-clamp-2 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mb-5">
          <PriorityBadge priority={project.priority} />
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">
            {project.type === 'AGILE' ? '🔄 Agile' : '📊 Waterfall'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-600 font-medium">Tiến độ</span>
            <span className="text-xs font-semibold text-indigo-600">{project.progress}%</span>
          </div>
          <ProgressBar progress={project.progress} />
        </div>

        {/* Footer: Status and Members */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100">
          <div className="flex-1">
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack users={project.members} maxVisible={3} />
            <button className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 p-1.5 hover:bg-slate-100 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-indigo-600 to-purple-600 pointer-events-none transition-opacity duration-300" />
    </div>
  );
};