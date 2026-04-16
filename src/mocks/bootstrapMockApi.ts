import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { MOCK_PROJECTS } from '@/mocks/projects';
import { MOCK_TASKS } from '@/mocks/task';
import { MOCK_NOTIFICATIONS, MOCK_UNREAD_NOTIFICATIONS_COUNT } from '@/mocks/notifications';
import { MOCK_CURRENT_USER } from '@/mocks/users';
import {
  MOCK_WORKSPACES,
  MOCK_WORKSPACE_MEMBERS,
  MOCK_WORKSPACE_INVITATIONS,
  MOCK_WORKSPACE_SETTINGS,
} from '@/mocks/workspaces';
import { MOCK_DOMAIN_DATASET } from '@/mocks/domainCatalog';

const isGitHubPagesHost = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.hostname.endsWith('github.io');
};

const API_MODE = (import.meta.env.VITE_API_MODE ?? '').toLowerCase();
const isMockApiMode = API_MODE === 'mock' || isGitHubPagesHost();

const MOCK_DELAY_MS = Number(import.meta.env.VITE_MOCK_API_DELAY_MS ?? 0);

const MOCK_USER = {
  user_id: MOCK_CURRENT_USER?.id ?? 'u-3',
  email: MOCK_CURRENT_USER?.email ?? 'mock.user@pronaflow.local',
  username: MOCK_CURRENT_USER?.username ?? 'mock.user',
  full_name: MOCK_CURRENT_USER?.full_name ?? 'Mock User',
  status: 'active',
  email_verified_at: new Date().toISOString(),
  mfa_enabled: false,
  roles: ['admin', 'project_manager'],
  created_at: new Date().toISOString(),
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const normalizePath = (config: InternalAxiosRequestConfig): string => {
  const baseUrl = (config.baseURL ?? '').replace(/\/+$/, '');
  const requestUrl = (config.url ?? '').replace(/^\/+/, '');
  const merged = `${baseUrl}/${requestUrl}`;

  let path = merged.replace(/^https?:\/\/[^/]+/i, '');
  path = path.split('?')[0] ?? path;
  path = path.replace(/\/+/g, '/');
  path = path.replace(/^\/api\/v\d+/i, '');
  path = path.replace(/^\/api/i, '');

  return path.startsWith('/') ? path : `/${path}`;
};

const okResponse = (
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
});

