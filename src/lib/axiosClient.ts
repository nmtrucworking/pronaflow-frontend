/// <reference types="vite/client" />
import axios from 'axios';
import { ROUTES } from '@/routes/paths';
import type { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/v1';

export const API_ROOT_URL = API_BASE_URL.replace(/\/v1\/?$/, '');
export const API_MODE = (import.meta.env.VITE_API_MODE ?? 'backend').toLowerCase();
export const isMockApiMode = API_MODE === 'mock';

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshTokenPromise: Promise<string | null> | null = null;

const redirectToLogin = () => {
  if (window.location.pathname !== ROUTES.auth.login) {
    window.location.href = ROUTES.auth.login;
  }
};

const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

const isRefreshRequest = (config?: InternalAxiosRequestConfig): boolean => {
  const requestUrl = config?.url ?? '';
  return /\/auth\/refresh$/i.test(requestUrl);
};

const getOrCreateRefreshTokenPromise = async (): Promise<string | null> => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = axios
      .post<{ access_token: string; refresh_token?: string }>(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: localStorage.getItem('refresh_token'),
      })
      .then((response) => {
        const nextAccessToken = response.data.access_token;
        const nextRefreshToken = response.data.refresh_token;

        if (!nextAccessToken) {
          return null;
        }

        localStorage.setItem('access_token', nextAccessToken);
        if (nextRefreshToken) {
          localStorage.setItem('refresh_token', nextRefreshToken);
        }
        return nextAccessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshTokenPromise = null;
      });
  }

  return refreshTokenPromise;
};

const attachInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const { response } = error;
      const originalRequest = error.config as RetryRequestConfig | undefined;

      if (response) {
        if (
          response.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !isRefreshRequest(originalRequest) &&
          localStorage.getItem('refresh_token')
        ) {
          originalRequest._retry = true;

          const nextAccessToken = await getOrCreateRefreshTokenPromise();
          if (nextAccessToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
            return instance(originalRequest);
          }
        }

        if (response.status === 401) {
          clearAuthTokens();
          redirectToLogin();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance =>
  attachInterceptors(
    axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })
  );

const axiosClient: AxiosInstance = createApiClient();

export const apiClient = axiosClient;

export default axiosClient;