import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/mocks/notifications';
import {
  InboxHeader,
  NotificationList,
  NotificationDetail,
  PreviewModal,
} from '../components';
import {
  useFilteredNotifications,
  useNotificationSelection,
  useNotificationActions,
} from '../hooks';
import type { NotificationEntity, NotificationFilter, Attachment } from '../types/inbox-types';

const CURRENT_USER_ID = 'u1';

export default function InboxPage() {
  const [notifications, setNotifications] = useState<NotificationEntity[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // Filtered notifications hook
  const filteredNotifications = useFilteredNotifications({
    notifications,
    filter,
    searchQuery,
  });

  // Selection hook
  const {
    selectedId,
    selectedNotification,
    selectNotification,
    clearSelection,
  } = useNotificationSelection({ notifications });

  // Actions hook
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationActions({
    notifications,
    onNotificationsChange: setNotifications,
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleSelect = (notification: NotificationEntity) => {
    selectNotification(notification);
    markAsRead(notification.notification_id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    if (selectedId === id) clearSelection();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* LEFT PANE: Notification List */}
      <div
        className={`${
          selectedId ? 'hidden md:flex' : 'flex'
        } w-full md:w-[400px] flex-col border-r border-slate-200 bg-white z-10 shadow-sm`}
      >
        <InboxHeader
          unreadCount={unreadCount}
          currentFilter={filter}
          onFilterChange={setFilter}
          onMarkAllAsRead={markAllAsRead}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <NotificationList
          notifications={filteredNotifications}
          selectedId={selectedId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          isEmpty={filteredNotifications.length === 0}
        />
      </div>

      {/* RIGHT PANE: Detail View */}
      <div
        className={`${
          selectedId ? 'flex' : 'hidden md:flex'
        } flex-1 flex-col h-full bg-slate-50 relative`}
      >
        {/* Mobile Back Button */}
        {selectedId && (
          <div className="md:hidden absolute top-4 left-4 z-20">
            <button
              onClick={clearSelection}
              className="p-2 bg-white border border-slate-200 rounded-full shadow-lg text-slate-600"
              aria-label="Go back"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
        )}

        <NotificationDetail notification={selectedNotification} onPreview={setPreviewAttachment} />
      </div>

      {/* Preview Modal */}
      <PreviewModal attachment={previewAttachment} onClose={() => setPreviewAttachment(null)} />
    </div>
  );
}