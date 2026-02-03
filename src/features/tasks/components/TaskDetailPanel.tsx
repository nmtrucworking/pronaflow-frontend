import { useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  History,
  Layers,
  Link as LinkIcon,
  Plus,
  SendHorizontal,
  Trash2,
  User as UserIcon,
  Workflow,
  X,
} from 'lucide-react';
import type { TaskEntity, TaskPriority, TaskStatus } from '../types';
import { PRIORITY_CONFIG, STATUS_CONFIG, USERS } from '../constants';
import { cn } from '../utils';
import { useClickOutside } from '../hooks/useClickOutside';
import { TaskCommentSection } from './TaskCommentSection';

export const TaskDetailPanel = ({ task, onClose }: { task: TaskEntity | null, onClose: () => void }) => {
  const [activePopover, setActivePopover] = useState<'status' | 'priority' | 'assignee' | 'deadline' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, () => setActivePopover(null));

  if (!task) return null;

  const statusOptions: TaskStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  const priorityOptions: TaskPriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-[-4px_0_20px_-6px_rgba(0,0,0,0.15)] z-[101] flex flex-col rounded-l-lg">
        {/* HEADER TOOLBAR */}
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer transition-colors">
              <Layers className="w-3.5 h-3.5" />
              {task.project.name}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="font-mono text-slate-400">{task.key}</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors" title="Sao chép Link">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-200 mx-2" />
            <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          <div className="flex flex-col gap-8">
            {/* TITLE & CHECKBOX */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="pt-1.5">
                  <input type="checkbox" className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-transform hover:scale-105" />
                </div>
                <div className="flex-1">
                  <textarea
                    rows={1}
                    defaultValue={task.title}
                    className="w-full text-xl md:text-2xl font-bold text-slate-800 border-none focus:ring-0 p-0 resize-none bg-transparent placeholder-slate-300 leading-tight focus:bg-slate-50 rounded-md transition-colors"
                    placeholder="Tên công việc..."
                  />
                </div>
              </div>
            </div>

            {/* METADATA GRID */}
            <div ref={popoverRef} className="bg-slate-50 rounded-lg border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {/* Status */}
              <div className="flex items-center justify-between relative">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Circle className="w-4 h-4 text-slate-400" /> Trạng thái
                </span>

                <button
                  onClick={() => setActivePopover(activePopover === 'status' ? null : 'status')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all min-w-[140px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {STATUS_CONFIG[task.status].label}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {activePopover === 'status' && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-slate-100 z-50">
                    <div className="p-1 space-y-0.5">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2",
                            task.status === status
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                          onClick={() => setActivePopover(null)}
                        >
                          <div className={cn("w-2 h-2 rounded-full", STATUS_CONFIG[status].color.replace('text-', 'bg-'))} />
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between relative">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" /> Độ ưu tiên
                </span>

                <button
                  onClick={() => setActivePopover(activePopover === 'priority' ? null : 'priority')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all min-w-[120px] justify-center"
                >
                  {PRIORITY_CONFIG[task.priority].label}
                </button>

                {activePopover === 'priority' && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-slate-100 z-50">
                    <div className="p-1 space-y-0.5">
                      {priorityOptions.map((priority) => (
                        <button
                          key={priority}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md",
                            task.priority === priority
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                          onClick={() => setActivePopover(null)}
                        >
                          {PRIORITY_CONFIG[priority].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div className="flex items-center justify-between relative">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" /> Người thực hiện
                </span>

                <div
                  onClick={() => setActivePopover(activePopover === 'assignee' ? null : 'assignee')}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white px-2 py-1.5 rounded-md transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                >
                  <img src={task.assignees[0]?.avatar || 'https://ui-avatars.com/api/?name=Unassigned&background=E2E8F0&color=64748B'} className="w-6 h-6 rounded-full ring-2 ring-white" />
                  <span className="text-sm text-slate-700 font-medium">{task.assignees[0]?.name || 'Chưa gán'}</span>
                </div>

                {activePopover === 'assignee' && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-100 z-50">
                    <div className="p-2 border-b border-slate-50">
                      <input type="text" placeholder="Tìm thành viên..." className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="p-1 max-h-48 overflow-y-auto">
                      {(task.assignees.length ? task.assignees : Object.values(USERS)).map((u) => (
                        <button key={u.id} className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-md group" onClick={() => setActivePopover(null)}>
                          <img src={u.avatar} className="w-6 h-6 rounded-full" />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">{u.name}</span>
                          {task.assignees.some(a => a.id === u.id) && <Check className="w-3.5 h-3.5 text-indigo-600 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between relative">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-400" /> Thời hạn
                </span>

                <button
                  onClick={() => setActivePopover(activePopover === 'deadline' ? null : 'deadline')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                >
                  <span>{new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </button>

                {activePopover === 'deadline' && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-100 z-50 p-3">
                    <div className="flex justify-between items-center mb-3">
                      <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="text-sm font-bold text-slate-700">December 2025</span>
                      <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-400">
                      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      <div className="p-1 text-slate-300">30</div>
                      <div className="p-1 text-slate-300">1</div>
                      <div className="p-1 hover:bg-slate-100 rounded cursor-pointer">2</div>
                      <div className="p-1 hover:bg-slate-100 rounded cursor-pointer">3</div>
                      <div className="p-1 hover:bg-slate-100 rounded cursor-pointer">4</div>
                      <div className="p-1 bg-indigo-100 text-indigo-600 rounded font-bold cursor-pointer">5</div>
                      <div className="p-1 hover:bg-slate-100 rounded cursor-pointer">6</div>
                      <div className="p-1 hover:bg-slate-100 rounded cursor-pointer col-start-2 row-start-3 bg-slate-800 text-white shadow-md">15</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                      <button className="text-xs text-indigo-600 font-medium hover:underline">Xóa hạn</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="group">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" /> Mô tả
              </h3>
              <div className="min-h-[100px] text-sm text-slate-600 leading-relaxed p-4 rounded-lg border border-transparent group-hover:border-slate-200 group-hover:bg-slate-50 transition-all cursor-text">
                <p>{task.description || 'Chưa có mô tả chi tiết cho công việc này.'}</p>
              </div>
            </div>

            {/* DEPENDENCIES */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Workflow className="w-4 h-4 text-slate-400" /> Liên kết & Phụ thuộc
              </h3>
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                <div className="relative group">
                  <div className="absolute -left-[31px] top-3 w-6 h-6 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-full z-10">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50/40 border border-red-100 rounded-lg hover:border-red-200 transition-all cursor-pointer">
                    <div className="p-2 bg-white rounded-md border border-red-100 shadow-sm text-red-500">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Cần xong trước</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-500 border border-slate-200">In Review</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate mt-0.5">Phê duyệt Wireframe từ khách hàng</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">TASK-99</span>
                        <img src="https://ui-avatars.com/api/?name=Alice&background=random" className="w-4 h-4 rounded-full border border-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white ring-2 ring-indigo-100 z-10"></div>
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-md text-xs text-indigo-700 font-medium text-center">
                    Công việc hiện tại ({task.key})
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -left-[31px] top-3 w-6 h-6 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-full z-10">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-200 transition-all cursor-pointer">
                    <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm text-indigo-600">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Chặn công việc</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-500 border border-slate-200">To Do</span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate mt-0.5">Slicing HTML/CSS Trang chủ</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">TASK-105</span>
                        <div className="w-4 h-4 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[8px] text-slate-500">?</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBTASKS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" /> Công việc con
                </h3>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">1/3</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '33%' }}></div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 group p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-sm text-slate-400 line-through decoration-slate-400">Phác thảo Layout Wireframe</span>
                  <button className="opacity-0 group-hover:opacity-100 ml-auto text-slate-300 hover:text-red-500 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-3 group p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-sm text-slate-700">Thiết kế Dark Mode</span>
                  <button className="opacity-0 group-hover:opacity-100 ml-auto text-slate-300 hover:text-red-500 transition-opacity"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex items-center gap-3 mt-2 px-2 py-1.5">
                  <Plus className="w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Thêm công việc con..." className="text-sm text-slate-600 placeholder-slate-400 bg-transparent border-none focus:ring-0 p-0 w-full" />
                </div>
              </div>
            </div>

            {/* ACTIVITY & COMMENTS */}
            <div className="border-t border-slate-200 pt-6">
              <TaskCommentSection taskId={task.id} />
            </div>
          </div>
        </div>

        {/* FOOTER - Removed, integrated comments in activity section */}
      </div>
    </div>
  );
};
