import type { ArchivedItem, AuditLog, DataRetentionPolicy, TrashItem } from '../types/archive';
import type { DashboardMetrics, ProjectMetrics, Report } from '../types/analytics';
import type {
  ApiToken,
  ApiUsageLog,
  ConsentGrant,
  IntegrationsListResponse,
  OAuthConnection,
  Plugin,
  PluginInstallation,
  WebhookDelivery,
  WebhookEndpoint,
} from '../types/integration';
import type { AdminUser, FeatureFlag, Permission, Role, SecurityIncident, SystemConfig } from '../types/admin';
import type { ArticleFeedback, HelpArticle, HelpCategory } from '../types/help-center';
import type { OnboardingFlow, OnboardingSurvey, ProductTour, UserPersona, UserProgress } from '../types/onboarding';
import { MOCK_USERS_BY_ID } from './users';

export const MOCK_ARCHIVED_ITEMS: ArchivedItem[] = [
  {
    archive_id: 'arc-001',
    resource_type: 'project',
    resource_id: 'prj-105',
    resource_name: 'Experiment Sandbox',
    archived_by: 'u-1',
    archived_at: '2026-03-01T08:00:00.000Z',
    reason: 'Workspace cleanup policy',
    metadata: { source_workspace_id: 'ws-2' },
  },
  {
    archive_id: 'arc-002',
    resource_type: 'task',
    resource_id: 'task-edge-2',
    resource_name: 'Unassigned backlog triage for stale dependencies',
    archived_by: 'u-2',
    archived_at: '2026-03-10T08:00:00.000Z',
    reason: 'No longer relevant after scope change',
  },
];

export const MOCK_TRASH_ITEMS: TrashItem[] = [
  {
    trash_id: 'trash-001',
    resource_type: 'file',
    resource_id: 'f-legacy-77',
    resource_name: 'legacy-risk-log.xlsx',
    deleted_by: 'u-5',
    deleted_at: '2026-03-15T04:00:00.000Z',
    auto_delete_at: '2026-04-14T04:00:00.000Z',
    can_restore: true,
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    audit_id: 'audit-001',
    user_id: 'u-2',
    username: MOCK_USERS_BY_ID['u-2'].name,
    action: 'workspace.member.role_updated',
    resource_type: 'workspace_member',
    resource_id: 'wm-3',
    ip_address: '10.20.1.56',
    user_agent: 'Chrome/123',
    changes: { role: ['member', 'admin'] },
    metadata: { workspace_id: 'ws-1' },
    timestamp: '2026-03-21T10:12:00.000Z',
  },
  {
    audit_id: 'audit-002',
    user_id: 'u-1',
    username: MOCK_USERS_BY_ID['u-1'].name,
    action: 'project.archived',
    resource_type: 'project',
    resource_id: 'prj-105',
    ip_address: '10.20.1.21',
    user_agent: 'Firefox/125',
    timestamp: '2026-03-22T03:00:00.000Z',
  },
];

export const MOCK_RETENTION_POLICIES: DataRetentionPolicy[] = [
  {
    policy_id: 'ret-001',
    workspace_id: 'ws-1',
    resource_type: 'audit_log',
    retention_days: 365,
    auto_archive: true,
    auto_delete: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-03-20T00:00:00.000Z',
  },
  {
    policy_id: 'ret-002',
    workspace_id: 'ws-2',
    resource_type: 'trash_item',
    retention_days: 30,
    auto_archive: false,
    auto_delete: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-03-20T00:00:00.000Z',
  },
];

