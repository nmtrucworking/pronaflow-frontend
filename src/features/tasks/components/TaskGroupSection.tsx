import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils';

export const TaskGroupSection = ({ title, icon: Icon, count, headerColorClass, borderColorClass, children, isCollapsed, onToggle, className }: any) => {
  return (
    <section className={cn("animate-in slide-in-from-left-2 duration-500", className)}>
      <div className="flex items-center gap-2 mb-3 px-1 cursor-pointer group select-none" onClick={onToggle}>
        <div className="p-1 rounded-md hover:bg-slate-100 transition-colors"><ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isCollapsed && "-rotate-90")} /></div>
        <h3 className={cn("text-sm font-bold uppercase tracking-wider flex items-center gap-2", headerColorClass)}>{Icon && <Icon className="w-4 h-4"/>} {title} <span className="text-xs font-normal opacity-70 ml-1">({count})</span></h3>
        <div className={cn("h-px flex-1 bg-gradient-to-r", borderColorClass)}></div>
      </div>
      <div className={cn("bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ease-in-out", isCollapsed ? "max-h-0 opacity-0 border-none shadow-none" : "max-h-[2000px] opacity-100")}> 
        <div className={cn("divide-y", headerColorClass.includes('red') ? "border-red-100 shadow-red-100/50 divide-red-50" : "border-slate-200 divide-slate-50")}>{children}</div>
      </div>
    </section>
  );
};
