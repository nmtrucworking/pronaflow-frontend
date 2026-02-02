/**
 * Auth Middleware
 * Module 1: Identity and Access Management
 * 
 * Handles token refresh and auth-related state management
 */

import type { Middleware } from '@reduxjs/toolkit';
import authService from '@/services/authService';

const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Pass action to next middleware
  const result = next(action);

  // Check if user needs to refresh token
  if (authService.isAuthenticated()) {
    const refreshToken = authService.getRefreshToken();
    if (refreshToken) {
      // Optional: Implement auto-refresh logic here
      // This would refresh the token before it expires
    }
  }

  return result;
};

export default authMiddleware;
