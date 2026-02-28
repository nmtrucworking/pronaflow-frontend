/**
 * TASK BULK ACTION BAR COMPONENT
 * Floating toolbar for bulk operations on multiple selected tasks
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Check,
  Clock,
  User,
  ChevronDown,
  X,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '@/themes/ThemeProvider';
import COLORS from '@/config/colors';
import { TASK_PRIORITY_COLORS, TASK_STATUS_COLORS } from '@/config/domainMappings';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import type { TaskStatus, TaskPriority } from '../types';

interface TaskBulkActionBarProps {
  selectedCount: number;
  isVisible: boolean;
  onClose: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  onPriorityChange?: (priority: TaskPriority) => void;
  onAssignee?: (userId: string) => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function TaskBulkActionBar({
  selectedCount,
  isVisible,
  onClose,
  onStatusChange,
  onPriorityChange,
  onAssignee,
  onDelete,
  isLoading = false,
}: TaskBulkActionBarProps) {
  const { theme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<'status' | 'priority' | 'assignee' | null>(null);

  // Close dropdowns when bar closes
  useEffect(() => {
    if (!isVisible) {
      setOpenDropdown(null);
    }
  }, [isVisible]);

  const statusOptions: TaskStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  const priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none"
          />

          {/* FLOATING BAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-2xl rounded-lg px-6 py-3 flex items-center gap-4 max-w-4xl mx-auto backdrop-blur-md bg-opacity-95 border border-indigo-500/30">
              {/* SELECTED COUNT */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                  <Check className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">
                  {selectedCount} {selectedCount === 1 ? 'công việc' : 'công việc'} được chọn
                </span>
              </div>

              {/* DIVIDER */}
              <div className="hidden md:block w-px h-6 bg-white/20" />

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* STATUS DROPDOWN */}
                <div className="relative group">
                  <button
                    disabled={isLoading}
                    onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    Trạng thái
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {openDropdown === 'status' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-2 left-0 bg-white text-slate-900 rounded-lg shadow-xl py-1 min-w-max z-50"
                      >
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              onStatusChange?.(status);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: TASK_STATUS_COLORS[status] || COLORS.neutral[200] }}
                            />
                            {STATUS_CONFIG[status]?.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PRIORITY DROPDOWN */}
                <div className="relative group">
                  <button
                    disabled={isLoading}
                    onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Ưu tiên
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {openDropdown === 'priority' && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full mt-2 left-0 bg-white text-slate-900 rounded-lg shadow-xl py-1 min-w-max z-50"
                      >
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority}
                            onClick={() => {
                              onPriorityChange?.(priority);
                              setOpenDropdown(null);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: TASK_PRIORITY_COLORS[priority] || COLORS.neutral[200] }}
                            />
                            {PRIORITY_CONFIG[priority]?.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* DUPLICATE BUTTON */}
                <button
                  disabled={isLoading}
                  onClick={() => {
                    setOpenDropdown(null);
                    // Handle duplicate
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors"
                  title="Nhân bản công việc"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* DELETE BUTTON */}
                <button
                  disabled={isLoading}
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedCount} công việc?`)) {
                      onDelete?.();
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors"
                  title="Xóa công việc"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="ml-auto flex-shrink-0 p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* LOADING STATE */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg shadow-lg"
            >
              <div className="animate-spin">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Đang xử lý...</span>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
