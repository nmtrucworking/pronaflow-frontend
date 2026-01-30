/**
 * Projects Feature Module
 */

export { AllProjectsPage } from './pages';
export {
  ProjectHeader,
  ProjectList,
  ProjectLayout,
  ProjectDetailsView,
  ProjectCard,
  ProjectRow,
} from './components';
export {
  useFilteredProjects,
  useProjectSelection,
} from './hooks';
export {
  VIEW_MODES,
  SORT_OPTIONS,
  type ViewMode,
  type SortOption,
} from './constants';
