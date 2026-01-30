import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import ProjectDetails from './ProjectDetails';

interface ProjectDetailsViewProps {
  project: Project | null;
  onBack: () => void;
}

export const ProjectDetailsView: React.FC<ProjectDetailsViewProps> = ({ project, onBack }) => {
  if (!project) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <ProjectDetails project={project} onBack={onBack} />
    </div>
  );
};
