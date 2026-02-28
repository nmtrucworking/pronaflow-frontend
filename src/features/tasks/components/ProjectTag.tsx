import React from 'react';
import type { ProjectRef } from '../types';
import { cn } from '../utils';

interface ProjectTagProps {
  project: ProjectRef;
  onClick?: () => void;
}

export const ProjectTag = ({ project, onClick }: ProjectTagProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center space-x-1.5 group cursor-pointer px-1.5 py-0.5 rounded-full hover:bg-slate-100 transition-colors duration-200 max-w-full"
  >
    <span className={cn("w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-slate-200 transition-all duration-300", project.color)} />
    <span className="text-xs text-slate-500 group-hover:text-slate-800 font-medium transition-colors truncate">
      {project.name}
    </span>
  </button>
);
