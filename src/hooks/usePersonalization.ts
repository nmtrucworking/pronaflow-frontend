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
  NotificationPreference,
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

// ==================== Notification Preferences ====================

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => personalizationService.getNotificationPreferences(),
  });
};

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventType, data }: { eventType: string; data: Partial<NotificationPreference> }) =>
      personalizationService.updateNotificationPreference(eventType, data),
    onMutate: async ({ eventType, data }) => {
      await queryClient.cancelQueries({ queryKey: ['notification-preferences'] });

      const previous = queryClient.getQueryData<NotificationPreference[]>(['notification-preferences']);
      if (!previous) {
        return { previous };
      }

      queryClient.setQueryData<NotificationPreference[]>(
        ['notification-preferences'],
        previous.map((pref) =>
          pref.event_type === eventType
            ? {
                ...pref,
                ...data,
                channels: {
                  ...pref.channels,
                  ...(data.channels || {}),
                },
              }
            : pref
        )
      );

      return { previous };
    },
    onError: (error: any, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['notification-preferences'], context.previous);
      }
      toast.error(error.response?.data?.message || 'Failed to update notification preference');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
};

export const useBulkUpdateNotificationChannels = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventTypes,
      patch,
    }: {
      eventTypes: string[];
      patch: (current: NotificationPreference) => Partial<NotificationPreference>;
    }) => {
      const current = queryClient.getQueryData<NotificationPreference[]>(['notification-preferences']) || [];
      const target = current.filter((pref) => eventTypes.includes(pref.event_type));
      await Promise.all(
        target.map((pref) =>
          personalizationService.updateNotificationPreference(pref.event_type, patch(pref))
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
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

export const useDashboardLayouts = (workspaceId: string) => {
  return useQuery({
    queryKey: ['dashboard-layouts', workspaceId],
    queryFn: () => personalizationService.getDashboardLayouts(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useDashboardLayout = (workspaceId: string, layoutId: string) => {
  return useQuery({
    queryKey: ['dashboard-layout', workspaceId, layoutId],
    queryFn: () => personalizationService.getDashboardLayout(workspaceId, layoutId),
    enabled: !!workspaceId && !!layoutId,
  });
};

export const useCreateDashboardLayout = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDashboardLayoutDTO) => 
      personalizationService.createDashboardLayout(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', workspaceId] });
      toast.success('Dashboard layout created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create layout');
    },
  });
};

export const useUpdateDashboardLayout = (workspaceId: string, layoutId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDashboardLayoutDTO) => 
      personalizationService.updateDashboardLayout(workspaceId, layoutId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-layout', workspaceId, layoutId] });
      toast.success('Dashboard layout updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update layout');
    },
  });
};

export const useDeleteDashboardLayout = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (layoutId: string) => 
      personalizationService.deleteDashboardLayout(workspaceId, layoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', workspaceId] });
      toast.success('Dashboard layout deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete layout');
    },
  });
};

export const useSetDefaultLayout = (workspaceId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (layoutId: string) => 
      personalizationService.setDefaultLayout(workspaceId, layoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-layouts', workspaceId] });
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
      toast.error(error.response?.data?.message || 'Failed to reset shortcuts');
    },
  });
};
