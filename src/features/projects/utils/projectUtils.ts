/**
 * Project Utilities
 * Module 3: Project Lifecycle Management
 * Helper functions for project operations
 */

import {
  Project,
  ProjectStatus,
  ProjectPriority,
  HealthStatus,
  ProjectMetrics,
} from '@/types/project';
import { PROJECT_PRIORITY_BADGE_CLASS, PROJECT_STATUS_BADGE_CLASS } from '@/config/domainMappings';

/**
 * Generate project key based on name
 * Example: "My Project" -> "MYP"
 */
export function generateProjectKey(name: string): string {
  const words = name.split(' ').filter((w) => w.length > 0);
  const key = words
    .map((w) => w[0].toUpperCase())
    .join('')
    .substring(0, 3)
    .padEnd(3, 'X');
  return key;
}

/**
 * Get readable status label
 */
export const statusLabels: Record<ProjectStatus, string> = {
  'NOT_STARTED': 'Not Started',
  'IN_PROGRESS': 'In Progress',
  'IN_REVIEW': 'In Review',
  'DONE': 'Done',
  'ON_HOLD': 'On Hold',
  'ARCHIVED': 'Archived',
};

export const getStatusLabel = (status: ProjectStatus): string => {
  return statusLabels[status] || status;
};

/**
 * Get status badge color
 */
export const statusColors: Record<ProjectStatus, string> = {
  NOT_STARTED: PROJECT_STATUS_BADGE_CLASS.NOT_STARTED,
  IN_PROGRESS: PROJECT_STATUS_BADGE_CLASS.IN_PROGRESS,
  IN_REVIEW: PROJECT_STATUS_BADGE_CLASS.IN_REVIEW,
  DONE: PROJECT_STATUS_BADGE_CLASS.DONE,
  ON_HOLD: PROJECT_STATUS_BADGE_CLASS.ON_HOLD,
  ARCHIVED: PROJECT_STATUS_BADGE_CLASS.ARCHIVED,
};

