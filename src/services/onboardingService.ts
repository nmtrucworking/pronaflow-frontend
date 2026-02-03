/**
 * Onboarding Service
 * Module 16: User Onboarding & Adoption
 * 
 * Handles user onboarding, surveys, tutorials, and product tours
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

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

export interface SurveyQuestion {
  question_id: string;
  survey_id: string;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'rating' | 'boolean';
  options?: string[];
  is_required: boolean;
  order: number;
}

export interface SurveyResponse {
  response_id: string;
  survey_id: string;
  user_id: string;
  answers: Record<string, any>;
  completed_at: string;
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

export interface UserOnboardingStatus {
  user_id: string;
  flow_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  current_step_id?: string;
  completed_steps: string[];
  started_at?: string;
  completed_at?: string;
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

export interface Checklist {
  checklist_id: string;
  user_id: string;
  name: string;
  items: ChecklistItem[];
  completed_count: number;
  total_count: number;
  created_at: string;
}

export interface ChecklistItem {
  item_id: string;
  title: string;
  description?: string;
  action_url?: string;
  completed: boolean;
  completed_at?: string;
}

// ============================================================================
// SURVEYS
// ============================================================================

/**
 * Create survey
 */
export const createSurvey = async (
  data: {
    title: string;
    description?: string;
    target_audience: 'new_users' | 'all_users' | 'specific_role';
  }
): Promise<AxiosResponse<OnboardingSurvey>> => {
  return axiosClient.post('/onboarding/surveys', data);
};

/**
 * Get all surveys
 */
export const getSurveys = async (
  params?: {
    status?: string;
  }
): Promise<AxiosResponse<{ surveys: OnboardingSurvey[] }>> => {
  return axiosClient.get('/onboarding/surveys', { params });
};

/**
 * Get survey by ID
 */
export const getSurveyById = async (
  surveyId: string
): Promise<AxiosResponse<OnboardingSurvey & { questions: SurveyQuestion[] }>> => {
  return axiosClient.get(`/onboarding/surveys/${surveyId}`);
};

/**
 * Add question to survey
 */
export const addSurveyQuestion = async (
  surveyId: string,
  data: {
    question_text: string;
    question_type: 'text' | 'multiple_choice' | 'rating' | 'boolean';
    options?: string[];
    is_required?: boolean;
  }
): Promise<AxiosResponse<SurveyQuestion>> => {
  return axiosClient.post(`/onboarding/surveys/${surveyId}/questions`, data);
};

/**
 * Submit survey response
 */
export const submitSurveyResponse = async (
  data: {
    survey_id: string;
    answers: Record<string, any>;
  }
): Promise<AxiosResponse<SurveyResponse>> => {
  return axiosClient.post('/onboarding/responses', data);
};

/**
 * Get survey responses
 */
export const getSurveyResponses = async (
  surveyId: string
): Promise<AxiosResponse<{ responses: SurveyResponse[] }>> => {
  return axiosClient.get(`/onboarding/surveys/${surveyId}/responses`);
};

// ============================================================================
// PERSONA
// ============================================================================

/**
 * Create user persona
 */
export const createPersona = async (
  data: {
    role: string;
    industry?: string;
    team_size?: string;
    goals?: string[];
    use_cases?: string[];
  }
): Promise<AxiosResponse<UserPersona>> => {
  return axiosClient.post('/onboarding/persona', data);
};

/**
 * Get current user persona
 */
export const getUserPersona = async (): Promise<AxiosResponse<UserPersona>> => {
  return axiosClient.get('/onboarding/persona');
};

/**
 * Update user persona
 */
export const updatePersona = async (
  data: Partial<UserPersona>
): Promise<AxiosResponse<UserPersona>> => {
  return axiosClient.patch('/onboarding/persona', data);
};

// ============================================================================
// ONBOARDING FLOWS
// ============================================================================

/**
 * Create onboarding flow
 */
export const createOnboardingFlow = async (
  data: {
    name: string;
    description?: string;
    target_persona?: string;
  }
): Promise<AxiosResponse<OnboardingFlow>> => {
  return axiosClient.post('/onboarding/flows', data);
};

/**
 * Get onboarding flows
 */
export const getOnboardingFlows = async (
  params?: {
    persona?: string;
    status?: string;
  }
): Promise<AxiosResponse<{ flows: OnboardingFlow[] }>> => {
  return axiosClient.get('/onboarding/flows', { params });
};

/**
 * Get user's onboarding status
 */
