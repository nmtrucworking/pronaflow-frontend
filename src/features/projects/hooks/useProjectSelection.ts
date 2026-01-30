import { useState, useCallback } from 'react';
import type { Project } from '@/types/project';

interface UseProjectSelectionReturn {
  selectedProject: Project | null;
  showSidebar: boolean;
  showFullPage: boolean;
  selectProject: (project: Project) => void;
  closeSidebar: () => void;
  openFullPage: () => void;
  closeFullPage: () => void;
}

export const useProjectSelection = (): UseProjectSelectionReturn => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFullPage, setShowFullPage] = useState(false);

  const selectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setShowSidebar(true);
    setShowFullPage(false);
  }, []);

  const closeSidebar = useCallback(() => {
    setShowSidebar(false);
    setSelectedProject(null);
  }, []);

  const openFullPage = useCallback(() => {
    setShowSidebar(false);
    setTimeout(() => {
      setShowFullPage(true);
    }, 150);
  }, []);

  const closeFullPage = useCallback(() => {
    setShowFullPage(false);
    setSelectedProject(null);
  }, []);

  return {
    selectedProject,
    showSidebar,
    showFullPage,
    selectProject,
    closeSidebar,
    openFullPage,
    closeFullPage,
  };
};
