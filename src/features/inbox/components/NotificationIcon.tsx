import { AtSign, Briefcase, Clock, MessageSquare, Bell } from 'lucide-react';
import type { NotificationType } from '../types/inbox-types';

interface NotificationIconProps {
  type: NotificationType;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  switch (type) {
    case 'MENTION':
      return (
        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
          <AtSign className="w-4 h-4" />
        </div>
      );
    case 'TASK_ASSIGNED':
      return (
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Briefcase className="w-4 h-4" />
        </div>
      );
    case 'DUE_SOON':
      return (
        <div className="p-2 bg-red-100 text-red-600 rounded-full">
          <Clock className="w-4 h-4" />
        </div>
      );
    case 'COMMENT_REPLY':
      return (
        <div className="p-2 bg-green-100 text-green-600 rounded-full">
          <MessageSquare className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className="p-2 bg-slate-100 text-slate-600 rounded-full">
          <Bell className="w-4 h-4" />
        </div>
      );
  }
};
