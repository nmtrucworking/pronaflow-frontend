import { useCallback } from 'react';
import type { NotificationEntity } from '../types/inbox-types';

interface UseNotificationActionsParams {
  onNotificationsChange: (notifications: NotificationEntity[]) => void;
  notifications: NotificationEntity[];
}

interface UseNotificationActionsReturn {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationActions = ({
  onNotificationsChange,
  notifications,
}: UseNotificationActionsParams): UseNotificationActionsReturn => {
  const markAsRead = useCallback((id: string) => {
    const updated = notifications.map(n =>
      n.notification_id === id ? { ...n, is_read: true } : n
    );
    onNotificationsChange(updated);
  }, [notifications, onNotificationsChange]);

  const markAllAsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, is_read: true }));
    onNotificationsChange(updated);
  }, [notifications, onNotificationsChange]);

  const deleteNotification = useCallback((id: string) => {
    const updated = notifications.filter(n => n.notification_id !== id);
    onNotificationsChange(updated);
  }, [notifications, onNotificationsChange]);

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