export const MOCK_PROJECT_METRICS: ProjectMetrics[] = [
  {
    project_id: 'prj-101',
    health_status: 'green',
    metrics: {
      schedule_health: { status: 'green', progress: 72, on_track: true },
      budget_health: { status: 'amber', spent_percentage: 63, spent: 156000000 },
      resource_health: { status: 'green', utilization: 78 },
    },
  },
  {
    project_id: 'prj-103',
    health_status: 'amber',
    metrics: {
      schedule_health: { status: 'amber', progress: 91, on_track: false },
      budget_health: { status: 'green', spent_percentage: 88, spent: 92000000 },
      resource_health: { status: 'amber', utilization: 93 },
    },
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    report_id: 'rep-001',
    name: 'Weekly Portfolio Health',
    type: 'project',
    status: 'completed',
    created_by: 'u-7',
    created_at: '2026-03-24T04:00:00.000Z',
    completed_at: '2026-03-24T04:02:00.000Z',
    file_url: '/downloads/weekly-portfolio-health.csv',
  },
  {
    report_id: 'rep-002',
    name: 'Overdue Task Summary',
    type: 'task',
    status: 'processing',
    created_by: 'u-7',
    created_at: '2026-03-29T02:10:00.000Z',
  },
];

export const MOCK_DASHBOARD_METRICS: DashboardMetrics = {
  workspace_id: 'ws-1',
  overview: {
    total_projects: 5,
    active_tasks: 19,
    team_members: 8,
    completion_rate: 71,
  },
  recent_activity: [
    {
      activity_id: 'act-001',
      type: 'task_done',
      description: 'Task task-102 marked as done',
      user: MOCK_USERS_BY_ID['u-4'].name,
      timestamp: '2026-03-29T07:10:00.000Z',
    },
    {
      activity_id: 'act-002',
      type: 'member_invited',
      description: 'observer@partner.local invited as viewer',
      user: MOCK_USERS_BY_ID['u-2'].name,
      timestamp: '2026-03-28T15:20:00.000Z',
    },
  ],
};

export const MOCK_API_TOKENS: ApiToken[] = [
  {
    token_id: 'tok-001',
    user_id: 'u-2',
    workspace_id: 'ws-1',
    name: 'CI pipeline token',
    token_hash: 'hash-ci-001',
    last_used_at: '2026-03-29T06:00:00.000Z',
    expires_at: '2026-06-01T00:00:00.000Z',
    is_active: true,
    created_at: '2026-02-01T00:00:00.000Z',
    scopes: ['read:projects', 'read:tasks', 'write:tasks'],
  },
];

export const MOCK_API_USAGE_LOGS: ApiUsageLog[] = [
  {
    log_id: 'api-log-1',
    token_id: 'tok-001',
    endpoint: '/api/v1/tasks',
    http_method: 'GET',
    status_code: 200,
    request_at: '2026-03-29T06:00:00.000Z',
    ip_address: '10.20.2.31',
  },
  {
    log_id: 'api-log-2',
    token_id: 'tok-001',
    endpoint: '/api/v1/tasks',
    http_method: 'PATCH',
    status_code: 429,
    request_at: '2026-03-29T06:05:00.000Z',
    ip_address: '10.20.2.31',
  },
];

export const MOCK_WEBHOOKS: WebhookEndpoint[] = [
  {
    webhook_id: 'wh-001',
    workspace_id: 'ws-1',
    name: 'Slack workflow hook',
    target_url: 'https://hooks.slack.com/services/T000/B000/XXXXX',
    secret_key: 'secret-mock-1',
    is_active: true,
    created_at: '2026-01-11T00:00:00.000Z',
    updated_at: '2026-03-15T00:00:00.000Z',
    events: ['task.created', 'task.updated', 'comment.created'],
  },
];

export const MOCK_WEBHOOK_DELIVERIES: WebhookDelivery[] = [
  {
    delivery_id: 'wd-001',
    webhook_id: 'wh-001',
    event_type: 'task.updated',
    payload: { task_id: 'task-101', status: 'IN_PROGRESS' },
    response_code: 200,
    response_body: 'ok',
    attempt_count: 1,
    delivered_at: '2026-03-29T05:00:00.000Z',
    created_at: '2026-03-29T05:00:00.000Z',
  },
  {
    delivery_id: 'wd-002',
    webhook_id: 'wh-001',
    event_type: 'task.updated',
    payload: { task_id: 'task-edge-1', status: 'IN_PROGRESS' },
    response_code: 500,
    error_message: 'receiver timeout',
    attempt_count: 3,
    created_at: '2026-03-28T10:00:00.000Z',
  },
];

