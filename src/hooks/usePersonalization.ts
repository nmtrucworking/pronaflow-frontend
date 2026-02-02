/**
 * Personalization Custom Hooks
 * React Query hooks for user settings and preferences
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personalizationService } from '@/services/personalizationService';
import type {
  UpdateUserSettingsDTO,
  CreateDashboardLayoutDTO,
  UpdateDashboardLayoutDTO,
} from '@/types/personalization';
import { toast } from 'sonner';

// ==================== User Settings ====================

export const useUserSettings = (userId: string) => {
  return useQuery({
    queryKey: ['user-settings', userId],
    queryFn: () => personalizationService.getUserSettings(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserSettings = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserSettingsDTO) => 
      personalizationService.updateUserSettings(userId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', userId] });
      // Apply settings immediately
      personalizationService.applySettings(data);
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

export const useResetSettings = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => personalizationService.resetToDefaults(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', userId] });
      toast.success('Settings reset to defaults');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reset settings');
    },
  });
};

// ==================== Localization ====================

export const useAvailableLanguages = () => {
  return useQuery({
    queryKey: ['available-languages'],
    queryFn: () => personalizationService.getAvailableLanguages(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useTimezones = () => {
  return useQuery({
    queryKey: ['timezones'],
    queryFn: () => personalizationService.getTimezones(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// ==================== Dashboard Layouts ====================

export const useDashboardLayouts = (userId: string) => {
  return useQuery({
    queryKey: ['dashboard-layouts', userId],
    queryFn: () => personalizationService.getDashboardLayouts(userId),
    enabled: !!userId,
  });
};

export const useDashboardLayout = (userId: string, layoutId: string) => {
  return useQuery({
    queryKey: ['dashboard-layout', userId, layoutId],
    queryFn: () => personalizationService.getDashboardLayout(userId, layoutId),
    enabled: !!userId && !!layoutId,
  });
};

export const useCreateDashboardLayout = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDashboardLayoutDTO) => 
      personalizationService.createDashboardLayout(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', userId] });
      toast.success('Dashboard layout created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create layout');
    },
  });
};

export const useUpdateDashboardLayout = (userId: string, layoutId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDashboardLayoutDTO) => 
      personalizationService.updateDashboardLayout(userId, layoutId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-layout', userId, layoutId] });
      toast.success('Dashboard layout updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update layout');
    },
  });
};

export const useDeleteDashboardLayout = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (layoutId: string) => 
      personalizationService.deleteDashboardLayout(userId, layoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', userId] });
      toast.success('Dashboard layout deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete layout');
    },
  });
};

export const useSetDefaultLayout = (userId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (layoutId: string) => 
      personalizationService.setDefaultLayout(userId, layoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', userId] });
      toast.success('Default layout set');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to set default layout');
    },
  });
};

// ==================== Keyboard Shortcuts ====================

export const useKeyboardShortcuts = () => {
  return useQuery({
    queryKey: ['keyboard-shortcuts'],
    queryFn: () => personalizationService.getKeyboardShortcuts(),
  });
};

export const useUpdateKeyboardShortcut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ shortcutId, newKey }: { shortcutId: string; newKey: string }) => 
      personalizationService.updateKeyboardShortcut(shortcutId, newKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyboard-shortcuts'] });
      toast.success('Keyboard shortcut updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update shortcut');
    },
  });
};

export const useResetKeyboardShortcuts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => personalizationService.resetKeyboardShortcuts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keyboard-shortcuts'] });
      toast.success('Keyboard shortcuts reset to defaults');
    },
    onError: (error: any) => {
      toast.error(error.response?.data||message || 'Failed to reset shortcuts');
    },
  });
};
