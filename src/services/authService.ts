/**
 * Authentication Service
 * Module 1: Identity and Access Management (IAM)
 * 
 * Handles all authentication-related API calls
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    user_id: string;
    email: string;
    username: string;
    roles: string[];
  };
  mfa_required: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name: string;
}

export interface RegisterResponse {
  user_id: string;
  email: string;
  username: string;
  status: 'pending_verification';
  email_verified_at: null;
  created_at: string;
  roles: string[];
}

export interface VerifyEmailRequest {
  user_id: string;
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface CurrentUserResponse {
  user_id: string;
  email: string;
  username: string;
  full_name: string;
  status: 'active' | 'pending_verification' | 'suspended';
  email_verified_at: string | null;
  mfa_enabled: boolean;
  roles: string[];
  created_at: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ConfirmPasswordResetRequest {
  user_id: string;
  token: string;
  new_password: string;
}

export interface MFAEnableResponse {
  secret: string;
  qr_code: string; // Base64 encoded image
  backup_codes: string[];
}

export interface ConfirmMFARequest {
  totp_code: string;
}

export interface VerifyMFACodeRequest {
  email: string;
  totp_code: string;
}

export interface DisableMFARequest {
  password: string;
}

export interface SessionInfo {
  session_id: string;
  user_agent: string;
  ip_address: string;
  device: string;
  location: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
}

export interface SessionsListResponse {
  sessions: SessionInfo[];
  total: number;
}

export interface RevokeSessionRequest {
  session_id: string;
}

// ============================================================================
// AUTH SERVICE
// ============================================================================

class AuthService {
  private readonly baseURL = '/auth';

  /**
   * User Registration
   * POST /api/v1/auth/register
   */
  async register(data: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> {
    return axiosClient.post(`${this.baseURL}/register`, data);
  }

  /**
   * User Login
   * POST /api/v1/auth/login
   */
  async login(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return axiosClient.post(`${this.baseURL}/login`, data);
  }

  /**
   * Verify Email
   * POST /api/v1/auth/verify-email
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/verify-email`, data);
  }

  /**
   * Resend Verification Email
   * POST /api/v1/auth/resend-verification
   */
  async resendVerification(data: ResendVerificationRequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/resend-verification`, data);
  }

  /**
   * Get Current User
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<AxiosResponse<CurrentUserResponse>> {
    return axiosClient.get(`${this.baseURL}/me`);
  }

  /**
   * Logout
   * POST /api/v1/auth/logout
   */
  async logout(): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/logout`);
  }

  /**
   * Request Password Reset
   * POST /api/v1/auth/password-reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/password-reset`, data);
  }

  /**
   * Confirm Password Reset
   * POST /api/v1/auth/password-reset/confirm
   */
  async confirmPasswordReset(data: ConfirmPasswordResetRequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/password-reset/confirm`, data);
  }

  // ========================================================================
  // MFA Methods
  // ========================================================================

  /**
   * Enable MFA
   * POST /api/v1/auth/mfa/enable
   */
  async enableMFA(): Promise<AxiosResponse<MFAEnableResponse>> {
    return axiosClient.post(`${this.baseURL}/mfa/enable`);
  }

  /**
   * Confirm MFA Setup
   * POST /api/v1/auth/mfa/confirm
   */
  async confirmMFA(data: ConfirmMFARequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/mfa/confirm`, data);
  }

  /**
   * Verify MFA Code During Login
   * POST /api/v1/auth/mfa/verify
   */
  async verifyMFACode(data: VerifyMFACodeRequest): Promise<AxiosResponse<LoginResponse>> {
    return axiosClient.post(`${this.baseURL}/mfa/verify`, data);
  }

  /**
   * Disable MFA
   * POST /api/v1/auth/mfa/disable
   */
  async disableMFA(data: DisableMFARequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/mfa/disable`, data);
  }

  /**
   * Get MFA Backup Codes
   * GET /api/v1/auth/mfa/backup-codes
   */
  async getMFABackupCodes(): Promise<AxiosResponse<{ backup_codes: string[] }>> {
    return axiosClient.get(`${this.baseURL}/mfa/backup-codes`);
  }

  // ========================================================================
  // Session Management Methods
  // ========================================================================

  /**
   * Get All Active Sessions
   * GET /api/v1/auth/sessions
   */
  async getAllSessions(): Promise<AxiosResponse<SessionsListResponse>> {
    return axiosClient.get(`${this.baseURL}/sessions`);
  }

  /**
   * Revoke Specific Session
   * POST /api/v1/auth/sessions/revoke
   */
  async revokeSession(data: RevokeSessionRequest): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/sessions/revoke`, data);
  }

  /**
   * Revoke All Sessions Except Current
   * POST /api/v1/auth/sessions/revoke-all
   */
  async revokeAllSessions(): Promise<AxiosResponse> {
    return axiosClient.post(`${this.baseURL}/sessions/revoke-all`);
  }

  // ========================================================================
  // Token Management
  // ========================================================================

  /**
   * Refresh Access Token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<AxiosResponse<{ access_token: string }>> {
    return axiosClient.post(`${this.baseURL}/refresh`, { refresh_token: refreshToken });
  }

  // ========================================================================
  // Utility Methods
  // ========================================================================

  /**
   * Store tokens in localStorage
   */
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
export default authService;
