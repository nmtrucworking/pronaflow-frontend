import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpCircle,
  ArrowUpDown,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  CheckCircle2,
  FilePlus,
  Filter,
  FolderPlus,
  Kanban as KanbanIcon,
  LayoutList,
  Plus,
  Search,
  Upload
} from 'lucide-react';
import { cn } from '../utils';
import { MOCK_TASKS, STATUS_CONFIG } from '../constants';
import { SortOption, TaskEntity, TaskStatus, ViewMode } from '../types';
import { CsvImportModal } from '../components/CsvImportModal';
import { Popover } from '../components/Popover';
import { TaskDetailPanel } from '../components/TaskDetailPanel';
import { TaskGroupSection } from '../components/TaskGroupSection';
import { TaskKanbanCard } from '../components/TaskKanbanCard';
import { TaskListRow } from '../components/TaskListRow';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('DUE_DATE_ASC');
  const [selectedTask, setSelectedTask] = useState<TaskEntity | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({ OVERDUE: false, TODAY: false, UPCOMING: false, DONE: true });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleSection = (section: string) => setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));

  // Filtering Logic
  const filteredTasks = useMemo(() => {
    let tasks = MOCK_TASKS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortOption === 'DUE_DATE_ASC') tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    else if (sortOption === 'PRIORITY_DESC') { const pMap = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }; tasks.sort((a, b) => pMap[b.priority] - pMap[a.priority]); }
    else if (sortOption === 'TITLE_ASC') tasks.sort((a, b) => a.title.localeCompare(b.title));
    return tasks;
  }, [searchQuery, sortOption]);

  const groupedTasks = useMemo(() => {
    const today = new Date().toDateString();
    return {
      overdue: filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'DONE'),
      today: filteredTasks.filter(t => new Date(t.dueDate).toDateString() === today && t.status !== 'DONE'),
      upcoming: filteredTasks.filter(t => new Date(t.dueDate) > new Date() && t.status !== 'DONE'),
      done: filteredTasks.filter(t => t.status === 'DONE')
    };
  }, [filteredTasks]);

  const kanbanColumns = {
    NOT_STARTED: filteredTasks.filter(t => t.status === 'NOT_STARTED'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: filteredTasks.filter(t => t.status === 'IN_REVIEW'),
    DONE: filteredTasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="px-6 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">Công việc của tôi <span className="text-sm font-normal text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full mt-1 shadow-sm">{filteredTasks.length}</span></h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2"><span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5"/> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span>{groupedTasks.overdue.length > 0 ? <span className="font-semibold text-red-600 flex items-center gap-1 animate-pulse"><AlertCircle className="w-3.5 h-3.5"/> {groupedTasks.overdue.length} task quá hạn</span> : <span className="text-emerald-600 font-medium">Tất cả đều đúng tiến độ</span>}</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Tìm kiếm nhanh..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white w-full md:w-56 transition-all shadow-sm hover:shadow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            {/* Filter Popover */}
            <Popover 
              isOpen={isFilterOpen} setIsOpen={setIsFilterOpen}
              trigger={<button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all active:scale-95 text-sm font-medium"><Filter className="w-4 h-4" /><span className="hidden sm:inline">Lọc & Sắp xếp</span></button>}
              content={
                <div className="w-64 p-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sắp xếp theo</div>
                  <button onClick={() => setSortOption('DUE_DATE_ASC')} className={cn("w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors", sortOption === 'DUE_DATE_ASC' ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700 hover:bg-slate-100")}><span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4"/> Ngày đến hạn (Tăng dần)</span>{sortOption === 'DUE_DATE_ASC' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setSortOption('PRIORITY_DESC')} className={cn("w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors", sortOption === 'PRIORITY_DESC' ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700 hover:bg-slate-100")}><span className="flex items-center gap-2"><ArrowUpCircle className="w-4 h-4"/> Độ ưu tiên (Cao nhất)</span>{sortOption === 'PRIORITY_DESC' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setSortOption('TITLE_ASC')} className={cn("w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors", sortOption === 'TITLE_ASC' ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700 hover:bg-slate-100")}><span className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4"/> Tiêu đề (A-Z)</span>{sortOption === 'TITLE_ASC' && <Check className="w-4 h-4" />}</button>
                </div>
              }
            />

            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 shadow-inner">
              <button onClick={() => setViewMode('LIST')} className={cn("p-1.5 rounded-md transition-all ease-out active:scale-95", viewMode === 'LIST' ? "bg-white shadow-sm text-indigo-600 ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700")}><LayoutList className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('KANBAN')} className={cn("p-1.5 rounded-md transition-all ease-out active:scale-95", viewMode === 'KANBAN' ? "bg-white shadow-sm text-indigo-600 ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700")}><KanbanIcon className="w-4 h-4" /></button>
            </div>
            
            {/* Create Popover */}
            <Popover 
              isOpen={isCreateOpen} setIsOpen={setIsCreateOpen}
              trigger={<button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 font-medium text-sm"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Tạo mới</span></button>}
              content={
                <div className="w-56 p-1.5">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Khởi tạo</div>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"><div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-200 transition-colors"><FilePlus className="w-4 h-4" /></div><div className="text-left"><div className="font-medium">Công việc mới</div><div className="text-[10px] text-slate-500 font-normal">Tạo task và gán người</div></div></button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group mt-1"><div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md group-hover:bg-emerald-200 transition-colors"><FolderPlus className="w-4 h-4" /></div><div className="text-left"><div className="font-medium">Dự án mới</div><div className="text-[10px] text-slate-500 font-normal">Tạo không gian làm việc</div></div></button>
                  <div className="h-px bg-slate-100 my-1.5"></div>
                  <button onClick={() => { setIsCreateOpen(false); setIsCsvModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors group"><Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /><span>Nhập dữ liệu (CSV)</span></button>
                </div>
              }
            />
          </div>
        </div>
      </header>

      {/* CONTENT AREA - SPLIT SCROLL LOGIC */}
      <main className={cn(
        "flex-1 flex flex-col relative", 
        viewMode === 'LIST' ? "overflow-y-auto" : "overflow-hidden"
      )}>
        
        {viewMode === 'LIST' && (
          <div className="flex-1 w-full max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {groupedTasks.overdue.length > 0 && <TaskGroupSection title="Quá hạn" icon={AlertCircle} count={groupedTasks.overdue.length} headerColorClass="text-red-600" borderColorClass="from-red-200 to-transparent" isCollapsed={collapsedSections.OVERDUE} onToggle={() => toggleSection('OVERDUE')}>{groupedTasks.overdue.map(task => <TaskListRow key={task.id} task={task} onViewDetails={() => setSelectedTask(task)} />)}</TaskGroupSection>}
            <TaskGroupSection title="Hôm nay" icon={CalendarIcon} count={groupedTasks.today.length} headerColorClass="text-indigo-600" borderColorClass="from-indigo-200 to-transparent" isCollapsed={collapsedSections.TODAY} onToggle={() => toggleSection('TODAY')}>{groupedTasks.today.length > 0 ? groupedTasks.today.map(task => <TaskListRow key={task.id} task={task} onViewDetails={() => setSelectedTask(task)}/>) : <div className="p-8 text-center text-slate-400 italic text-sm bg-slate-50/50">Không có công việc nào cần làm hôm nay.</div>}</TaskGroupSection>
            <TaskGroupSection title="Sắp tới" icon={ArrowRight} count={groupedTasks.upcoming.length} headerColorClass="text-slate-500" borderColorClass="from-slate-200 to-transparent" isCollapsed={collapsedSections.UPCOMING} onToggle={() => toggleSection('UPCOMING')} className="opacity-90 hover:opacity-100">{groupedTasks.upcoming.map(task => <TaskListRow key={task.id} task={task} onViewDetails={() => setSelectedTask(task)}/>)}</TaskGroupSection>
            <TaskGroupSection title="Đã hoàn thành" icon={CheckCircle2} count={groupedTasks.done.length} headerColorClass="text-slate-400 line-through decoration-slate-300" borderColorClass="from-slate-200 to-transparent" isCollapsed={collapsedSections.DONE} onToggle={() => toggleSection('DONE')}>{groupedTasks.done.map(task => <TaskListRow key={task.id} task={task} onViewDetails={() => setSelectedTask(task)}/>)}</TaskGroupSection>
          </div>
        )}

        {/* KANBAN VIEW - HORIZONTAL SCROLL ONLY */}
        {viewMode === 'KANBAN' && (
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
            <div className="h-full flex gap-6 min-w-max">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const tasks = kanbanColumns[key as TaskStatus];
                return (
                  <div key={key} className="flex-shrink-0 w-80 flex flex-col h-full group/column">
                    <div className={cn("flex items-center justify-between mb-3 px-3 py-2.5 rounded-xl border transition-colors duration-300 flex-shrink-0", config.bg, `border-${config.color.split('-')[1]}-200`)}><div className="flex items-center gap-2 font-bold text-sm text-slate-700"><config.icon className={cn("w-4 h-4", config.color)} />{config.label}</div><span className="bg-white/60 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">{tasks.length}</span></div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-1 pb-4">{tasks.map(task => <TaskKanbanCard key={task.id} task={task} onViewDetails={() => setSelectedTask(task)}/>)}<button className="w-full py-2.5 mt-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 opacity-0 group-hover/column:opacity-100"><Plus className="w-4 h-4" /> Thêm nhanh</button></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      <CsvImportModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} onImportSuccess={(count) => { console.log(`Imported ${count}`); setIsCsvModalOpen(false); }} />
    </div>
  );
}
