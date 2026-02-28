import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { MOCK_PROJECTS } from '@/mocks/projects';
import { MOCK_TASKS } from '@/mocks/task';

const APP_MODE = (import.meta.env.VITE_API_MODE ?? 'backend').toLowerCase();
const MOCK_DELAY_MS = Number(import.meta.env.VITE_MOCK_API_DELAY_MS ?? 0);

const MOCK_USER = {
  user_id: 'mock-user-1',
  email: 'mock.user@pronaflow.local',
  username: 'mock.user',
  full_name: 'Mock User',
  status: 'active',
  email_verified_at: new Date().toISOString(),
  mfa_enabled: false,
  roles: ['admin'],
  created_at: new Date().toISOString(),
};

const MOCK_WORKSPACES = [
  {
    id: 'ws-1',
    name: 'Mock Workspace',
    description: 'Workspace giả lập cho kiểm tra UI/UX',
    owner_id: 'mock-user-1',
    status: 'ACTIVE',
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
          roles: MOCK_USER.roles,
        },
        mfa_required: false,
      },
    };
  }

  if (method === 'get' && /\/auth\/me$/i.test(path)) {
    return { data: MOCK_USER };
  }

  if (method === 'get' && /\/(v1\/)?projects$/i.test(path)) {
    return {
      data: {
        projects: MOCK_PROJECTS,
        pagination: {
          page: 1,
          page_size: MOCK_PROJECTS.length,
          total: MOCK_PROJECTS.length,
          total_pages: 1,
        },
      },
    };
  }

  if (method === 'get' && /\/(v1\/)?projects\/[^/]+$/i.test(path)) {
    return { data: MOCK_PROJECTS[0] ?? null };
  }

  if (method === 'get' && /\/tasks$/i.test(path)) {
    return {
      data: {
        tasks: MOCK_TASKS,
        pagination: {
          page: 1,
          page_size: MOCK_TASKS.length,
          total: MOCK_TASKS.length,
          total_pages: 1,
        },
      },
    };
  }

  if (method === 'get' && /\/tasks\/[^/]+$/i.test(path)) {
    return { data: MOCK_TASKS[0] ?? null };
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
    return {
      data: {
        notifications: [],
        pagination: {
          page: 1,
          page_size: 10,
          total: 0,
          total_pages: 0,
        },
        unread_count: 0,
      },
    };
  }

  if (method === 'get' && /\/notifications\/unread-count$/i.test(path)) {
    return {
      data: {
        unread_count: 0,
        last_updated: new Date().toISOString(),
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
  if (APP_MODE !== 'mock') {
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