export const MOCK_OAUTH_CONNECTIONS: OAuthConnection[] = [
  {
    connection_id: 'oauth-001',
    user_id: 'u-4',
    app_id: 'github-app',
    provider: 'github',
    access_token: 'encrypted-github-token',
    scopes: ['repo', 'read:user'],
    is_active: true,
    connected_at: '2026-02-05T00:00:00.000Z',
    last_synced_at: '2026-03-28T23:30:00.000Z',
  },
  {
    connection_id: 'oauth-002',
    user_id: 'u-6',
    app_id: 'figma-app',
    provider: 'figma',
    access_token: 'encrypted-figma-token',
    scopes: ['file_read'],
    is_active: true,
    connected_at: '2026-03-01T00:00:00.000Z',
    last_synced_at: '2026-03-29T01:12:00.000Z',
  },
];

export const MOCK_PLUGINS: Plugin[] = [
  {
    plugin_id: 'plug-001',
    name: 'Risk Radar',
    slug: 'risk-radar',
    version: '1.3.0',
    author: 'Prona Labs',
    description: 'Highlight risk signals from schedule and dependency graph.',
    manifest: {
      name: 'Risk Radar',
      version: '1.3.0',
      description: 'Risk score widget',
      author: 'Prona Labs',
      license: 'MIT',
      entry_url: 'https://plugins.pronaflow.local/risk-radar/index.js',
      permissions: ['tasks:read', 'projects:read'],
      ui_anchors: ['project_header', 'task_detail_sidebar'],
    },
    is_verified: true,
    is_published: true,
    download_count: 1284,
    rating: 4.8,
    created_at: '2025-11-10T00:00:00.000Z',
    updated_at: '2026-03-15T00:00:00.000Z',
  },
];

export const MOCK_PLUGIN_INSTALLATIONS: PluginInstallation[] = [
  {
    installation_id: 'ins-001',
    plugin_id: 'plug-001',
    workspace_id: 'ws-1',
    user_id: 'u-2',
    config: { threshold: 70 },
    is_enabled: true,
    installed_at: '2026-03-20T00:00:00.000Z',
    plugin: MOCK_PLUGINS[0],
  },
];

export const MOCK_CONSENTS: ConsentGrant[] = [
  {
    consent_id: 'cons-001',
    user_id: 'u-4',
    app_id: 'github-app',
    scopes: ['repo', 'read:user'],
    granted_at: '2026-02-05T00:00:00.000Z',
  },
];

export const MOCK_INTEGRATIONS_SNAPSHOT: IntegrationsListResponse = {
  api_tokens: MOCK_API_TOKENS,
  webhooks: MOCK_WEBHOOKS,
  oauth_connections: MOCK_OAUTH_CONNECTIONS,
  plugins: MOCK_PLUGIN_INSTALLATIONS,
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    admin_user_id: 'adm-1',
    email: 'root@pronaflow.local',
    username: 'root.admin',
    full_name: 'Root Administrator',
    status: 'active',
    roles: ['super_admin'],
    last_login: '2026-03-29T04:00:00.000Z',
    created_at: '2025-01-01T00:00:00.000Z',
  },
];

export const MOCK_ADMIN_ROLES: Role[] = [
  {
    role_id: 'role-super-admin',
    name: 'super_admin',
    description: 'Full platform administration',
    permissions: ['*'],
    is_system_role: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
];

export const MOCK_ADMIN_PERMISSIONS: Permission[] = [
  {
    permission_id: 'perm-feature-flag-write',
    name: 'feature_flag.write',
    description: 'Manage feature flag state and rollout',
    resource: 'feature_flag',
    action: 'write',
    created_at: '2025-01-01T00:00:00.000Z',
  },
];

export const MOCK_SYSTEM_CONFIGS: SystemConfig[] = [
  {
    config_id: 'cfg-1',
    key: 'security.mfa.required_for_admin',
    value: true,
    description: 'Require MFA for all admin users',
    category: 'security',
    is_public: false,
    updated_at: '2026-03-01T00:00:00.000Z',
  },
];

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    flag_id: 'ff-onboarding-v2',
    key: 'onboarding.v2',
    enabled: true,
    description: 'Enable segmented onboarding experience',
    rollout_percentage: 40,
    target_workspaces: ['ws-1'],
    created_at: '2026-02-20T00:00:00.000Z',
    updated_at: '2026-03-29T00:00:00.000Z',
  },
];

