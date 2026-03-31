import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpCircle,
  ArrowUpDown,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  CheckCircle2,
  FilePlus,
  Flag,
  Filter,
  Kanban as KanbanIcon,
  LayoutList,
  Plus,
  Search,
  Upload,
  Layers,
  Archive,
  ArchiveRestore,
  GripVertical,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { useProjects } from '@/hooks/projectHooks';
import { taskService } from '@/services/taskService';
import type { ApiTaskPriority, ApiTaskStatus, CreateTaskDTO, TaskListItem, TaskResponse } from '@/services/taskService';
import { cn } from '../utils';
import { STATUS_CONFIG, USERS } from '../constants';
import type { DensityMode, ProjectRef, SortOption, TaskEntity, TaskPriority, TaskStatus, ViewMode } from '../types';
import { useBulkDeleteTasks, useBulkUpdateTasks, useCreateTask, useTask, useTasks } from '../hooks/useTaskQueries';
import { CsvImportModal } from '../components/CsvImportModal';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Modal } from '../components/Modal';
import { Popover } from '../components/Popover';
import { TaskDetailPanel } from '../components/TaskDetailPanel';
import { TaskGroupSection } from '../components/TaskGroupSection';
import { TaskKanbanCard } from '../components/TaskKanbanCard';
import { TaskListRow } from '../components/TaskListRow';
import { TaskEmptyState } from '../components/TaskEmptyState';
import { formatDate } from '@/lib/localeFormatters';
import { useDensityPreference } from '@/hooks/useDensityPreference';
import { TaskBulkActionBar } from '../components/TaskBulkActionBar';
import { TaskSkeletonLoader } from '../components/TaskSkeletonLoader';

type MilestoneFilter = 'ALL' | 'MILESTONE_ONLY' | 'NON_MILESTONE_ONLY';

interface TaskResponseWithRelations extends TaskResponse {
  task_number?: number;
  planned_end?: string;
  key?: string;
  project?: {
    project_id?: string;
    name?: string;
    key?: string;
  };
  assignees?: Array<{
    user_id?: string;
    id?: string;
    username?: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
    avatar?: string;
  }>;
}

const PROJECT_COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-orange-500', 'bg-rose-500', 'bg-violet-500'];

function normalizeTaskStatus(status: ApiTaskStatus | string | undefined): TaskStatus {
  const normalized = (status ?? '').toString().toUpperCase();

  if (normalized === 'IN_PROGRESS') {
    return 'IN_PROGRESS';
  }
  if (normalized === 'IN_REVIEW') {
    return 'IN_REVIEW';
  }
  if (normalized === 'DONE' || normalized === 'COMPLETED' || normalized === 'CANCELLED') {
    return 'DONE';
  }

  return 'NOT_STARTED';
}

function normalizeTaskPriority(priority: ApiTaskPriority | string | undefined): TaskPriority {
  const normalized = (priority ?? '').toString().toUpperCase();

  if (normalized === 'CRITICAL' || normalized === 'URGENT') {
    return 'URGENT';
  }
  if (normalized === 'HIGH') {
    return 'HIGH';
  }
  if (normalized === 'LOW') {
    return 'LOW';
  }

  return 'MEDIUM';
}

function toApiTaskStatus(status: TaskStatus): ApiTaskStatus {
  if (status === 'IN_PROGRESS') {
    return 'IN_PROGRESS';
  }
  if (status === 'IN_REVIEW') {
    return 'IN_REVIEW';
  }
  if (status === 'DONE') {
    return 'DONE';
  }

  return 'TO_DO';
}

function toApiTaskPriority(priority: TaskPriority): ApiTaskPriority {
  if (priority === 'URGENT') {
    return 'CRITICAL';
  }

  return priority;
}

function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Unknown error.';
  }

  const response = (error as { response?: { data?: { detail?: string; message?: string } } }).response;
  return response?.data?.detail || response?.data?.message || 'Failed to load task data.';
}

function toTaskEntity(task: TaskResponseWithRelations, index: number, projectLookup: Map<string, ProjectRef>): TaskEntity {
  const projectId = task.project_id || task.project?.project_id || 'unknown-project';
  const fallbackProject: ProjectRef = {
    id: projectId,
    name: task.project?.name || 'Unknown project',
    key: task.project?.key || 'TASK',
    color: PROJECT_COLORS[index % PROJECT_COLORS.length],
  };

  const project = projectLookup.get(projectId) ?? fallbackProject;

  const assignees = Array.isArray(task.assignees)
    ? task.assignees.map((assignee, assigneeIndex) => ({
        id: assignee.user_id || assignee.id || `user-${assigneeIndex}`,
        name: assignee.full_name || assignee.username || assignee.name || 'Unknown user',
        avatar:
          assignee.avatar_url ||
          assignee.avatar ||
          'https://ui-avatars.com/api/?name=User&background=64748B&color=fff',
      }))
    : task.assigned_to && USERS[task.assigned_to]
      ? [USERS[task.assigned_to]]
      : [];

  const dueSource = task.due_date || task.planned_end || task.updated_at || task.created_at;
  const dueDate = dueSource ? new Date(dueSource).toISOString() : new Date().toISOString();

  return {
    id: task.task_id,
    taskListId: task.task_list_id,
    key: task.key || `${project.key}-${task.task_number ?? index + 1}`,
    title: task.title,
    project,
    status: normalizeTaskStatus(task.status),
    priority: normalizeTaskPriority(task.priority),
    isMilestone: Boolean(task.is_milestone),
    dueDate,
    estimatedHours: task.estimated_hours ?? 0,
    assignees,
    description: task.description,
    subtasks: (task.subtasks ?? []).map((subtask, subtaskIndex) => ({
      id: subtask.id,
      title: subtask.title,
      is_completed: subtask.is_done,
      assignee_id: subtask.assignee_id,
      position: subtask.position ?? subtaskIndex,
    })),
    dependencies: (task.dependency_links ?? []).map((dependency) => ({
      id: dependency.id,
      task_id: dependency.task_id,
      depends_on_task_id: dependency.depends_on_task_id,
      dependency_type: dependency.dependency_type,
    })),
  };
}

