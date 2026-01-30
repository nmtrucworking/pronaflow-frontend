import { useState, useCallback } from 'react';
import type { NotificationEntity } from '../types/inbox-types';

interface UseNotificationSelectionReturn {
  selectedId: string | null;
  selectedNotification: NotificationEntity | null;
  selectNotification: (notification: NotificationEntity) => void;
  clearSelection: () => void;
}

interface UseNotificationSelectionParams {
  notifications: NotificationEntity[];
}

export const useNotificationSelection = ({
  notifications,
}: UseNotificationSelectionParams): UseNotificationSelectionReturn => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedNotification = notifications.find(n => n.notification_id === selectedId) || null;

  const selectNotification = useCallback((notification: NotificationEntity) => {
    setSelectedId(notification.notification_id);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  return {
    selectedId,
    selectedNotification,
    selectNotification,
    clearSelection,
  };
};
