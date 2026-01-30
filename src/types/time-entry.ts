/**
 * TimeEntry Entity
 * Module 11: Time Tracking & Resource Utilization
 * 
 * Ghi nhận thời gian làm việc
 */

export type TimeEntrySource = 'MANUAL' | 'TIMER' | 'IMPORT' | 'AI_TRACKING';

export interface TimeEntry {
  time_entry_id: string;
  user_id: string;
  task_id: string;
  start_time: string; // ISO timestamp
  end_time?: string; // ISO timestamp, nullable for running timers
  duration_minutes: number;
  is_billable: boolean;
  source: TimeEntrySource;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateTimeEntryDTO {
  task_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  is_billable: boolean;
  description?: string;
  source?: TimeEntrySource;
}

export interface UpdateTimeEntryDTO {
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  is_billable?: boolean;
  description?: string;
}

export interface StartTimerDTO {
  task_id: string;
  description?: string;
}

export interface StopTimerDTO {
  description?: string;
}
