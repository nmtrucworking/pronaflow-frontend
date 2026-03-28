import type { Workspace, WorkspaceInvitation, WorkspaceMember, WorkspaceSetting } from '@/types/workspace';

const NOW = new Date('2026-03-01T09:00:00.000Z').toISOString();

export const MOCK_WORKSPACES: Workspace[] = [
	{
		id: 'ws-1',
		name: 'PronaFlow Product HQ',
		description: 'Workspace giả lập cho kiểm thử quản trị và phân quyền.',
		owner_id: 'u-1',
		status: 'ACTIVE',
		is_deleted: false,
		created_at: NOW,
		updated_at: NOW,
	},
];

export const MOCK_WORKSPACE_MEMBERS: WorkspaceMember[] = [
	{
		id: 'wm-1',
		workspace_id: 'ws-1',
		user_id: 'u-1',
		role: 'owner',
		is_active: true,
		joined_at: '2025-11-15T08:00:00.000Z',
		user: {
			id: 'u-1',
			email: 'owner@pronaflow.local',
			username: 'linh.owner',
			avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=128&h=128&fit=crop',
		},
	},
	{
		id: 'wm-2',
		workspace_id: 'ws-1',
		user_id: 'u-2',
		role: 'admin',
		is_active: true,
		joined_at: '2025-12-02T09:00:00.000Z',
		user: {
			id: 'u-2',
			email: 'admin@pronaflow.local',
			username: 'huy.admin',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop',
		},
	},
	{
		id: 'wm-3',
		workspace_id: 'ws-1',
		user_id: 'u-3',
		role: 'member',
		is_active: true,
		joined_at: '2026-01-04T09:00:00.000Z',
		user: {
			id: 'u-3',
			email: 'member@pronaflow.local',
			username: 'minh.member',
			avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=128&h=128&fit=crop',
		},
	},
	{
		id: 'wm-4',
		workspace_id: 'ws-1',
		user_id: 'u-4',
		role: 'viewer',
		is_active: true,
		joined_at: '2026-01-25T09:00:00.000Z',
		user: {
			id: 'u-4',
			email: 'viewer@pronaflow.local',
			username: 'thao.viewer',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop',
		},
	},
	{
		id: 'wm-5',
		workspace_id: 'ws-1',
		user_id: 'u-5',
		role: 'guest',
		is_active: true,
		joined_at: '2026-02-15T09:00:00.000Z',
		user: {
			id: 'u-5',
			email: 'guest@partner.local',
			username: 'quoc.guest',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop',
		},
	},
];

export const MOCK_WORKSPACE_INVITATIONS: WorkspaceInvitation[] = [
	{
		id: 'wi-1',
		workspace_id: 'ws-1',
		email: 'new.admin@pronaflow.local',
		invited_role: 'admin',
		token_hash: 'mock-token-1',
		expires_at: '2026-03-05T09:00:00.000Z',
		created_at: '2026-02-28T09:00:00.000Z',
		invited_by: 'u-1',
	},
	{
		id: 'wi-2',
		workspace_id: 'ws-1',
		email: 'observer@partner.local',
		invited_role: 'viewer',
		token_hash: 'mock-token-2',
		expires_at: '2026-03-03T09:00:00.000Z',
		created_at: '2026-02-27T09:00:00.000Z',
		invited_by: 'u-2',
	},
	{
		id: 'wi-3',
		workspace_id: 'ws-1',
		email: 'contractor@vendor.local',
		invited_role: 'guest',
		token_hash: 'mock-token-3',
		expires_at: '2026-03-04T09:00:00.000Z',
		created_at: '2026-02-26T09:00:00.000Z',
		invited_by: 'u-2',
	},
];

export const MOCK_WORKSPACE_SETTINGS: WorkspaceSetting = {
	workspace_id: 'ws-1',
	timezone: 'Asia/Ho_Chi_Minh',
	work_days: 'Mon,Tue,Wed,Thu,Fri',
	work_hours: '08:30-17:30',
	logo_url: '',
	updated_at: NOW,
};
