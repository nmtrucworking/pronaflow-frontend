/**
 * Notification Service
 * Module 7: Event-Driven Notifications
 * 
 * Handles notifications, preferences, and real-time alerts
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  notification_id: string;
  user_id: string;
  type: 'task_assigned' | 'task_completed' | 'mention' | 'comment' | 'deadline' | 'system';
  title: string;
  message: string;
  resource_type?: 'task' | 'project' | 'workspace' | 'comment';
  resource_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  read_at?: string;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  preferences: {
    task_assigned: boolean;
    task_completed: boolean;
    mentions: boolean;
    comments: boolean;
    deadlines: boolean;
    project_updates: boolean;
    system_announcements: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start_time?: string;
    end_time?: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time?: string;
  };
}

export interface NotificationChannel {
  channel: 'email' | 'push' | 'in_app' | 'slack' | 'teams';
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface BulkNotificationAction {
  notification_ids: string[];
  action: 'read' | 'unread' | 'delete';
}

export interface UnreadCountResponse {
  unread_count: number;
  last_updated: string;
}

export interface WebSocketTokenResponse {
  token: string;
  url: string;
}

// ============================================================================
// NOTIFICATION SERVICE CLASS
// ============================================================================

class NotificationService {
  private readonly baseURL = '/notifications';

  /**
   * Get notifications for current user
   */
  async getNotifications(
    params?: {
      read?: boolean;
      type?: string;
      priority?: string;
      page?: number;
      page_size?: number;
    }
  ): Promise<AxiosResponse<{ notifications: Notification[]; pagination: any; unread_count: number }>> {
    return axiosClient.get(this.baseURL, { params });
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(
    notificationId: string
  ): Promise<AxiosResponse<Notification>> {
    return axiosClient.get(`${this.baseURL}/${notificationId}`);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    notificationId: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.patch(`${this.baseURL}/${notificationId}/read`);
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(
    notificationId: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.patch(`${this.baseURL}/${notificationId}/unread`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<AxiosResponse<{ message: string; count: number }>> {
    return axiosClient.post(`${this.baseURL}/read-all`);
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    notificationId: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.delete(`${this.baseURL}/${notificationId}`);
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<AxiosResponse<{ message: string; count: number }>> {
    return axiosClient.delete(`${this.baseURL}/read`);
  }

  /**
   * Bulk action on notifications
   */
  async bulkNotificationAction(
    data: BulkNotificationAction
  ): Promise<AxiosResponse<{ message: string; count: number }>> {
    return axiosClient.post(`${this.baseURL}/bulk-action`, data);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<AxiosResponse<UnreadCountResponse>> {
    return axiosClient.get(`${this.baseURL}/unread-count`);
  }

  // ========================================================================
  // PREFERENCES
  // ========================================================================

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<AxiosResponse<NotificationPreferences>> {
    return axiosClient.get(`${this.baseURL}/preferences`);
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    data: Partial<NotificationPreferences>
  ): Promise<AxiosResponse<NotificationPreferences>> {
    return axiosClient.patch(`${this.baseURL}/preferences`, data);
  }

  /**
   * Get notification channels
   */
  async getChannels(): Promise<AxiosResponse<{ channels: NotificationChannel[] }>> {
    return axiosClient.get(`${this.baseURL}/channels`);
  }

  /**
   * Update notification channel
   */
  async updateChannel(
    channel: string,
    data: Partial<NotificationChannel>
  ): Promise<AxiosResponse<NotificationChannel>> {
    return axiosClient.patch(`${this.baseURL}/channels/${channel}`, data);
  }

  /**
   * Test notification
   */
  async testNotification(channel: string): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.post(`${this.baseURL}/test`, { channel });
  }

  // ========================================================================
  // PUSH NOTIFICATIONS
  // ========================================================================

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(
    subscription: PushSubscription
  ): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.post(`${this.baseURL}/push/subscribe`, {
      subscription: subscription.toJSON(),
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(
    endpoint: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return axiosClient.post(`${this.baseURL}/push/unsubscribe`, { endpoint });
  }

  // ========================================================================
  // WEBSOCKET / REAL-TIME
  // ========================================================================

  /**
   * Get WebSocket connection token
   */
  async getWebSocketToken(): Promise<AxiosResponse<WebSocketTokenResponse>> {
    return axiosClient.get(`${this.baseURL}/ws-token`);
  }

  /**
   * Create a notification (for testing or admin use)
   */
  async createNotification(
    data: {
      user_id: string;
      type: string;
      title: string;
      message: string;
      priority?: string;
      resource_type?: string;
      resource_id?: string;
    }
  ): Promise<AxiosResponse<Notification>> {
    return axiosClient.post(this.baseURL, data);
  }
}

// Export service instance
export const notificationService = new NotificationService();
export default notificationService;
