import type { AxiosError } from 'axios';

interface ApiErrorPayload {
  detail?: string;
  message?: string;
  error?: string;
  code?: string;
  retry_after_seconds?: number;
}

const SENSITIVE_KEYWORDS = [
  'token',
  'password',
  'secret',
  'credential',
  'stack',
  'traceback',
  'sql',
];

const getPayload = (error: unknown): ApiErrorPayload => {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  return axiosError?.response?.data ?? {};
};

export const getErrorCode = (error: unknown): string | undefined => {
  const payload = getPayload(error);
  return payload.code?.toLowerCase();
};

export const getRetryAfterSeconds = (error: unknown): number | undefined => {
  const payload = getPayload(error);
  if (typeof payload.retry_after_seconds === 'number') {
    return payload.retry_after_seconds;
  }

  const axiosError = error as AxiosError;
  const headerValue = axiosError?.response?.headers?.['retry-after'];
  const parsed = Number(headerValue);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const isRateLimitedError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  const status = axiosError?.response?.status;
  if (status === 429) {
    return true;
  }

  const code = getErrorCode(error);
  return code === 'too_many_requests' || code === 'rate_limited';
};

export const isAccountLockedError = (error: unknown): boolean => {
  const code = getErrorCode(error);
  if (code === 'account_locked' || code === 'locked_out') {
    return true;
  }

  const message = getReadableMessage(error, '').toLowerCase();
  return message.includes('locked') || message.includes('temporarily blocked');
};

export const isUnverifiedEmailError = (error: unknown): boolean => {
  const code = getErrorCode(error);
  if (code === 'email_not_verified' || code === 'pending_verification') {
    return true;
  }

  const message = getReadableMessage(error, '').toLowerCase();
  return message.includes('verify') && message.includes('email');
};

export const getReadableMessage = (error: unknown, fallback: string): string => {
  const payload = getPayload(error);
  const raw = payload.detail || payload.message || payload.error || fallback;
  return sanitizeAuthErrorMessage(raw, fallback);
};

export const sanitizeAuthErrorMessage = (message: string, fallback: string): string => {
  if (!message) {
    return fallback;
  }

  const normalized = message.trim();
  const lower = normalized.toLowerCase();

  if (SENSITIVE_KEYWORDS.some((keyword) => lower.includes(keyword))) {
    return fallback;
  }

  if (normalized.length > 180) {
    return fallback;
  }

  return normalized;
};
