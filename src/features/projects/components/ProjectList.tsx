import { ProjectCard } from './ProjectCard';
import { ProjectRow } from './ProjectRow';
import { Inbox } from 'lucide-react';
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
          </div>
          <p className="text-slate-500 font-medium">Đang tải dữ liệu dự án...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
          <Inbox className="w-8 h-8 text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900">Không có dự án nào</p>
          <p className="text-slate-500 mt-2">Hãy tạo dự án đầu tiên của bạn để bắt đầu</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {viewMode === 'GRID' && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in duration-500">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard 
                  project={project} 
                  onProjectClick={onProjectClick} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'LIST' && (
        <div className="p-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 sticky top-0 z-20">
              <div className="col-span-4 text-xs font-semibold text-slate-700 uppercase tracking-wider">Dự án</div>
              <div className="col-span-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">Trạng thái</div>
              <div className="col-span-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">Tiến độ</div>
              <div className="col-span-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">Thành viên</div>
              <div className="col-span-2 text-xs font-semibold text-slate-700 uppercase tracking-wider text-right">Ngày kết thúc</div>
            </div>

            {/* List Items */}
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <ProjectRow 
                  project={project} 
                  onProjectClick={onProjectClick} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'KANBAN' && (
        <div className="flex items-center justify-center h-96 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-full mb-4">
              <span className="text-2xl">🔨</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">Chế độ Kanban đang được phát triển</p>
            <p className="text-slate-500 mt-2">Quay lại sau để trải nghiệm chế độ xem Kanban</p>
          </div>
        </div>
      )}
    </main>
  );
};
