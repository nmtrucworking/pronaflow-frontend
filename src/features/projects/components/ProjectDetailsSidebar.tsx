import React, { useState } from 'react';
import { X, Maximize2, BarChart2, List, FileText, Settings, Users, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Project } from '../../../types/project';
import ProjectDetails from './ProjectDetails';

interface ProjectDetailsSidebarProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onFullPage: () => void;
}

export default function ProjectDetailsSidebar({ 
  project, 
  isOpen, 
  onClose, 
  onFullPage 
}: ProjectDetailsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GANTT' | 'LIST' | 'NOTES' | 'DOCS' | 'SETTINGS'>('OVERVIEW');

  const tabs = [
    { id: 'OVERVIEW', label: 'Tổng quan', icon: BarChart2 },
    { id: 'LIST', label: 'Danh sách', icon: List },
    { id: 'NOTES', label: 'Ghi chú', icon: FileText },
    { id: 'DOCS', label: 'Tài liệu', icon: FileText },
    { id: 'SETTINGS', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onFullPage}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
            Toàn trang
          </button>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex flex-col">
            <h2 className="text-headline text-slate-900 truncate">
              {project.name}
            </h2>
            <p className="text-caption text-slate-500">{project.key} • {project.manager.name}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Project Info Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-body font-medium text-slate-700">Đang thực thi</span>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-body text-slate-600">
              {new Date(project.end_date).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
        <div className="text-body font-semibold text-slate-700">
          {project.progress}% hoàn thành
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 bg-white flex-shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all rounded-lg",
              activeTab === tab.id 
                ? "bg-indigo-100 text-indigo-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ProjectDetails 
            project={project} 
            onBack={onClose} 
            hideHeader 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
}