const getMockPayload = (config: InternalAxiosRequestConfig): { data: unknown; status?: number } => {
  const method = (config.method ?? 'get').toLowerCase();
  const path = normalizePath(config);
  const pathSegments = path.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] ?? '';

  if (method === 'get' && /\/errors\/validation$/i.test(path)) {
    return {
      status: 422,
      data: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          status_code: 422,
          details: [
            { field: 'workspace_id', reason: 'required' },
            { field: 'name', reason: 'min_length' },
          ],
        },
      },
    };
  }

  if (method === 'post' && /\/auth\/login$/i.test(path)) {
    return {
      data: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        token_type: 'bearer',
        user: {
          user_id: MOCK_USER.user_id,
          email: MOCK_USER.email,
          username: MOCK_USER.username,
          full_name: MOCK_USER.full_name,
          status: MOCK_USER.status,
          email_verified_at: MOCK_USER.email_verified_at,
          mfa_enabled: MOCK_USER.mfa_enabled,
          roles: MOCK_USER.roles,
          created_at: MOCK_USER.created_at,
        },
        mfa_required: false,
      },
    };
  }

  if (method === 'get' && /\/auth\/me$/i.test(path)) {
    return { data: MOCK_USER };
  }

  if (method === 'get' && /\/(v1\/)?projects$/i.test(path)) {
    const workspaceId = (config.params as Record<string, unknown> | undefined)?.workspace_id as string | undefined;
    const projectStatus = (config.params as Record<string, unknown> | undefined)?.status as string | undefined;

    const filteredProjects = MOCK_PROJECTS.filter((project) => {
      const workspaceMatch = workspaceId ? project.workspace_id === workspaceId : true;
      const statusMatch = projectStatus ? project.status === projectStatus : true;
      return workspaceMatch && statusMatch;
    });

    return {
      data: {
        projects: filteredProjects,
        pagination: {
          page: 1,
          page_size: filteredProjects.length,
          total: filteredProjects.length,
          total_pages: 1,
        },
      },
    };
  }

  if (method === 'get' && /\/(v1\/)?projects\/[^/]+$/i.test(path)) {
    const projectId = lastSegment;
    const project = MOCK_PROJECTS.find((item) => item.project_id === projectId) ?? null;
    return { data: project };
  }

  if (method === 'get' && /\/(v1\/)?projects\/[^/]+\/members$/i.test(path)) {
    const projectId = pathSegments[pathSegments.length - 2] ?? '';
    const project = MOCK_PROJECTS.find((item) => item.project_id === projectId) ?? MOCK_PROJECTS[0];
    return { data: project?.members ?? [] };
  }

  if (method === 'get' && /\/(v1\/)?projects\/[^/]+\/metrics$/i.test(path)) {
    const projectId = pathSegments[pathSegments.length - 2] ?? '';
    const metrics = MOCK_DOMAIN_DATASET.analytics.project_metrics.find((item) => item.project_id === projectId);
    return { data: metrics ?? MOCK_DOMAIN_DATASET.analytics.project_metrics[0] ?? null };
  }

  if (method === 'get' && /\/tasks$/i.test(path)) {
    const projectId = (config.params as Record<string, unknown> | undefined)?.project_id as string | undefined;
    const filteredTasks = MOCK_TASKS.filter((task) => (projectId ? task.project.project_id === projectId : true));

    return {
      data: {
        tasks: filteredTasks,
        pagination: {
          page: 1,
          page_size: filteredTasks.length,
          total: filteredTasks.length,
          total_pages: 1,
        },
      },
    };
  }

  if (method === 'get' && /\/tasks\/[^/]+$/i.test(path)) {
    const task = MOCK_TASKS.find((item) => item.task_id === lastSegment) ?? MOCK_TASKS[0] ?? null;
    return { data: task };
  }

  if (method === 'get' && /\/tasks\/[^/]+\/comments$/i.test(path)) {
    const taskId = pathSegments[pathSegments.length - 2] ?? 'task-101';
    return {
      data: {
        comments: [
          {
            comment_id: `cmt-${taskId}-1`,
            task_id: taskId,
            author_id: 'u-4',
            author_name: 'Minh Le',
            content: 'Scope can be closed if QA checklist passes all critical items.',
            created_at: '2026-03-29T06:00:00.000Z',
            edited: false,
          },
        ],
        total: 1,
      },
    };
  }

  if (method === 'get' && /\/workspaces\/me\/last-accessed$/i.test(path)) {
    const workspace = MOCK_WORKSPACES[0];
    return {
      data: {
        workspace_id: workspace?.id ?? 'ws-1',
        name: workspace?.name ?? 'Mock Workspace',
        accessed_at: new Date().toISOString(),
      },
    };
  }

  if (method === 'get' && /\/(v1\/)?workspaces\/[^/]+\/members$/i.test(path)) {
    return { data: MOCK_WORKSPACE_MEMBERS };
  }

  if (method === 'get' && /\/(v1\/)?workspaces\/[^/]+\/invitations$/i.test(path)) {
    return { data: MOCK_WORKSPACE_INVITATIONS };
  }

  if (method === 'get' && /\/(v1\/)?workspaces\/[^/]+\/settings$/i.test(path)) {
    return { data: MOCK_WORKSPACE_SETTINGS };
  }

  if (method === 'get' && /\/(v1\/)?workspaces\/[^/]+$/i.test(path)) {
    const workspaceId = path.split('/').pop();
    const workspace = MOCK_WORKSPACES.find((item) => item.id === workspaceId) ?? MOCK_WORKSPACES[0];

    return {
      data: {
        ...workspace,
        members: MOCK_WORKSPACE_MEMBERS,
        settings: MOCK_WORKSPACE_SETTINGS,
      },
    };
  }

  if (method === 'get' && /\/(v1\/)?workspaces$/i.test(path)) {
    return {
      data: {
        total: MOCK_WORKSPACES.length,
        items: MOCK_WORKSPACES,
      },
    };
  }

  if (method === 'get' && /\/notifications$/i.test(path)) {
    const unreadOnly = (config.params as Record<string, unknown> | undefined)?.unread_only === true;
    const notifications = unreadOnly
      ? MOCK_NOTIFICATIONS.filter((item) => !item.is_read)
      : MOCK_NOTIFICATIONS;

    return {
      data: {
        notifications,
        pagination: {
          page: 1,
          page_size: notifications.length,
          total: notifications.length,
          total_pages: 1,
        },
        unread_count: notifications.filter((item) => !item.is_read).length,
      },
    };
  }

  if (method === 'get' && /\/notifications\/unread-count$/i.test(path)) {
    return {
      data: {
        unread_count: MOCK_UNREAD_NOTIFICATIONS_COUNT,
        last_updated: new Date().toISOString(),
      },
    };
  }

  if (method === 'get' && /\/analytics\/dashboard-metrics$/i.test(path)) {
    return { data: MOCK_DOMAIN_DATASET.analytics.dashboard_metrics };
  }

  if (method === 'get' && /\/analytics\/reports$/i.test(path)) {
    return {
      data: {
        reports: MOCK_DOMAIN_DATASET.analytics.reports,
        pagination: {
          page: 1,
          page_size: MOCK_DOMAIN_DATASET.analytics.reports.length,
          total: MOCK_DOMAIN_DATASET.analytics.reports.length,
          total_pages: 1,
        },
      },
    };
  }

  if (method === 'get' && /\/archive\/items$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.archive.archived_items,
        total: MOCK_DOMAIN_DATASET.archive.archived_items.length,
      },
    };
  }

  if (method === 'get' && /\/archive\/audit-logs$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.archive.audit_logs,
        total: MOCK_DOMAIN_DATASET.archive.audit_logs.length,
      },
    };
  }

  if (method === 'get' && /\/integrations$/i.test(path)) {
    return { data: MOCK_DOMAIN_DATASET.integrations.snapshot };
  }

  if (method === 'get' && /\/integrations\/api-usage$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.integrations.api_usage_logs,
        total: MOCK_DOMAIN_DATASET.integrations.api_usage_logs.length,
      },
    };
  }

  if (method === 'get' && /\/admin\/feature-flags$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.admin.feature_flags,
        total: MOCK_DOMAIN_DATASET.admin.feature_flags.length,
      },
    };
  }

  if (method === 'get' && /\/admin\/security-incidents$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.admin.incidents,
        total: MOCK_DOMAIN_DATASET.admin.incidents.length,
      },
    };
  }

  if (method === 'get' && /\/help-center\/categories$/i.test(path)) {
    return { data: MOCK_DOMAIN_DATASET.help_center.categories };
  }

  if (method === 'get' && /\/help-center\/articles$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.help_center.articles,
        total: MOCK_DOMAIN_DATASET.help_center.articles.length,
      },
    };
  }

  if (method === 'get' && /\/onboarding\/flows$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.onboarding.flows,
        total: MOCK_DOMAIN_DATASET.onboarding.flows.length,
      },
    };
  }

  if (method === 'get' && /\/onboarding\/progress$/i.test(path)) {
    return {
      data: {
        items: MOCK_DOMAIN_DATASET.onboarding.progress,
        total: MOCK_DOMAIN_DATASET.onboarding.progress.length,
      },
    };
  }

  if (method === 'get') {
    return { data: {} };
  }

  if (method === 'delete') {
    return { data: { message: 'Deleted (mock)' }, status: 204 };
  }

  return {
    data: {
      message: 'Success (mock)',
      request: {
        method,
        path,
      },
    },
  };
};

const attachMockInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.request.use((config) => {
    config.adapter = async () => {
      if (MOCK_DELAY_MS > 0) {
        await sleep(MOCK_DELAY_MS);
      }

      const mock = getMockPayload(config);
      return okResponse(config, mock.data, mock.status ?? 200);
    };

    return config;
  });
};

const bootstrapMockApi = (): void => {
  if (!isMockApiMode) {
    return;
  }

  const originalCreate = axios.create.bind(axios);

  attachMockInterceptor(axios);

  axios.create = ((...args: Parameters<typeof originalCreate>) => {
    const instance = originalCreate(...args);
    attachMockInterceptor(instance);
    return instance;
  }) as typeof axios.create;

  localStorage.setItem('access_token', 'mock-access-token');

  if (import.meta.env.DEV) {
    console.info('[Mock API] Enabled for UI/UX mode');
  }
};

bootstrapMockApi();
