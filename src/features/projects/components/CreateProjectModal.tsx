import React, { useState } from 'react';
import { X, Zap, Layers } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ProjectType, ProjectPriority } from '@/types/project';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject?: (projectData: {
    name: string;
    description: string;
    type: ProjectType;
    priority: ProjectPriority;
  }) => void;
}

const PROJECT_TYPE_OPTIONS: Array<{
  value: ProjectType;
  label: string;
  icon: typeof Zap;
  title: string;
  description: string;
  hints: string[];
}> = [
  {
    value: 'AGILE',
    label: '🔄 Agile',
    icon: Zap,
    title: 'Agile - linh hoạt theo sprint',
    description: 'Phù hợp team cần phản hồi nhanh, chia nhỏ công việc và cập nhật liên tục.',
    hints: ['Ưu tiên tốc độ triển khai', 'Dễ thay đổi scope giữa các vòng lặp'],
  },
  {
    value: 'WATERFALL',
    label: '📊 Waterfall',
    icon: Layers,
    title: 'Waterfall - tuần tự theo kế hoạch',
    description: 'Phù hợp dự án có phạm vi ổn định, cần mốc kiểm soát và kế hoạch dài hạn.',
    hints: ['Rõ timeline & phụ thuộc', 'Dễ kiểm soát baseline và phê duyệt'],
  },
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'AGILE' as ProjectType,
    priority: 'MEDIUM' as ProjectPriority,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Tên dự án là bắt buộc';
    }
    if (formData.name.trim().length > 100) {
      newErrors.name = 'Tên dự án không được vượt quá 100 ký tự';
    }
    if (formData.description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreateProject?.(formData);
      setFormData({
        name: '',
        description: '',
        type: 'AGILE',
        priority: 'MEDIUM',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-40" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-[min(92vw,860px)] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <form onSubmit={handleSubmit} className="relative bg-gradient-to-b from-white to-slate-50 p-8">
            {/* Close Button */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng</span>
              </button>
            </Dialog.Close>

            {/* Header */}
            <div className="mb-6 pr-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                PronaFlow project studio
              </div>
              <Dialog.Title className="text-2xl font-bold text-slate-900 mb-2">
                Tạo dự án mới
              </Dialog.Title>
              <Dialog.Description className="text-slate-600">
                Khởi tạo dự án với layout rõ ràng, hiện đại và đồng nhất với hệ thống PronaFlow.
              </Dialog.Description>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Project Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900">
                  Tên dự án <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="VD: Website Redesign, Mobile App v2.0..."
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-900">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về dự án của bạn..."
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none",
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-500"
                  )}
                />
                <p className="text-xs text-slate-500">
                  {formData.description.length}/500 ký tự
                </p>
                {errors.description && (
                  <p className="text-xs text-red-600 font-medium">{errors.description}</p>
                )}
              </div>

              {/* Project Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-900">
                  Loại dự án
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                  {PROJECT_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: value as ProjectType }))}
                      className={cn(
                        "relative overflow-hidden px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm",
                        formData.type === value
                          ? "text-indigo-700"
                          : "text-slate-600 hover:text-slate-800"
                      )}
                    >
                      {formData.type === value && (
                        <motion.span
                          layoutId="active-project-type"
                          className="absolute inset-0 rounded-lg border border-indigo-200 bg-white shadow-sm"
                          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        />
                      )}

                      <motion.span
                        className="relative z-10 inline-flex items-center gap-2"
                        animate={{ y: formData.type === value ? 0 : 0.5, scale: formData.type === value ? 1 : 0.98 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </motion.span>
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {PROJECT_TYPE_OPTIONS.filter(option => option.value === formData.type).map(option => (
                      <motion.div
                        key={option.value}
                        initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="space-y-2"
                      >
                        <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{option.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {option.hints.map(hint => (
                            <span
                              key={hint}
                              className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600"
                            >
                              {hint}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-semibold text-slate-900">
                  Độ ưu tiên
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="LOW">🟢 Thấp</option>
                  <option value="MEDIUM">🟡 Trung bình</option>
                  <option value="HIGH">🟠 Cao</option>
                  <option value="CRITICAL">🔴 Khẩn cấp</option>
                </select>
              </div>
            </div>

            {/* Actions */}
              <div className="flex gap-3 mt-8">
              <Dialog.Close asChild>
                <button
                  type="button"
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.99]"
                >
                  Hủy
                </button>
              </Dialog.Close>
              <button
                type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2.5 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99]"
              >
                  Khởi tạo dự án
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
