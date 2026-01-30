import type { Task } from '../types/task';
import { MOCK_MEMBERS } from './projects';

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', 
    key: 'MKT-101', 
    title: 'Thiết kế Wireframe Trang chủ',
    status: 'DONE', 
    priority: 'HIGH', 
    assignee: MOCK_MEMBERS[1],
    startDate: '2024-03-01', 
    dueDate: '2024-03-05', 
    progress: 100,
    type: 'STORY'
  },
  {
    id: 't2', 
    key: 'MKT-102', 
    title: 'Viết nội dung giới thiệu sản phẩm',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM', 
    assignee: MOCK_MEMBERS[2],
    startDate: '2024-03-06',
    dueDate: '2024-03-10', 
    progress: 60, 
    type: 'TASK',
    dependencies: ['t1']
  },
  {
    id: 't3', key: 'MKT-103', 
    title: 'Tích hợp cổng thanh toán VNPay',
    status: 'TODO', 
    priority: 'CRITICAL', 
    assignee: MOCK_MEMBERS[1],
    startDate: '2024-03-12',
    dueDate: '2024-03-20', 
    progress: 0, 
    type: 'STORY',
    dependencies: ['t2']
  },
  {
    id: 't4', key: 'MKT-104', 
    title: 'Lỗi hiển thị banner trên Safari mobile',
    status: 'REVIEW', 
    priority: 'HIGH', 
    assignee: MOCK_MEMBERS[1], 
    startDate: '2024-03-06',
    dueDate: '2024-03-08', 
    progress: 90, 
    type: 'BUG'
  },
];