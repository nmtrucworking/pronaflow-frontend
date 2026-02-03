import React, { useState } from 'react';
import { X, Zap, Layers } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
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
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border border-slate-200 bg-white shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-xl">
          <form onSubmit={handleSubmit} className="relative p-8">
            {/* Close Button */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-100 p-1.5 transition-all"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Đóng</span>
              </button>
            </Dialog.Close>

            {/* Header */}
            <div className="mb-6">
              <Dialog.Title className="text-2xl font-bold text-slate-900 mb-2">
                🚀 Tạo dự án mới
              </Dialog.Title>
              <Dialog.Description className="text-slate-600">
                Khởi tạo một dự án mới để bắt đầu quản lý công việc của bạn
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
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'AGILE', label: '🔄 Agile', icon: Zap },
                    { value: 'WATERFALL', label: '📊 Waterfall', icon: Layers },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: value as ProjectType }))}
                      className={cn(
                        "relative px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 font-medium text-sm",
                        formData.type === value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
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
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Hủy
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 transform inline-flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:animate-bounce [animation-delay:0ms]">Khởi</span>
                <span className="group-hover:animate-bounce [animation-delay:100ms]">tạo</span>
                <span className="group-hover:animate-bounce [animation-delay:200ms]">dự</span>
                <span className="group-hover:animate-bounce [animation-delay:300ms]">án</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
