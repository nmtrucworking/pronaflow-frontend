import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_TASKS, CURRENT_USER } from '@/mocks/task';
import { ROUTES } from '@/routes/paths';
import {
  DashboardHeader,
  DashboardMain,
} from '../components';
import {
  useGroupedTasks,
  useDashboardConfig,
} from '../hooks';
import type { TaskEntity, DensityMode } from '../types/dashboard-types';
import type { TaskEntity as DetailTaskEntity } from '@/features/tasks/types';
import { TaskDetailPanel } from '@/features/tasks/components/TaskDetailPanel';

export default function DashboardPage() {
  const navigate = useNavigate();

  const [density, setDensity] = useState<DensityMode>('comfortable');
  const [tasks, setTasks] = useState<TaskEntity[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<DetailTaskEntity | null>(null);

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

  const mapToDetailTask = (task: TaskEntity): DetailTaskEntity => ({
    id: task.task_id,
    key: `${task.project.key}-${task.task_number}`,
    title: task.title,
    project: {
      id: task.project.project_id,
      name: task.project.name,
      key: task.project.key,
      color: 'bg-indigo-500',
    },
    status: task.status,
    priority: task.priority,
    dueDate: new Date(task.planned_end).toISOString(),
    estimatedHours: 0,
    assignees: task.assignees.map((assignee) => ({
      id: assignee.user_id,
      name: assignee.username,
      avatar: assignee.avatar_url ?? 'https://ui-avatars.com/api/?name=User&background=E2E8F0&color=64748B',
    })),
  });

  const handleOpenTaskDetails = (task: TaskEntity) => {
    setSelectedTask(mapToDetailTask(task));
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`${ROUTES.app.projects}?project=${encodeURIComponent(projectId)}`);
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
        onViewTaskDetails={handleOpenTaskDetails}
        onOpenProject={handleOpenProject}
      />

      <TaskDetailPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}