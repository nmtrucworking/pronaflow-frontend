import { useState, useMemo } from 'react';
import type { Project, ProjectStatus, ProjectPriority, ProjectType, CreateProjectDTO } from '@/types/project';
import { ProjectHeader } from '../components/ProjectHeader';
import { useProjects, useCreateProject, useUpdateProjectStatus, useDeleteProject } from '@/hooks/projectHooks';
import { ProjectList } from '../components/ProjectList';
import { ProjectLayout } from '../components/ProjectLayout';
import { ProjectDetailsView } from '../components/ProjectDetailsView';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useProjectSelection } from '../hooks/useProjectSelection';
import type { ViewMode, SortOption } from '../constants/viewModes';

export const AllProjectsPage: React.FC = () => {
  // Data fetching
  const { data: projectsResponse, isLoading, error } = useProjects();
  const projects = projectsResponse?.projects ?? [];
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateStatus } = useUpdateProjectStatus();
  const { mutate: deleteProject } = useDeleteProject();
  
  // Local state
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

  const handleCreateProject = (projectData: { name: string; description: string; type: ProjectType; priority: ProjectPriority }) => {
    const fullData: CreateProjectDTO = {
      workspace_id: 'default', // TODO: Get from context or URL
      name: projectData.name,
      description: projectData.description,
      type: projectData.type,
      priority: projectData.priority,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    createProject(fullData);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateStatus({ projectId, status: newStatus });
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
    let filtered = projects.filter((project: Project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || project.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Apply column sorting
    filtered.sort((a: Project, b: Project) => {
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
          compareValue = new Date(a.end_date || '').getTime() - new Date(b.end_date || '').getTime();
          break;
      }
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, priorityFilter, sortColumn, sortDirection]);

  // Project statistics
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p: Project) => p.status === 'ON_HOLD' || p.status === 'IN_PROGRESS').length,
    completed: projects.filter((p: Project) => p.status === 'DONE').length,
    archived: projects.filter((p: Project) => p.status === 'ARCHIVED').length,
  }), [projects]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Đang tải dự án...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Có lỗi xảy ra</h2>
          </div>
          <p className="text-slate-600 mb-4">{error instanceof Error ? error.message : 'Không thể tải dữ liệu dự án'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
