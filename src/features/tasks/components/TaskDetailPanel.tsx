import { useEffect, useRef, useState } from 'react';
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
import { toast } from 'sonner';
import { taskService } from '@/services/taskService';
import type { TaskDependency, TaskEntity, TaskPriority, TaskStatus, TaskSubtask } from '../types';
import { PRIORITY_CONFIG, STATUS_CONFIG, USERS } from '../constants';
import { cn } from '../utils';
import { useClickOutside } from '../hooks/useClickOutside';
import { TaskCommentSection } from './TaskCommentSection';

export const TaskDetailPanel = ({ task, onClose }: { task: TaskEntity | null, onClose: () => void }) => {
  const [activePopover, setActivePopover] = useState<'status' | 'priority' | 'assignee' | 'deadline' | null>(null);
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>('NOT_STARTED');
  const [currentPriority, setCurrentPriority] = useState<TaskPriority>('MEDIUM');
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newDependencyTaskId, setNewDependencyTaskId] = useState('');
  const [isSavingSubtask, setIsSavingSubtask] = useState(false);
  const [isSavingDependency, setIsSavingDependency] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  useClickOutside(popoverRef, () => setActivePopover(null));

  if (!task) return null;

  useEffect(() => {
    setCurrentStatus(task.status);
    setCurrentPriority(task.priority);
    setSubtasks(task.subtasks ?? []);
    setDependencies(task.dependencies ?? []);
    setNewSubtaskTitle('');
    setNewDependencyTaskId('');
  }, [task.id, task.priority, task.status, task.subtasks, task.dependencies]);

  useEffect(() => {
    const loadTaskRelations = async () => {
      try {
        const [subtaskList, dependencyList] = await Promise.all([
          taskService.getSubtasks(task.id),
          taskService.getDependencies(task.id),
        ]);

        setSubtasks(
          subtaskList.map((subtask, index) => ({
            id: subtask.id,
            title: subtask.title,
            is_completed: subtask.is_done,
            assignee_id: subtask.assignee_id,
            position: subtask.position ?? index,
          }))
        );

        setDependencies(
          dependencyList.map((dependency) => ({
            id: dependency.id,
            task_id: dependency.task_id,
            depends_on_task_id: dependency.depends_on_task_id,
            dependency_type: dependency.dependency_type,
          }))
        );
      } catch (error) {
        // Keep fallback data from parent task payload
      }
    };

    void loadTaskRelations();
  }, [task.id]);

  const statusOptions: TaskStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  const priorityOptions: TaskPriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

  const toApiStatus = (status: TaskStatus) => {
    if (status === 'IN_PROGRESS') {
      return 'IN_PROGRESS' as const;
    }
    if (status === 'IN_REVIEW') {
      return 'IN_REVIEW' as const;
    }
    if (status === 'DONE') {
      return 'DONE' as const;
    }
    return 'TO_DO' as const;
  };

  const toApiPriority = (priority: TaskPriority) => {
    if (priority === 'URGENT') {
      return 'CRITICAL' as const;
    }
    return priority;
  };

  const handleStatusChange = async (nextStatus: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(task.id, toApiStatus(nextStatus));
      setCurrentStatus(nextStatus);
      toast.success('Status updated.');
    } catch (error) {
      toast.error('Failed to update status.');
    } finally {
      setActivePopover(null);
    }
  };

  const handlePriorityChange = async (nextPriority: TaskPriority) => {
    try {
      await taskService.updateTask(task.id, {
        priority: toApiPriority(nextPriority),
      });
      setCurrentPriority(nextPriority);
      toast.success('Priority updated.');
    } catch (error) {
      toast.error('Failed to update priority.');
    } finally {
      setActivePopover(null);
    }
  };

  const completedSubtaskCount = subtasks.filter((subtask) => subtask.is_completed).length;
  const completionPercentage = subtasks.length > 0 ? Math.round((completedSubtaskCount / subtasks.length) * 100) : 0;

  const handleAddSubtask = async () => {
    const title = newSubtaskTitle.trim();
    if (!title) {
      return;
    }

    setIsSavingSubtask(true);
    try {
      const createdSubtask = await taskService.createSubtask(task.id, {
        title,
        position: subtasks.length,
      });

      setSubtasks((prev) => [
        ...prev,
        {
          id: createdSubtask.id,
          title: createdSubtask.title,
          is_completed: createdSubtask.is_done,
          assignee_id: createdSubtask.assignee_id,
          position: createdSubtask.position,
        },
      ]);
      setNewSubtaskTitle('');
      toast.success('Subtask created.');
    } catch (error) {
      toast.error('Failed to create subtask.');
    } finally {
      setIsSavingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask: TaskSubtask) => {
    try {
      const updatedSubtask = await taskService.updateSubtask(task.id, subtask.id, {
        is_completed: !subtask.is_completed,
      });

      setSubtasks((prev) =>
        prev.map((item) =>
          item.id === subtask.id
            ? {
                ...item,
                is_completed: updatedSubtask.is_done,
              }
            : item
        )
      );
    } catch (error) {
      toast.error('Failed to update subtask.');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await taskService.deleteSubtask(task.id, subtaskId);
      setSubtasks((prev) => prev.filter((item) => item.id !== subtaskId));
      toast.success('Subtask deleted.');
    } catch (error) {
      toast.error('Failed to delete subtask.');
    }
  };

  const handleAddDependency = async () => {
    const dependsOnTaskId = newDependencyTaskId.trim();
    if (!dependsOnTaskId) {
      return;
    }

    setIsSavingDependency(true);
    try {
      const createdDependency = await taskService.createDependency(task.id, {
        depends_on_task_id: dependsOnTaskId,
        dependency_type: 'FS',
      });

      setDependencies((prev) => [
        ...prev,
        {
          id: createdDependency.id,
          task_id: createdDependency.task_id,
          depends_on_task_id: createdDependency.depends_on_task_id,
          dependency_type: createdDependency.dependency_type,
        },
      ]);
      setNewDependencyTaskId('');
      toast.success('Dependency created.');
    } catch (error) {
      toast.error('Failed to create dependency.');
    } finally {
      setIsSavingDependency(false);
    }
  };

  const handleDeleteDependency = async (dependencyId: string) => {
    try {
      await taskService.deleteDependency(dependencyId);
      setDependencies((prev) => prev.filter((item) => item.id !== dependencyId));
      toast.success('Dependency removed.');
    } catch (error) {
      toast.error('Failed to remove dependency.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-3xl bg-white shadow-2xl z-[101] flex flex-col rounded-l-lg">
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
                    {STATUS_CONFIG[currentStatus].label}
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
                            currentStatus === status
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                          onClick={() => {
                            void handleStatusChange(status);
                          }}
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
                  {PRIORITY_CONFIG[currentPriority].label}
                </button>

                {activePopover === 'priority' && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-slate-100 z-50">
                    <div className="p-1 space-y-0.5">
                      {priorityOptions.map((priority) => (
                        <button
                          key={priority}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md",
                            currentPriority === priority
                              ? "bg-indigo-50 text-indigo-700 font-medium"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                          onClick={() => {
                            void handlePriorityChange(priority);
                          }}
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
              <div className="space-y-3">
                {dependencies.length === 0 && (
                  <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    Chưa có dependency nào.
                  </div>
                )}

                {dependencies.map((dependency) => (
                  <div key={dependency.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="p-2 bg-white rounded-md border border-slate-200 shadow-sm text-indigo-600">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        {dependency.dependency_type || 'FS'} dependency
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate mt-0.5">
                        Depends on task: {dependency.depends_on_task_id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDependency(dependency.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa dependency"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newDependencyTaskId}
                    onChange={(event) => setNewDependencyTaskId(event.target.value)}
                    placeholder="Nhập depends_on_task_id"
                    className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    disabled={isSavingDependency || !newDependencyTaskId.trim()}
                    onClick={handleAddDependency}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* SUBTASKS */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-slate-400" /> Công việc con
                </h3>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">{completedSubtaskCount}/{subtasks.length}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
              </div>
              <div className="space-y-2">
                {subtasks.length === 0 && (
                  <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    Chưa có subtask nào.
                  </div>
                )}

                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 group p-2 rounded-md hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={subtask.is_completed}
                      onChange={() => handleToggleSubtask(subtask)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={cn('text-sm', subtask.is_completed ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-700')}>
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      className="opacity-0 group-hover:opacity-100 ml-auto text-slate-300 hover:text-red-500 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-3 mt-2 px-2 py-1.5">
                  <Plus className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(event) => setNewSubtaskTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void handleAddSubtask();
                      }
                    }}
                    placeholder="Thêm công việc con..."
                    className="text-sm text-slate-600 placeholder-slate-400 bg-transparent border-none focus:ring-0 p-0 w-full"
                  />
                  <button
                    type="button"
                    disabled={isSavingSubtask || !newSubtaskTitle.trim()}
                    onClick={() => {
                      void handleAddSubtask();
                    }}
                    className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Add
                  </button>
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
