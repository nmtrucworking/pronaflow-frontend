/**
 * Auth Hooks
 * Module 1: Identity and Access Management
 * 
 * Reusable React hooks for authentication operations
 */

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import authService from '@/services/authService';
import { setUser, clearAuth } from '@/store/features/authSlice';
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  PasswordResetRequest,
  ConfirmPasswordResetRequest,
  ConfirmMFARequest,
  VerifyMFACodeRequest,
  DisableMFARequest,
  CurrentUserResponse,
  MFAEnableResponse,
  SessionsListResponse,
  RevokeSessionRequest,
} from '@/services/authService';

// ============================================================================
// useAuth Hook
// ============================================================================

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const error = useSelector((state: RootState) => state.auth.error);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
};

// ============================================================================
// useLogin Hook
// ============================================================================

export const useLogin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.login(credentials);
        const { access_token, refresh_token, user, mfa_required } = response.data;

        if (mfa_required) {
          setMfaRequired(true);
          return { success: false, mfaRequired: true };
        }

        // Store tokens and set user
        authService.setTokens(access_token, refresh_token);
        dispatch(setUser(user));

        return { success: true, mfaRequired: false };
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Login failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  return { login, isLoading, error, mfaRequired };
};

// ============================================================================
// useRegister Hook
// ============================================================================

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register, isLoading, error };
};

// ============================================================================
// useVerifyEmail Hook
// ============================================================================

export const useVerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = useCallback(async (data: VerifyEmailRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyEmail(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Email verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (data: ResendVerificationRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendVerification(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Resend verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { verifyEmail, resendVerification, isLoading, error };
};

// ============================================================================
// usePasswordReset Hook
// ============================================================================

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestReset = useCallback(async (data: PasswordResetRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Password reset request failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmReset = useCallback(async (data: ConfirmPasswordResetRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.confirmPasswordReset(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Password reset confirmation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { requestReset, confirmReset, isLoading, error };
};

// ============================================================================
// useMFA Hook
// ============================================================================

export const useMFA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaSetup, setMfaSetup] = useState<MFAEnableResponse | null>(null);

  const enableMFA = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.enableMFA();
      setMfaSetup(response.data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to enable MFA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmMFA = useCallback(async (data: ConfirmMFARequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.confirmMFA(data);
      setMfaSetup(null);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'MFA confirmation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyMFACode = useCallback(async (data: VerifyMFACodeRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.verifyMFACode(data);
      const { access_token, refresh_token } = response.data;
      authService.setTokens(access_token, refresh_token);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'MFA verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableMFA = useCallback(async (data: DisableMFARequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.disableMFA(data);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to disable MFA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBackupCodes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.getMFABackupCodes();
      return { success: true, data: response.data.backup_codes };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch backup codes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { enableMFA, confirmMFA, verifyMFACode, disableMFA, getBackupCodes, isLoading, error, mfaSetup };
};

// ============================================================================
// useSessions Hook
// ============================================================================

export const useSessions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionsListResponse | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.getAllSessions();
      setSessions(response.data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch sessions';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeSession = useCallback(async (data: RevokeSessionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.revokeSession(data);
      // Refresh sessions list
      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to revoke session';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

  const revokeAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.revokeAllSessions();
      await fetchSessions();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to revoke all sessions';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [fetchSessions]);

  return { fetchSessions, revokeSession, revokeAll, sessions, isLoading, error };
};

// ============================================================================
// useLogout Hook
// ============================================================================

export const useLogout = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth state regardless of API result
      authService.clearTokens();
      dispatch(clearAuth());
      setIsLoading(false);
    }
  }, [dispatch]);

  return { logout, isLoading };
};

// ============================================================================
// useCurrentUser Hook
// ============================================================================

export const useCurrentUser = () => {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Failed to fetch current user';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { user, isLoading, error };
};
