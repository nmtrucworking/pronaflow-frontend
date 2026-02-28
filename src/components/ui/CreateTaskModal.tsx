/**
 * CREATE TASK MODAL COMPONENT
 * Enhanced task creation modal with form validation and accessibility
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, User, Flag, Clock, Link2, Info } from 'lucide-react';
import type { Task as GanttTask } from 'gantt-task-react';
import { Button, Input, Badge } from '../ui';
import { useTheme } from '../../themes/ThemeProvider';
import { useFocusTrap } from '../../hooks/useAccessibility.tsx';
import COLORS from '@/config/colors';

interface Task extends GanttTask {
  project?: string;
  dependencies?: string[];
  assignee?: string;
  priority?: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'displayOrder' | 'styles'>) => void;
  existingTasks: Task[];
}

const PRIORITY_OPTIONS = [
  { value: 'URGENT', label: 'Khẩn cấp', color: 'danger', bgColor: COLORS.priority.urgent },
  { value: 'HIGH', label: 'Cao', color: 'warning', bgColor: COLORS.priority.high },
  { value: 'NORMAL', label: 'Bình thường', color: 'default', bgColor: COLORS.semantic.info[500] },
  { value: 'LOW', label: 'Thấp', color: 'default', bgColor: COLORS.priority.low },
] as const;

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'Cần làm', color: 'default' },
  { value: 'IN_PROGRESS', label: 'Đang thực hiện', color: 'info' },
  { value: 'REVIEW', label: 'Chờ duyệt', color: 'warning' },
  { value: 'DONE', label: 'Hoàn thành', color: 'success' },
] as const;

export function CreateTaskModal({ isOpen, onClose, onSubmit, existingTasks }: CreateTaskModalProps) {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Focus management
  useFocusTrap(isOpen);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'task' as 'project' | 'task',
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: 0,
    project: '',
    assignee: '',
    priority: 'NORMAL' as Task['priority'],
    status: 'TODO' as Task['status'],
    dependencies: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available options
  const availableProjects = existingTasks.filter(task => task.type === 'project');
  const availableTasks = existingTasks.filter(task => task.type === 'task');
  const availableAssignees = Array.from(new Set(existingTasks.map(task => task.assignee).filter(Boolean)));

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên công việc không được để trống';
    }

    if (new Date(formData.start) >= new Date(formData.end)) {
      newErrors.end = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Tiến độ phải từ 0 đến 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newTask = {
        ...formData,
        start: new Date(formData.start),
        end: new Date(formData.end),
        dependencies: formData.dependencies,
      };
      
      await onSubmit(newTask);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        type: 'task',
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        project: '',
        assignee: '',
        priority: 'NORMAL',
        status: 'TODO',
        dependencies: [],
      });
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle dependency toggle
  const toggleDependency = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter(id => id !== taskId)
        : [...prev.dependencies, taskId],
    }));
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-hidden"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 id="modal-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Tạo công việc mới
                </h2>
                <p id="modal-description" className="text-sm text-slate-600 dark:text-slate-400">
                  Điền thông tin chi tiết cho công việc mới
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Đóng modal">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Task name */}
            <Input
              label="Tên công việc *"
              placeholder="Nhập tên công việc..."
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              autoFocus
            />

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Loại
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('type', 'task')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    formData.type === 'task'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Công việc
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('type', 'project')}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    formData.type === 'project'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Dự án
                </button>
              </div>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ngày bắt đầu *"
                type="date"
                value={formData.start}
                onChange={(e) => handleChange('start', e.target.value)}
                leftIcon={<Calendar size={16} />}
              />
              <Input
                label="Ngày kết thúc *"
                type="date"
                value={formData.end}
                onChange={(e) => handleChange('end', e.target.value)}
                error={errors.end}
                leftIcon={<Calendar size={16} />}
              />
            </div>

            {/* Progress and project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tiến độ (%)"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value) || 0)}
                error={errors.progress}
              />

              {formData.type === 'task' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Dự án
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => handleChange('project', e.target.value)}
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Chọn dự án...</option>
                    {availableProjects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Người phụ trách
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  list="assignees"
                  placeholder="Nhập tên người phụ trách..."
                  value={formData.assignee}
                  onChange={(e) => handleChange('assignee', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <datalist id="assignees">
                  {availableAssignees.map(assignee => (
                    <option key={assignee} value={assignee} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Độ ưu tiên
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITY_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('priority', option.value)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        formData.priority === option.value
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dependencies */}
            {formData.type === 'task' && availableTasks.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phụ thuộc
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableTasks.map(task => (
                    <label key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.dependencies.includes(task.id)}
                        onChange={() => toggleDependency(task.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                        {task.name}
                      </span>
                      {task.assignee && (
                        <Badge variant="default" size="sm">{task.assignee}</Badge>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Info box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-1">Ghi chú quan trọng:</p>
                  <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                    <li>• Các phụ thuộc sẽ tự động sắp xếp thời gian</li>
                    <li>• Tiến độ có thể được cập nhật sau khi tạo</li>
                    <li>• Người phụ trách sẽ nhận thông báo qua email</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              disabled={!formData.name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}