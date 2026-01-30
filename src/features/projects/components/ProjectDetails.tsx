import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    ArrowLeft,
    Layout,
    List,
    FileText,
    Settings,
    Users,
    Zap,
    Layers,
    Target,
    BarChart2,
    TrendingUp,
    AlertTriangle,
    Flag,
    ChevronRight,
    PlayCircle,
    Kanban as KanbanIcon,
    ArrowRight,
    Plus,
    Tag,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Save,
    UserPlus,
    ShieldAlert,
    File as FileIcon,
    FileEdit,
    Bug,
    Bookmark,
    CheckSquare,
    Circle,
    Folder,
    Download,
    Image as ImageIcon,
    FileSpreadsheet,
    CalendarRange,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Bell,
    Sliders,
    Lock,
    ToggleLeft,
    ToggleRight,
    Edit,
    Copy,
    Share2,
    Eye,
    ArrowUpDown,
    History,
    Briefcase,
    PieChart,
    ChevronDown,
    Check,
    Activity,
    UserCheck,
    ShieldCheck,
    ZapOff,
    Mail,
    Cpu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import Mock Data 
import {
    MOCK_PROJECTS,
    MOCK_FILES,
    MOCK_MEMBERS,
    MOCK_NOTES
} from '../../../mocks/projects';
import { MOCK_TASKS } from '../../../mocks/task'; // added

import { PRIORITY_CONFIG, PROJECT_STATUS_CONFIG } from '../utils/config';

// Import Interfaces 
import type { Project, FileType, ProjectPriority, ProjectType, ProjectStatus } from '../../../types/project';
import type { Task, TaskType, TaskStatus, TaskPriority } from '../../../types/task';
import type { Member } from '../../../types/member';
import type { Note } from '../../../types/note';
// import type { Task as GanttTask } from '../../../types/task';

// --- 1. UTILITIES & HOOKS ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler();
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}



// --- 4. BASE UI COMPONENTS ---

function Popover({
    trigger,
    content,
    isOpen,
    setIsOpen,
    align = 'end',
    width = 'w-48'
}: {
    trigger: React.ReactNode;
    content: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    align?: 'start' | 'end';
    width?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => setIsOpen(false));

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>{trigger}</div>
            {isOpen && (
                <div className={cn(
                    "absolute top-full mt-2 z-[60] bg-white rounded-xl border border-slate-200 shadow-xl p-1 animate-in fade-in zoom-in-95 duration-150 origin-top",
                    width,
                    align === 'end' ? 'right-0' : 'left-0'
                )}>
                    {content}
                </div>
            )}
        </div>
    );
}

function ProjectTags({ tags }: { tags: string[] }) {
    return (
        <div className="flex flex-wrap items-center gap-2 mt-3">
            {tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                    <Tag className="w-3 h-3 mr-1 text-slate-400" />
                    {tag}
                </span>
            ))}
            <button className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-400 border border-dashed border-slate-300 hover:text-indigo-600 hover:border-indigo-300 transition-colors">
                <Plus className="w-3 h-3 mr-1" /> Thêm thẻ
            </button>
        </div>
    );
}

function PriorityBadge({ priority }: { priority: ProjectPriority }) {
    return (
        <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide", PRIORITY_CONFIG[priority].bg, PRIORITY_CONFIG[priority].color)}>
            {PRIORITY_CONFIG[priority].label}
        </span>
    );
}

function TaskTypeIcon({ type }: { type: TaskType }) {
    switch (type) {
        case 'STORY': return <Bookmark className="w-4 h-4 text-green-600 fill-green-100" />;
        case 'BUG': return <Bug className="w-4 h-4 text-red-600" />;
        case 'TASK': default: return <CheckSquare className="w-4 h-4 text-blue-600" />;
    }
}

function FileTypeIcon({ type }: { type: FileType }) {
    switch (type) {
        case 'PDF': return <FileIcon className="w-8 h-8 text-red-500" />;
        case 'DOC': return <FileText className="w-8 h-8 text-blue-500" />;
        case 'XLS': return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
        case 'IMG': return <ImageIcon className="w-8 h-8 text-purple-500" />;
        default: return <FileIcon className="w-8 h-8 text-slate-400" />;
    }
}

