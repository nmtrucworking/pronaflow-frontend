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
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Project Details Sidebar */}
      {selectedProject && (
        <>
          {/* Backdrop for mobile */}
          {showSidebar && (
            <div 
              className="fixed inset-0 lg:hidden bg-black/50 backdrop-blur-sm z-30 animate-in fade-in duration-200"
              onClick={onCloseSidebar}
            />
          )}
          
          {/* Sidebar Container */}
          <div
            className={cn(
              'fixed lg:relative right-0 top-0 h-full bg-white border-l border-slate-200 shadow-2xl z-40 transition-all duration-300 ease-out overflow-hidden',
              showSidebar 
                ? 'w-full sm:w-[480px] lg:w-[600px] xl:w-[700px] translate-x-0' 
                : 'w-0 translate-x-full lg:translate-x-0 opacity-0 pointer-events-none'
            )}
          >
            {showSidebar && (
              <ProjectDetailsSidebar
                project={selectedProject}
                isOpen={showSidebar}
                onClose={onCloseSidebar}
                onFullPage={onOpenFullPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
