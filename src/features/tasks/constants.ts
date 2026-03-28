import {
  AlertCircle,
  ArrowRight,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import type { TaskPriority, TaskStatus, TaskEntity, UserEntity } from './types';
import { MOCK_TASKS as CENTRAL_TASKS, MOCK_USERS_BY_ID } from '@/mocks';

export const USERS: Record<string, UserEntity> = {
  'u-3': { id: 'u-3', name: MOCK_USERS_BY_ID['u-3'].name, avatar: MOCK_USERS_BY_ID['u-3'].avatar_url ?? '' },
  'u-4': { id: 'u-4', name: MOCK_USERS_BY_ID['u-4'].name, avatar: MOCK_USERS_BY_ID['u-4'].avatar_url ?? '' },
  'u-5': { id: 'u-5', name: MOCK_USERS_BY_ID['u-5'].name, avatar: MOCK_USERS_BY_ID['u-5'].avatar_url ?? '' },
};

export const MOCK_TASKS: TaskEntity[] = CENTRAL_TASKS.map((task) => ({
  id: task.task_id,
  key: `${task.project.key}-${task.task_number}`,
  title: task.title,
  project: {
    id: task.project.project_id,
    name: task.project.name,
    key: task.project.key,
    color: 'bg-indigo-500',
  },
  status: task.status,
  priority: task.priority,
  dueDate: new Date(task.planned_end).toISOString(),
  estimatedHours: 2,
  assignees: task.assignees.map((assignee) => ({
    id: assignee.user_id,
    name: assignee.username,
    avatar: assignee.avatar_url ?? 'https://ui-avatars.com/api/?name=User&background=64748B&color=fff',
  })),
}));

export const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: any; color: string; bg: string }> = {
  NOT_STARTED: { label: 'Chưa bắt đầu', icon: Circle, color: 'text-slate-500', bg: 'bg-slate-100' },
  IN_PROGRESS: { label: 'Đang thực hiện', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  IN_REVIEW: { label: 'Đang đánh giá', icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-100' },
  DONE: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; icon: any; color: string; bg: string }> = {
  URGENT: { label: 'Khẩn cấp', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  HIGH: { label: 'Cao', icon: ArrowUpCircle, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  MEDIUM: { label: 'Trung bình', icon: ArrowRight, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  LOW: { label: 'Thấp', icon: ArrowRight, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
};