function StatCard({ label, value, subtext, icon: Icon, trend, colorClass }: any) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
                <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded flex items-center", trend > 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50")}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{label}</div>
            {subtext && <div className="text-xs text-slate-400 mt-2">{subtext}</div>}
        </div>
    );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean, onChange?: () => void }) {
    return (
        <button onClick={onChange} className={cn("transition-colors duration-200 focus:outline-none", checked ? "text-indigo-600" : "text-slate-300")}>
            {checked ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
        </button>
    );
}

// --- 5. POPOVER MENUS ---

function TaskActionsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            trigger={<button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>}
            content={
                <div className="flex flex-col">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left rounded-md"><Edit className="w-3.5 h-3.5" /> Chỉnh sửa</button>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left rounded-md"><Copy className="w-3.5 h-3.5" /> Nhân bản</button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left rounded-md"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                </div>
            }
        />
    );
}

function ProjectStatusPopover({ currentStatus }: { currentStatus: ProjectStatus }) {
    const [isOpen, setIsOpen] = useState(false);
    const statuses: ProjectStatus[] = ['ON_HOLD', 'NOT_STARTED', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    return (
        <Popover
            isOpen={isOpen} setIsOpen={setIsOpen} align="start" width="w-56"
            trigger={
                <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors group">
                    <div className={cn("w-2 h-2 rounded-full", PROJECT_STATUS_CONFIG[currentStatus].color)}></div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{PROJECT_STATUS_CONFIG[currentStatus].label}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
                </button>
            }
            content={
                <div className="py-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuyển trạng thái</div>
                    {statuses.map(s => (
                        <button key={s} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <div className={cn("w-2 h-2 rounded-full", PROJECT_STATUS_CONFIG[s].color)}></div>
                            {PROJECT_STATUS_CONFIG[s].label}
                            {s === currentStatus && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600" />}
                        </button>
                    ))}
                </div>
            }
        />
    )
}

function ProjectPriorityPopover({ currentPriority }: { currentPriority: ProjectPriority }) {
    const [isOpen, setIsOpen] = useState(false);
    const priorities: ProjectPriority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return (
        <Popover
            isOpen={isOpen} setIsOpen={setIsOpen} width="w-48"
            trigger={
                <button className={cn("inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border transition-all hover:brightness-95", PRIORITY_CONFIG[currentPriority].bg, PRIORITY_CONFIG[currentPriority].color, "border-transparent")}>
                    {PRIORITY_CONFIG[currentPriority].label}
                </button>
            }
            content={
                <div className="py-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Độ ưu tiên</div>
                    {priorities.map(p => (
                        <button key={p} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <Flag className={cn("w-4 h-4", PRIORITY_CONFIG[p].color)} />
                            {PRIORITY_CONFIG[p].label}
                            {p === currentPriority && <Check className="w-3.5 h-3.5 ml-auto text-indigo-600" />}
                        </button>
                    ))}
                </div>
            }
        />
    )
}

// --- 6. SUB-VIEW COMPONENTS ---

function ProjectOverview({ project }: { project: Project }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Hoàn thành dự án" value={`${project.progress}%`} subtext="Tổng thể tiến độ" icon={Target} trend={12} colorClass="bg-indigo-100 text-indigo-600" />
                <StatCard label="Tác vụ còn lại" value="18" subtext="8 việc đang thực thi" icon={Zap} colorClass="bg-purple-100 text-purple-600" />
                <StatCard label="Quỹ thời gian" value="42 ngày" subtext="Đến mốc bàn giao kế tiếp" icon={Clock} colorClass="bg-sky-100 text-sky-600" />
                <StatCard label="Chỉ số sức khỏe" value="Tốt" subtext="Tiến độ thực tế ổn định" icon={Activity} colorClass="bg-emerald-100 text-emerald-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-8"><h4 className="font-bold text-slate-800 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600" /> Hiệu suất công việc</h4></div>
                    <div className="flex items-end gap-4 h-48 px-4">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-indigo-50 group-hover:bg-indigo-100 rounded-t-lg transition-colors relative" style={{ height: `${h}%` }}>
                                    <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500 rounded-t-lg opacity-40"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-orange-500" /> Phân tích rủi ro</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-sm text-slate-700">Trễ hạn module thanh toán</span></div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-sm text-slate-700">Thiếu nhân sự thiết kế</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function GanttChart({ tasks }: { tasks: Task[] }) {
    const [viewMode, setViewMode] = useState<'DAY' | 'WEEK'>('DAY');
    const dates = useMemo(() => {
        if (!tasks.length) return [];
        const allDates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)]);
        const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
        minDate.setDate(minDate.getDate() - 3); maxDate.setDate(maxDate.getDate() + 10);
        const dateArray = []; let currentDate = new Date(minDate);
        while (currentDate <= maxDate) { dateArray.push(new Date(currentDate)); currentDate.setDate(currentDate.getDate() + 1); }
        return dateArray;
    }, [tasks]);

    const CELL_WIDTH = 48; const ROW_HEIGHT = 48;
    const getTaskStyles = (task: Task) => {
        const minDate = dates[0];
        const offsetDays = Math.ceil((new Date(task.startDate).getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        const durationDays = Math.ceil((new Date(task.dueDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return { left: offsetDays * CELL_WIDTH, width: durationDays * CELL_WIDTH };
    };

    const renderDependencies = () => (
        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full">
            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" /></marker></defs>
            {tasks.map((task, taskIdx) => (task.dependencies || []).map(depId => {
                const prereqIdx = tasks.findIndex(t => t.id === depId);
                if (prereqIdx === -1) return null;
                const fromStyle = getTaskStyles(tasks[prereqIdx]);
                const toStyle = getTaskStyles(task);
                const startX = fromStyle.left + fromStyle.width;
                const startY = (prereqIdx * ROW_HEIGHT) + (ROW_HEIGHT / 2);
                const endX = toStyle.left;
                const endY = (taskIdx * ROW_HEIGHT) + (ROW_HEIGHT / 2);
                const midX = startX + (endX - startX) / 2;
                return <path key={`${task.id}-${depId}`} d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`} stroke="#cbd5e1" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />;
            }))}
        </svg>
    );

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex flex-1 overflow-hidden">
                <div className="w-72 flex-shrink-0 border-r border-slate-200 flex flex-col bg-white z-20">
                    <div className="h-[50px] border-b border-slate-100 flex items-center px-4 bg-slate-50 font-bold text-[10px] text-slate-400 uppercase tracking-widest">Tên công việc</div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">{tasks.map(t => (<div key={t.id} className="h-[48px] border-b border-slate-50 flex items-center px-4 group hover:bg-slate-50 transition-colors justify-between"><div className="flex items-center gap-2 truncate"><TaskTypeIcon type={t.type} /><span className="text-sm font-medium text-slate-700 truncate">{t.title}</span></div><TaskActionsMenu /></div>))}</div>
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar relative bg-slate-50/20">
                    <div className="min-w-max relative h-full">
                        <div className="flex sticky top-0 z-30 bg-white border-b border-slate-200 h-[50px]">{dates.map((d, i) => (<div key={i} className={cn("flex-shrink-0 border-r border-slate-100 flex flex-col items-center justify-center text-xs", [0, 6].includes(d.getDay()) ? "bg-slate-50 text-slate-400" : "text-slate-600")} style={{ width: CELL_WIDTH }}><span className="font-mono">{d.getDate()}</span><span className="text-[9px] uppercase font-bold">{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]}</span></div>))}</div>
                        <div className="relative">{renderDependencies()}{tasks.map(t => { const s = getTaskStyles(t); return (<div key={t.id} className="h-[48px] border-b border-slate-100/50 relative"><div className={cn("absolute top-2 h-7 rounded-lg shadow-sm flex items-center px-2 z-20 group border border-black/5 hover:scale-[1.02] transition-transform", t.status === 'DONE' ? 'bg-emerald-500' : 'bg-indigo-500')} style={{ left: s.left, width: s.width }}><span className="text-[10px] text-white font-bold truncate drop-shadow-sm pointer-events-none">{t.title}</span></div></div>) })}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectTaskList() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Lọc công việc..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-indigo-500 w-64" />
                    </div>
                    <Popover
                        isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} width="w-56"
                        trigger={<button className="p-1.5 text-slate-500 hover:bg-white hover:shadow-sm rounded-md transition-all border border-transparent hover:border-slate-200"><Filter className="w-4 h-4" /></button>}
                        content={<div className="p-2">Filter Options</div>}
                    />
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 shadow-sm transition-colors"><Plus className="w-4 h-4" /> Tạo công việc</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-widest">
                        <tr><th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" /></th><th className="px-4 py-3 w-24">Mã số</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3 w-40 text-center">Tiến độ</th><th className="px-4 py-3 w-40">Thực hiện</th><th className="px-4 py-3 w-32">Độ ưu tiên</th><th className="px-4 py-3 w-10"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">{MOCK_TASKS.map(task => (
                        <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-3"><input type="checkbox" className="rounded border-slate-300" /></td>
                            <td className="px-4 py-3 font-mono text-slate-500 text-xs">{task.key}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800 flex items-center gap-2"><TaskTypeIcon type={task.type} /> {task.title}</td>
                            <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${task.progress}%` }}></div></div><span className="text-[10px] font-bold text-slate-500 w-8">{task.progress}%</span></div></td>
                            <td className="px-4 py-3 text-xs">{task.assignee?.name}</td>
                            <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                            <td className="px-4 py-3 text-right"><TaskActionsMenu /></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </div>
    );
}

function ProjectSettings({ project }: { project: Project }) {
    const [activeSubTab, setActiveSubTab] = useState<'GENERAL' | 'MEMBERS' | 'FEATURES' | 'NOTIFICATIONS'>('GENERAL');

    const subTabs = [
        { id: 'GENERAL', label: 'Thông tin chung', icon: Settings },
        { id: 'MEMBERS', label: 'Nhân sự & Quyền', icon: Users },
        { id: 'FEATURES', label: 'Phân hệ chức năng', icon: Sliders },
        { id: 'NOTIFICATIONS', label: 'Thông báo', icon: Bell },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1 space-y-1">
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục cấu hình</h3>
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as any)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                            activeSubTab === tab.id
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="lg:col-span-3 pb-20">
                {activeSubTab === 'GENERAL' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Thông tin chung</h3>
                                <p className="text-sm text-slate-500 mt-1">Quản lý các tham số nhận diện cơ bản của dự án PronaFlow.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                                <Save className="w-4 h-4" /> Lưu thay đổi
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên dự án thực thi</label>
                                    <input type="text" defaultValue={project.name} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã định danh (Key)</label>
                                    <div className="relative">
                                        <input type="text" defaultValue={project.key} disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-mono" />
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả mục tiêu dự án</label>
                                <textarea rows={4} defaultValue={project.description} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loại hình thực thi</label>
                                    <select defaultValue={project.type} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                                        <option value="AGILE">Agile (Linh hoạt)</option>
                                        <option value="WATERFALL">Waterfall (Tuần tự)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Độ ưu tiên mặc định</label>
                                    <select defaultValue={project.priority} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none">
                                        <option value="CRITICAL">Nghiêm trọng</option>
                                        <option value="HIGH">Cao</option>
                                        <option value="MEDIUM">Trung bình</option>
                                        <option value="LOW">Thấp</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 space-y-4">
                            <h4 className="text-sm font-bold text-red-700 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Vùng quản trị rủi ro</h4>
                            <div className="flex items-center justify-between py-2 border-b border-red-100">
                                <div>
                                    <p className="text-sm font-bold text-red-900">Lưu trữ dự án (Archive)</p>
                                    <p className="text-xs text-red-600 mt-1">Dữ liệu sẽ được bảo toàn nhưng chỉ có thể đọc.</p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors">Lưu trữ</button>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <p className="text-sm font-bold text-red-900">Xóa vĩnh viễn (Destroy)</p>
                                    <p className="text-xs text-red-600 mt-1">Hành động này không thể hoàn tác.</p>
                                </div>
                                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-md active:scale-95">Xác nhận xóa</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'MEMBERS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Nhân sự & Phân quyền</h3>
                                <p className="text-sm text-slate-500 mt-1">Quản lý đội ngũ tham gia và ma trận quyền hạn.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md">
                                <UserPlus className="w-4 h-4" /> Mời thành viên
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thành viên</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {project.members.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={m.avatar_url} className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{m.name}</div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> {m.role}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSubTab === 'FEATURES' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Phân hệ chức năng</h3>
                            <p className="text-sm text-slate-500 mt-1">Kích hoạt hoặc vô hiệu hóa các công cụ chuyên biệt.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: 'Quản lý Sprint (Agile)', desc: 'Kích hoạt Backlog và Burndown Chart.', icon: Zap, active: project.type === 'AGILE' },
                                { title: 'Biểu đồ Gantt (Timeline)', desc: 'Theo dõi tiến độ trên trục thời gian.', icon: CalendarRange, active: true },
                                { title: 'Module QA & Testing', desc: 'Quản lý Test Case và Bug Tracking.', icon: Bug, active: false },
                                { title: 'Theo dõi thời gian', desc: 'Cho phép thành viên log thời gian thực hiện.', icon: Clock, active: true },
                            ].map((f, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><f.icon className="w-6 h-6" /></div>
                                        <div><h4 className="text-sm font-bold text-slate-800">{f.title}</h4><p className="text-xs text-slate-500 mt-1">{f.desc}</p></div>
                                    </div>
                                    <ToggleSwitch checked={f.active} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSubTab === 'NOTIFICATIONS' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Cấu hình thông báo</h3>
                            <p className="text-sm text-slate-500 mt-1">Kiểm soát cơ chế thông tin liên lạc và cảnh báo.</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 shadow-sm">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Cpu className="w-3.5 h-3.5" /> Sự kiện hệ thống</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Khởi tạo task', 'Thay đổi trạng thái', 'Bình luận mới', 'Tài liệu cập nhật', 'Task quá hạn'].map(e => (
                                        <label key={e} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer border border-transparent hover:border-slate-200">
                                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className="text-sm font-medium text-slate-700">{e}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 7. MAIN APP ENTRY POINT ---

interface ProjectDetailsProps {
  project?: Project;
  onBack?: () => void;
  hideHeader?: boolean;
  activeTab?: 'OVERVIEW' | 'GANTT' | 'LIST' | 'NOTES' | 'DOCS' | 'SETTINGS';
  onTabChange?: (tab: 'OVERVIEW' | 'GANTT' | 'LIST' | 'NOTES' | 'DOCS' | 'SETTINGS') => void;
}

export default function ProjectDetails({ 
  project: initialProject, 
  onBack, 
  hideHeader, 
  activeTab: externalActiveTab, 
  onTabChange 
}: ProjectDetailsProps) {
    const [currentProject, setCurrentProject] = useState<Project>(initialProject || MOCK_PROJECTS[0]);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GANTT' | 'LIST' | 'NOTES' | 'DOCS' | 'SETTINGS'>(externalActiveTab || 'OVERVIEW');

    // Update currentProject when initialProject changes
    useEffect(() => {
        if (initialProject) {
            setCurrentProject(initialProject);
        }
    }, [initialProject]);

    // Sync activeTab with external prop
    useEffect(() => {
        if (externalActiveTab) {
            setActiveTab(externalActiveTab);
        }
    }, [externalActiveTab]);

    const handleTabChange = (tab: 'OVERVIEW' | 'GANTT' | 'LIST' | 'NOTES' | 'DOCS' | 'SETTINGS') => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    const toggleDemoProject = () => setCurrentProject(prev => 
        prev.type === 'AGILE' 
            ? MOCK_PROJECTS.find(p => p.type === 'WATERFALL') || MOCK_PROJECTS[0]
            : MOCK_PROJECTS.find(p => p.type === 'AGILE') || MOCK_PROJECTS[0]
    );

    const tabs = useMemo(() => [
        { id: 'OVERVIEW', label: 'Tổng quan', icon: BarChart2 },
        { id: 'GANTT', label: 'Tiến độ (Gantt)', icon: CalendarRange },
        { id: 'LIST', label: 'Danh sách việc', icon: List },
        { id: 'NOTES', label: 'Wiki & Ghi chú', icon: FileEdit },
        { id: 'DOCS', label: 'Tài liệu', icon: Folder },
        { id: 'SETTINGS', label: 'Cấu hình', icon: Settings },
    ], []);

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            // Fallback navigation logic
            window.history.back();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }`}</style>

            {!hideHeader && (
                <header className="bg-white border-b border-slate-200 z-30 flex-shrink-0">
                    <div className="px-6 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <button 
                                onClick={handleBackClick}
                                className="hover:text-indigo-600 flex items-center transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3 mr-1" /> Dự án
                            </button>
                            <ChevronRight className="w-3 h-3 text-slate-300" />
                            <span className="text-slate-800 font-bold">{currentProject.key}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={toggleDemoProject} className="text-[10px] font-bold px-2 py-1 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors uppercase tracking-widest">Switch Demo</button>
                            <div className="h-3 w-px bg-slate-200 mx-1"></div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase"><History className="w-3 h-3" /> Cập nhật: 2h trước</div>
                        </div>
                    </div>

                    <div className="px-6 pt-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <ProjectStatusPopover currentStatus={currentProject.status} />
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentProject.name}</h1>
                                </div>
                                <p className="text-slate-500 max-w-3xl text-sm leading-relaxed mb-3">{currentProject.description}</p>
                                <div className="flex items-center gap-4">
                                    <ProjectPriorityPopover currentPriority={currentProject.priority} />
                                    <div className="h-3 w-px bg-slate-200"></div>
                                    <ProjectTags tags={currentProject.tags} />
                                </div>
                            </div>

                            <div className="flex items-center gap-8 self-start bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Project Manager</div>
                                    <div className="flex items-center justify-end gap-2 group cursor-pointer">
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{currentProject.manager.name}</span>
                                        <img src={currentProject.manager.avatar_url} className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm" />
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-200"></div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Thời hạn cuối</div>
                                    <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-slate-800">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                        {new Date(currentProject.end_date).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 border-b border-slate-200">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 pb-3 text-sm font-bold transition-all border-b-2 relative",
                                        activeTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                    )}
                                >
                                    <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
                                    {tab.label}
                                    {activeTab === tab.id && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-indigo-600 animate-in fade-in duration-300"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>
            )}

            <main className="flex-1 overflow-y-auto bg-white p-8 scroll-smooth custom-scrollbar">
                <div className="max-w-7xl mx-auto h-full">
                    {activeTab === 'OVERVIEW' && <ProjectOverview project={currentProject} />}
                    {activeTab === 'GANTT' && <div className="h-full flex flex-col"><GanttChart tasks={MOCK_TASKS} /></div>}
                    {activeTab === 'LIST' && <ProjectTaskList />}

                    {activeTab === 'NOTES' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">Wiki & Ghi chú dự án</h3>
                                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md"><FileEdit className="w-4 h-4" /> Tạo ghi chú</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {MOCK_NOTES.map(note => (
                                    <div key={note.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer flex flex-col h-full relative">
                                        <div className="flex justify-between items-start mb-4"><div className="p-2.5 bg-slate-50 text-indigo-600 rounded-xl group-hover:bg-indigo-50 transition-colors"><FileText className="w-5 h-5" /></div><TaskActionsMenu /></div>
                                        <h4 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">{note.title}</h4>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1 leading-relaxed">{note.excerpt}</p>
                                        <div className="flex items-center gap-2 mb-4">{note.tags.map(tag => (<span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 font-bold">#{tag}</span>))}</div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                            <div className="flex items-center gap-2"><img src={note.author.avatar_url} alt={note.author.name} className="w-5 h-5 rounded-full shadow-sm" /><span className="text-xs font-medium text-slate-600">{note.author.name}</span></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(note.updatedAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'DOCS' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">Kho tài liệu tập trung</h3>
                                <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"><Plus className="w-4 h-4" /> Tải lên tài liệu</button>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-widest">
                                        <tr><th className="px-6 py-4 w-12 text-center">Định dạng</th><th className="px-6 py-4">Tên tệp</th><th className="px-6 py-4 w-32 text-center">Dung lượng</th><th className="px-6 py-4 w-48">Người tải</th><th className="px-6 py-4 w-16 text-right"></th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">{MOCK_FILES.map(f => (
                                        <tr key={f.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer"><td className="px-6 py-4 text-center"><FileTypeIcon type={f.type} /></td><td className="px-6 py-4"><div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{f.name}</div><div className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-wider">{f.type} Document</div></td><td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">{f.size}</td><td className="px-6 py-4"><div className="flex items-center gap-2"><img src={f.uploader.avatar_url} className="w-6 h-6 rounded-full" /><span className="text-xs font-medium text-slate-600">{f.uploader.name}</span></div></td><td className="px-6 py-4 text-right"><button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"><Download className="w-4 h-4" /></button></td></tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SETTINGS' && <ProjectSettings project={currentProject} />}
                </div>
            </main>
        </div>
    );
}