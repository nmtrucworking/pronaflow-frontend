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
import { setUser, clearAuth, setMFARequired, setPendingEmail } from '@/store/features/authSlice';
import {
  getReadableMessage,
  isAccountLockedError,
  isRateLimitedError,
  isUnverifiedEmailError,
  getRetryAfterSeconds,
} from '@/features/auth/utils/authError';
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
  const mfaRequired = useSelector((state: RootState) => state.auth.mfaRequired);
  const pendingEmail = useSelector((state: RootState) => state.auth.pendingEmail);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    mfaRequired,
    pendingEmail,
  };
};

export const useAuthBootstrap = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!isAuthenticated || user) {
        return;
      }

      setIsBootstrapping(true);
      try {
        const response = await authService.getCurrentUser();
        if (!cancelled) {
          dispatch(setUser(response.data));
        }
      } catch {
        if (!cancelled) {
          authService.clearTokens();
          dispatch(clearAuth());
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated, user]);

  return { isBootstrapping };
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
          dispatch(setMFARequired(true));
          dispatch(setPendingEmail(credentials.email));
          return { success: false, mfaRequired: true, pendingEmail: credentials.email };
        }

        // Store tokens and set user
        authService.setTokens(access_token, refresh_token);
        dispatch(setUser(user));
        dispatch(setPendingEmail(null));

        return { success: true, mfaRequired: false };
      } catch (err: unknown) {
        const fallbackMessage = 'Login failed. Please check your credentials and try again.';
        const errorMessage = getReadableMessage(err, fallbackMessage);
        setError(errorMessage);

        if (isUnverifiedEmailError(err)) {
          return {
            success: false,
            error: errorMessage,
            unverifiedEmail: true,
            pendingEmail: credentials.email,
          };
        }

        if (isRateLimitedError(err) || isAccountLockedError(err)) {
          return {
            success: false,
            error: errorMessage,
            isLocked: true,
            retryAfterSeconds: getRetryAfterSeconds(err),
          };
        }

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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Registration failed. Please try again.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Email verification failed. Please request a new link.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Could not resend verification email. Please try again.');
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
    } catch {
      // Keep forgot-password flow neutral to avoid account enumeration.
      const neutralMessage = 'If the email exists, reset instructions will be sent shortly.';
      setError(null);
      return { success: true, message: neutralMessage };
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Password reset failed. Please request a new link.');
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
  const dispatch = useDispatch();
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to enable MFA. Please try again.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'MFA confirmation failed. Please verify your code and retry.');
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
      const { access_token, refresh_token, user } = response.data;
      authService.setTokens(access_token, refresh_token);
      dispatch(setUser(user));
      dispatch(setMFARequired(false));
      dispatch(setPendingEmail(null));
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'MFA verification failed. Use a valid 6-digit code.');
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const disableMFA = useCallback(async (data: DisableMFARequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.disableMFA(data);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to disable MFA. Please try again.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to fetch backup codes.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to fetch sessions.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to revoke session.');
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
    } catch (err: unknown) {
      const errorMessage = getReadableMessage(err, 'Failed to revoke sessions.');
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
    } catch {
      // Ignore network/logout endpoint failures and clear local auth regardless.
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
      } catch (err: unknown) {
        const errorMessage = getReadableMessage(err, 'Failed to fetch current user');
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
