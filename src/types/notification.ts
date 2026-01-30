/**
 * Notification Entity
 * Module 7: Observability & Async Communication
 * 
 * Thông báo cho người dùng
 */

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
  notification_id: string;
  user_id: string;
  event_id: string;
  title: string;
  content: string;
  priority: NotificationPriority;
  is_read: boolean;
  expires_at?: string; // ISO timestamp, TTL
  created_at: string;
  // Optional links
  action_url?: string;
  entity_type?: string; // e.g., TASK, PROJECT
  entity_id?: string;
}

export interface CreateNotificationDTO {
  user_id: string;
  title: string;
  content: string;
  priority?: NotificationPriority;
  expires_at?: string;
}

export interface MarkNotificationAsReadDTO {
  is_read: boolean;
}
