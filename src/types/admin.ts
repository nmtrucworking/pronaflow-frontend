/**
 * Admin System Types
 * Module 14: System Administration
 */

export interface AdminUser {
  admin_user_id: string;
  email: string;
  username: string;
  full_name: string;
  status: 'active' | 'locked' | 'suspended';
  roles: string[];
  last_login: string;
  created_at: string;
}

export interface Role {
  role_id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system_role: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  permission_id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface SystemConfig {
  config_id: string;
  key: string;
  value: any;
  description?: string;
  category?: string;
  is_public: boolean;
  updated_at: string;
}

export interface FeatureFlag {
  flag_id: string;
  key: string;
  enabled: boolean;
  description?: string;
  rollout_percentage?: number;
  target_users?: string[];
  target_workspaces?: string[];
  created_at: string;
  updated_at: string;
}

export interface SecurityIncident {
  incident_id: string;
  type: 'unauthorized_access' | 'data_breach' | 'suspicious_activity' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  description: string;
  user_id?: string;
  ip_address?: string;
  detected_at: string;
  resolved_at?: string;
  actions_taken?: string;
}
