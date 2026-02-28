import { useMemo, useState } from 'react';
import { CalendarDays, Check, FileText, Flag, User } from 'lucide-react';
import type { ProjectRef, TaskPriority } from '../types';
import { PRIORITY_CONFIG, USERS } from '../constants';
import { Modal } from './Modal';
import { cn } from '../utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectRef[];
  onCreateTask: (payload: {
    title: string;
    projectId: string;
    priority: TaskPriority;
    dueDate: string;
    assigneeId?: string;
    description?: string;
  }) => void;
}

export function CreateTaskModal({ isOpen, onClose, projects, onCreateTask }: CreateTaskModalProps) {
  const defaultProject = projects[0]?.id ?? '';
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(defaultProject);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState(today);
  const [assigneeId, setAssigneeId] = useState('');
  const [description, setDescription] = useState('');

  const selectedProject = useMemo(() => projects.find((project) => project.id === projectId), [projects, projectId]);
  const isDisabled = !title.trim() || !projectId || !dueDate;

  const resetForm = () => {
    setTitle('');
    setProjectId(projects[0]?.id ?? '');
    setPriority('MEDIUM');
    setDueDate(today);
    setAssigneeId('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (isDisabled) return;

    onCreateTask({
      title: title.trim(),
      projectId,
      priority,
      dueDate,
      assigneeId: assigneeId || undefined,
      description: description.trim() || undefined,
    });
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Tạo công việc mới</h3>
          <p className="text-xs text-slate-500 mt-0.5">Điền thông tin cơ bản để tạo task nhanh và mở chi tiết sau.</p>
        </div>
      </div>

      <div className="p-6 space-y-5 overflow-y-auto">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tiêu đề</label>
          <div className="mt-1.5 relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ví dụ: Thiết kế flow đăng ký mới"
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dự án</label>
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
            >
              {projects.map((project) => (
                <option value={project.id} key={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Độ ưu tiên</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPriority(value)}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5',
                    priority === value
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  )}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {PRIORITY_CONFIG[value].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ngày hạn</label>
            <div className="mt-1.5 relative">
              <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Người phụ trách</label>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
              >
                <option value="">Chưa gán</option>
                {Object.values(USERS).map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mô tả (tuỳ chọn)</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Mô tả bối cảnh và kỳ vọng đầu ra..."
            className="mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 resize-none"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <div className="font-medium text-slate-700">Xác nhận nhanh</div>
          <div className="mt-1">Task sẽ được tạo trong dự án <span className="font-semibold text-slate-800">{selectedProject?.name || '—'}</span> với ưu tiên <span className="font-semibold text-slate-800">{PRIORITY_CONFIG[priority].label}</span>.</div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/60">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-800 hover:bg-white transition-colors"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          Tạo task
        </button>
      </div>
    </Modal>
  );
}
