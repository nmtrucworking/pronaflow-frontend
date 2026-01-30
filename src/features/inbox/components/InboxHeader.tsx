import * as Tabs from '@radix-ui/react-tabs';
import { Search, CheckCircle2 } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { NotificationFilter } from '../types/inbox-types';

interface InboxHeaderProps {
  unreadCount: number;
  currentFilter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
  onMarkAllAsRead: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  unreadCount,
  currentFilter,
  onFilterChange,
  onMarkAllAsRead,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="p-4 border-b border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          Hộp thư đến
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {unreadCount}
          </span>
        </h1>
        <div className="flex gap-1">
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  onClick={onMarkAllAsRead} 
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  aria-label="Mark all as read"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Content className="px-2 py-1 bg-slate-800 text-white text-xs rounded mb-1">
                Đánh dấu tất cả là đã đọc
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm thông báo..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Tabs.Root value={currentFilter} onValueChange={(val) => onFilterChange(val as NotificationFilter)}>
        <Tabs.List className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {['ALL', 'UNREAD', 'MENTION'].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="flex-1 py-1.5 text-xs font-medium rounded-md text-slate-500 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
            >
              {tab === 'ALL' ? 'Tất cả' : tab === 'UNREAD' ? 'Chưa đọc' : 'Đề cập'}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};
