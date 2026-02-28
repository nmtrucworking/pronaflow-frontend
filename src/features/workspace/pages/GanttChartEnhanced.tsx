/**
 * PRONAFLOW GANTT CHART ENHANCED v2.0
 * Architect: Lead Frontend Engineer
 * Description: High-performance Gantt chart with custom renderers matching the Design System.
 */

import React, { useState, useMemo, useCallback } from 'react';
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

// --- TYPES ---

// Mở rộng type gốc của thư viện để chứa dữ liệu PronaFlow
interface PronaFlowGanttTask extends GanttTask {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignees: Array<{ id: string; name: string; avatar?: string }>;
}

// --- MOCK DATA (Thay thế bằng API call thực tế) ---
const MOCK_TASKS: PronaFlowGanttTask[] = [
  {
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 15),
    name: 'Phát triển Backend Core',
    id: 't1',
    type: 'project',
    progress: 45,
    isDisabled: false,
    styles: { progressColor: '#10b981', progressSelectedColor: '#059669' },
    priority: 'high',
    status: 'in-progress',
    assignees: [],
    hideChildren: false
  },
  {
    start: new Date(2024, 0, 2),
    end: new Date(2024, 0, 5),
    name: 'Thiết kế Database Schema',
    id: 't2',
    type: 'task',
    project: 't1',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#3b82f6', progressSelectedColor: '#2563eb' },
    priority: 'urgent',
    status: 'done',
    assignees: [{ id: 'u1', name: 'Nguyễn Văn A', avatar: '/defaults/avatars/avatar-1.png' }]
  },
  {
    start: new Date(2024, 0, 6),
    end: new Date(2024, 0, 10),
    name: 'API Authentication',
    id: 't3',
    type: 'task',
    project: 't1',
    progress: 20,
    isDisabled: false,
    styles: { progressColor: '#f59e0b', progressSelectedColor: '#d97706' },
    priority: 'medium',
    status: 'review',
    assignees: [{ id: 'u2', name: 'Trần Thị B', avatar: '/defaults/avatars/avatar-2.png' }]
  },
    {
    start: new Date(2024, 0, 8),
    end: new Date(2024, 0, 12),
    name: 'Integration Testing',
    id: 't4',
    type: 'task',
    project: 't1',
    progress: 0,
    isDisabled: false,
    styles: { progressColor: '#64748b', progressSelectedColor: '#475569' },
    priority: 'low',
    status: 'todo',
    assignees: []
  },
];

// --- HELPER COMPONENTS ---

const StatusIndicator = ({ status }: { status: string }) => {
  const map = {
    'todo': { color: 'bg-slate-400', icon: <Clock className="w-3 h-3" /> },
    'in-progress': { color: 'bg-blue-500', icon: <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> },
    'review': { color: 'bg-yellow-500', icon: <AlertCircle className="w-3 h-3" /> },
    'done': { color: 'bg-emerald-500', icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const config = map[status as keyof typeof map] || map.todo;

  return (
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${config.color} text-white shadow-sm`}>
      {config.icon}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const GanttChartEnhanced: React.FC = () => {
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

  // Colors for Canvas Drawing (Must match Tailwind theme)
  // Vì thư viện vẽ bằng Canvas API nên cần mã HEX cứng, không dùng class Tailwind được
  const themeColors = useMemo(() => ({
    barBackground: isDark ? '#1e293b' : '#f1f5f9', // slate-800 : slate-100
    barProgress: '#10b981', // emerald-500
    text: isDark ? '#e2e8f0' : '#334155', // slate-200 : slate-700
    gridColor: isDark ? '#334155' : '#e2e8f0', // slate-700 : slate-200
    arrowColor: isDark ? '#94a3b8' : '#64748b',
    todayColor: isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(252, 211, 77, 0.1)', // yellow with opacity
  }), [isDark]);

  // Handlers
  const handleTaskChange = (task: GanttTask) => {
    console.log("On date changeId:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? { ...t, ...task } : t));
    setTasks(newTasks);
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
      styles: { progressColor: '#64748b', progressSelectedColor: '#475569' }
    };
    setTasks([ganttTask, ...tasks]);
    setIsCreateModalOpen(false);
  };

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
      </header>

      {/* 2. Main Chart Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
            <Gantt
                tasks={filteredTasks}
                viewMode={viewMode}
                onDateChange={handleTaskChange}
                onProgressChange={handleTaskChange}
                onDoubleClick={(task) => alert(`Edit task: ${task.name}`)}
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