export const getStatusColor = (status: ProjectStatus): string => {
  return statusColors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Get priority label
 */
export const priorityLabels: Record<ProjectPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const getPriorityLabel = (priority: ProjectPriority): string => {
  return priorityLabels[priority] || priority;
};

/**
 * Get priority badge color
 */
export const priorityColors: Record<ProjectPriority, string> = {
  LOW: PROJECT_PRIORITY_BADGE_CLASS.LOW,
  MEDIUM: PROJECT_PRIORITY_BADGE_CLASS.MEDIUM,
  HIGH: PROJECT_PRIORITY_BADGE_CLASS.HIGH,
  URGENT: PROJECT_PRIORITY_BADGE_CLASS.URGENT,
};

export const getPriorityColor = (priority: ProjectPriority): string => {
  return priorityColors[priority] || 'bg-gray-100 text-gray-700';
};

/**
 * Get health status color
 */
export const healthColors: Record<HealthStatus, string> = {
  green: 'bg-green-100 text-green-700',
  amber: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
};

export const getHealthColor = (status: HealthStatus): string => {
  return healthColors[status] || 'bg-gray-100 text-gray-700';
};

/**
 * Check if project is overdue
 */
export function isProjectOverdue(project: Project): boolean {
  if (!project.end_date || project.status === 'DONE' || project.status === 'ARCHIVED') {
    return false;
  }
  return new Date(project.end_date) < new Date();
}

/**
 * Get days until deadline
 */
export function getDaysUntilDeadline(endDate: string): number {
  const today = new Date();
  const deadline = new Date(endDate);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get deadline status label
 */
export function getDeadlineStatus(endDate: string, status: ProjectStatus): string {
  if (status === 'DONE' || status === 'ARCHIVED') {
    return 'Completed';
  }

  const days = getDaysUntilDeadline(endDate);

  if (days < 0) {
    return `${Math.abs(days)} days overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else if (days <= 7) {
    return `Due in ${days} days`;
  } else if (days <= 30) {
    const weeks = Math.ceil(days / 7);
    return `Due in ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.ceil(days / 30);
    return `Due in ${months} month${months > 1 ? 's' : ''}`;
  }
}

/**
 * Calculate project health status from metrics
 */
export function calculateHealthStatus(metrics: ProjectMetrics): HealthStatus {
  const { schedule_health, budget_health, resource_health } = metrics.metrics;

  const scheduleScore =
    schedule_health.status === 'green' ? 3 : schedule_health.status === 'amber' ? 2 : 1;
  const budgetScore =
    budget_health.status === 'green' ? 3 : budget_health.status === 'amber' ? 2 : 1;
  const resourceScore =
    resource_health.status === 'green' ? 3 : resource_health.status === 'amber' ? 2 : 1;

  const averageScore = (scheduleScore + budgetScore + resourceScore) / 3;

  if (averageScore >= 2.7) return 'green';
  if (averageScore >= 1.7) return 'amber';
  return 'red';
}

/**
 * Format percentage with symbol
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get projects by status grouped
 */
export function groupProjectsByStatus(projects: Project[]): Record<ProjectStatus, Project[]> {
  const grouped = {
    'NOT_STARTED': [] as Project[],
    'IN_PROGRESS': [] as Project[],
    'IN_REVIEW': [] as Project[],
    'DONE': [] as Project[],
    'ON_HOLD': [] as Project[],
    'ARCHIVED': [] as Project[],
  };

  projects.forEach((project) => {
    grouped[project.status].push(project);
  });

  return grouped;
}

/**
 * Get projects by priority grouped
 */
export function groupProjectsByPriority(projects: Project[]): Record<ProjectPriority, Project[]> {
  const grouped = {
    LOW: [] as Project[],
    MEDIUM: [] as Project[],
    HIGH: [] as Project[],
    URGENT: [] as Project[],
  };

  projects.forEach((project) => {
    grouped[project.priority].push(project);
  });

  return grouped;
}

/**
 * Calculate average project progress
 */
export function calculateAverageProgress(projects: Project[]): number {
  if (projects.length === 0) return 0;
  const total = projects.reduce((sum, p) => sum + p.progress, 0);
  return Math.round(total / projects.length);
}

/**
 * Get project risk level
 */
export function getProjectRiskLevel(
  project: Project,
  metrics?: ProjectMetrics
): 'low' | 'medium' | 'high' {
  let riskScore = 0;

  // Check status
  if (project.status === 'ON_HOLD' || project.status === 'IN_REVIEW') {
    riskScore += 2;
  }

  // Check if overdue
  if (isProjectOverdue(project)) {
    riskScore += 2;
  }

  // Check progress vs time elapsed
  if (project.end_date) {
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.end_date);
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const elapsedDays = (new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const expectedProgress = (elapsedDays / totalDays) * 100;

    if (project.progress < expectedProgress * 0.8) {
      riskScore += 2;
    }
  }

  // Check metrics health
  if (metrics) {
    if (
      metrics.metrics.schedule_health.status === 'red' ||
      metrics.metrics.budget_health.status === 'red'
    ) {
      riskScore += 2;
    }
  }

  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

/**
 * Sort projects by various criteria
 */
export function sortProjects(
  projects: Project[],
  sortBy: 'name' | 'created_at' | 'updated_at' | 'progress' | 'priority' | 'deadline',
  order: 'asc' | 'desc' = 'desc'
): Project[] {
  const sorted = [...projects];

  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'updated_at':
        aValue = new Date(a.updated_at || a.created_at).getTime();
        bValue = new Date(b.updated_at || b.created_at).getTime();
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'priority': {
        const priorityMap = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityMap[a.priority];
        bValue = priorityMap[b.priority];
        break;
      }
      case 'deadline':
        aValue = a.end_date ? new Date(a.end_date).getTime() : Infinity;
        bValue = b.end_date ? new Date(b.end_date).getTime() : Infinity;
        break;
      default:
        return 0;
    }

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}

/**
 * Filter projects by criteria
 */
export function filterProjects(
  projects: Project[],
  {
    status,
    priority,
    workspaceId,
    searchQuery,
    isOverdue,
  }: {
    status?: ProjectStatus;
    priority?: ProjectPriority;
    workspaceId?: string;
    searchQuery?: string;
    isOverdue?: boolean;
  }
): Project[] {
  return projects.filter((project) => {
    if (status && project.status !== status) return false;
    if (priority && project.priority !== priority) return false;
    if (workspaceId && project.workspace_id !== workspaceId) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches =
        project.name.toLowerCase().includes(query) ||
        project.key.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);
      if (!matches) return false;
    }
    if (isOverdue && !isProjectOverdue(project)) return false;

    return true;
  });
}

/**
 * Check if user can edit project
 */
export function canEditProject(
  project: Project,
  userId: string,
  userRole?: string
): boolean {
  // Owner can always edit
  if (project.owner_id === userId) return true;

  // Admins in workspace can edit (would need workspace info)
  if (userRole === 'admin' || userRole === 'ADMIN') return true;

  return false;
}

/**
 * Get project summary for display
 */
export function getProjectSummary(project: Project): {
  title: string;
  subtitle: string;
  status: string;
} {
  return {
    title: project.name,
    subtitle: `${project.key} • ${getStatusLabel(project.status)}`,
    status: getStatusLabel(project.status),
  };
}
