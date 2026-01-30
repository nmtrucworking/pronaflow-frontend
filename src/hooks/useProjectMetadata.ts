import { useQuery } from '@tanstack/react-query';
import { referenceService } from '../services/referenceService';
import type { ProjectPriority, ProjectStatus } from '../types/reference';

// Dữ liệu Mock để hiển thị ngay lập tức (Instant Feedback)
const INITIAL_PRIORITIES: ProjectPriority[] = [
    { id: 1, code: "PRJ_PRIORITY_CRITICAL", name_en: "Critical", name_vi: "Khẩn cấp", description: "", color_hex: "#DC2626", icon: "alert-triangle" },
    // ... (như cũ)
];

export const useProjectMetadata = () => {
  // Query cho Priorities
  const { 
    data: priorities = INITIAL_PRIORITIES, 
    isLoading: isLoadingPriorities,
    isError: isErrorPriorities 
  } = useQuery({
    queryKey: ['references', 'priorities'],
    queryFn: referenceService.getProjectPriorities,
    staleTime: 1000 * 60 * 60, // Cache dữ liệu trong 1 giờ (vì Master data ít thay đổi)
    placeholderData: INITIAL_PRIORITIES // Hiển thị dữ liệu giả trong khi chờ API
  });

  // Query cho Statuses
  const { 
    data: statuses = [], 
    isLoading: isLoadingStatuses 
  } = useQuery({
    queryKey: ['references', 'statuses'],
    queryFn: referenceService.getProjectStatuses,
    staleTime: 1000 * 60 * 60,
  });

  return { 
    priorities, 
    statuses, 
    loading: isLoadingPriorities || isLoadingStatuses 
  };
};