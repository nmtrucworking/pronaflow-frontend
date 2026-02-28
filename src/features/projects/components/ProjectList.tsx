// @ts-nocheck
import { ProjectCard } from './ProjectCard';
import { ProjectRow } from './ProjectRow';
import { KanbanColumn } from './KanbanColumn';
import { Inbox, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { Project } from '@/types/project';
import type { ViewMode } from '../constants/viewModes';
import type { ProjectStatus } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectListProps {
  projects: Project[];
  viewMode: ViewMode;
  onProjectClick: (project: Project) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onColumnSort?: (column: string) => void;
  onStatusChange?: (projectId: string, newStatus: ProjectStatus) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  viewMode,
  onProjectClick,
  isLoading = false,
  isEmpty = false,
  sortColumn,
  sortDirection,
  onColumnSort,
  onStatusChange,
}) => {
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
      : <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />;
  };

  const SortableHeader = ({ column, children, className = "" }: { column: string; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => onColumnSort?.(column)}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider hover:text-indigo-600 transition-colors group",
        className
      )}
    >
      {children}
      {renderSortIcon(column)}
    </button>
  );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 animate-in fade-in duration-500 auto-rows-max">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard 
                  project={project} 
                  onProjectClick={onProjectClick}
                  onDoubleClick={(proj) => {
                    // Open full project details on double-click
                    onProjectClick?.(proj);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'LIST' && (
        <div className="p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 sticky top-0 z-20">
              <div className="col-span-4">
                <SortableHeader column="name">Dự án</SortableHeader>
              </div>
              <div className="col-span-2">
                <SortableHeader column="status">Trạng thái</SortableHeader>
              </div>
              <div className="col-span-2">
                <SortableHeader column="progress">Tiến độ</SortableHeader>
              </div>
              <div className="col-span-2">
                <SortableHeader column="members">Thành viên</SortableHeader>
              </div>
              <div className="col-span-2">
                <SortableHeader column="endDate" className="justify-end">Ngày kết thúc</SortableHeader>
              </div>
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
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              status="PLANNING"
              projects={projects.filter(p => p.status === 'PLANNING')}
              onProjectClick={onProjectClick}
              onStatusChange={onStatusChange}
            />
            <KanbanColumn
              status="IN_PROGRESS"
              projects={projects.filter(p => p.status === 'IN_PROGRESS')}
              onProjectClick={onProjectClick}
              onStatusChange={onStatusChange}
            />
            <KanbanColumn
              status="ON_HOLD"
              projects={projects.filter(p => p.status === 'ON_HOLD')}
              onProjectClick={onProjectClick}
              onStatusChange={onStatusChange}
            />
            <KanbanColumn
              status="COMPLETED"
              projects={projects.filter(p => p.status === 'COMPLETED')}
              onProjectClick={onProjectClick}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectList;
