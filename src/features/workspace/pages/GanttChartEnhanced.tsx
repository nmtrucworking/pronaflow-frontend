/**
 * PRONAFLOW GANTT CHART ENHANCED v2.0
 * Architect: Lead Frontend Engineer
 * Description: High-performance Gantt chart with custom renderers matching the Design System.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Gantt, ViewMode } from 'gantt-task-react';
import type { Task as GanttTask } from 'gantt-task-react';
import "gantt-task-react/dist/index.css"; // Import base styles
import { 
  Plus, Search,
  Maximize2, Minimize2, ChevronRight, ChevronDown,
  Clock, AlertCircle, CheckCircle2, User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
// import { vi } from 'date-fns/locale';

// Components
import { Button, Input } from '@/components/ui';
import { CreateTaskModal } from '@/components/ui/CreateTaskModal';
import { useResponsiveGanttConfig } from '@/hooks/useResponsive';
import { useTheme } from '@/themes/ThemeProvider';
import COLORS from '@/config/colors';
import { GANTT_STATUS_COLORS, GANTT_TASK_PROGRESS_STYLE } from '@/config/domainMappings';
import { MOCK_TASKS as CENTRAL_TASKS } from '@/mocks';
import { useTasks } from '@/features/tasks/hooks/useTaskQueries';
import {
  useApprovePlan,
  useCriticalPath,
  useImpactAnalysis,
  useLockPlan,
  usePlanState,
  useSchedulingGantt,
  useSimulation,
  useSubmitPlan,
  useTaskBaseline,
} from '@/hooks/useSchedulingQueries';
import { useProjectStore } from '@/features/projects/store/projectStore';
import { taskService, type TaskResponse } from '@/services/taskService';

// --- TYPES ---

// Mở rộng type gốc của thư viện để chứa dữ liệu PronaFlow
interface PronaFlowGanttTask extends GanttTask {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignees: Array<{ id: string; name: string; avatar?: string }>;
  source: 'scheduling' | 'task-api' | 'mock';
  isPersisted: boolean;
}

// --- MOCK DATA (Thay thế bằng API call thực tế) ---
const TASK_PROGRESS_STYLE = GANTT_TASK_PROGRESS_STYLE;

const toGanttPriority = (priority: string): PronaFlowGanttTask['priority'] => {
  if (priority === 'URGENT') return 'urgent';
  if (priority === 'HIGH') return 'high';
  if (priority === 'MEDIUM') return 'medium';
  return 'low';
};

const toGanttStatus = (status: string): PronaFlowGanttTask['status'] => {
  if (status === 'DONE') return 'done';
  if (status === 'IN_PROGRESS') return 'in-progress';
  return 'todo';
};

const styleByStatus = (status: PronaFlowGanttTask['status']) => {
  if (status === 'done') return TASK_PROGRESS_STYLE.done;
  if (status === 'in-progress') return TASK_PROGRESS_STYLE.inProgress;
  if (status === 'review') return TASK_PROGRESS_STYLE.review;
  return TASK_PROGRESS_STYLE.todo;
};

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const toIso = (date: Date): string => date.toISOString();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const mapTaskResponseToGanttTask = (task: TaskResponse): PronaFlowGanttTask | null => {
  const end = toDate(task.due_date);
  if (!end) return null;

  const start = toDate(task.created_at) ?? new Date(end);
  if (!toDate(task.created_at)) {
    start.setDate(end.getDate() - 1);
  }

  return {
    start,
    end,
    name: task.title,
    id: task.task_id,
    type: 'task',
    progress: task.progress ?? 0,
    isDisabled: false,
    styles: styleByStatus(toGanttStatus(task.status)),
    priority: toGanttPriority(task.priority),
    status: toGanttStatus(task.status),
    assignees: [],
    source: 'task-api',
    isPersisted: true,
  };
};

const mapSchedulingTaskToGanttTask = (task: Record<string, unknown>): PronaFlowGanttTask | null => {
  const id = String(task.task_id ?? task.id ?? '');
  const title = String(task.title ?? task.name ?? 'Untitled task');
  const end = toDate(task.planned_end ?? task.end_date ?? task.end);

  if (!id || !end) return null;

  const start = toDate(task.planned_start ?? task.start_date ?? task.start) ?? new Date(end);
  if (!(task.planned_start ?? task.start_date ?? task.start)) {
    start.setDate(end.getDate() - 1);
  }

  const status = toGanttStatus(String(task.status ?? 'TO_DO'));
  const priority = toGanttPriority(String(task.priority ?? 'MEDIUM'));

  return {
    start,
    end,
    name: title,
    id,
    type: 'task',
    progress: Number(task.progress ?? 0),
    isDisabled: false,
    styles: styleByStatus(status),
    priority,
    status,
    assignees: [],
    source: 'scheduling',
    isPersisted: true,
  };
};

const MOCK_TASKS: PronaFlowGanttTask[] = CENTRAL_TASKS.slice(0, 8).map((task, index) => {
  const end = new Date(task.planned_end);
  const start = new Date(end);
  start.setDate(end.getDate() - (index % 4) - 2);
  const mappedStatus = toGanttStatus(task.status);

  return {
    start,
    end,
    name: task.title,
    id: task.task_id,
    type: 'task',
    progress: mappedStatus === 'done' ? 100 : mappedStatus === 'in-progress' ? 60 : 0,
    isDisabled: false,
    styles: styleByStatus(mappedStatus),
    priority: toGanttPriority(task.priority),
    status: mappedStatus,
    assignees: task.assignees.map((assignee) => ({
      id: assignee.user_id,
      name: assignee.username,
      avatar: assignee.avatar_url,
    })),
    source: 'mock',
    isPersisted: false,
  };
});

// --- HELPER COMPONENTS ---

const StatusIndicator = ({ status }: { status: string }) => {
  const map = {
    'todo': { color: GANTT_STATUS_COLORS.todo, icon: <Clock className="w-3 h-3" /> },
    'in-progress': { color: GANTT_STATUS_COLORS['in-progress'], icon: <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> },
    'review': { color: GANTT_STATUS_COLORS.review, icon: <AlertCircle className="w-3 h-3" /> },
    'done': { color: GANTT_STATUS_COLORS.done, icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const config = map[status as keyof typeof map] || map.todo;

  return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: config.color }}>
      {config.icon}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const GanttChartEnhanced: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const projectId = useMemo(() => {
    const fromQuery = searchParams.get('project');
    if (fromQuery && fromQuery.trim().length > 0) return fromQuery;
    return selectedProject?.project_id || '';
  }, [searchParams, selectedProject?.project_id]);

  // Global & Theme
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const responsiveConfig = useResponsiveGanttConfig();

  // Local State
  const [tasks, setTasks] = useState<PronaFlowGanttTask[]>(MOCK_TASKS);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = useState(true); // Show list toggle
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeSimulationId, setActiveSimulationId] = useState<string>('');

  const schedulingQuery = useSchedulingGantt(
    projectId
      ? {
          project_id: projectId,
          zoom_level: viewMode === ViewMode.Day ? 'day' : viewMode === ViewMode.Week ? 'week' : 'month',
          include_milestones: true,
          show_baseline: true,
          show_critical_path: false,
        }
      : undefined
  );

  const taskFallbackQuery = useTasks(
    projectId
      ? {
          project_id: projectId,
          page: 1,
          page_size: 100,
          sort_by: 'due_date',
        }
      : undefined
  );

  const writebackMutation = useMutation({
    mutationFn: ({ taskId, start, end }: { taskId: string; start: Date; end: Date }) =>
      taskService.updateTask(taskId, {
        planned_start: toIso(start),
        planned_end: toIso(end),
        due_date: toIso(end),
      }),
  });

  const remoteSchedulingTasks = useMemo(() => {
    const taskItems = schedulingQuery.data?.tasks;
    if (!Array.isArray(taskItems)) return [];

    return taskItems
      .filter(isRecord)
      .map(mapSchedulingTaskToGanttTask)
      .filter((item): item is PronaFlowGanttTask => item !== null);
  }, [schedulingQuery.data?.tasks]);

  const fallbackApiTasks = useMemo(() => {
    const items = taskFallbackQuery.data?.tasks || [];
    return items
      .map(mapTaskResponseToGanttTask)
      .filter((item): item is PronaFlowGanttTask => item !== null);
  }, [taskFallbackQuery.data?.tasks]);

  const resolvedTasks = useMemo(() => {
    if (remoteSchedulingTasks.length > 0) return remoteSchedulingTasks;
    if (fallbackApiTasks.length > 0) return fallbackApiTasks;
    return MOCK_TASKS;
  }, [fallbackApiTasks, remoteSchedulingTasks]);

  const simulation = useSimulation();
  const impactAnalysis = useImpactAnalysis();
  const planStateQuery = usePlanState(projectId || undefined);
  const submitPlan = useSubmitPlan();
  const approvePlan = useApprovePlan();
  const lockPlan = useLockPlan();

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId]
  );

  const criticalPathQuery = useCriticalPath(projectId || undefined);
  const baselineQuery = useTaskBaseline(
    selectedTask && selectedTask.isPersisted && selectedTask.source !== 'mock' ? selectedTask.id : undefined
  );

  const criticalTaskSet = useMemo(
    () => new Set(criticalPathQuery.data?.critical_task_ids || []),
    [criticalPathQuery.data?.critical_task_ids]
  );

  const selectedTaskVarianceDays = useMemo(() => {
    if (!selectedTask || !baselineQuery.data) return null;

    const baselineEnd = new Date(baselineQuery.data.baseline_end).getTime();
    const currentEnd = selectedTask.end.getTime();
    const deltaMs = currentEnd - baselineEnd;
    return Math.round(deltaMs / (1000 * 60 * 60 * 24));
  }, [baselineQuery.data, selectedTask]);

  React.useEffect(() => {
    setTasks(resolvedTasks);
  }, [resolvedTasks]);

  React.useEffect(() => {
    if (!selectedTaskId && resolvedTasks.length > 0) {
      setSelectedTaskId(resolvedTasks[0].id);
    }
  }, [resolvedTasks, selectedTaskId]);

  React.useEffect(() => {
    const startedId = simulation.startSimulation.data?.id;
    if (startedId) {
      setActiveSimulationId(startedId);
    }
  }, [simulation.startSimulation.data?.id]);

  // Colors for Canvas Drawing (Must match Tailwind theme)
  // Vì thư viện vẽ bằng Canvas API nên cần mã HEX cứng, không dùng class Tailwind được
  const themeColors = useMemo(() => ({
    barBackground: isDark ? COLORS.dark.background.secondary : COLORS.ui.background.tertiary,
    barProgress: COLORS.primary[500],
    text: isDark ? COLORS.dark.text.secondary : COLORS.ui.text.secondary,
    gridColor: isDark ? COLORS.dark.border.light : COLORS.ui.border.medium,
    arrowColor: isDark ? COLORS.dark.text.muted : COLORS.ui.text.muted,
    todayColor: isDark ? COLORS.semantic.warning[900] : COLORS.semantic.warning[100],
  }), [isDark]);

  // Handlers
  const handleTaskChange = (task: GanttTask) => {
    const previousTasks = tasks;
    const nextTasks = tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t));
    setTasks(nextTasks);

    const target = nextTasks.find((t) => t.id === task.id);
    if (!target?.isPersisted) return;

    writebackMutation.mutate(
      {
        taskId: target.id,
        start: task.start,
        end: task.end,
      },
      {
        onError: () => {
          setTasks(previousTasks);
        },
      }
    );
  };

  const handleExpanderClick = (task: GanttTask) => {
    setTasks(tasks.map(t => (t.id === task.id ? { ...t, ...task } as PronaFlowGanttTask : t)));
  };

  const handleCreateTask = (newTask: any) => {
    // Adapter để chuyển từ form data sang Gantt Task
    const ganttTask: PronaFlowGanttTask = {
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
      name: newTask.title,
      id: crypto.randomUUID(),
      type: 'task',
      progress: 0,
      isDisabled: false,
      priority: newTask.priority,
      status: 'todo',
      assignees: [], // Mock assignee
      styles: TASK_PROGRESS_STYLE.todo,
      source: 'mock',
      isPersisted: false,
    };
    setTasks([ganttTask, ...tasks]);
    setIsCreateModalOpen(false);
  };

  const handleStartSimulation = useCallback(() => {
    if (!projectId) return;
    simulation.startSimulation.mutate({
      project_id: projectId,
      notes: 'Gantt what-if session',
    });
  }, [projectId, simulation.startSimulation]);

  const handleApplySimulation = useCallback(() => {
    if (!activeSimulationId) return;
    simulation.applySimulation.mutate(activeSimulationId);
    setActiveSimulationId('');
  }, [activeSimulationId, simulation.applySimulation]);

  const handleDiscardSimulation = useCallback(() => {
    if (!activeSimulationId) return;
    simulation.discardSimulation.mutate(activeSimulationId);
    setActiveSimulationId('');
  }, [activeSimulationId, simulation.discardSimulation]);

  const triggerImpactAnalysis = useCallback(() => {
    if (!selectedTask?.isPersisted) return;
    impactAnalysis.mutate(selectedTask.id);
  }, [impactAnalysis, selectedTask]);

  const lastSimulationResult =
    simulation.applySimulation.data ||
    simulation.discardSimulation.data ||
    simulation.startSimulation.data;

  const activePlanState = planStateQuery.data?.state || 'DRAFT';

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  // --- CUSTOM RENDERERS (Core Visual Upgrade) ---

  // 1. Custom Task List Header
  const TaskListHeader = () => {
    return (
      <div className="flex h-full items-center bg-slate-50 dark:bg-slate-800/50 border-b border-r border-slate-200 dark:border-slate-700">
        <div className="flex-1 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Công việc
        </div>
        <div className="w-32 px-4 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 hidden md:block">
          Trạng thái
        </div>
      </div>
    );
  };

  // 2. Custom Task List Table Row
  const TaskListTable = ({ rowHeight, task, fontFamily, fontSize, onExpanderClick }: any) => {
    if (!task) return null;
    const pTask = task as PronaFlowGanttTask;
    
    return (
      <div 
        className="flex items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-r border-slate-200 dark:border-slate-700 group cursor-pointer"
        style={{ height: rowHeight, fontFamily, fontSize }}
      >
        {/* Name Column */}
        <div className="flex-1 px-4 flex items-center min-w-0">
          {/* Expander Arrow */}
          <div 
            className="flex-shrink-0 mr-2 w-6 flex justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            onClick={() => onExpanderClick?.(task)}
          >
             {task?.hideChildren !== undefined ? (
               task?.hideChildren ? <ChevronRight size={16} /> : <ChevronDown size={16} />
             ) : null}
          </div>
          
          <div className="flex flex-col min-w-0">
            <span className="truncate font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {task?.name}
            </span>
            {density === 'comfortable' && (
              <span className="text-[10px] text-slate-400 truncate">
                {task?.start ? format(task.start, 'dd/MM') : '--/--'} - {task?.end ? format(task.end, 'dd/MM') : '--/--'}
              </span>
            )}
          </div>
        </div>

        {/* Status/Priority Column (Hidden on mobile) */}
        <div className="w-32 px-4 border-l border-slate-200 dark:border-slate-700 hidden md:flex items-center gap-2">
            <StatusIndicator status={pTask.status} />
            
            {/* Avatar Stack for Assignees */}
            <div className="flex -space-x-2 overflow-hidden">
                {pTask.assignees.length > 0 ? (
                    pTask.assignees.map((u, i) => (
                        <img 
                            key={i} 
                            src={u.avatar} 
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                            alt={u.name}
                        />
                    ))
                ) : (
                    <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-dashed border-slate-300 flex items-center justify-center">
                         <UserIcon size={10} className="text-slate-400" />
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  // 3. Custom Tooltip
  const TooltipContent = ({ task, fontSize, fontFamily }: { task: GanttTask; fontSize: string; fontFamily: string }) => {
    const pTask = task as PronaFlowGanttTask;
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-[200px] z-50">
        <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{task.name}</div>
        <div className="text-xs text-slate-500 mb-2">
           {format(task.start, 'dd MMM')} - {format(task.end, 'dd MMM')}
        </div>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-medium">Tiến độ</span>
            <span className="text-xs font-bold text-emerald-600">{task.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 dark:bg-slate-700">
          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
        </div>
      </div>
    );
  };

  // Adapters for type compatibility
  const convertToModalTasks = (tasks: PronaFlowGanttTask[]): any[] => {
    return tasks.map(task => ({
      ...task,
      priority: task.priority === 'urgent' ? 'URGENT' : 
                task.priority === 'high' ? 'HIGH' : 
                task.priority === 'medium' ? 'NORMAL' : 'LOW'
    }));
  };

  return (
    <div className="token-page-shell flex flex-col h-full w-full overflow-hidden">
      
      {/* 1. Top Toolbar - "The Control Center" */}
      <header className="token-page-header flex flex-col gap-4 px-6 py-4 z-10 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Timeline</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý tiến độ dự án trực quan</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {projectId
                ? remoteSchedulingTasks.length > 0
                  ? 'Nguồn dữ liệu: Module 5 Scheduling API'
                  : fallbackApiTasks.length > 0
                    ? 'Nguồn dữ liệu: Task API (fallback do Scheduling API chưa trả task)'
                    : 'Nguồn dữ liệu: Mock (chưa có dữ liệu từ API)'
                : 'Chưa chọn project. Có thể thêm query ?project={project_id} để bật API mode.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             {/* Create Task Button */}
             <Button
                onClick={() => setIsCreateModalOpen(true)}
               className="flex items-center gap-2"
             >
                <Plus size={18} />
                <span className="hidden sm:inline">Thêm Task</span>
             </Button>
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="w-full sm:w-64">
              <Input
                type="text"
                placeholder="Tìm kiếm công việc..."
                leftIcon={<Search size={16} />}
                className="bg-slate-100 dark:bg-slate-800 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="token-toolbar-group flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar p-1">
                {/* View Mode Toggle */}
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    {[ViewMode.Day, ViewMode.Week, ViewMode.Month].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                viewMode === mode 
                                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                        >
                            {mode === ViewMode.Day ? 'Ngày' : mode === ViewMode.Week ? 'Tuần' : 'Tháng'}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Density Toggle */}
                <button 
                    onClick={() => setDensity(d => d === 'comfortable' ? 'compact' : 'comfortable')}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                    title="Đổi mật độ hiển thị"
                >
                    {density === 'comfortable' ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>

                {/* List Toggle */}
                <button 
                    onClick={() => setIsChecked(!isChecked)}
                    className={`p-2 rounded-md transition-colors ${isChecked ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    title="Hiện/Ẩn danh sách"
                >
                    <LayoutIcon size={18} />
                </button>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Simulation: FE wired
          </span>
          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Impact analysis: FE wired
          </span>
          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Resource leveling: beta
          </span>
          <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Critical path: {criticalPathQuery.data?.critical_task_ids?.length ?? 0} task
          </span>
          {criticalPathQuery.data?.updated_at && (
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              CPM updated: {format(new Date(criticalPathQuery.data.updated_at), 'dd/MM HH:mm')}
            </span>
          )}
        </div>

        {selectedTask && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Selected: {selectedTask.name}</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Source: {selectedTask.source}
            </span>
            <span className={`px-2 py-1 rounded-full ${criticalTaskSet.has(selectedTask.id) ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
              {criticalTaskSet.has(selectedTask.id) ? 'Critical path task' : 'Non-critical task'}
            </span>
            <span className="text-slate-500 dark:text-slate-400">Baseline:</span>
            {baselineQuery.isLoading ? (
              <span className="text-slate-500 dark:text-slate-400">Loading...</span>
            ) : baselineQuery.data ? (
              <>
                <span className="text-slate-700 dark:text-slate-200">
                  v{baselineQuery.data.baseline_version}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {format(new Date(baselineQuery.data.baseline_start), 'dd/MM')} - {format(new Date(baselineQuery.data.baseline_end), 'dd/MM')}
                </span>
                <span className={`px-2 py-1 rounded-full ${selectedTaskVarianceDays === null || selectedTaskVarianceDays <= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                  Variance: {selectedTaskVarianceDays ?? 0}d
                </span>
              </>
            ) : (
              <span className="text-amber-700 dark:text-amber-300">No baseline available</span>
            )}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Plan Governance</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              State: {activePlanState}
            </span>
            {planStateQuery.isLoading && (
              <span className="text-blue-600 dark:text-blue-300">Loading state...</span>
            )}
            {planStateQuery.isError && (
              <span className="text-rose-600 dark:text-rose-300">Cannot load plan state.</span>
            )}
            <button
              onClick={() => projectId && submitPlan.mutate(projectId)}
              disabled={!projectId || activePlanState !== 'DRAFT' || submitPlan.isPending}
              className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50"
            >
              Submit
            </button>
            <button
              onClick={() => projectId && approvePlan.mutate({ projectId, notes: 'Approved from Gantt FE panel' })}
              disabled={!projectId || activePlanState !== 'SUBMITTED' || approvePlan.isPending}
              className="px-2 py-1 rounded-md bg-emerald-600 text-white disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => projectId && lockPlan.mutate(projectId)}
              disabled={!projectId || activePlanState !== 'APPROVED' || lockPlan.isPending}
              className="px-2 py-1 rounded-md bg-slate-700 text-white disabled:opacity-50"
            >
              Lock
            </button>
            {(submitPlan.isError || approvePlan.isError || lockPlan.isError) && (
              <span className="text-rose-600 dark:text-rose-300">Governance action failed. Please retry.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Simulation</span>
            <button
              onClick={handleStartSimulation}
              disabled={!projectId || simulation.startSimulation.isPending || !!activeSimulationId}
              className="px-2 py-1 rounded-md bg-blue-600 text-white disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={handleApplySimulation}
              disabled={!activeSimulationId || simulation.applySimulation.isPending}
              className="px-2 py-1 rounded-md bg-emerald-600 text-white disabled:opacity-50"
            >
              Apply
            </button>
            <button
              onClick={handleDiscardSimulation}
              disabled={!activeSimulationId || simulation.discardSimulation.isPending}
              className="px-2 py-1 rounded-md bg-rose-600 text-white disabled:opacity-50"
            >
              Discard
            </button>
            <span className="text-slate-500 dark:text-slate-400">
              {activeSimulationId ? `Active session: ${activeSimulationId.slice(0, 8)}...` : 'No active session'}
            </span>
          </div>

          {(simulation.startSimulation.isPending || simulation.applySimulation.isPending || simulation.discardSimulation.isPending) && (
            <p className="text-blue-600 dark:text-blue-300 mb-2">Simulation action in progress...</p>
          )}

          {(simulation.startSimulation.isError || simulation.applySimulation.isError || simulation.discardSimulation.isError) && (
            <p className="text-rose-600 dark:text-rose-300 mb-2">Simulation action failed. Check backend availability.</p>
          )}

          {lastSimulationResult && (
            <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-300">
              <span>Delta end: {lastSimulationResult.delta_project_end_days ?? 0}d</span>
              <span>CP changes: {lastSimulationResult.new_critical_path_count ?? 0}</span>
              <span>SLA risk: {lastSimulationResult.sla_at_risk_count ?? 0}</span>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Impact Analysis</span>
              <button
                onClick={triggerImpactAnalysis}
                disabled={!selectedTask?.isPersisted || impactAnalysis.isPending}
                className="px-2 py-1 rounded-md bg-indigo-600 text-white disabled:opacity-50"
              >
                Analyze Selected Task
              </button>
            </div>

            {impactAnalysis.isPending && (
              <p className="text-blue-600 dark:text-blue-300 mb-1">Analyzing impact...</p>
            )}

            {impactAnalysis.isError && (
              <p className="text-rose-600 dark:text-rose-300 mb-1">Impact analysis failed. Endpoint may still be placeholder.</p>
            )}

            {impactAnalysis.data ? (
              <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-300">
                <span>Project delta: {impactAnalysis.data.delta_project_end_days}d</span>
                <span>Affected: {impactAnalysis.data.affected_task_ids.length}</span>
                <span>New CP count: {impactAnalysis.data.new_critical_path_count}</span>
                <span>SLA risk: {impactAnalysis.data.sla_at_risk_count}</span>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                Chon mot task persisted va bam Analyze de xem tac dong truoc khi luu.
              </p>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Chart Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
            <Gantt
                tasks={filteredTasks}
                viewMode={viewMode}
                onDateChange={handleTaskChange}
                onProgressChange={handleTaskChange}
                onDoubleClick={(task) => setSelectedTaskId(task.id)}
                onExpanderClick={handleExpanderClick}
                
                // Style Customization via Props
                listCellWidth={isChecked ? (density === 'compact' ? "250px" : "350px") : ""}
                columnWidth={viewMode === ViewMode.Month ? 300 : viewMode === ViewMode.Week ? 200 : 65}
                rowHeight={density === 'compact' ? 40 : 60}
                
                // Custom Renderers
                TaskListHeader={TaskListHeader}
                TaskListTable={TaskListTable}
                TooltipContent={TooltipContent}
            />
            
            {/* Empty State Overlay */}
            {filteredTasks.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 z-20 backdrop-blur-sm">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Không tìm thấy công việc nào</p>
                    <p className="text-sm text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
            )}

            {writebackMutation.isPending && (
              <div className="absolute right-4 bottom-4 z-30 rounded-lg bg-slate-900 text-white text-xs px-3 py-2 shadow-lg">
                Đang lưu thay đổi timeline...
              </div>
            )}
        </div>
      </main>

      {/* Create Task Modal Integration */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        existingTasks={convertToModalTasks(tasks)}
      />
    </div>
  );
};

// Helper Icon for layout toggle
const LayoutIcon = ({ size, className }: {size?: number, className?: string}) => (
    <svg 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
);

export default GanttChartEnhanced;