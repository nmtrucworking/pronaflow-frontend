// @ts-nocheck
import { useState, useMemo } from 'react';
import type { Project, ProjectStatus, ProjectPriority } from '@/types/project';
import { MOCK_PROJECTS } from '@/mocks/projects';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectList } from '../components/ProjectList';
import { ProjectLayout } from '../components/ProjectLayout';
import { ProjectDetailsView } from '../components/ProjectDetailsView';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useProjectSelection } from '../hooks/useProjectSelection';
import type { ViewMode, SortOption } from '../constants/viewModes';

export const AllProjectsPage: React.FC = () => {
  // Initial data
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreateProject = (projectData: any) => {
    // Create new project with unique ID
    const newProject: Project = {
      id: `PRJ-${Date.now()}`,
      key: `PRJ${Math.floor(Math.random() * 10000)}`,
      ...projectData,
      progress: 0,
      status: 'NOT_STARTED',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      members: [],
      team_size: 0,
      tasks_count: 0,
      completed_tasks: 0,
    };
    setProjects([...projects, newProject]);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus }
        : project
    ));
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
    <>
      <CreateProjectModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateProject={handleCreateProject}
      />
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
            onCreateClick={() => setShowCreateModal(true)}
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
            onStatusChange={handleStatusChange}
          />
        </div>
      </ProjectLayout>
    </>
  );
};

export default AllProjectsPage;