function SortableTaskListRow({
  task,
  density,
  isSelected,
  onSelect,
  onViewDetails,
  onOpenProject,
}: {
  task: TaskEntity;
  density: DensityMode;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  onOpenProject: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('relative', isDragging && 'opacity-60')}>
      <button
        type="button"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder task"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="pl-5">
        <TaskListRow
          task={task}
          density={density}
          isSelected={isSelected}
          onSelect={onSelect}
          onViewDetails={onViewDetails}
          onOpenProject={onOpenProject}
        />
      </div>
    </div>
  );
}

function SortableKanbanTaskCard({
  task,
  isCompact,
  onViewDetails,
  onOpenProject,
}: {
  task: TaskEntity;
  isCompact: boolean;
  onViewDetails: () => void;
  onOpenProject: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-60 scale-[0.99]')}>
      <div {...attributes} {...listeners}>
        <TaskKanbanCard task={task} compact={isCompact} onViewDetails={onViewDetails} onOpenProject={onOpenProject} />
      </div>
    </div>
  );
}

function SortableTaskListManagerItem({
  taskList,
  children,
}: {
  taskList: TaskListItem;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: taskList.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('flex items-center gap-2', isDragging && 'opacity-60')}>
      <button
        type="button"
        className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder task list"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const densityPreference = useDensityPreference();
  const isCompact = densityPreference === 'compact';
  const taskDensity: DensityMode = isCompact ? 'COMPACT' : 'COMFORTABLE';

  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('MANUAL');
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>('ALL');
  const [selectedTask, setSelectedTask] = useState<TaskEntity | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isTaskListModalOpen, setIsTaskListModalOpen] = useState(false);
  const [managedProjectId, setManagedProjectId] = useState('');
  const [taskLists, setTaskLists] = useState<TaskListItem[]>([]);
  const [isTaskListLoading, setIsTaskListLoading] = useState(false);
  const [editingTaskListId, setEditingTaskListId] = useState<string | null>(null);
  const [editingTaskListName, setEditingTaskListName] = useState('');
  const [newTaskListName, setNewTaskListName] = useState('');
  const [isTaskListActionLoading, setIsTaskListActionLoading] = useState(false);
  const [deleteTargetTaskListId, setDeleteTargetTaskListId] = useState<string | null>(null);
  const [deleteForce, setDeleteForce] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    OVERDUE: false,
    TODAY: false,
    UPCOMING: false,
    DONE: true,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [taskOrder, setTaskOrder] = useState<string[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  useEffect(() => {
    const shouldOpenCreate = searchParams.get('create') === '1';
    if (!shouldOpenCreate) {
      return;
    }

    setIsCreateTaskModalOpen(true);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('create');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const handleCreateTaskShortcut = () => {
      setIsCreateTaskModalOpen(true);
    };

    window.addEventListener('pronaflow-create-task', handleCreateTaskShortcut as EventListener);
    return () => {
      window.removeEventListener('pronaflow-create-task', handleCreateTaskShortcut as EventListener);
    };
  }, []);

  const { data: projectsResponse } = useProjects(undefined, undefined, 1, 200);
  const { data: taskListResponse, isLoading, isError, error, refetch } = useTasks({
    page: 1,
    page_size: 200,
    sort_by: 'updated_at',
  });

  const { mutate: createTask } = useCreateTask();
  const { mutateAsync: bulkUpdateTasks } = useBulkUpdateTasks();
  const { mutateAsync: bulkDeleteTasks } = useBulkDeleteTasks();
  const { data: selectedTaskDetail } = useTask(selectedTask?.id);

  const rawTasks = useMemo<TaskResponseWithRelations[]>(() => {
    return (taskListResponse?.tasks ?? []) as TaskResponseWithRelations[];
  }, [taskListResponse]);

  const projectOptions = useMemo<ProjectRef[]>(() => {
    if (projectsResponse?.projects?.length) {
      return projectsResponse.projects.map((project, index) => ({
        id: project.project_id,
        name: project.name,
        key: project.key,
        color: PROJECT_COLORS[index % PROJECT_COLORS.length],
      }));
    }

    const uniqueProjects = new Map<string, ProjectRef>();
    rawTasks.forEach((task, index) => {
      const projectId = task.project_id || task.project?.project_id;
      if (!projectId || uniqueProjects.has(projectId)) {
        return;
      }

      uniqueProjects.set(projectId, {
        id: projectId,
        name: task.project?.name || 'Unknown project',
        key: task.project?.key || 'TASK',
        color: PROJECT_COLORS[index % PROJECT_COLORS.length],
      });
    });

    return Array.from(uniqueProjects.values());
  }, [projectsResponse, rawTasks]);

  const archivedProjectIds = useMemo(() => {
    const ids = new Set<string>();
    (projectsResponse?.projects ?? []).forEach((project) => {
      if (project.is_archived || project.status === 'ARCHIVED') {
        ids.add(project.project_id);
      }
    });
    return ids;
  }, [projectsResponse]);

  const isProjectReadOnly = (projectId?: string | null) => {
    if (!projectId) {
      return false;
    }
    return archivedProjectIds.has(projectId);
  };

  const projectLookup = useMemo(() => {
    return new Map(projectOptions.map((project) => [project.id, project]));
  }, [projectOptions]);

  useEffect(() => {
    if (!managedProjectId && projectOptions.length > 0) {
      setManagedProjectId(projectOptions[0].id);
    }
  }, [managedProjectId, projectOptions]);

  const tasks = useMemo<TaskEntity[]>(() => {
    return rawTasks.map((task, index) => toTaskEntity(task, index, projectLookup));
  }, [rawTasks, projectLookup]);

  const taskById = useMemo(() => {
    return new Map(tasks.map((task) => [task.id, task]));
  }, [tasks]);

  useEffect(() => {
    setTaskOrder((previous) => {
      const availableIds = tasks.map((task) => task.id);
      const previousSet = new Set(previous);
      const kept = previous.filter((id) => availableIds.includes(id));
      const appended = availableIds.filter((id) => !previousSet.has(id));
      return [...kept, ...appended];
    });
  }, [tasks]);

  const orderedTasks = useMemo(() => {
    if (taskOrder.length === 0) {
      return tasks;
    }

    const ordered = taskOrder
      .map((taskId) => taskById.get(taskId))
      .filter((task): task is TaskEntity => Boolean(task));

    const missing = tasks.filter((task) => !taskOrder.includes(task.id));
    return [...ordered, ...missing];
  }, [taskById, taskOrder, tasks]);

  const selectedTaskWithDetail = useMemo(() => {
    if (!selectedTask) {
      return null;
    }

    if (!selectedTaskDetail) {
      return selectedTask;
    }

    return toTaskEntity(selectedTaskDetail as TaskResponseWithRelations, 0, projectLookup);
  }, [projectLookup, selectedTask, selectedTaskDetail]);

  const taskListByProject = useMemo(() => {
    const projectToTaskList = new Map<string, string>();

    rawTasks.forEach((task) => {
      if (task.project_id && task.task_list_id && !projectToTaskList.has(task.project_id)) {
        projectToTaskList.set(task.project_id, task.task_list_id);
      }
    });

    return projectToTaskList;
  }, [rawTasks]);

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTaskIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTaskIds(newSelected);
  };

  const filteredTasks = useMemo(() => {
    const tasksToFilter = orderedTasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const milestoneFilteredTasks = tasksToFilter.filter((task) => {
      if (milestoneFilter === 'MILESTONE_ONLY') {
        return task.isMilestone;
      }
      if (milestoneFilter === 'NON_MILESTONE_ONLY') {
        return !task.isMilestone;
      }
      return true;
    });

    if (sortOption === 'DUE_DATE_ASC') {
      milestoneFilteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortOption === 'PRIORITY_DESC') {
      const priorityMap: Record<TaskPriority, number> = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      milestoneFilteredTasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
    } else if (sortOption === 'TITLE_ASC') {
      milestoneFilteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    return milestoneFilteredTasks;
  }, [orderedTasks, searchQuery, sortOption, milestoneFilter]);

  const containsArchivedProjectTasks = useMemo(() => {
    return filteredTasks.some((task) => archivedProjectIds.has(task.project.id));
  }, [archivedProjectIds, filteredTasks]);

  const managedProjectIsArchived = useMemo(() => {
    return isProjectReadOnly(managedProjectId || null);
  }, [managedProjectId, archivedProjectIds]);

  const groupedTasks = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();

    return {
      overdue: filteredTasks.filter((task) => new Date(task.dueDate) < now && task.status !== 'DONE'),
      today: filteredTasks.filter(
        (task) => new Date(task.dueDate).toDateString() === today && task.status !== 'DONE'
      ),
      upcoming: filteredTasks.filter((task) => new Date(task.dueDate) > now && task.status !== 'DONE'),
      done: filteredTasks.filter((task) => task.status === 'DONE'),
    };
  }, [filteredTasks]);

  const kanbanColumns = {
    NOT_STARTED: filteredTasks.filter((task) => task.status === 'NOT_STARTED'),
    IN_PROGRESS: filteredTasks.filter((task) => task.status === 'IN_PROGRESS'),
    IN_REVIEW: filteredTasks.filter((task) => task.status === 'IN_REVIEW'),
    DONE: filteredTasks.filter((task) => task.status === 'DONE'),
  };

  const openProject = (project: ProjectRef) => {
    navigate(`${ROUTES.app.projects}?project=${encodeURIComponent(project.id)}`);
  };

  const sortedTaskLists = useMemo(() => {
    return [...taskLists].sort((a, b) => {
      if (a.position === b.position) {
        return a.name.localeCompare(b.name);
      }
      return a.position - b.position;
    });
  }, [taskLists]);

  const deleteTargetTaskList = useMemo(() => {
    if (!deleteTargetTaskListId) {
      return null;
    }
    return taskLists.find((list) => list.id === deleteTargetTaskListId) ?? null;
  }, [deleteTargetTaskListId, taskLists]);

  const handleCreateTask = async (payload: {
    title: string;
    projectId: string;
    priority: TaskPriority;
    isMilestone: boolean;
    dueDate: string;
    assigneeId?: string;
    description?: string;
  }) => {
    if (isProjectReadOnly(payload.projectId)) {
      toast.error('Project archived is in read-only mode. Cannot create tasks.');
      return;
    }

    let taskListId = taskListByProject.get(payload.projectId);

    if (!taskListId) {
      try {
        const existingLists = await taskService.listTaskLists(payload.projectId);
        if (existingLists.length > 0) {
          taskListId = existingLists[0].id;
        } else {
          const createdList = await taskService.createTaskList({
            project_id: payload.projectId,
            name: 'General',
            position: 0,
          });
          taskListId = createdList.id;
          toast.success('Created default task list for this project.');
        }
      } catch (listError) {
        toast.error(getErrorMessage(listError));
        return;
      }
    }

    const requestBody: CreateTaskDTO = {
      project_id: payload.projectId,
      task_list_id: taskListId,
      title: payload.title,
      description: payload.description,
      status: 'TO_DO',
      priority: toApiTaskPriority(payload.priority),
      is_milestone: payload.isMilestone,
      due_date: new Date(payload.dueDate).toISOString(),
      assigned_to: payload.assigneeId,
    };

    createTask(requestBody, {
      onSuccess: () => {
        toast.success('Task created successfully.');
      },
      onError: (mutationError) => {
        toast.error(getErrorMessage(mutationError));
      },
    });
  };

  const handleQuickCreateTaskList = async () => {
    if (projectOptions.length === 0) {
      toast.error('No project available to create task list.');
      return;
    }

    const projectId = managedProjectId || projectOptions[0].id;
    if (isProjectReadOnly(projectId)) {
      toast.error('Project archived is in read-only mode. Cannot create task lists.');
      return;
    }

    setManagedProjectId(projectId);
    setIsTaskListModalOpen(true);
    setDeleteTargetTaskListId(null);
    setDeleteForce(false);
    setEditingTaskListId(null);
    setEditingTaskListName('');
    await loadTaskLists(projectId);
  };

  const loadTaskLists = async (projectId: string) => {
    if (!projectId) {
      setTaskLists([]);
      return;
    }

    setIsTaskListLoading(true);
    try {
      const lists = await taskService.listTaskLists(projectId, true);
      setTaskLists(lists);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTaskListLoading(false);
    }
  };

  const openTaskListManager = async () => {
    if (projectOptions.length === 0) {
      toast.error('No project available.');
      return;
    }

    const projectId = managedProjectId || projectOptions[0].id;
    if (isProjectReadOnly(projectId)) {
      toast.error('Project archived is in read-only mode. Task list manager is disabled.');
      return;
    }

    setManagedProjectId(projectId);
    setDeleteTargetTaskListId(null);
    setDeleteForce(false);
    setEditingTaskListId(null);
    setEditingTaskListName('');
    setIsTaskListModalOpen(true);
    await loadTaskLists(projectId);
  };

  const handleCreateTaskListInManager = async () => {
    const name = newTaskListName.trim();
    if (!managedProjectId) {
      toast.error('Select a project first.');
      return;
    }

    if (!name) {
      toast.error('Task list name is required.');
      return;
    }

    if (isProjectReadOnly(managedProjectId)) {
      toast.error('Project archived is in read-only mode. Cannot create task lists.');
      return;
    }

    try {
      setIsTaskListActionLoading(true);
      await taskService.createTaskList({
        project_id: managedProjectId,
        name,
        position: sortedTaskLists.length,
      });
      setNewTaskListName('');
      toast.success('Task list created successfully.');
      await loadTaskLists(managedProjectId);
      await refetch();
    } catch (createListError) {
      toast.error(getErrorMessage(createListError));
    } finally {
      setIsTaskListActionLoading(false);
    }
  };

  const startRenameTaskList = (taskList: TaskListItem) => {
    setEditingTaskListId(taskList.id);
    setEditingTaskListName(taskList.name);
  };

  const cancelRenameTaskList = () => {
    setEditingTaskListId(null);
    setEditingTaskListName('');
  };

  const handleRenameTaskList = async (taskList: TaskListItem) => {
    const nextName = editingTaskListName.trim();
    if (!nextName || nextName === taskList.name) {
      cancelRenameTaskList();
      return;
    }

    if (isProjectReadOnly(taskList.project_id)) {
      toast.error('Project archived is in read-only mode. Cannot rename task list.');
      return;
    }

    try {
      setIsTaskListActionLoading(true);
      await taskService.updateTaskList(taskList.id, { name: nextName });
      cancelRenameTaskList();
      toast.success('Task list renamed.');
      await loadTaskLists(taskList.project_id);
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTaskListActionLoading(false);
    }
  };

  const handleArchiveToggleTaskList = async (taskList: TaskListItem) => {
    if (isProjectReadOnly(taskList.project_id)) {
      toast.error('Project archived is in read-only mode. Cannot modify task list state.');
      return;
    }

    try {
      setIsTaskListActionLoading(true);
      await taskService.updateTaskList(taskList.id, { is_archived: !taskList.is_archived });
      toast.success(taskList.is_archived ? 'Task list restored.' : 'Task list archived.');
      if (deleteTargetTaskListId === taskList.id) {
        setDeleteTargetTaskListId(null);
        setDeleteForce(false);
      }
      await loadTaskLists(taskList.project_id);
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTaskListActionLoading(false);
    }
  };

  const requestDeleteTaskList = (taskList: TaskListItem) => {
    if (isProjectReadOnly(taskList.project_id)) {
      toast.error('Project archived is in read-only mode. Cannot delete task list.');
      return;
    }

    setDeleteTargetTaskListId(taskList.id);
    setDeleteForce(false);
  };

  const cancelDeleteTaskList = () => {
    setDeleteTargetTaskListId(null);
    setDeleteForce(false);
  };

  const confirmDeleteTaskList = async () => {
    if (!deleteTargetTaskList) {
      return;
    }

    if (isProjectReadOnly(deleteTargetTaskList.project_id)) {
      toast.error('Project archived is in read-only mode. Cannot delete task list.');
      return;
    }

    try {
      setIsTaskListActionLoading(true);
      await taskService.deleteTaskList(deleteTargetTaskList.id, deleteForce);
      cancelDeleteTaskList();
      toast.success('Task list deleted.');
      await loadTaskLists(deleteTargetTaskList.project_id);
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsTaskListActionLoading(false);
    }
  };

  const persistTaskListOrder = async (reordered: TaskListItem[]) => {
    if (isProjectReadOnly(managedProjectId)) {
      toast.error('Project archived is in read-only mode. Cannot reorder task lists.');
      return;
    }

    const nextById = new Map(reordered.map((item, index) => [item.id, { ...item, position: index }]));
    const changed = reordered
      .map((item, index) => ({ id: item.id, position: index, previousPosition: item.position }))
      .filter((item) => item.position !== item.previousPosition);

    if (changed.length === 0) {
      return;
    }

    setTaskLists((prev) => prev.map((item) => nextById.get(item.id) ?? item));

    try {
      setIsTaskListActionLoading(true);
      await Promise.all(changed.map((item) => taskService.updateTaskList(item.id, { position: item.position })));
      toast.success('Task list order updated.');
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
      if (managedProjectId) {
        await loadTaskLists(managedProjectId);
      }
    } finally {
      setIsTaskListActionLoading(false);
    }
  };

  const handleTaskListDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedTaskLists.findIndex((item) => item.id === String(active.id));
    const newIndex = sortedTaskLists.findIndex((item) => item.id === String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reordered = arrayMove(sortedTaskLists, oldIndex, newIndex);
    await persistTaskListOrder(reordered);
  };

  const handleTaskDragEnd = async (event: DragEndEvent) => {
    if (sortOption !== 'MANUAL') {
      toast.info('Switch sort to Manual order to drag and reorder tasks.');
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const currentOrder = taskOrder.length > 0 ? taskOrder : tasks.map((task) => task.id);
    const oldIndex = currentOrder.findIndex((taskId) => taskId === String(active.id));
    const newIndex = currentOrder.findIndex((taskId) => taskId === String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const nextTaskOrder = arrayMove(currentOrder, oldIndex, newIndex);

    const activeTask = taskById.get(String(active.id));
    const overTask = taskById.get(String(over.id));
    if (!activeTask || !overTask) {
      return;
    }

    if (isProjectReadOnly(activeTask.project.id) || isProjectReadOnly(overTask.project.id)) {
      toast.error('Project archived is in read-only mode. Cannot reorder tasks.');
      return;
    }

    const targetTaskListId = overTask.taskListId || activeTask.taskListId;
    if (!targetTaskListId) {
      toast.error('Task list id is missing. Cannot persist task order.');
      return;
    }

    const reorderedEntities = nextTaskOrder
      .map((id) => taskById.get(id))
      .filter((task): task is TaskEntity => Boolean(task));
    const targetListTasks = reorderedEntities.filter((task) => (task.taskListId || activeTask.taskListId) === targetTaskListId);
    const nextPosition = targetListTasks.findIndex((task) => task.id === activeTask.id);

    const previousOrder = currentOrder;
    setTaskOrder(nextTaskOrder);

    try {
      await taskService.moveTask(activeTask.id, targetTaskListId, Math.max(0, nextPosition));
      toast.success('Task order updated.');
      await refetch();
    } catch (error) {
      toast.error(getErrorMessage(error));
      setTaskOrder(previousOrder);
    }
  };

  return (
    <div className="legacy-dark-scope h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans overflow-hidden">
      <header className="px-6 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex-shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">My Tasks <span className="text-sm font-normal text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full mt-1 shadow-sm">{filteredTasks.length}</span></h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2"><span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}</span><span className="w-1 h-1 bg-slate-300 rounded-full"></span>{groupedTasks.overdue.length > 0 ? <span className="font-semibold text-red-600 flex items-center gap-1 animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> {groupedTasks.overdue.length} overdue</span> : <span className="text-emerald-600 font-medium">On track</span>}</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input type="text" placeholder="Quick search..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white w-full md:w-56 transition-all shadow-sm hover:shadow" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </div>

            <Popover
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
              trigger={<button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all active:scale-95 text-sm font-medium"><Filter className="w-4 h-4" /><span className="hidden sm:inline">Filter & Sort</span></button>}
              content={
                <div className="w-64 p-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort by</div>
                  <button onClick={() => setSortOption('MANUAL')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', sortOption === 'MANUAL' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><GripVertical className="w-4 h-4" /> Manual order</span>{sortOption === 'MANUAL' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setSortOption('DUE_DATE_ASC')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', sortOption === 'DUE_DATE_ASC' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Due date (asc)</span>{sortOption === 'DUE_DATE_ASC' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setSortOption('PRIORITY_DESC')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', sortOption === 'PRIORITY_DESC' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><ArrowUpCircle className="w-4 h-4" /> Priority (desc)</span>{sortOption === 'PRIORITY_DESC' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setSortOption('TITLE_ASC')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', sortOption === 'TITLE_ASC' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4" /> Title (A-Z)</span>{sortOption === 'TITLE_ASC' && <Check className="w-4 h-4" />}</button>
                  <div className="my-1.5 h-px bg-slate-100" />
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Milestone</div>
                  <button onClick={() => setMilestoneFilter('ALL')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', milestoneFilter === 'ALL' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><Flag className="w-4 h-4" /> All tasks</span>{milestoneFilter === 'ALL' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setMilestoneFilter('MILESTONE_ONLY')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', milestoneFilter === 'MILESTONE_ONLY' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><Flag className="w-4 h-4" /> Milestones only</span>{milestoneFilter === 'MILESTONE_ONLY' && <Check className="w-4 h-4" />}</button>
                  <button onClick={() => setMilestoneFilter('NON_MILESTONE_ONLY')} className={cn('w-full flex items-center justify-between px-2 py-2 text-sm rounded-lg transition-colors', milestoneFilter === 'NON_MILESTONE_ONLY' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-100')}><span className="flex items-center gap-2"><Flag className="w-4 h-4" /> Non-milestones</span>{milestoneFilter === 'NON_MILESTONE_ONLY' && <Check className="w-4 h-4" />}</button>
                </div>
              }
            />

            <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 shadow-inner">
              <button onClick={() => setViewMode('LIST')} className={cn('p-1.5 rounded-md transition-all ease-out active:scale-95', viewMode === 'LIST' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700')}><LayoutList className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('KANBAN')} className={cn('p-1.5 rounded-md transition-all ease-out active:scale-95', viewMode === 'KANBAN' ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700')}><KanbanIcon className="w-4 h-4" /></button>
            </div>

            <Popover
              isOpen={isCreateOpen}
              setIsOpen={setIsCreateOpen}
              trigger={<button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 font-medium text-sm"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Create</span></button>}
              content={
                <div className="w-56 p-1.5">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Create</div>
                  <button onClick={() => { setIsCreateOpen(false); setIsCreateTaskModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"><div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-200 transition-colors"><FilePlus className="w-4 h-4" /></div><div className="text-left"><div className="font-medium">New task</div><div className="text-[10px] text-slate-500 font-normal">Open full task form</div></div></button>
                  <button onClick={() => { setIsCreateOpen(false); void handleQuickCreateTaskList(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"><div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-200 transition-colors"><Layers className="w-4 h-4" /></div><div className="text-left"><div className="font-medium">New task list</div><div className="text-[10px] text-slate-500 font-normal">Open manager to create list</div></div></button>
                  <button onClick={() => { setIsCreateOpen(false); void openTaskListManager(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group"><div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-md group-hover:bg-indigo-200 transition-colors"><Layers className="w-4 h-4" /></div><div className="text-left"><div className="font-medium">Manage task lists</div><div className="text-[10px] text-slate-500 font-normal">Rename, archive, delete</div></div></button>
                  <div className="h-px bg-slate-100 my-1.5"></div>
                  <button onClick={() => { setIsCreateOpen(false); setIsCsvModalOpen(true); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors group"><Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /><span>Import CSV</span></button>
                </div>
              }
            />
          </div>
        </div>
      </header>

      <main className={cn('flex-1 flex flex-col relative', viewMode === 'LIST' ? 'overflow-y-auto' : 'overflow-hidden')}>
        {(containsArchivedProjectTasks || managedProjectIsArchived) && (
          <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Một hoặc nhiều project đang ở trạng thái lưu trữ. Các thao tác chỉnh sửa task/task list trong project lưu trữ đã bị khóa.
          </div>
        )}

        {isLoading && (
          <div className="p-6 w-full max-w-5xl mx-auto">
            <TaskSkeletonLoader count={4} variant={viewMode === 'LIST' ? 'list' : 'kanban'} />
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-6 w-full max-w-5xl mx-auto">
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-5">
              <div className="font-semibold">Failed to load tasks</div>
              <p className="text-sm mt-1">{getErrorMessage(error)}</p>
              <button onClick={() => refetch()} className="mt-3 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Retry</button>
            </div>
          </div>
        )}

        {!isLoading && !isError && viewMode === 'LIST' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => { void handleTaskDragEnd(event); }}>
            <div className={cn('flex-1 w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out', isCompact ? 'p-4 space-y-5' : 'p-6 space-y-8')}>
              {filteredTasks.length === 0 ? (
                <TaskEmptyState
                  type={searchQuery ? 'no-results' : 'no-tasks'}
                  searchQuery={searchQuery}
                  onCreateTask={() => setIsCreateTaskModalOpen(true)}
                  onClearSearch={() => setSearchQuery('')}
                />
              ) : (
                <>
                  {groupedTasks.overdue.length > 0 && (
                    <TaskGroupSection
                      title="Overdue"
                      icon={AlertCircle}
                      count={groupedTasks.overdue.length}
                      headerColorClass="text-red-600"
                      borderColorClass="from-red-200 to-transparent"
                      isCollapsed={collapsedSections.OVERDUE}
                      onToggle={() => toggleSection('OVERDUE')}
                    >
                      <SortableContext items={groupedTasks.overdue.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                        {groupedTasks.overdue.map((task) => (
                          <SortableTaskListRow
                            key={task.id}
                            task={task}
                            density={taskDensity}
                            isSelected={selectedTaskIds.has(task.id)}
                            onSelect={() => toggleTaskSelection(task.id)}
                            onViewDetails={() => setSelectedTask(task)}
                            onOpenProject={() => openProject(task.project)}
                          />
                        ))}
                      </SortableContext>
                    </TaskGroupSection>
                  )}
                  <TaskGroupSection
                    title="Today"
                    icon={CalendarIcon}
                    count={groupedTasks.today.length}
                    headerColorClass="text-indigo-600"
                    borderColorClass="from-indigo-200 to-transparent"
                    isCollapsed={collapsedSections.TODAY}
                    onToggle={() => toggleSection('TODAY')}
                  >
                    {groupedTasks.today.length > 0 ? (
                      <SortableContext items={groupedTasks.today.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                        {groupedTasks.today.map((task) => (
                          <SortableTaskListRow
                            key={task.id}
                            task={task}
                            density={taskDensity}
                            isSelected={selectedTaskIds.has(task.id)}
                            onSelect={() => toggleTaskSelection(task.id)}
                            onViewDetails={() => setSelectedTask(task)}
                            onOpenProject={() => openProject(task.project)}
                          />
                        ))}
                      </SortableContext>
                    ) : (
                      <TaskEmptyState type="no-filter-results" onCreateTask={() => setIsCreateTaskModalOpen(true)} />
                    )}
                  </TaskGroupSection>
                  <TaskGroupSection
                    title="Upcoming"
                    icon={ArrowRight}
                    count={groupedTasks.upcoming.length}
                    headerColorClass="text-slate-500"
                    borderColorClass="from-slate-200 to-transparent"
                    isCollapsed={collapsedSections.UPCOMING}
                    onToggle={() => toggleSection('UPCOMING')}
                    className="opacity-90 hover:opacity-100"
                  >
                    <SortableContext items={groupedTasks.upcoming.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                      {groupedTasks.upcoming.map((task) => (
                        <SortableTaskListRow
                          key={task.id}
                          task={task}
                          density={taskDensity}
                          isSelected={selectedTaskIds.has(task.id)}
                          onSelect={() => toggleTaskSelection(task.id)}
                          onViewDetails={() => setSelectedTask(task)}
                          onOpenProject={() => openProject(task.project)}
                        />
                      ))}
                    </SortableContext>
                  </TaskGroupSection>
                  <TaskGroupSection
                    title="Done"
                    icon={CheckCircle2}
                    count={groupedTasks.done.length}
                    headerColorClass="text-slate-400 line-through decoration-slate-300"
                    borderColorClass="from-slate-200 to-transparent"
                    isCollapsed={collapsedSections.DONE}
                    onToggle={() => toggleSection('DONE')}
                  >
                    <SortableContext items={groupedTasks.done.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                      {groupedTasks.done.map((task) => (
                        <SortableTaskListRow
                          key={task.id}
                          task={task}
                          density={taskDensity}
                          isSelected={selectedTaskIds.has(task.id)}
                          onSelect={() => toggleTaskSelection(task.id)}
                          onViewDetails={() => setSelectedTask(task)}
                          onOpenProject={() => openProject(task.project)}
                        />
                      ))}
                    </SortableContext>
                  </TaskGroupSection>
                </>
              )}
            </div>
          </DndContext>
        )}

        {!isLoading && !isError && viewMode === 'KANBAN' && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => { void handleTaskDragEnd(event); }}>
            <div className={cn('flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar', isCompact ? 'p-4' : 'p-6')}>
              <div className="h-full flex gap-6 min-w-max">
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                  const columnTasks = kanbanColumns[key as TaskStatus];
                  return (
                    <div key={key} className="flex-shrink-0 w-80 flex flex-col h-full group/column">
                      <div className={cn('flex items-center justify-between mb-3 px-3 py-2.5 rounded-xl border transition-colors duration-300 flex-shrink-0', config.bg)}>
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
                          <config.icon className={cn('w-4 h-4', config.color)} />
                          {config.label}
                        </div>
                        <span className="bg-white/60 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">{columnTasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar p-1 pb-4">
                        <SortableContext items={columnTasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                          {columnTasks.map((task) => (
                            <SortableKanbanTaskCard
                              key={task.id}
                              task={task}
                              isCompact={isCompact}
                              onViewDetails={() => setSelectedTask(task)}
                              onOpenProject={() => openProject(task.project)}
                            />
                          ))}
                        </SortableContext>
                        <button onClick={() => setIsCreateTaskModalOpen(true)} className="w-full py-2.5 mt-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 opacity-0 group-hover/column:opacity-100"><Plus className="w-4 h-4" /> Quick add</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DndContext>
        )}
      </main>

      <TaskDetailPanel task={selectedTaskWithDetail} onClose={() => setSelectedTask(null)} />
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        projects={projectOptions}
        onCreateTask={handleCreateTask}
      />
      <Modal isOpen={isTaskListModalOpen} onClose={() => setIsTaskListModalOpen(false)} className="max-w-2xl">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Manage Task Lists</h3>
            <p className="text-xs text-slate-500 mt-0.5">Create, reorder, rename, archive, and delete task lists by project.</p>
          </div>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</label>
            <select
              value={managedProjectId}
              onChange={(event) => {
                const nextProjectId = event.target.value;
                setManagedProjectId(nextProjectId);
                void loadTaskLists(nextProjectId);
              }}
              className="mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
            >
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">New Task List</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                value={newTaskListName}
                onChange={(event) => setNewTaskListName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void handleCreateTaskListInManager();
                  }
                }}
                placeholder="e.g. Sprint Backlog"
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-white"
              />
              <button
                type="button"
                onClick={() => { void handleCreateTaskListInManager(); }}
                disabled={isTaskListActionLoading}
                className="px-3 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
              >
                Create
              </button>
            </div>
          </div>

          {isTaskListLoading ? (
            <div className="text-sm text-slate-500">Loading task lists...</div>
          ) : sortedTaskLists.length === 0 ? (
            <div className="text-sm text-slate-500 border border-slate-200 rounded-md p-3">No task lists found for this project.</div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => { void handleTaskListDragEnd(event); }}>
              <SortableContext items={sortedTaskLists.map((taskList) => taskList.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sortedTaskLists.map((taskList) => (
                    <SortableTaskListManagerItem key={taskList.id} taskList={taskList}>
                      <div className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg p-3 bg-white">
                        <div className="min-w-0">
                          {editingTaskListId === taskList.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={editingTaskListName}
                                onChange={(event) => setEditingTaskListName(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault();
                                    void handleRenameTaskList(taskList);
                                  }
                                  if (event.key === 'Escape') {
                                    event.preventDefault();
                                    cancelRenameTaskList();
                                  }
                                }}
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
                              />
                              <button
                                type="button"
                                onClick={() => { void handleRenameTaskList(taskList); }}
                                className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50"
                                title="Save"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={cancelRenameTaskList}
                                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className={cn('text-sm font-medium truncate', taskList.is_archived ? 'text-slate-400 line-through' : 'text-slate-800')}>
                              {taskList.name}
                            </div>
                          )}
                          <div className="text-xs text-slate-500">Position: {taskList.position} • {taskList.is_archived ? 'Archived' : 'Active'}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isTaskListActionLoading || editingTaskListId === taskList.id}
                            onClick={() => { startRenameTaskList(taskList); }}
                            className="p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40"
                            title="Rename"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isTaskListActionLoading}
                            onClick={() => { void handleArchiveToggleTaskList(taskList); }}
                            className="p-2 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-40"
                            title={taskList.is_archived ? 'Restore' : 'Archive'}
                          >
                            {taskList.is_archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            disabled={isTaskListActionLoading}
                            onClick={() => { requestDeleteTaskList(taskList); }}
                            className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </SortableTaskListManagerItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {deleteTargetTaskList && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
              <div>
                <div className="text-sm font-semibold text-red-700">Confirm delete</div>
                <p className="text-xs text-red-600 mt-1">
                  Delete task list "{deleteTargetTaskList.name}". Enable force delete if this list still contains tasks.
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-red-700">
                <input
                  type="checkbox"
                  checked={deleteForce}
                  onChange={(event) => setDeleteForce(event.target.checked)}
                />
                Force delete (remove with remaining tasks)
              </label>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDeleteTaskList}
                  className="px-3 py-2 text-sm rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isTaskListActionLoading}
                  onClick={() => { void confirmDeleteTaskList(); }}
                  className="px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Delete task list
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <CsvImportModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} onImportSuccess={(count) => { console.log(`Imported ${count}`); setIsCsvModalOpen(false); }} />

      <TaskBulkActionBar
        selectedCount={selectedTaskIds.size}
        isVisible={selectedTaskIds.size > 0}
        isLoading={isBulkLoading}
        onClose={() => setSelectedTaskIds(new Set())}
        onStatusChange={async (status) => {
          setIsBulkLoading(true);
          try {
            await bulkUpdateTasks({
              task_ids: Array.from(selectedTaskIds),
              status: toApiTaskStatus(status),
            });
            setSelectedTaskIds(new Set());
            toast.success('Bulk status updated.');
          } catch (bulkError) {
            toast.error(getErrorMessage(bulkError));
          } finally {
            setIsBulkLoading(false);
          }
        }}
        onPriorityChange={async (priority) => {
          setIsBulkLoading(true);
          try {
            await bulkUpdateTasks({
              task_ids: Array.from(selectedTaskIds),
              priority: toApiTaskPriority(priority),
            });
            setSelectedTaskIds(new Set());
            toast.success('Bulk priority updated.');
          } catch (bulkError) {
            toast.error(getErrorMessage(bulkError));
          } finally {
            setIsBulkLoading(false);
          }
        }}
        onDelete={async () => {
          setIsBulkLoading(true);
          try {
            await bulkDeleteTasks(Array.from(selectedTaskIds));
            setSelectedTaskIds(new Set());
            toast.success('Selected tasks deleted.');
          } catch (bulkError) {
            toast.error(getErrorMessage(bulkError));
          } finally {
            setIsBulkLoading(false);
          }
        }}
      />
    </div>
  );
}
