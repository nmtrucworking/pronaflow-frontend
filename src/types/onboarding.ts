/**
 * Onboarding Types
 * Module 16: User Onboarding & Adoption
 */

export interface OnboardingSurvey {
  survey_id: string;
  title: string;
  description?: string;
  target_audience: 'new_users' | 'all_users' | 'specific_role';
  status: 'active' | 'inactive';
  questions_count: number;
  responses_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserPersona {
  persona_id: string;
  user_id: string;
  role: string;
  industry?: string;
  team_size?: string;
  goals?: string[];
  use_cases?: string[];
  created_at: string;
  updated_at: string;
}

export interface OnboardingFlow {
  flow_id: string;
  name: string;
  description?: string;
  target_persona?: string;
  steps: OnboardingStep[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface OnboardingStep {
  step_id: string;
  flow_id: string;
  title: string;
  description?: string;
  step_type: 'tutorial' | 'action' | 'video' | 'documentation';
  content?: any;
  action_required?: boolean;
  order: number;
}

export interface ProductTour {
  tour_id: string;
  name: string;
  description?: string;
  route_pattern: string;
  trigger: 'automatic' | 'manual' | 'first_visit';
  steps: TourStep[];
  status: 'active' | 'inactive';
  created_at: string;
}

export interface TourStep {
  step_id: string;
  title: string;
  content: string;
  target_element?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  order: number;
}

export interface UserProgress {
  user_id: string;
  onboarding_completed: boolean;
  profile_completion_percentage: number;
  first_project_created: boolean;
  first_task_created: boolean;
  team_invited: boolean;
  achievements: string[];
  tours_completed: string[];
}
