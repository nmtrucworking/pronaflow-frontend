import axiosClient from '../lib/axiosClient'
import type { ProjectPriority, ProjectStatus } from '../types/reference';

export const referenceService = {
  /**
   * Lấy danh sách mức độ ưu tiên
   */
  getProjectPriorities: async (): Promise<ProjectPriority[]> => {
    // Gọi API đã tạo ở Bước 1
    // Đường dẫn phải khớp với cấu hình router trong FastAPI
    const response = await axiosClient.get<ProjectPriority[]>('/references/project-priorities');
    return response.data;
  },

  /**
   * Lấy danh sách trạng thái
   */
  getProjectStatuses: async (): Promise<ProjectStatus[]> => {
    const response = await axiosClient.get<ProjectStatus[]>('/references/project-statuses');
    return response.data;
  },
  
  /**
   * Helper để lấy màu sắc theo Priority Code (Dùng cho UI Badge)
   * Hàm này giúp xử lý đồng bộ màu sắc mà không cần gọi API liên tục
   */
  getPriorityColor: (priorities: ProjectPriority[], code: string): string => {
    const priority = priorities.find(p => p.code === code);
    return priority ? priority.color_hex : '#6B7280'; // Default gray
  },
  
  /**
   * Helper để lấy tên hiển thị theo ngôn ngữ
   */
  getPriorityLabel: (priorities: ProjectPriority[], code: string, lang: 'vi' | 'en' = 'vi'): string => {
    const priority = priorities.find(p => p.code === code);
    return priority ? (lang === 'vi' ? priority.name_vi : priority.name_en) : code;
  }
};