export const MOCK_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    incident_id: 'sec-001',
    type: 'suspicious_activity',
    severity: 'high',
    status: 'investigating',
    description: 'Multiple failed API token attempts from unknown IP range',
    user_id: 'u-2',
    ip_address: '203.0.113.17',
    detected_at: '2026-03-29T05:30:00.000Z',
  },
];

export const MOCK_HELP_CATEGORIES: HelpCategory[] = [
  {
    category_id: 'hc-1',
    name: 'Getting Started',
    description: 'Kickoff guides for first-time users',
    slug: 'getting-started',
    icon: 'rocket',
    order: 1,
    articles_count: 5,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-03-20T00:00:00.000Z',
  },
  {
    category_id: 'hc-2',
    name: 'Workspace Administration',
    slug: 'workspace-admin',
    icon: 'shield',
    order: 2,
    articles_count: 8,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-03-20T00:00:00.000Z',
  },
];

export const MOCK_HELP_ARTICLES: HelpArticle[] = [
  {
    article_id: 'ha-1',
    category_id: 'hc-1',
    title: 'Create your first workspace',
    slug: 'create-first-workspace',
    content: 'Step-by-step setup flow for workspace creation and member invitation.',
    excerpt: 'Setup workspace in 3 steps.',
    status: 'published',
    author_id: 'u-2',
    author_name: MOCK_USERS_BY_ID['u-2'].name,
    views_count: 3280,
    helpful_count: 3020,
    not_helpful_count: 48,
    tags: ['workspace', 'onboarding'],
    related_articles: ['ha-2'],
    created_at: '2026-01-10T00:00:00.000Z',
    updated_at: '2026-03-10T00:00:00.000Z',
    published_at: '2026-01-10T00:00:00.000Z',
  },
  {
    article_id: 'ha-2',
    category_id: 'hc-2',
    title: 'Configure retention and archive policy',
    slug: 'configure-retention-archive-policy',
    content: 'Guide for module 8 retention windows and archive jobs.',
    status: 'published',
    author_id: 'u-7',
    author_name: MOCK_USERS_BY_ID['u-7'].name,
    views_count: 820,
    helpful_count: 661,
    not_helpful_count: 12,
    tags: ['archive', 'compliance', 'admin'],
    created_at: '2026-02-12T00:00:00.000Z',
    updated_at: '2026-03-22T00:00:00.000Z',
    published_at: '2026-02-12T00:00:00.000Z',
  },
];

export const MOCK_ARTICLE_FEEDBACKS: ArticleFeedback[] = [
  {
    feedback_id: 'haf-1',
    article_id: 'ha-2',
    user_id: 'u-4',
    rating: 'helpful',
    comment: 'Easy to follow, includes exact policy examples.',
    created_at: '2026-03-28T11:20:00.000Z',
  },
];

export const MOCK_ONBOARDING_SURVEYS: OnboardingSurvey[] = [
  {
    survey_id: 'os-1',
    title: 'Initial Setup Survey',
    description: 'Collect profile and team maturity details',
    target_audience: 'new_users',
    status: 'active',
    questions_count: 8,
    responses_count: 316,
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-03-18T00:00:00.000Z',
  },
];

export const MOCK_USER_PERSONAS: UserPersona[] = [
  {
    persona_id: 'persona-1',
    user_id: 'u-3',
    role: 'project_manager',
    industry: 'SaaS',
    team_size: '11-50',
    goals: ['faster-delivery', 'visibility'],
    use_cases: ['portfolio-planning', 'resource-balancing'],
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-03-19T00:00:00.000Z',
  },
];

