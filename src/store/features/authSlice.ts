/**
 * Auth Redux Slice
 * Module 1: Identity and Access Management
 * 
 * State management for authentication
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserStatus } from '@/types';

export interface User {
  user_id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  status: UserStatus;
  email_verified_at: string | null;
  mfa_enabled: boolean;
  roles: string[];
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  pendingEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaRequired: false,
  pendingEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.mfaRequired = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.mfaRequired = false;
      state.pendingEmail = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMFARequired: (state, action: PayloadAction<boolean>) => {
      state.mfaRequired = action.payload;
    },
    setPendingEmail: (state, action: PayloadAction<string | null>) => {
      state.pendingEmail = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  clearAuth,
  setLoading,
  setError,
  setMFARequired,
  setPendingEmail,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
