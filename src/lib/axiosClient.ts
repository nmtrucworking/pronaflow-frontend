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

      if (response) {
        switch (response.status) {
          case 401:
            console.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            localStorage.removeItem('access_token');
            if (window.location.pathname !== ROUTES.auth.login) {
              window.location.href = ROUTES.auth.login;
            }
            break;

          case 403:
            console.error('Bạn không có quyền thực hiện hành động này.');
            break;

          case 404:
            console.error('Tài nguyên không tìm thấy.');
            break;

          case 422:
            console.error('Dữ liệu không hợp lệ:', response.data);
            break;

          case 500:
            console.error('Lỗi hệ thống. Vui lòng thử lại sau.');
            break;

          default:
            console.error(`Lỗi API (${response.status}):`, response.data);
        }
      } else if (error.request) {
        console.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        console.error('Lỗi cấu hình request:', error.message);
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

export default axiosClient;