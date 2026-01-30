/**
 * Inbox Feature Module
 */

export { InboxPage } from './pages';

export {
  NotificationIcon,
  RelativeTime,
  EmptyState,
  PreviewModal,
  InboxHeader,
  NotificationList,
  NotificationDetail,
} from './components';

export {
  useFilteredNotifications,
  useNotificationSelection,
  useNotificationActions,
} from './hooks';

export type {
  NotificationPriority,
  NotificationType,
  NotificationFilter,
  UserEntity,
  Attachment,
  NotificationEntity,
} from './types';

export {
  NOTIFICATION_FILTERS,
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITIES,
} from './constants';
