import {
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  Inbox,
  Users,
  Settings,
  Plug,
  Folder,
  GanttChart,
  Archive,
  Trash2,
} from 'lucide-react';
import type { ElementType } from 'react';
import { ROUTES } from '@/routes/paths';

export type BadgeType = 'urgent' | 'count' | 'new' | 'info';

export interface NavItemData {
  id: string;
  label: string;
  icon: ElementType;
  badge?: string | number;
  badgeType?: BadgeType;
  path?: string;
  statusColor?: string;
}

export interface SectionData {
  id: string;
  title: string;
  items: NavItemData[];
}

export const getSidebarNavigationData = (
  taskCount: number = 0,
  inboxCount: number = 0,
  memberCount: number = 0,
  projectCount: number = 0
): SectionData[] => [
  {
    id: 'overview',
    title: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, path: ROUTES.app.dashboard },
      {
        id: 'tasks',
        label: 'Việc của tôi',
        icon: CheckCircle2,
        badge: taskCount > 0 ? taskCount : undefined,
        badgeType: taskCount > 0 ? 'urgent' : undefined,
        path: ROUTES.app.tasks,
      },
      { id: 'calendar', label: 'Lịch biểu', icon: Calendar, path: ROUTES.app.calendar },
      {
        id: 'inbox',
        label: 'Hộp thư',
        icon: Inbox,
        badge: inboxCount > 0 ? inboxCount : undefined,
        badgeType: 'count',
        path: ROUTES.app.inbox,
      },
    ],
  },
  {
    id: 'workspace',
    title: 'Không gian làm việc',
    items: [
      {
        id: 'members',
        label: 'Thành viên',
        icon: Users,
        badge: memberCount > 0 ? memberCount : undefined,
        badgeType: 'count',
        path: ROUTES.app.members,
      },
      { id: 'settings', label: 'Cấu hình', icon: Settings, path: ROUTES.app.workspaceSettings },
      { id: 'integrations', label: 'Tích hợp', icon: Plug, path: ROUTES.integrations.root, badgeType: 'new' },
    ],
  },
  {
    id: 'collaboration',
    title: 'Dự án',
    items: [
      {
        id: 'all-projects',
        label: 'Danh sách dự án',
        icon: Folder,
        badge: projectCount > 0 ? projectCount : undefined,
        badgeType: 'count',
        path: ROUTES.app.projects,
      },
      { id: 'gantt', label: 'Biểu đồ Gantt', icon: GanttChart, badge: 'New', badgeType: 'new', path: ROUTES.app.gantt },
    ],
  },
  {
    id: 'favorites',
    title: 'Đã ghim',
    items: [],
  },
  {
    id: 'data',
    title: 'Dữ liệu',
    items: [
      { id: 'archive', label: 'Kho lưu trữ', icon: Archive, path: ROUTES.app.archive },
      { id: 'trash', label: 'Thùng rác', icon: Trash2, path: ROUTES.app.trash },
    ],
  },
];
