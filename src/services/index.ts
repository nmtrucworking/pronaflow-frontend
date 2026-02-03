/**
 * Central Export Point for All Services
 * PronaFlow API Services
 */

// Module 1: Identity & Access Management
import authService from './authService';
export { default as authService } from './authService';
export * from './authService';

// Module 2: Workspace Management
import workspaceService from './workspaceService';
export { default as workspaceService } from './workspaceService';
export * from './workspaceService';

// Module 3: Project Lifecycle Management
import projectService from './projectService';
export { default as projectService } from './projectService';
export * from './projectService';

// Module 4: Task Execution & Orchestration
import taskService from './taskService';
export { default as taskService } from './taskService';
export * from './taskService';

// Module 6: Unified Collaboration Hub
import { referenceService } from './referenceService';
export { referenceService } from './referenceService';
export * from './referenceService';

// Module 7: Event-Driven Notifications
import notificationService from './notificationService';
export { default as notificationService } from './notificationService';
export * from './notificationService';

// Module 8: Archive & Data Management
import archiveService from './archiveService';
export { default as archiveService } from './archiveService';
export * from './archiveService';

// Module 9: Reports & Analytics
import analyticsService from './analyticsService';
export { default as analyticsService } from './analyticsService';
export * from './analyticsService';

// Module 12: Integration Ecosystem
import integrationService from './integrationService';
export { default as integrationService } from './integrationService';
export * from './integrationService';

// Module 9: Personalization & UX
import personalizationService from './personalizationService';
export { default as personalizationService } from './personalizationService';
export * from './personalizationService';

// Module 13: Subscription & Billing Management
import billingService from './billingService';
export { default as billingService } from './billingService';
export * from './billingService';

// Module 14: System Administration
import adminService from './adminService';
export { default as adminService } from './adminService';
export * from './adminService';

// Module 15: Help Center & Knowledge Base
import helpCenterService from './helpCenterService';
export { default as helpCenterService } from './helpCenterService';
export * from './helpCenterService';

// Module 16: User Onboarding & Adoption
import onboardingService from './onboardingService';
export { default as onboardingService } from './onboardingService';
export * from './onboardingService';

/**
 * Service Collection Object
 * Use this for accessing all services in one place
 */
export const services: Record<string, any> = {
  auth: authService,
  workspace: workspaceService,
  project: projectService,
  task: taskService,
  reference: referenceService,
  notification: notificationService,
  archive: archiveService,
  analytics: analyticsService,
  integration: integrationService,
  personalization: personalizationService,
  billing: billingService,
  admin: adminService,
  helpCenter: helpCenterService,
  onboarding: onboardingService,
};

export default services;
