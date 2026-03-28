// @ts-nocheck
import type { TaskEntity } from '../features/dashboard/types/dashboard-types';
import { MOCK_PROJECTS } from '@/mocks/projects';
import { MOCK_USERS_BY_ID, MOCK_CURRENT_USER } from '@/mocks/users';

export const CURRENT_USER = {
  username: MOCK_CURRENT_USER?.name ?? 'User',
  user_id: MOCK_CURRENT_USER?.id ?? 'u-3',
};

const projectById = (projectId: string) =>
  MOCK_PROJECTS.find((project) => project.project_id === projectId || project.id === projectId) ?? MOCK_PROJECTS[0];

const dashboardAssignee = (userId: string) => {
  const user = MOCK_USERS_BY_ID[userId];
  return {
    user_id: user.id,
    username: user.name,
    avatar_url: user.avatar_url,
  };
};

export const MOCK_TASKS: TaskEntity[] = [
  {
    task_id: 'task-101',
    task_number: 101,
    title: 'Finalize dashboard IA and section hierarchy',
    project: {
      project_id: projectById('prj-101').project_id,
      name: projectById('prj-101').name,
      key: projectById('prj-101').key,
    },
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    planned_end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-6'), dashboardAssignee('u-4')],
  },
  {
    task_id: 'task-102',
    task_number: 102,
    title: 'Migrate legacy auth guards to workspace-aware middleware',
    project: {
      project_id: projectById('prj-103').project_id,
      name: projectById('prj-103').name,
      key: projectById('prj-103').key,
    },
    status: 'DONE',
    priority: 'HIGH',
    planned_end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-4')],
  },
  {
    task_id: 'task-103',
    task_number: 103,
    title: 'Design help center taxonomy for module 15',
    project: {
      project_id: projectById('prj-102').project_id,
      name: projectById('prj-102').name,
      key: projectById('prj-102').key,
    },
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-6')],
  },
  {
    task_id: 'task-104',
    task_number: 104,
    title: 'Validate retention policy migration job output',
    project: {
      project_id: projectById('prj-103').project_id,
      name: projectById('prj-103').name,
      key: projectById('prj-103').key,
    },
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    planned_end: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-5')],
  },
  {
    task_id: 'task-105',
    task_number: 105,
    title: 'Set up bi-directional Slack integration proof-of-concept',
    project: {
      project_id: projectById('prj-101').project_id,
      name: projectById('prj-101').name,
      key: projectById('prj-101').key,
    },
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-4'), dashboardAssignee('u-7')],
  },
  {
    task_id: 'task-106',
    task_number: 106,
    title: 'Draft onboarding checklist for first-week activation',
    project: {
      project_id: projectById('prj-101').project_id,
      name: projectById('prj-101').name,
      key: projectById('prj-101').key,
    },
    status: 'NOT_STARTED',
    priority: 'LOW',
    planned_end: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-3')],
  },
  {
    task_id: 'task-107',
    task_number: 107,
    title: 'Investigate webhook retries exceeding threshold',
    project: {
      project_id: projectById('prj-103').project_id,
      name: projectById('prj-103').name,
      key: projectById('prj-103').key,
    },
    status: 'NOT_STARTED',
    priority: 'HIGH',
    planned_end: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [],
  },
  {
    task_id: 'task-108',
    task_number: 108,
    title: 'Close sprint retrospective action items',
    project: {
      project_id: projectById('prj-102').project_id,
      name: projectById('prj-102').name,
      key: projectById('prj-102').key,
    },
    status: 'DONE',
    priority: 'LOW',
    planned_end: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-3'), dashboardAssignee('u-5')],
  },
];

export const MOCK_TASKS_EMPTY: TaskEntity[] = [];

export const MOCK_TASKS_EDGE: TaskEntity[] = [
  {
    task_id: 'task-edge-1',
    task_number: 999,
    title: 'Emergency rollback and compliance freeze',
    project: {
      project_id: projectById('prj-103').project_id,
      name: projectById('prj-103').name,
      key: projectById('prj-103').key,
    },
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    planned_end: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [dashboardAssignee('u-2')],
  },
  {
    task_id: 'task-edge-2',
    task_number: 1000,
    title: 'Unassigned backlog triage for stale dependencies',
    project: {
      project_id: projectById('prj-105').project_id,
      name: projectById('prj-105').name,
      key: projectById('prj-105').key,
    },
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [],
  },
];

export const MOCK_TASK_DATASET = {
  default: MOCK_TASKS,
  empty: MOCK_TASKS_EMPTY,
  edge: MOCK_TASKS_EDGE,
};