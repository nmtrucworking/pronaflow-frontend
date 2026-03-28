import type { NotificationEntity } from '@/features/inbox/types/inbox-types';
import { MOCK_USERS_BY_ID } from '@/mocks/users';

export const MOCK_NOTIFICATIONS: NotificationEntity[] = [
  {
    notification_id: 'noti-001',
    user_id: 'u-3',
    event_id: 'evt-task-assign-101',
    title: 'New task assignment',
    content: 'Huy Tran assigned you to "Finalize dashboard IA and section hierarchy".',
    priority: 'HIGH',
    is_read: false,
    created_at: '2026-03-28T09:15:00Z',
    type: 'TASK_ASSIGNED',
    actor: {
      user_id: 'u-2',
      username: MOCK_USERS_BY_ID['u-2'].name,
      avatar_url: MOCK_USERS_BY_ID['u-2'].avatar_url ?? '',
    },
    metadata: {
      project_name: 'Platform Revamp 2026',
      task_key: 'PLT-101',
      task_id: 'task-101',
    },
  },
  {
    notification_id: 'noti-002',
    user_id: 'u-3',
    event_id: 'evt-mention-221',
    title: 'Mentioned in a review note',
    content: 'Nhi Do mentioned you in a design review note for mobile workflow.',
    priority: 'MEDIUM',
    is_read: false,
    created_at: '2026-03-27T17:45:00Z',
    type: 'MENTION',
    actor: {
      user_id: 'u-6',
      username: MOCK_USERS_BY_ID['u-6'].name,
      avatar_url: MOCK_USERS_BY_ID['u-6'].avatar_url ?? '',
    },
    metadata: {
      project_name: 'Mobile Workflow Companion',
      task_key: 'MOB-220',
      task_id: 'task-103',
    },
  },
  {
    notification_id: 'noti-003',
    user_id: 'u-3',
    event_id: 'evt-due-601',
    title: 'Task is due soon',
    content: 'Task "Set up bi-directional Slack integration proof-of-concept" is due in 48 hours.',
    priority: 'HIGH',
    is_read: true,
    created_at: '2026-03-26T22:00:00Z',
    type: 'DUE_SOON',
    metadata: {
      project_name: 'Platform Revamp 2026',
      task_key: 'PLT-105',
      task_id: 'task-105',
    },
  },
  {
    notification_id: 'noti-004',
    user_id: 'u-3',
    event_id: 'evt-system-901',
    title: 'System maintenance notice',
    content: 'Maintenance window is scheduled on Mar 30, 2026 from 01:00 to 03:00 UTC.',
    priority: 'LOW',
    is_read: true,
    created_at: '2026-03-25T20:30:00Z',
    type: 'SYSTEM_ALERT',
  },
  {
    notification_id: 'noti-005',
    user_id: 'u-3',
    event_id: 'evt-comment-411',
    title: 'Comment reply',
    content: 'Minh Le replied to your comment in "Archive and Compliance Sprint".',
    priority: 'MEDIUM',
    is_read: false,
    created_at: '2026-03-29T08:10:00Z',
    type: 'COMMENT_REPLY',
    actor: {
      user_id: 'u-4',
      username: MOCK_USERS_BY_ID['u-4'].name,
      avatar_url: MOCK_USERS_BY_ID['u-4'].avatar_url ?? '',
    },
    metadata: {
      project_name: 'Archive and Compliance Sprint',
      task_key: 'ARC-104',
      task_id: 'task-104',
    },
    attachments: [
      {
        id: 'att-1',
        name: 'evidence-checklist.png',
        type: 'IMAGE',
        url: '/previews/dashboard-page.png',
        size: '245KB',
      },
    ],
  },
  {
    notification_id: 'noti-006',
    user_id: 'u-3',
    event_id: 'evt-mention-779',
    title: 'Mentioned in release checklist',
    content: 'Bao Ho mentioned you in release checklist notes.',
    priority: 'LOW',
    is_read: false,
    created_at: '2026-03-29T07:00:00Z',
    type: 'MENTION',
    actor: {
      user_id: 'u-7',
      username: MOCK_USERS_BY_ID['u-7'].name,
      avatar_url: MOCK_USERS_BY_ID['u-7'].avatar_url ?? '',
    },
    metadata: {
      project_name: 'System Administration Hardening',
      task_key: 'OPS-14',
      task_id: 'task-108',
    },
  },
];

export const MOCK_NOTIFICATIONS_EMPTY: NotificationEntity[] = [];

export const MOCK_NOTIFICATION_DATASET = {
  default: MOCK_NOTIFICATIONS,
  unreadOnly: MOCK_NOTIFICATIONS.filter((item) => !item.is_read),
  mentionOnly: MOCK_NOTIFICATIONS.filter((item) => item.type === 'MENTION'),
  empty: MOCK_NOTIFICATIONS_EMPTY,
};

export const MOCK_UNREAD_NOTIFICATIONS_COUNT = MOCK_NOTIFICATIONS.filter((item) => !item.is_read).length;
