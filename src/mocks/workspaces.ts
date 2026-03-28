import type { Workspace, WorkspaceInvitation, WorkspaceMember, WorkspaceSetting } from '@/types/workspace';
import { MOCK_USERS_BY_ID } from '@/mocks/users';

const NOW = new Date('2026-03-01T09:00:00.000Z').toISOString();

export const MOCK_WORKSPACES: Workspace[] = [
	{
		id: 'ws-1',
		name: 'PronaFlow Product HQ',
		description: 'Workspace chinh danh cho mock governance, project va collaboration.',
		owner_id: 'u-1',
		status: 'ACTIVE',
		is_deleted: false,
		created_at: NOW,
		updated_at: NOW,
	},
	{
		id: 'ws-2',
		name: 'PronaFlow Sandbox Lab',
		description: 'Workspace thu nghiem cho edge-case, archive va migration rehearsal.',
		owner_id: 'u-2',
		status: 'ACTIVE',
		is_deleted: false,
		created_at: '2026-01-10T09:00:00.000Z',
		updated_at: '2026-03-28T09:00:00.000Z',
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
			email: MOCK_USERS_BY_ID['u-1'].email ?? 'owner@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-1'].username,
			avatar: MOCK_USERS_BY_ID['u-1'].avatar_url,
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
			email: MOCK_USERS_BY_ID['u-2'].email ?? 'admin@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-2'].username,
			avatar: MOCK_USERS_BY_ID['u-2'].avatar_url,
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
			email: MOCK_USERS_BY_ID['u-3'].email ?? 'member@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-3'].username,
			avatar: MOCK_USERS_BY_ID['u-3'].avatar_url,
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
			email: MOCK_USERS_BY_ID['u-4'].email ?? 'viewer@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-4'].username,
			avatar: MOCK_USERS_BY_ID['u-4'].avatar_url,
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
			email: MOCK_USERS_BY_ID['u-5'].email ?? 'guest@partner.local',
			username: MOCK_USERS_BY_ID['u-5'].username,
			avatar: MOCK_USERS_BY_ID['u-5'].avatar_url,
		},
	},
	{
		id: 'wm-6',
		workspace_id: 'ws-2',
		user_id: 'u-7',
		role: 'admin',
		is_active: true,
		joined_at: '2026-02-18T09:00:00.000Z',
		user: {
			id: 'u-7',
			email: MOCK_USERS_BY_ID['u-7'].email ?? 'analyst@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-7'].username,
			avatar: MOCK_USERS_BY_ID['u-7'].avatar_url,
		},
	},
	{
		id: 'wm-7',
		workspace_id: 'ws-2',
		user_id: 'u-10',
		role: 'member',
		is_active: false,
		joined_at: '2026-02-01T09:00:00.000Z',
		left_at: '2026-03-01T09:00:00.000Z',
		user: {
			id: 'u-10',
			email: MOCK_USERS_BY_ID['u-10'].email ?? 'retired.user@pronaflow.local',
			username: MOCK_USERS_BY_ID['u-10'].username,
			avatar: MOCK_USERS_BY_ID['u-10'].avatar_url,
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
		accepted_at: null,
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
		workspace_id: 'ws-2',
		email: 'contractor@vendor.local',
		invited_role: 'guest',
		token_hash: 'mock-token-3',
		expires_at: '2026-03-04T09:00:00.000Z',
		accepted_at: null,
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

export const MOCK_WORKSPACE_DATASET = {
	default: {
		workspaces: MOCK_WORKSPACES,
		members: MOCK_WORKSPACE_MEMBERS,
		invitations: MOCK_WORKSPACE_INVITATIONS,
		settings: MOCK_WORKSPACE_SETTINGS,
	},
	empty: {
		workspaces: [] as Workspace[],
		members: [] as WorkspaceMember[],
		invitations: [] as WorkspaceInvitation[],
		settings: null,
	},
};
