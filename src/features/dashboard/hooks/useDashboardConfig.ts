import { useState, useCallback } from 'react';
import type { DashboardConfig } from '../types/dashboard-types';
import { DEFAULT_DASHBOARD_CONFIG } from '../constants/dashboard-constants';

interface UseDashboardConfigReturn {
  config: DashboardConfig;
  toggleConfig: (key: keyof DashboardConfig) => void;
  resetConfig: () => void;
}

export const useDashboardConfig = (): UseDashboardConfigReturn => {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD_CONFIG);

  const toggleConfig = useCallback((key: keyof DashboardConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_DASHBOARD_CONFIG);
  }, []);

  return { config, toggleConfig, resetConfig };
};
