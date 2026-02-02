import { useState, useMemo } from 'react';
import type { Project, ProjectStatus, ProjectPriority } from '@/types/project';
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
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NAME_ASC');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  
  // Column sorting
  const [sortColumn, setSortColumn] = useState<'name' | 'status' | 'progress' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleColumnSort = (column: 'name' | 'status' | 'progress' | 'date') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

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

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || project.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Apply column sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      switch (sortColumn) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
        case 'progress':
          compareValue = a.progress - b.progress;
          break;
        case 'date':
          compareValue = new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
          break;
      }
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, priorityFilter, sortColumn, sortDirection]);

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
    <ProjectLayout
      selectedProject={selectedProject}
      showSidebar={showSidebar}
      onCloseSidebar={closeSidebar}
      onOpenFullPage={openFullPage}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <ProjectHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showFilterPopover={showFilterPopover}
          onFilterClick={() => setShowFilterPopover(!showFilterPopover)}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
          onCreateClick={() => {
            // TODO: Open create modal
          }}
        />

        {/* Quick Stats Bar */}
        <div className="hidden md:flex gap-8 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
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
        <ProjectList
          projects={filteredProjects}
          viewMode={viewMode}
          onProjectClick={selectProject}
          isEmpty={filteredProjects.length === 0}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onColumnSort={handleColumnSort}
        />
      </div>
    </ProjectLayout>
  );
};

export default AllProjectsPage;
