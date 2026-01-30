import { useMemo } from 'react';
import type { NotificationEntity, NotificationFilter } from '../types/inbox-types';

interface UseFilteredNotificationsParams {
  notifications: NotificationEntity[];
  filter: NotificationFilter;
  searchQuery?: string;
}

export const useFilteredNotifications = ({
  notifications,
  filter,
  searchQuery = '',
}: UseFilteredNotificationsParams) => {
  return useMemo(() => {
    let result = notifications.filter(n => {
      if (filter === 'UNREAD') return !n.is_read;
      if (filter === 'MENTION') return n.type === 'MENTION';
      return true;
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.metadata?.project_name?.toLowerCase().includes(query) ||
        n.metadata?.task_key?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [notifications, filter, searchQuery]);
};
