import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  CheckCircle2, 
  Clock, 
  Layout, 
  List, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  ChevronRight,
  Flag,
  MessageSquare,
  Paperclip,
  UserPlus
} from 'lucide-react';

/**
 * Interface dựa trên Entity Task và Project
 * Bám sát project-statuses.json và task-priorities.json
 */
const STATUS_COLORS = {
  'To Do': '#64748b',
  'In Progress': '#3b82f6',
  'Review': '#f59e0b',
  'Done': '#10B981', // Theo project-statuses.json
};

const PRIORITY_COLORS = {
  'Urgent': '#FF0000', // Theo task-priorities.json
  'High': '#ef4444',
  'Medium': '#f97316',
  'Low': '#8b5cf6',
};

// Component: Thẻ Task tối giản cho Simple Mode
const SimpleTaskCard = ({ task }: { task: any }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group mb-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || '#cbd5e1' }}
        />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {task.task_id}
        </span>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
        <MoreHorizontal size={18} />
      </button>
    </div>
    
    <h4 className="text-lg font-semibold text-slate-800 mb-4 leading-tight">
      {task.name}
    </h4>

    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
      <div className="flex -space-x-2">
        {task.assignees?.map((user: any, idx: number) => (
          <img 
            key={idx} 
            src={user.avatar} 
            className="w-8 h-8 rounded-full border-2 border-white" 
            alt={user.name} 
          />
        ))}
        <button className="w-8 h-8 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Plus size={14} />
        </button>
      </div>
      
      <div className="flex items-center gap-3 text-slate-400">
        <div className="flex items-center gap-1 text-sm">
          <MessageSquare size={14} />
          <span>3</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
          <Clock size={14} />
          <span>{task.planned_end}</span>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('board');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Simple Header: Chỉ giữ lại các thông tin cực kỳ quan trọng */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Layout size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                PronaFlow Redesign
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} />
                  On Track
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-sm text-slate-500 font-medium">Updated 2m ago</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl py-2.5 pl-10 pr-4 w-64 transition-all text-sm outline-none"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]">
              <Plus size={20} />
              Tạo Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs - Radix UI Primitive */}
        <Tabs.Root defaultValue="board" onValueChange={setActiveTab} className="mb-8">
          <Tabs.List className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
            {[
              { id: 'board', label: 'Bảng Kanban', icon: Layout },
              { id: 'list', label: 'Danh sách', icon: List },
              { id: 'files', label: 'Tài liệu', icon: Paperclip },
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
                `}
              >
                <tab.icon size={18} />
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="board" className="mt-8 outline-none">
            {/* Kanban Grid với Spacing lớn (Module 9 - Comfortable) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['To Do', 'In Progress', 'Done'].map((status) => (
                <div key={status} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                        {status}
                      </h3>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {status === 'In Progress' ? 2 : 1}
                      </span>
                    </div>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="min-h-[500px] rounded-3xl p-1">
                    {/* Render Mock Tasks */}
                    <SimpleTaskCard task={{
                      task_id: 'TASK-102',
                      name: 'Thiết kế hệ thống Design Tokens cho Module 9',
                      priority: 'Urgent',
                      planned_end: 'Today',
                      assignees: [{ name: 'An', avatar: 'https://i.pravatar.cc/150?u=1' }]
                    }} />
                    {status === 'In Progress' && (
                      <SimpleTaskCard task={{
                        task_id: 'TASK-105',
                        name: 'Nghiên cứu khả năng tiếp cận WCAG 2.1',
                        priority: 'Medium',
                        planned_end: 'Tomorrow',
                        assignees: [
                          { name: 'Bình', avatar: 'https://i.pravatar.cc/150?u=2' },
                          { name: 'Chi', avatar: 'https://i.pravatar.cc/150?u=3' }
                        ]
                      }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>

      {/* Floating Helper (Module 15: Help Center) */}
      <div className="fixed bottom-8 right-8">
        <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group">
          <MessageSquare size={24} className="group-hover:text-indigo-600 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default App;