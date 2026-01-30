import type { TrashItemEntity } from './types';

export const MOCK_TRASH_ITEMS: TrashItemEntity[] = [
  {
    trash_id: 't1',
    entity_type: 'TASK',
    entity_id: 'task-101',
    name: 'Thiết kế Wireframe trang chủ v2',
    original_location: 'Dự án: Website Redesign',
    deleted_by: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
    deleted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    purge_after: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    trash_id: 't2',
    entity_type: 'FILE',
    entity_id: 'file-202',
    name: 'Báo cáo tài chính Q3_final.pdf',
    original_location: 'Task: Tổng kết quý',
    deleted_by: { id: 'u2', name: 'Trần Thị B', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=E11D48&color=fff' },
    deleted_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    purge_after: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(),
    size: '2.4 MB'
  },
  {
    trash_id: 't3',
    entity_type: 'PROJECT',
    entity_id: 'proj-303',
    name: 'Marketing Chiến dịch Mùa hè (Old)',
    original_location: 'Workspace: PronaFlow Corp',
    deleted_by: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
    deleted_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    purge_after: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    trash_id: 't4',
    entity_type: 'NOTE',
    entity_id: 'note-404',
    name: 'Biên bản cuộc họp Product 12/10',
    original_location: 'Wiki: Product Team',
    deleted_by: { id: 'u3', name: 'Lê C', avatar: 'https://ui-avatars.com/api/?name=Le+C&background=059669&color=fff' },
    deleted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    purge_after: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    trash_id: 't5',
    entity_type: 'TASK',
    entity_id: 'task-105',
    name: 'Fix bug login mobile',
    original_location: 'Dự án: Mobile App MVP',
    deleted_by: { id: 'u1', name: 'Nguyễn Văn A', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff' },
    deleted_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    purge_after: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
