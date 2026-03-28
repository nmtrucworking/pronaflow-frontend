import type { Member } from '@/types/member';

export interface MockUserProfile extends Member {
	name: string;
	role: 'Owner' | 'Admin' | 'Project Manager' | 'Developer' | 'QA' | 'Designer' | 'Analyst' | 'Viewer' | 'Guest';
	timezone: string;
	locale: string;
	skills: string[];
	status: 'active' | 'inactive';
}

export const MOCK_USERS: MockUserProfile[] = [
	{
		id: 'u-1',
		name: 'Linh Nguyen',
		username: 'linh.owner',
		full_name: 'Linh Nguyen',
		email: 'linh@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Linh+Nguyen&background=0F766E&color=fff',
		role: 'Owner',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['governance', 'stakeholder-management'],
		status: 'active',
	},
	{
		id: 'u-2',
		name: 'Huy Tran',
		username: 'huy.admin',
		full_name: 'Huy Tran',
		email: 'huy@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Huy+Tran&background=1D4ED8&color=fff',
		role: 'Admin',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['security', 'ops'],
		status: 'active',
	},
	{
		id: 'u-3',
		name: 'Anh Pham',
		username: 'anh.pm',
		full_name: 'Anh Pham',
		email: 'anh.pm@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Anh+Pham&background=DC2626&color=fff',
		role: 'Project Manager',
		timezone: 'Asia/Bangkok',
		locale: 'en-US',
		skills: ['planning', 'delivery', 'agile'],
		status: 'active',
	},
	{
		id: 'u-4',
		name: 'Minh Le',
		username: 'minh.dev',
		full_name: 'Minh Le',
		email: 'minh.dev@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Minh+Le&background=7C3AED&color=fff',
		role: 'Developer',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['react', 'typescript', 'testing'],
		status: 'active',
	},
	{
		id: 'u-5',
		name: 'Tuan Vu',
		username: 'tuan.qa',
		full_name: 'Tuan Vu',
		email: 'tuan.qa@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Tuan+Vu&background=059669&color=fff',
		role: 'QA',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['automation', 'regression', 'api-testing'],
		status: 'active',
	},
	{
		id: 'u-6',
		name: 'Nhi Do',
		username: 'nhi.design',
		full_name: 'Nhi Do',
		email: 'nhi.design@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Nhi+Do&background=F59E0B&color=fff',
		role: 'Designer',
		timezone: 'Asia/Singapore',
		locale: 'en-US',
		skills: ['ux', 'figma', 'design-system'],
		status: 'active',
	},
	{
		id: 'u-7',
		name: 'Bao Ho',
		username: 'bao.analyst',
		full_name: 'Bao Ho',
		email: 'bao.analytics@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Bao+Ho&background=475569&color=fff',
		role: 'Analyst',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['bi', 'kpi', 'forecast'],
		status: 'active',
	},
	{
		id: 'u-8',
		name: 'Thao Nguyen',
		username: 'thao.viewer',
		full_name: 'Thao Nguyen',
		email: 'thao.viewer@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Thao+Nguyen&background=9333EA&color=fff',
		role: 'Viewer',
		timezone: 'Asia/Ho_Chi_Minh',
		locale: 'vi-VN',
		skills: ['reporting'],
		status: 'active',
	},
	{
		id: 'u-9',
		name: 'Quoc Partner',
		username: 'quoc.guest',
		full_name: 'Quoc Partner',
		email: 'quoc.partner@vendor.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Quoc+Partner&background=0EA5E9&color=fff',
		role: 'Guest',
		timezone: 'Asia/Tokyo',
		locale: 'en-US',
		skills: ['vendor-collaboration'],
		status: 'active',
	},
	{
		id: 'u-10',
		name: 'Retired User',
		username: 'retired.user',
		full_name: 'Retired User',
		email: 'retired.user@pronaflow.local',
		avatar_url: 'https://ui-avatars.com/api/?name=Retired+User&background=94A3B8&color=fff',
		role: 'Viewer',
		timezone: 'UTC',
		locale: 'en-US',
		skills: ['legacy-system'],
		status: 'inactive',
	},
];

export const MOCK_USERS_BY_ID: Record<string, MockUserProfile> = MOCK_USERS.reduce((acc, user) => {
	acc[user.id] = user;
	return acc;
}, {} as Record<string, MockUserProfile>);

export const MOCK_CURRENT_USER = MOCK_USERS_BY_ID['u-3'];

export const MOCK_USER_SCENARIOS = {
	default: MOCK_USERS,
	activeOnly: MOCK_USERS.filter((user) => user.status === 'active'),
	inactiveOnly: MOCK_USERS.filter((user) => user.status === 'inactive'),
	empty: [] as MockUserProfile[],
};
