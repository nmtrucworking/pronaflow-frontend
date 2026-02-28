// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronDown, LayoutDashboard, CheckCircle2,
  Calendar, Inbox, Star, Folder,
  GanttChart, Users, Archive, Trash2, Megaphone,
  LifeBuoy, Search, PlusCircle, Settings, Plug,
  User, Sliders, Moon, LogOut, Check, MoreHorizontal
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useQuery } from '@tanstack/react-query';
import { ROUTES } from '@/routes/paths';
import { workspaceService } from '@/services/workspaceService';
import { projectService } from '@/services/projectService';
import { authService } from '@/services/authService';
import { notificationService } from '@/services/notificationService';
import { useWorkspaceStore } from '@/store/features/workspaceStore';
import type { Workspace, Project, CurrentUserResponse } from '@/types';
import { getSidebarNavigationData, type BadgeType, type NavItemData, type SectionData } from './sidebarNavigationConfig';

/** * ĐỊNH NGHĨA TYPES & INTERFACES 
 * Đảm bảo tính minh bạch về kiểu dữ liệu và ngăn chặn lỗi runtime.
 */
/**
 * COMPONENT CHÍNH: APP (SIDEBAR)
 */
export default function App({
  currentWorkspace,
  activePath = '/dashboard',
  onNavigate
}: {
  currentWorkspace?: { workspace_id: string; name: string };
  activePath?: string;
  onNavigate?: (path: string) => void;
}) {
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState<string>(activePath);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    workspace: true,
    collaboration: true,
    favorites: true,
    data: true
  });
  const selectedWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
  const setCurrentWorkspaceId = useWorkspaceStore((state) => state.setCurrentWorkspaceId);

  // Fetch current user
  const { data: currentUser } = useQuery<CurrentUserResponse>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Fetch workspaces
  const { data: workspacesData } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await workspaceService.getWorkspaces({ page: 1, page_size: 10 });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch current workspace details
  const currentWorkspaceId =
    currentWorkspace?.workspace_id ||
    selectedWorkspaceId ||
    workspacesData?.workspaces?.[0]?.workspace_id;

  useEffect(() => {
    if (currentWorkspaceId && currentWorkspaceId !== selectedWorkspaceId) {
      setCurrentWorkspaceId(currentWorkspaceId);
    }
  }, [currentWorkspaceId, selectedWorkspaceId, setCurrentWorkspaceId]);
  
  const { data: workspaceDetails } = useQuery({
    queryKey: ['workspace', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return null;
      const response = await workspaceService.getWorkspace(currentWorkspaceId);
      return response.data;
    },
    enabled: !!currentWorkspaceId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch projects for current workspace
  const { data: projectsData } = useQuery({
    queryKey: ['projects', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return null;
      const response = await projectService.getProjects({
        workspace_id: currentWorkspaceId,
        page: 1,
        page_size: 100,
      });
      return response.data;
    },
    enabled: !!currentWorkspaceId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // Fetch favorite projects
  const { data: favoriteProjects } = useQuery({
    queryKey: ['favoriteProjects', currentWorkspaceId],
    queryFn: async () => {
      if (!currentWorkspaceId) return [];
      const response = await projectService.getProjects({
        workspace_id: currentWorkspaceId,
        is_favorite: true,
        page: 1,
        page_size: 10,
      });
      return response.data?.projects || [];
    },
    enabled: !!currentWorkspaceId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  // Fetch notifications count
  const { data: notificationsData } = useQuery({
    queryKey: ['notificationsCount'],
    queryFn: async () => {
      const response = await notificationService.getUnreadCount();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 1,
  });

  // Calculate counts with safe defaults when API is unavailable
  const projectCount = projectsData?.pagination?.total || 0;
  const memberCount = workspaceDetails?.members_count || 0;
  const inboxCount = notificationsData?.unread_count || 0;
  const taskCount = 0; // Will be implemented with task service

  // Generate navigation data with real counts
  const NAVIGATION_DATA = getSidebarNavigationData(taskCount, inboxCount, memberCount, projectCount);

  // Add favorite projects to navigation
  if (favoriteProjects && favoriteProjects.length > 0) {
    const favoritesSection = NAVIGATION_DATA.find(s => s.id === 'favorites');
    if (favoritesSection) {
      favoritesSection.items = favoriteProjects.map((project: any) => ({
        id: project.project_id,
        label: project.name,
        icon: Star,
        statusColor: getProjectStatusColor(project.status),
        path: `/projects/${project.project_id}`,
      }));
    }
  }

  // Detect OS for keyboard shortcut display
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update currentPath when activePath prop changes
  useEffect(() => {
    setCurrentPath(activePath);
  }, [activePath]);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const toggleSection = (id: string) => {
    if (isCollapsed) return;
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  };

  const handleNavigate = useCallback((path: string) => {
    setCurrentPath(path);
    onNavigate?.(path);
  }, [onNavigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearTokens();
      navigate(ROUTES.auth.login);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  // Helper function to get project status color
  function getProjectStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'bg-green-500',
      completed: 'bg-blue-500',
      on_hold: 'bg-yellow-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      <aside
        className={`relative flex flex-col bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 ${isCollapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
      >
        {/* Nút Thu Gọn Sidebar */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="absolute top-6 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center z-40 hover:text-blue-600 hover:border-blue-600 shadow-sm transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* 1. Header: Thông tin Workspace */}
        <header className="relative h-16 px-4 flex items-center justify-between border-b border-slate-200">
          {!isCollapsed ? (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="flex items-center gap-2 overflow-hidden w-full cursor-pointer hover:bg-slate-200/50 transition-colors group rounded-md px-2 py-1.5 -mx-2"
                  aria-label="Switch workspace"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white flex items-center justify-center font-bold text-lg shadow-blue-200/50 shadow-md flex-shrink-0">
                    {workspaceDetails?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div className="flex flex-col overflow-hidden whitespace-nowrap flex-1">
                    <span className="font-semibold text-[15px] leading-tight truncate">
                      {workspaceDetails?.name || 'Loading...'}
                    </span>
                    <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                      {workspaceDetails?.workspace_type || 'Workspace'}
                    </span>
                  </div>
                  <Popover.Anchor />
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </Popover.Trigger>
              <WorkspacePopover 
                workspaces={workspacesData?.workspaces || []} 
                currentWorkspaceId={currentWorkspaceId}
                onSelectWorkspace={setCurrentWorkspaceId}
              />
            </Popover.Root>
          ) : (
            <RadixTooltip text={workspaceDetails?.name || 'Workspace'}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white flex items-center justify-center font-bold text-lg shadow-blue-200/50 shadow-md flex-shrink-0">
                {workspaceDetails?.name?.charAt(0).toUpperCase() || 'P'}
              </div>
            </RadixTooltip>
          )}
        </header>

        {/* 2. Search Section */}
        <div className="p-3 pt-4">
          <div
            onClick={handleSearchClick}
            className={`flex items-center gap-2 bg-white border border-slate-200 rounded-lg h-9 px-2.5 transition-all group ${isCollapsed ? 'justify-center border-transparent bg-transparent cursor-pointer' : 'hover:border-slate-300'
              }`}
          >
            <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-900 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Quick Search... (${isMac ? '⌘K' : 'Ctrl+K'})`}
                  className="w-full bg-transparent border-none outline-none text-[13px] text-slate-900 placeholder:text-slate-400"
                />
                <span className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 font-mono text-slate-400 font-medium">{isMac ? '⌘K' : 'Ctrl+K'}</span>
              </>
            )}
          </div>
        </div>

        {/* 3. Navigation Content */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar overflow-x-hidden">
          {NAVIGATION_DATA.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Tiêu đề phân mục */}
              <div
                onClick={() => toggleSection(section.id)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${isCollapsed ? 'justify-center cursor-default' : 'cursor-pointer hover:bg-slate-200/30 group'
                  }`}
              >
                {!isCollapsed ? (
                  <>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.05em] opacity-80 select-none">
                      {section.title}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${!expandedSections[section.id] ? '-rotate-90' : ''}`} />
                  </>
                ) : (
                  <div className="h-[1px] w-8 bg-slate-200 my-2" />
                )}
              </div>

              {/* Danh sách các mục (Chỉ hiển thị khi expanded hoặc sidebar bị thu gọn) */}
              {(isCollapsed || expandedSections[section.id]) && (
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    // onClick truyền từ App.tsx để cập nhật route
                    <li key={item.id}>
                      {item.path && (
                        <NavLink
                          to={item.path}
                          // Logic Active State nằm ở đây
                          className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium text-sm",
                            isActive
                              ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100" // Style khi active
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"       // Style khi inactive
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      )}
                    </li>

                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        {/* 4. Footer Section */}
        <footer className="mt-auto border-t border-slate-200 p-3 bg-slate-50/80 space-y-1">
          {/* Thông báo hệ thống */}
          {!isCollapsed ? (
            <NavLink
              to={ROUTES.app.inbox}
              className="w-full flex items-center gap-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors group relative overflow-hidden"
            >
              <Megaphone className="w-4 h-4 flex-shrink-0" />
              <span className="text-[13px] font-medium whitespace-nowrap truncate">Maintenance at 22:00</span>
            </NavLink>
          ) : (
            <RadixTooltip text="Maintenance: 22:00">
              <NavLink
                to={ROUTES.app.inbox}
                className="w-full flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100 transition-colors"
              >
                <Megaphone className="w-4 h-4 flex-shrink-0" />
              </NavLink>
            </RadixTooltip>
          )}

          {/* Trợ giúp */}
          {!isCollapsed ? (
            <NavLink
              to={ROUTES.help.root}
              className="w-full flex items-center gap-3 p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all group relative"
            >
              <LifeBuoy className="w-5 h-5 flex-shrink-0" />
              <span className="text-[14px] font-medium whitespace-nowrap">Help & Support</span>
            </NavLink>
          ) : (
            <RadixTooltip text="Help & Support">
              <NavLink
                to={ROUTES.help.root}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
              >
                <LifeBuoy className="w-5 h-5 flex-shrink-0" />
              </NavLink>
            </RadixTooltip>
          )}

          {/* Thông tin người dùng */}
          {!isCollapsed ? (
            <Popover.Root>
              <Popover.Trigger asChild>
                <button
                  className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 cursor-pointer group transition-colors w-full"
                  aria-label="Account settings"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || currentUser?.username || 'User')}&background=random`}
                      className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                      alt="Profile"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="block text-sm font-semibold truncate leading-tight">
                      {currentUser?.full_name || currentUser?.username || 'Loading...'}
                    </span>
                    <span className="block text-xs text-slate-500 truncate">
                      {currentUser?.email || ''}
                    </span>
                  </div>
                  <Popover.Anchor />
                  <MoreHorizontal className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                </button>
              </Popover.Trigger>
              <UserPopover onLogout={handleLogout} />
            </Popover.Root>
          ) : (
            <RadixTooltip text="Account Settings">
              <div className="relative flex items-center justify-center p-2">
                <div className="relative flex-shrink-0">
                  <img
                    src={currentUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.full_name || currentUser?.username || 'User')}&background=random`}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                    alt="Profile"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </RadixTooltip>
          )}
        </footer>
      </aside>


      {/* Style overrides for custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: transparent; 
          border-radius: 20px; 
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: var(--color-neutral-200);
        }
      `}</style>
    </div>
  );
}

/**
 * COMPONENT PHỤ: NAVITEM
 */
function NavItem({
  data,
  isCollapsed,
  currentPath,
  onNavigate
}: {
  data: NavItemData;
  isCollapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const Icon = data.icon;
  const isActive = data.path ? currentPath === data.path : false;

  const badgeColors: Record<BadgeType, string> = {
    urgent: 'bg-red-100 text-red-600',
    count: 'bg-slate-200 text-slate-600',
    new: 'bg-indigo-600 text-white',
    info: 'bg-blue-100 text-blue-700'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (data.path) {
      onNavigate(data.path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative flex items-center h-10 px-3 rounded-lg transition-all duration-200 text-sm font-medium w-full ${isActive
          ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
          : 'text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
        } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        </div>
        {!isCollapsed && <span className="truncate whitespace-nowrap">{data.label}</span>}
      </div>

      {!isCollapsed && data.badge && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center ${badgeColors[data.badgeType || 'count']}`}>
          {data.badge}
        </span>
      )}

      {isCollapsed && (
        <RadixTooltip text={data.label}>
          <span className="absolute inset-0" />
        </RadixTooltip>
      )}
    </button>
  );
}

/**
 * COMPONENT PHỤ: RADIX TOOLTIP
 * Sử dụng Radix UI Tooltip với hỗ trợ đầy đủ keyboard navigation
 */
function RadixTooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="px-2 py-1 bg-slate-800 text-white text-[11px] font-medium rounded shadow-lg whitespace-nowrap z-[60] data-[state=delayed-open]:data-[side=right]:animate-in data-[state=delayed-open]:data-[side=right]:fade-in-0 data-[state=delayed-open]:data-[side=right]:slide-in-from-left-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          >
            {text}
            <Tooltip.Arrow className="fill-slate-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

/**
 * COMPONENT PHỤ: STATUS DOT
 * Uses Tailwind classes instead of hardcoded HEX for better theme support
 */
function StatusDot({ color, className }: { color: string; className?: string }) {
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm flex-shrink-0 ${color} ${className}`}
    />
  );
}

/**
 * COMPONENT PHỤ: WORKSPACE POPOVER (Radix UI)
 * Hỗ trợ đầy đủ keyboard navigation và WCAG 2.1
 */
function WorkspacePopover({ 
  workspaces, 
  currentWorkspaceId,
  onSelectWorkspace,
}: { 
  workspaces: any[]; 
  currentWorkspaceId?: string;
  onSelectWorkspace: (workspaceId: string | null) => void;
}) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-[228px] bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Workspace</div>
        
        {workspaces.map((workspace) => (
          <Popover.Close asChild key={workspace.workspace_id}>
            <Link
              to={ROUTES.workspace.detail(workspace.workspace_id)}
              onClick={() => onSelectWorkspace(workspace.workspace_id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                workspace.workspace_id === currentWorkspaceId
                  ? 'bg-blue-50/50 text-blue-700 border border-blue-100/50'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`w-6 h-6 rounded text-white text-[10px] flex items-center justify-center font-bold ${
                workspace.workspace_id === currentWorkspaceId ? 'bg-blue-600' : 'bg-slate-400'
              }`}>
                {workspace.name?.charAt(0).toUpperCase() || 'W'}
              </div>
              <span className="text-sm font-semibold flex-1 text-left truncate">{workspace.name}</span>
              {workspace.workspace_id === currentWorkspaceId && <Check className="w-4 h-4" />}
            </Link>
          </Popover.Close>
        ))}
        
        <div className="h-px bg-slate-100 my-1.5" />
        <Popover.Close asChild>
          <Link
            to={ROUTES.workspace.create}
            className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" /> Create Workspace
          </Link>
        </Popover.Close>
        <Popover.Close asChild>
          <Link
            to={ROUTES.app.workspaceSettings}
            className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Settings className="w-4 h-4 text-slate-400" /> Workspace Settings
          </Link>
        </Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  );
}

/**
 * COMPONENT PHỤ: USER POPOVER (Radix UI)
 * Hỗ trợ đầy đủ keyboard navigation và WCAG 2.1
 */
function UserPopover({ onLogout }: { onLogout: () => void }) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="start"
        sideOffset={8}
        className="w-[228px] bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Account</div>
        <div className="space-y-0.5">
          {[
            { icon: User, label: 'Profile & Status', to: `${ROUTES.app.settings}?tab=profile` },
            { icon: Sliders, label: 'Preferences', to: `${ROUTES.app.settings}?tab=preferences` },
            { icon: Moon, label: 'Dark Mode', to: `${ROUTES.app.settings}?tab=preferences` },
          ].map((item, idx) => (
            <Popover.Close asChild key={idx}>
              <Link
                to={item.to}
                className="w-full flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <item.icon className="w-4 h-4 text-slate-400" /> {item.label}
              </Link>
            </Popover.Close>
          ))}
        </div>
        <div className="h-px bg-slate-100 my-1.5" />
        <Popover.Close asChild>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg text-sm text-red-600 transition-colors font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  );
}