import { useState } from 'react';
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

      <ProjectList
        projects={filteredProjects}
        viewMode={viewMode}
        onProjectClick={selectProject}
        isEmpty={filteredProjects.length === 0}
      />
    </ProjectLayout>
  );
};

export default AllProjectsPage;
