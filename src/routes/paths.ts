export const ROUTES = {
  root: '/',
  notFound: '*',

  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    unauthorized: '/unauthorized',
  },

  app: {
    home: '/home',
    dashboard: '/dashboard',
    projects: '/projects',
    tasks: '/tasks',
    inbox: '/inbox',
    settings: '/settings',
    accountSettings: '/account-settings',
    accountBilling: '/account-settings/billing',
    trash: '/trash',
    calendar: '/calendar',
    gantt: '/gantt',
    workspaceSettings: '/workspace-settings',
    members: '/members',
    archive: '/archive',
    billing: '/billing',
    analytics: '/analytics',
  },

  integrations: {
    root: '/integrations',
    apiTokens: '/integrations/api-tokens',
    webhooks: '/integrations/webhooks',
    connectedApps: '/integrations/connected-apps',
    plugins: '/integrations/plugins',
  },

  help: {
    root: '/help',
    api: '/help/api',
    changelog: '/help/changelog',
    contact: '/help/contact',
    legal: '/help/legal',
    privacy: '/help/privacy',
    status: '/help/status',
    terms: '/help/terms',
  },

  workspace: {
    list: '/workspaces',
    create: '/workspaces/create',
    detail: (id: string) => `/workspaces/${id}`,
    members: (id: string) => `/workspaces/${id}/members`,
    settings: (id: string) => `/workspaces/${id}/settings`,
  },
} as const;

export const toChildPath = (absolutePath: string): string =>
  absolutePath.startsWith('/') ? absolutePath.slice(1) : absolutePath;
