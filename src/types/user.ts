/**
 * User Entity
 * Module 1: Identity and Access Management
 * 
 * Định danh cốt lõi của hệ thống
 */

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash?: string; // Không trả về từ API
  status: UserStatus;
  email_verified_at?: string; // ISO timestamp
  created_at: string;
  updated_at: string;
  // Frontend only fields
  full_name?: string;
  avatar_url?: string;
}

export interface UserProfile extends User {
  full_name: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface UpdateUserDTO {
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface ChangePasswordDTO {
  current_password: string;
  new_password: string;
}
