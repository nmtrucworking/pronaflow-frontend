import { useMemo } from 'react';
import type { Project, ProjectStatus } from '@/types/project';
import type { SortOption } from '../constants/viewModes';

interface UseFilteredProjectsParams {
  projects: Project[];
  searchQuery: string;
  statusFilter: ProjectStatus | 'ALL';
  sortOption: SortOption;
}

export const useFilteredProjects = ({
  projects,
  searchQuery,
  statusFilter,
  sortOption,
}: UseFilteredProjectsParams) => {
  return useMemo(() => {
    let result = projects.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sắp xếp dữ liệu
    if (sortOption === 'NAME_ASC') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'PRIORITY_DESC') {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }

    return result;
  }, [projects, searchQuery, statusFilter, sortOption]);
};
