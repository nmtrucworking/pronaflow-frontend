import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Gantt, ViewMode } from 'gantt-task-react';
import type { Task as GanttTask } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import * as Tabs from '@radix-ui/react-tabs';
import { 
  Calendar as CalendarIcon, 
  LayoutList, 
  Plus, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Settings2
} from 'lucide-react';
import COLORS from '@/config/colors';
import { CALENDAR_PRIORITY_COLORS } from '@/config/domainMappings';

/**
 * PRONAFLOW CALENDAR & GANTT MODULE
 * Sử dụng thư viện chuyên dụng để tối ưu hiệu năng render và tương tác kéo thả.
 */

interface TaskEntity {
  task_id: string;
  project_id: string;
  title: string;
  planned_start: string;
  planned_end: string;
  progress: number;
  priority_id: 'urgent' | 'high' | 'medium' | 'low';
  status_id: 'todo' | 'in_progress' | 'review' | 'done';
}

const CalendarGanttPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'calendar' | 'gantt'>('calendar');
  const [ganttMode, setGanttMode] = useState<ViewMode>(ViewMode.Day);

  // Giả lập dữ liệu từ Workspace (Tham chiếu Task.md)
  const tasks: TaskEntity[] = [
    {
      task_id: 'TASK-001',
      project_id: 'PROJ-ALPHA',
      title: 'Thiết kế hệ thống Database Core',
      planned_start: '2025-05-01',
      planned_end: '2025-05-07',
      progress: 60,
      priority_id: 'urgent',
      status_id: 'in_progress'
    },
    {
      task_id: 'TASK-002',
      project_id: 'PROJ-ALPHA',
      title: 'Phát triển API Gateway',
      planned_start: '2025-05-05',
      planned_end: '2025-05-15',
      progress: 20,
      priority_id: 'high',
      status_id: 'todo'
    },
    {
      task_id: 'TASK-003',
      project_id: 'PROJ-BETA',
      title: 'Kiểm thử bảo mật (Pentest)',
      planned_start: '2025-05-12',
      planned_end: '2025-05-20',
      progress: 0,
      priority_id: 'medium',
      status_id: 'todo'
    }
  ];

  // Mapping dữ liệu cho FullCalendar
  const calendarEvents = useMemo(() => tasks.map(t => ({
    id: t.task_id,
    title: t.title,
    start: t.planned_start,
    end: t.planned_end,
    backgroundColor: CALENDAR_PRIORITY_COLORS[t.priority_id],
    borderColor: 'transparent',
    extendedProps: { ...t }
  })), [tasks]);

  // Mapping dữ liệu cho Gantt-task-react
  const ganttTasks: GanttTask[] = useMemo(() => tasks.map(t => ({
    start: new Date(t.planned_start),
    end: new Date(t.planned_end),
    name: t.title,
    id: t.task_id,
    type: 'task',
    progress: t.progress,
    isDisabled: false,
    styles: { 
      progressColor: CALENDAR_PRIORITY_COLORS[t.priority_id], 
      progressSelectedColor: COLORS.semantic.info[600]
    }
  })), [tasks]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      {/* 1. Workspace Toolbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white"> Temporal Hub </h1>
            <p className="text-xs text-slate-500"> Workspace: PronaFlow Dev </p>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <CalendarIcon size={16} /> Lịch
            </button>
            <button 
              onClick={() => setCurrentView('gantt')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'gantt' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutList size={16} /> Gantt
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Lọc task..." 
              className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 ring-blue-500/20 w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            <Plus size={18} /> Tạo Lộ Trình
          </button>
        </div>
      </header>

      {/* 2. Main Viewport Container */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'calendar' ? (
          <div className="h-full p-6 calendar-wrapper bg-white dark:bg-slate-950">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              editable={true}
              selectable={true}
              height="100%"
              eventBorderColor="transparent"
              eventTextColor={COLORS.ui.text.inverse}
              // Custom Styles Override
              themeSystem="standard"
              eventClick={(info) => console.log('Task Detail:', info.event.id)}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            {/* Gantt Specific Toolbar */}
            <div className="px-6 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1">
                 {(['Day', 'Week', 'Month'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setGanttMode(ViewMode[mode])}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        ganttMode === ViewMode[mode] ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {mode}
                    </button>
                 ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                <Settings2 size={12} /> Cấu hình Timeline
              </div>
            </div>

            <div className="flex-1 overflow-auto gantt-container">
              <Gantt
                tasks={ganttTasks}
                viewMode={ganttMode}
                listCellWidth="220px"
                columnWidth={ganttMode === ViewMode.Day ? 65 : 100}
                headerHeight={60}
                rowHeight={50}
                barCornerRadius={8}
                fontSize="var(--font-size-xs)"
                onDateChange={(task) => console.log('Update date:', task)}
                onProgressChange={(task) => console.log('Update progress:', task)}
              />
            </div>
          </div>
        )}
      </main>

      {/* 3. Style Overrides for Libraries */}
      <style>{`
        /* FullCalendar Tailwind Integration */
        .fc { font-family: inherit; }
        .fc .fc-toolbar-title { font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text-primary); }
        .dark .fc .fc-toolbar-title { color: var(--color-text-primary); }
        .fc .fc-button-primary { background: var(--color-primary-600); border: none; font-weight: 600; text-transform: capitalize; border-radius: 8px; }
        .fc .fc-button-primary:hover { background: var(--color-primary-700); }
        .fc .fc-button-active { background: var(--color-primary-800) !important; }
        .fc td, .fc th { border-color: var(--color-border-medium) !important; }
        .dark .fc td, .dark .fc th { border-color: var(--color-border-light) !important; }
        .fc-event { padding: 2px 4px; box-shadow: 0 2px 4px var(--color-shadow-md); }
        
        /* Gantt Customization */
        .gantt-container ._3_yLp { color: var(--color-text-muted); font-weight: 700; } /* Task name label */
        .dark .gantt-container { background: var(--color-bg-primary); }
        .dark .gantt-container line { stroke: var(--color-border-light); }
        .dark .gantt-container text { fill: var(--color-text-muted); }
      `}</style>
    </div>
  );
};

export default CalendarGanttPage;