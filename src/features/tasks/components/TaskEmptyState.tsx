/**
 * TASK EMPTY STATE COMPONENT
 * Displays when no tasks found or search results empty
 */

import { motion } from 'framer-motion';
import { Search, Plus, Inbox, ArrowRight } from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';

interface TaskEmptyStateProps {
  type?: 'no-tasks' | 'no-results' | 'no-filter-results';
  searchQuery?: string;
  onCreateTask?: () => void;
  onClearSearch?: () => void;
}

const emptyStateConfig = {
  'no-tasks': {
    icon: Inbox,
    title: 'Chưa có công việc nào',
    description: 'Hãy tạo công việc đầu tiên để bắt đầu quản lý dự án của bạn.',
    actionLabel: 'Tạo công việc',
    actionIcon: Plus,
    color: 'slate',
  },
  'no-results': {
    icon: Search,
    title: 'Không tìm thấy kết quả',
    description: 'Không có công việc nào khớp với tìm kiếm của bạn.',
    actionLabel: 'Xóa tìm kiếm',
    actionIcon: ArrowRight,
    color: 'amber',
  },
  'no-filter-results': {
    icon: Search,
    title: 'Không tìm thấy kết quả lọc',
    description: 'Thử điều chỉnh bộ lọc hoặc tìm kiếm để tìm các công việc.',
    actionLabel: 'Đặt lại bộ lọc',
    actionIcon: ArrowRight,
    color: 'blue',
  },
};

export function TaskEmptyState({
  type = 'no-tasks',
  searchQuery,
  onCreateTask,
  onClearSearch,
}: TaskEmptyStateProps) {
  const { theme } = useTheme();
  const config = emptyStateConfig[type];
  const Icon = config.icon;
  const ActionIcon = config.actionIcon;

  const colorClasses: Record<string, { bg: string; icon: string; button: string }> = {
    slate: {
      bg: 'bg-slate-50',
      icon: 'text-slate-400',
      button: 'bg-slate-600 hover:bg-slate-700',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'text-amber-400',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const colors = colorClasses[config.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-slate-200 ${colors.bg}`}
    >
      {/* ICON */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="mb-4"
      >
        <div className={`p-4 rounded-full bg-white shadow-lg`}>
          <Icon className={`w-8 h-8 ${colors.icon}`} />
        </div>
      </motion.div>

      {/* TITLE */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-lg font-bold text-slate-900 mb-2 text-center"
      >
        {config.title}
      </motion.h3>

      {/* DESCRIPTION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-slate-600 text-center mb-6 max-w-sm"
      >
        {config.description}
        {searchQuery && type === 'no-results' && (
          <span className="block mt-2 font-mono text-xs text-slate-500 break-words">
            Tìm kiếm: "<span className="font-semibold">{searchQuery}</span>"
          </span>
        )}
      </motion.p>

      {/* ACTION BUTTON */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (type === 'no-tasks' || type === 'no-filter-results') {
            onCreateTask?.();
          } else {
            onClearSearch?.();
          }
        }}
        className={`flex items-center gap-2 px-6 py-2.5 ${colors.button} text-white rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-xl active:scale-95`}
      >
        <ActionIcon className="w-4 h-4" />
        {type === 'no-tasks'
          ? config.actionLabel
          : type === 'no-results'
            ? 'Xóa tìm kiếm'
            : 'Đặt lại bộ lọc'}
      </motion.button>

      {/* TIPS - Optional */}
      {type === 'no-tasks' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 max-w-sm"
        >
          <p className="font-medium mb-2">💡 Mẹo nhanh:</p>
          <ul className="space-y-1 text-left">
            <li>• Bấm <kbd className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">+</kbd> để tạo công việc mới</li>
            <li>• Sử dụng <kbd className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">CSV</kbd> để nhập hàng loạt</li>
            <li>• Gán người để cộng tác</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
