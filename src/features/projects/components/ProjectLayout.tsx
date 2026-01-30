import { cn } from '@/lib/utils';
import ProjectDetailsSidebar from './ProjectDetailsSidebar';
import type { Project } from '@/types/project';

interface ProjectLayoutProps {
  children: React.ReactNode;
  selectedProject: Project | null;
  showSidebar: boolean;
  onCloseSidebar: () => void;
  onOpenFullPage: () => void;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({
  children,
  selectedProject,
  showSidebar,
  onCloseSidebar,
  onOpenFullPage,
}) => {
  return (
    <div className="h-screen flex bg-slate-50/50 overflow-hidden">
      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-out',
          showSidebar ? 'mr-[900px]' : 'mr-0'
        )}
      >
        {children}
      </div>

      {/* Project Details Sidebar */}
      {selectedProject && (
        <ProjectDetailsSidebar
          project={selectedProject}
          isOpen={showSidebar}
          onClose={onCloseSidebar}
          onFullPage={onOpenFullPage}
        />
      )}
    </div>
  );
};