export const getUserOnboardingStatus = async (): Promise<AxiosResponse<UserOnboardingStatus>> => {
  return axiosClient.get('/onboarding/status');
};

/**
 * Start onboarding flow
 */
export const startOnboardingFlow = async (
  flowId: string
): Promise<AxiosResponse<UserOnboardingStatus>> => {
  return axiosClient.post(`/onboarding/flows/${flowId}/start`);
};

/**
 * Complete onboarding step
 */
export const completeOnboardingStep = async (
  flowId: string,
  stepId: string
): Promise<AxiosResponse<UserOnboardingStatus>> => {
  return axiosClient.post(`/onboarding/flows/${flowId}/steps/${stepId}/complete`);
};

/**
 * Skip onboarding
 */
export const skipOnboarding = async (
  flowId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/onboarding/flows/${flowId}/skip`);
};

// ============================================================================
// PRODUCT TOURS
// ============================================================================

/**
 * Create product tour
 */
export const createProductTour = async (
  data: {
    name: string;
    description?: string;
    route_pattern: string;
    trigger: 'automatic' | 'manual' | 'first_visit';
    steps: Partial<TourStep>[];
  }
): Promise<AxiosResponse<ProductTour>> => {
  return axiosClient.post('/onboarding/tours', data);
};

/**
 * Get product tours
 */
export const getProductTours = async (
  params?: {
    route?: string;
  }
): Promise<AxiosResponse<{ tours: ProductTour[] }>> => {
  return axiosClient.get('/onboarding/tours', { params });
};

/**
 * Get tour by ID
 */
export const getTourById = async (
  tourId: string
): Promise<AxiosResponse<ProductTour>> => {
  return axiosClient.get(`/onboarding/tours/${tourId}`);
};

/**
 * Mark tour as completed
 */
export const completeTour = async (
  tourId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/onboarding/tours/${tourId}/complete`);
};

/**
 * Dismiss tour
 */
export const dismissTour = async (
  tourId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/onboarding/tours/${tourId}/dismiss`);
};

// ============================================================================
// USER PROGRESS
// ============================================================================

/**
 * Get user progress
 */
export const getUserProgress = async (): Promise<AxiosResponse<UserProgress>> => {
  return axiosClient.get('/onboarding/progress');
};

/**
 * Update user progress
 */
export const updateUserProgress = async (
  data: {
    achievement?: string;
    milestone?: string;
  }
): Promise<AxiosResponse<UserProgress>> => {
  return axiosClient.post('/onboarding/progress', data);
};

// ============================================================================
// CHECKLISTS
// ============================================================================

/**
 * Get user checklist
 */
export const getUserChecklist = async (): Promise<AxiosResponse<Checklist>> => {
  return axiosClient.get('/onboarding/checklist');
};

/**
 * Complete checklist item
 */
export const completeChecklistItem = async (
  itemId: string
): Promise<AxiosResponse<Checklist>> => {
  return axiosClient.post(`/onboarding/checklist/items/${itemId}/complete`);
};

/**
 * Reset checklist
 */
export const resetChecklist = async (): Promise<AxiosResponse<Checklist>> => {
  return axiosClient.post('/onboarding/checklist/reset');
};

// ============================================================================
// TIPS & HINTS
// ============================================================================

/**
 * Get contextual tips
 */
export const getContextualTips = async (
  context: string
): Promise<AxiosResponse<{ tips: Array<{ title: string; content: string; action_url?: string }> }>> => {
  return axiosClient.get('/onboarding/tips', {
    params: { context }
  });
};

/**
 * Dismiss tip
 */
export const dismissTip = async (
  tipId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/onboarding/tips/${tipId}/dismiss`);
};

export default {
  // Surveys
  createSurvey,
  getSurveys,
  getSurveyById,
  addSurveyQuestion,
  submitSurveyResponse,
  getSurveyResponses,
  
  // Persona
  createPersona,
  getUserPersona,
  updatePersona,
  
  // Onboarding Flows
  createOnboardingFlow,
  getOnboardingFlows,
  getUserOnboardingStatus,
  startOnboardingFlow,
  completeOnboardingStep,
  skipOnboarding,
  
  // Product Tours
  createProductTour,
  getProductTours,
  getTourById,
  completeTour,
  dismissTour,
  
  // Progress
  getUserProgress,
  updateUserProgress,
  
  // Checklists
  getUserChecklist,
  completeChecklistItem,
  resetChecklist,
  
  // Tips
  getContextualTips,
  dismissTip,
};
