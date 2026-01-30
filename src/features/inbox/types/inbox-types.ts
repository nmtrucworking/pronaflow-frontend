export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type NotificationType = 'TASK_ASSIGNED' | 'MENTION' | 'DUE_SOON' | 'SYSTEM_ALERT' | 'COMMENT_REPLY';
export type NotificationFilter = 'ALL' | 'UNREAD' | 'MENTION';

export interface UserEntity {
  user_id: string;
  username: string;
  avatar_url: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'IMAGE' | 'FILE';
  url: string;
  size: string;
}

export interface NotificationEntity {
  notification_id: string;
  user_id: string;
  event_id: string;
  title: string;
  content: string;
  priority: NotificationPriority;
  is_read: boolean;
  expires_at?: string;
  created_at: string;
  actor?: UserEntity;
  type: NotificationType;
  metadata?: {
    project_name?: string;
    task_key?: string;
    task_id?: string;
  };
  attachments?: Attachment[];
}