export const MOCK_ONBOARDING_FLOWS: OnboardingFlow[] = [
  {
    flow_id: 'flow-1',
    name: 'PM Activation Flow',
    description: 'Guided setup for PM role in first 48 hours',
    target_persona: 'project_manager',
    status: 'active',
    created_at: '2026-01-20T00:00:00.000Z',
    steps: [
      {
        step_id: 'flow-1-step-1',
        flow_id: 'flow-1',
        title: 'Create workspace',
        description: 'Set name, timezone and work days',
        step_type: 'action',
        action_required: true,
        order: 1,
      },
      {
        step_id: 'flow-1-step-2',
        flow_id: 'flow-1',
        title: 'Create first project',
        step_type: 'tutorial',
        action_required: true,
        order: 2,
      },
    ],
  },
];

export const MOCK_PRODUCT_TOURS: ProductTour[] = [
  {
    tour_id: 'tour-dashboard-1',
    name: 'Dashboard Quick Tour',
    description: 'Learn task grouping and urgency indicators',
    route_pattern: '/app/dashboard',
    trigger: 'first_visit',
    status: 'active',
    created_at: '2026-01-20T00:00:00.000Z',
    steps: [
      {
        step_id: 'tour-dashboard-1-step-1',
        title: 'Focus panel',
        content: 'This panel highlights overdue tasks and due-soon actions.',
        target_element: '[data-tour=focus-panel]',
        placement: 'bottom',
        order: 1,
      },
      {
        step_id: 'tour-dashboard-1-step-2',
        title: 'Filter controls',
        content: 'Switch between compact and comfortable density for triage.',
        target_element: '[data-tour=filter-controls]',
        placement: 'left',
        order: 2,
      },
    ],
  },
];

export const MOCK_USER_PROGRESS: UserProgress[] = [
  {
    user_id: 'u-3',
    onboarding_completed: true,
    profile_completion_percentage: 100,
    first_project_created: true,
    first_task_created: true,
    team_invited: true,
    achievements: ['workspace_owner', 'planner_pro'],
    tours_completed: ['tour-dashboard-1'],
  },
  {
    user_id: 'u-8',
    onboarding_completed: false,
    profile_completion_percentage: 42,
    first_project_created: false,
    first_task_created: false,
    team_invited: false,
    achievements: [],
    tours_completed: [],
  },
];

export const MOCK_DOMAIN_DATASET = {
  archive: {
    archived_items: MOCK_ARCHIVED_ITEMS,
    trash_items: MOCK_TRASH_ITEMS,
    audit_logs: MOCK_AUDIT_LOGS,
    retention_policies: MOCK_RETENTION_POLICIES,
  },
  analytics: {
    project_metrics: MOCK_PROJECT_METRICS,
    reports: MOCK_REPORTS,
    dashboard_metrics: MOCK_DASHBOARD_METRICS,
  },
  integrations: {
    snapshot: MOCK_INTEGRATIONS_SNAPSHOT,
    api_usage_logs: MOCK_API_USAGE_LOGS,
    webhook_deliveries: MOCK_WEBHOOK_DELIVERIES,
    consents: MOCK_CONSENTS,
  },
  admin: {
    users: MOCK_ADMIN_USERS,
    roles: MOCK_ADMIN_ROLES,
    permissions: MOCK_ADMIN_PERMISSIONS,
    configs: MOCK_SYSTEM_CONFIGS,
    feature_flags: MOCK_FEATURE_FLAGS,
    incidents: MOCK_SECURITY_INCIDENTS,
  },
  help_center: {
    categories: MOCK_HELP_CATEGORIES,
    articles: MOCK_HELP_ARTICLES,
    feedbacks: MOCK_ARTICLE_FEEDBACKS,
  },
  onboarding: {
    surveys: MOCK_ONBOARDING_SURVEYS,
    personas: MOCK_USER_PERSONAS,
    flows: MOCK_ONBOARDING_FLOWS,
    tours: MOCK_PRODUCT_TOURS,
    progress: MOCK_USER_PROGRESS,
  },
};
