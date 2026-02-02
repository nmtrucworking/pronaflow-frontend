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
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-out overflow-hidden',
          showSidebar ? 'mr-96' : 'mr-0'
        )}
      >
        {children}
      </div>

      {/* Project Details Sidebar */}
      {selectedProject && (
        <>
          {/* Backdrop */}
          {showSidebar && (
            <div 
              className="fixed inset-0 md:hidden bg-black/40 backdrop-blur-sm z-30 animate-in fade-in duration-200"
              onClick={onCloseSidebar}
            />
          )}
          
          {/* Sidebar */}
          <div
            className={cn(
              'fixed md:relative right-0 top-0 h-full w-full md:w-96 bg-white border-l border-slate-200 shadow-2xl md:shadow-lg z-40 transition-all duration-300 ease-out overflow-y-auto',
              showSidebar 
                ? 'translate-x-0 animate-in slide-in-from-right-80 duration-300' 
                : 'translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none'
            )}
          >
            <ProjectDetailsSidebar
              project={selectedProject}
              isOpen={showSidebar}
              onClose={onCloseSidebar}
              onFullPage={onOpenFullPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
