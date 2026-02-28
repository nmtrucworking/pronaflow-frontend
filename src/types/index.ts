/**
 * Central export point for all entity types
 * Frontend Type Definitions based on PronaFlow Backend Documentation
 */

// Identity & Access Management (Module 1)
export * from './user';
export type { UserStatus, UserProfile } from './user';

// Multi-tenancy (Module 2)
export * from './workspace';
export type { WorkspaceStatus } from './workspace';
export type {
	WorkspaceMemberRole,
	InviteWorkspaceMemberDTO,
	UpdateWorkspaceMemberRoleDTO,
	RemoveWorkspaceMemberDTO,
} from './workspace-member';

// Projects (Module 3)
export * from './project';
export type { ProjectStatus, ProjectType, ProjectPriority, ProjectMemberRole } from './project';

// Task Management (Module 4)
export * from './task';
export * from './subtask';
export type { TaskStatus, TaskPriority } from './task';

// Collaboration & Communication
export * from './comment';
export * from './notification';
export * from './tag';

// Files & Storage
export * from './file';

// Time Tracking (Module 11)
export * from './time-entry';

// Notes & Documentation
export * from './note';
export type { NoteStatus } from './note';

// Members
export * from './member';

// References
export * from './reference';

// Integration (Module 12)
export * from './integration';

// Billing (Module 13)
export * from './billing';

// Analytics (Module 9)
export type {
	Report,
	DashboardMetrics,
} from './analytics';

// Archive (Module 8)
export * from './archive';

// Admin (Module 14)
export * from './admin';

// Help Center (Module 15)
export * from './help-center';

// Onboarding (Module 16)
export * from './onboarding';

// Mocks
export * from './mock-type';
