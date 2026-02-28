// @ts-nocheck
import type { Task } from '../types/task';
import type { TaskEntity } from '../features/dashboard/types/dashboard-types';
import { MOCK_MEMBERS } from './projects';

export const CURRENT_USER = {
  username: MOCK_MEMBERS[0]?.name ?? 'User',
};

export const MOCK_TASKS: TaskEntity[] = [
  {
    task_id: 't1',
    task_number: 1,
    title: 'Thiết kế Wireframe Trang chủ',
    project: { project_id: 'p1', name: 'Marketing Website', key: 'MKT' },
    status: 'DONE',
    priority: 'HIGH',
    planned_end: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[1].id, username: MOCK_MEMBERS[1].name, avatar_url: MOCK_MEMBERS[1].avatar_url }],
  },
  {
    task_id: 't2',
    task_number: 2,
    title: 'Viết nội dung giới thiệu sản phẩm',
    project: { project_id: 'p1', name: 'Marketing Website', key: 'MKT' },
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[2].id, username: MOCK_MEMBERS[2].name, avatar_url: MOCK_MEMBERS[2].avatar_url }],
  },
  {
    task_id: 't3',
    task_number: 3,
    title: 'Tích hợp cổng thanh toán VNPay',
    project: { project_id: 'p1', name: 'Marketing Website', key: 'MKT' },
    status: 'NOT_STARTED',
    priority: 'HIGH',
    planned_end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[1].id, username: MOCK_MEMBERS[1].name, avatar_url: MOCK_MEMBERS[1].avatar_url }],
  },
  {
    task_id: 't4',
    task_number: 4,
    title: 'Lỗi hiển thị banner trên Safari mobile',
    project: { project_id: 'p1', name: 'Marketing Website', key: 'MKT' },
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    planned_end: new Date().toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[1].id, username: MOCK_MEMBERS[1].name, avatar_url: MOCK_MEMBERS[1].avatar_url }],
  },
  {
    task_id: 't5',
    task_number: 5,
    title: 'Setup CI/CD Pipeline',
    project: { project_id: 'p2', name: 'Backend API', key: 'API' },
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[0].id, username: MOCK_MEMBERS[0].name, avatar_url: MOCK_MEMBERS[0].avatar_url }],
  },
  {
    task_id: 't6',
    task_number: 6,
    title: 'Database Migration',
    project: { project_id: 'p2', name: 'Backend API', key: 'API' },
    status: 'DONE',
    priority: 'MEDIUM',
    planned_end: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [{ user_id: MOCK_MEMBERS[3].id, username: MOCK_MEMBERS[3].name, avatar_url: MOCK_MEMBERS[3].avatar_url }],
  },
];