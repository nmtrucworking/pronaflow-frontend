import * as ScrollArea from '@radix-ui/react-scroll-area';
import { FileText, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationEntity } from '../types/inbox-types';
import { NotificationIcon } from './NotificationIcon';
import { RelativeTime } from './RelativeTime';
import { EmptyState } from './EmptyState';

interface NotificationListProps {
  notifications: NotificationEntity[];
  selectedId: string | null;
  onSelect: (notification: NotificationEntity) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isEmpty: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  selectedId,
  onSelect,
  onDelete,
  isEmpty,
}) => {
  return (
    <ScrollArea.Root className="flex-1 overflow-hidden bg-slate-50/50">
      <ScrollArea.Viewport className="w-full h-full">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => onSelect(notification)}
                className={cn(
                  'group relative p-4 cursor-pointer transition-all duration-200 border-l-4 hover:bg-slate-50',
                  selectedId === notification.notification_id
                    ? 'bg-indigo-50/50 border-indigo-500'
                    : 'bg-white border-transparent',
                  !notification.is_read && selectedId !== notification.notification_id
                    ? 'border-l-blue-500 bg-blue-50/10'
                    : ''
                )}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1 relative">
                    <NotificationIcon type={notification.type} />
                    {!notification.is_read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p
                        className={cn(
                          'text-sm font-medium truncate pr-2',
                          !notification.is_read ? 'text-slate-900 font-bold' : 'text-slate-700'
                        )}
                      >
                        {notification.title}
                      </p>
                      <RelativeTime dateString={notification.created_at} />
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notification.content}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      {notification.priority === 'HIGH' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                          Urgent
                        </span>
                      )}
                      {notification.attachments && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          <FileText className="w-3 h-3 mr-1" /> {notification.attachments.length} files
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-1 flex gap-1">
                  <button
                    onClick={(e) => onDelete(notification.notification_id, e)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    title="Tùy chọn"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="flex select-none touch-none p-0.5 bg-slate-100 transition-colors duration-[160ms] ease-out hover:bg-slate-200 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
      >
        <ScrollArea.Thumb className="flex-1 bg-slate-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
};
