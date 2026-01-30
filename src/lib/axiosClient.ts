import axios from 'axios';
import type { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse 
} from 'axios';

// 1. Khởi tạo instance với cấu hình mặc định
const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Timeout sau 30 giây
});

// 2. Request Interceptor: Tự động đính kèm Token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ LocalStorage (hoặc Cookies/State Management)
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

// 3. Response Interceptor: Xử lý phản hồi và lỗi chung
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response thành công
    // Bạn có thể return response.data tại đây nếu muốn code gọn hơn, 
    // nhưng return response giữ lại tính linh hoạt để check headers/status.
    return response;
  },
  async (error: AxiosError) => {
    const { response } = error;
    
    if (response) {
      // Xử lý các mã lỗi HTTP phổ biến
      switch (response.status) {
        case 401:
          // Unauthorized: Token hết hạn hoặc không hợp lệ
          console.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          
          // Xóa token và điều hướng về trang login
          // Lưu ý: Nên dùng event bus hoặc state management để trigger logout action thì tốt hơn window.location
          localStorage.removeItem('access_token');
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login'; 
          }
          break;
          
        case 403:
          // Forbidden: Không có quyền truy cập
          console.error('Bạn không có quyền thực hiện hành động này.');
          break;
          
        case 404:
          // Not Found: API không tồn tại
          console.error('Tài nguyên không tìm thấy.');
          break;
          
        case 422:
          // Validation Error (FastAPI thường trả về lỗi này)
          console.error('Dữ liệu không hợp lệ:', response.data);
          break;

        case 500:
          // Server Error
          console.error('Lỗi hệ thống. Vui lòng thử lại sau.');
          break;
          
        default:
          console.error(`Lỗi API (${response.status}):`, response.data);
      }
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được phản hồi (Mất mạng, Server down)
      console.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Lỗi khi thiết lập request
      console.error('Lỗi cấu hình request:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;