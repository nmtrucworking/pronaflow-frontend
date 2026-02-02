import { useState, useMemo } from 'react';
import type { Project, ProjectStatus } from '@/types/project';
import { MOCK_PROJECTS } from '@/mocks/projects';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectList } from '../components/ProjectList';
import { ProjectLayout } from '../components/ProjectLayout';
import { ProjectDetailsView } from '../components/ProjectDetailsView';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useProjectSelection } from '../hooks/useProjectSelection';
import type { ViewMode, SortOption } from '../constants/viewModes';

export const AllProjectsPage: React.FC = () => {
  // Initial data
  const [projects] = useState<Project[]>(MOCK_PROJECTS);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NAME_ASC');

  // Project selection state
  const {
    selectedProject,
    showSidebar,
    showFullPage,
    selectProject,
    closeSidebar,
    openFullPage,
    closeFullPage,
  } = useProjectSelection();

  // Filtered projects
  const filteredProjects = useFilteredProjects({
    projects,
    searchQuery,
    statusFilter,
    sortOption,
  });

  // Project statistics
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status === 'ON_HOLD' || p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
    archived: projects.filter(p => p.status === 'ARCHIVED').length,
  }), [projects]);

  // Render full page view if needed
  if (selectedProject && showFullPage) {
    return (
      <ProjectDetailsView 
        project={selectedProject} 
        onBack={closeFullPage} 
      />
    );
  }

  // Render main layout
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100">
      {/* Header */}
      <ProjectHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onFilterClick={() => {
          // TODO: Open filter modal
        }}
        onCreateClick={() => {
          // TODO: Open create modal
        }}
      />

      {/* Quick Stats Bar */}
      <div className="hidden md:flex gap-8 px-6 py-4 bg-white border-b border-slate-200 sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-indigo-600">{stats.total}</span>
          <span className="text-sm text-slate-600">Tổng dự án</span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600">{stats.active}</span>
          <span className="text-sm text-slate-600">Đang hoạt động</span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-emerald-600">{stats.completed}</span>
          <span className="text-sm text-slate-600">Đã hoàn thành</span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-slate-600">{stats.archived}</span>
          <span className="text-sm text-slate-600">Lưu trữ</span>
        </div>
      </div>

      {/* Main Content */}
      <ProjectLayout
        selectedProject={selectedProject}
        showSidebar={showSidebar}
        onCloseSidebar={closeSidebar}
        onOpenFullPage={openFullPage}
      >
        <ProjectList
          projects={filteredProjects}
          viewMode={viewMode}
          onProjectClick={selectProject}
          isEmpty={filteredProjects.length === 0}
        />
      </ProjectLayout>
    </div>
  );
};

export default AllProjectsPage;
