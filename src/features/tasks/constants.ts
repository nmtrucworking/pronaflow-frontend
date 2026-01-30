import {
  AlertCircle,
  ArrowRight,
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import type { TaskPriority, TaskStatus, TaskEntity, UserEntity } from './types';

export const USERS: Record<string, UserEntity> = {
  u1: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
  u2: { id: 'u2', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=E11D48&color=fff' },
  u3: { id: 'u3', name: 'Le C', avatar: 'https://ui-avatars.com/api/?name=Le+C&background=059669&color=fff' },
};

export const MOCK_TASKS: TaskEntity[] = [
  {
    id: 't1', key: 'MKT-101', title: 'Hoàn thiện bản thiết kế UI cho Dashboard',
    project: { id: 'p1', name: 'Marketing Q1', key: 'MKT', color: 'bg-blue-500' },
    status: 'IN_PROGRESS', priority: 'URGENT', dueDate: '2023-10-25T10:00:00Z', estimatedHours: 4,
    assignees: [USERS.u1],
    description: 'Cần hoàn thiện wireframe và visual design cho màn hình Dashboard chính.'
  },
  {
    id: 't2', key: 'DEV-88', title: 'Review Pull Request module Auth',
    project: { id: 'p2', name: 'Core Backend', key: 'DEV', color: 'bg-indigo-500' },
    status: 'NOT_STARTED', priority: 'HIGH', dueDate: '2023-10-26T17:00:00Z', estimatedHours: 2,
    assignees: [USERS.u1, USERS.u2]
  },
  {
    id: 't3', key: 'DOC-205', title: 'Cập nhật tài liệu hướng dẫn sử dụng Module 9',
    project: { id: 'p3', name: 'Documentation', key: 'DOC', color: 'bg-emerald-500' },
    status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2023-10-26T14:00:00Z', estimatedHours: 3,
    assignees: [USERS.u2]
  },
  {
    id: 't4', key: 'HRM-12', title: 'Phỏng vấn ứng viên Senior Frontend',
    project: { id: 'p4', name: 'Recruitment', key: 'HRM', color: 'bg-rose-500' },
    status: 'NOT_STARTED', priority: 'MEDIUM', dueDate: '2023-10-27T09:00:00Z', estimatedHours: 1,
    assignees: [USERS.u3, USERS.u1]
  },
  {
    id: 't5', key: 'MKT-105', title: 'Lên kế hoạch content tháng 11',
    project: { id: 'p1', name: 'Marketing Q1', key: 'MKT', color: 'bg-blue-500' },
    status: 'DONE', priority: 'LOW', dueDate: '2023-10-24T17:00:00Z', estimatedHours: 8,
    assignees: [USERS.u1]
  },
  {
    id: 't6', key: 'SYS-01', title: 'Kiểm tra log server định kỳ',
    project: { id: 'p2', name: 'Core Backend', key: 'DEV', color: 'bg-indigo-500' },
    status: 'NOT_STARTED', priority: 'LOW', dueDate: '2023-10-28T00:00:00Z', estimatedHours: 0.5,
    assignees: []
  },
];

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
