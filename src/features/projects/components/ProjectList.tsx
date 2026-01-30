import { ProjectCard } from './ProjectCard';
import { ProjectRow } from './ProjectRow';
import type { Project } from '@/types/project';
import type { ViewMode } from '../constants/viewModes';

interface ProjectListProps {
  projects: Project[];
  viewMode: ViewMode;
  onProjectClick: (project: Project) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  viewMode,
  onProjectClick,
  isLoading = false,
  isEmpty = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Không có dự án nào</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onProjectClick={onProjectClick} 
            />
          ))}
        </div>
      )}

      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {projects.map(project => (
            <ProjectRow 
              key={project.id} 
              project={project} 
              onProjectClick={onProjectClick} 
            />
          ))}
        </div>
      )}

      {viewMode === 'KANBAN' && (
        <div className="text-slate-500 text-center py-8">
          Chế độ Kanban đang được phát triển
        </div>
      )}
    </main>
  );
};
