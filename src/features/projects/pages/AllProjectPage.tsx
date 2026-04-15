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
import { useDensityPreference } from '@/hooks/useDensityPreference';
import { cn } from '@/lib/utils';

export const AllProjectsPage: React.FC = () => {
  const densityPreference = useDensityPreference();
  const isCompact = densityPreference === 'compact';
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'>('ALL');
  
  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'ALL'>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NAME_ASC');
  const [showFilterPopover, setShowFilterPopover] = useState(false);

  // Data fetching
  const { data: projectsResponse, isLoading, error } = useProjects(
    undefined,
    undefined,
    1,
    1000,
    'created_at',
    true
  );
  const projects = projectsResponse?.projects ?? [];
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateStatus } = useUpdateProjectStatus();
  const { mutate: deleteProject } = useDeleteProject();
  
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
      const matchesQuickFilter = (() => {
        switch (quickFilter) {
          case 'ACTIVE':
            return project.status === 'IN_PROGRESS' || project.status === 'ON_HOLD';
          case 'COMPLETED':
            return project.status === 'DONE';
          case 'ARCHIVED':
            return project.status === 'ARCHIVED' || project.is_archived;
          default:
            return true;
        }
      })();
      return matchesSearch && matchesStatus && matchesPriority && matchesQuickFilter;
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
  }, [projects, searchQuery, statusFilter, priorityFilter, quickFilter, sortColumn, sortDirection]);

  // Project statistics
  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p: Project) => p.status === 'ON_HOLD' || p.status === 'IN_PROGRESS').length,
    completed: projects.filter((p: Project) => p.status === 'DONE').length,
    archived: projects.filter((p: Project) => p.status === 'ARCHIVED').length,
  }), [projects]);

  const quickFilterItems: Array<{
    key: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    label: string;
    count: number;
    tone: string;
  }> = [
    { key: 'ALL', label: 'Tất cả', count: stats.total, tone: 'text-slate-700' },
    { key: 'ACTIVE', label: 'Đang hoạt động', count: stats.active, tone: 'text-blue-700' },
    { key: 'COMPLETED', label: 'Đã hoàn thành', count: stats.completed, tone: 'text-emerald-700' },
  ];

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

          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-200 flex-shrink-0 overflow-x-auto">
            {quickFilterItems.map((item) => {
              const active = quickFilter === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setQuickFilter(item.key)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 whitespace-nowrap',
                    active
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <span className={cn('text-base font-bold', item.tone)}>{item.count}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setQuickFilter('ARCHIVED')}
                className={cn(
                  'text-sm font-medium underline underline-offset-4 transition-colors',
                  quickFilter === 'ARCHIVED' ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
                )}
              >
                Lưu trữ
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
              >
                <span className="text-base leading-none">+</span>
                Tạo nhanh project
              </button>
            </div>
          </div>

          {/* Main Content */}
          <ProjectList
            projects={filteredProjects}
            viewMode={viewMode}
            isCompact={isCompact}
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
