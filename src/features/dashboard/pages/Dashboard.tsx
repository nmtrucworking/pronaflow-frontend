import React, { useState } from 'react';
import { MOCK_TASKS, CURRENT_USER } from '@/mocks/task';
import {
  DashboardHeader,
  DashboardMain,
} from '../components';
import {
  useGroupedTasks,
  useDashboardConfig,
} from '../hooks';
import type { TaskEntity, DensityMode } from '../types/dashboard-types';

export default function DashboardPage() {
  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [tasks, setTasks] = useState<TaskEntity[]>(MOCK_TASKS);

  // Personalization State
  const { config, toggleConfig } = useDashboardConfig();

  // Grouped tasks
  const groupedTasks = useGroupedTasks({ tasks });

  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.task_id === id
          ? { ...t, status: t.status === 'DONE' ? 'IN_PROGRESS' : 'DONE' }
          : t
      )
    );
  };

  const handleNavigate = (type: string) => {
    console.log(`Navigating to list view: ${type}`);
    // Navigation logic here
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <DashboardHeader
        user={CURRENT_USER}
        density={density}
        config={config}
        groupedTasks={groupedTasks}
        onDensityChange={setDensity}
        onConfigToggle={toggleConfig}
      />

      <DashboardMain
        user={CURRENT_USER}
        groupedTasks={groupedTasks}
        density={density}
        config={config}
        onToggleTask={handleToggleTask}
        onNavigate={handleNavigate}
      />
    </div>
  );
}