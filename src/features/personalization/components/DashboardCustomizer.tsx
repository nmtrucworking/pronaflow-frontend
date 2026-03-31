/**
 * Dashboard Customizer Component
 * Module 9: User Experience Personalization
 * Widget library, drag & drop layout, and persistent roaming layout config
 */

import React, { useEffect, useMemo, useState } from 'react';
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
  LayoutGrid,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  BarChart3,
  Calendar,
  ListTodo,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  useDashboardLayouts,
  useCreateDashboardLayout,
  useUpdateDashboardLayout,
  useDeleteDashboardLayout,
  useSetDefaultLayout,
} from '@/hooks/usePersonalization';
import { useCurrentWorkspaceId } from '@/store/features/workspaceStore';
import type {
  DashboardLayout,
  DashboardWidget,
  CreateDashboardLayoutDTO,
} from '@/types/personalization';

interface WidgetTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ElementType;
  defaultSize: 'small' | 'medium' | 'large';
  category: 'productivity' | 'analytics' | 'collaboration';
}

interface DashboardCustomizerProps {
  userId?: string;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'tasks-overview',
    type: 'my-tasks',
    name: 'Tasks Overview',
    description: 'Quick view of your tasks and priorities',
    icon: ListTodo,
    defaultSize: 'medium',
    category: 'productivity',
  },
  {
    id: 'recent-projects',
    type: 'project-progress',
    name: 'Recent Projects',
    description: 'Recently accessed projects',
    icon: LayoutGrid,
    defaultSize: 'medium',
    category: 'productivity',
  },
  {
    id: 'calendar-widget',
    type: 'calendar',
    name: 'Calendar',
    description: 'Upcoming events and deadlines',
    icon: Calendar,
    defaultSize: 'medium',
    category: 'productivity',
  },
  {
    id: 'team-activity',
    type: 'team-members',
    name: 'Team Activity',
    description: 'Recent team member activities',
    icon: Users,
    defaultSize: 'large',
    category: 'collaboration',
  },
  {
    id: 'time-tracking',
    type: 'quick-stats',
    name: 'Time Tracking',
    description: 'Hours logged this week',
    icon: Clock,
    defaultSize: 'small',
    category: 'analytics',
  },
  {
    id: 'productivity-chart',
    type: 'project-progress',
    name: 'Productivity Chart',
    description: 'Task completion trends',
    icon: BarChart3,
    defaultSize: 'large',
    category: 'analytics',
  },
  {
    id: 'project-progress',
    type: 'project-progress',
    name: 'Project Progress',
    description: 'Overall project completion',
    icon: TrendingUp,
    defaultSize: 'medium',
    category: 'analytics',
  },
  {
    id: 'notifications-feed',
    type: 'notifications',
    name: 'Notifications',
    description: 'Recent notifications and alerts',
    icon: AlertCircle,
    defaultSize: 'small',
    category: 'collaboration',
  },
];

const getWidgetTemplate = (widget: DashboardWidget): WidgetTemplate | undefined => {
  return WIDGET_TEMPLATES.find((t) => t.type === widget.type) || WIDGET_TEMPLATES.find((t) => t.id === widget.icon);
};

const withPositionIndex = (widgets: DashboardWidget[]): DashboardWidget[] => {
  return widgets.map((widget, index) => ({
    ...widget,
    position: {
      x: widget.position?.x ?? 0,
      y: index,
    },
  }));
};

function SortableWidgetRow({
  widget,
  onToggle,
  onResize,
  onRemove,
}: {
  widget: DashboardWidget;
  onToggle: (id: string) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const template = getWidgetTemplate(widget);
  const Icon = template?.icon || LayoutGrid;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      <button
        type="button"
        className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder widget"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="p-2 bg-white dark:bg-slate-800 rounded">
        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-900 dark:text-white">{widget.title}</div>
        <div className="text-sm text-slate-500">{widget.size} widget</div>
      </div>

      <div className="flex items-center gap-1">
        {(['small', 'medium', 'large'] as const).map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onResize(widget.id, size)}
            className={`px-2 py-1 text-xs rounded border ${
              widget.size === size
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
            }`}
          >
            {size[0].toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(widget.id)}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          title={widget.is_enabled ? 'Hide widget' : 'Show widget'}
        >
          {widget.is_enabled ? (
            <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </button>
        <button
          onClick={() => onRemove(widget.id)}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          title="Remove widget"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>
    </div>
  );
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = () => {
  const workspaceId = useCurrentWorkspaceId();

  const { data: layouts = [], isLoading } = useDashboardLayouts(workspaceId || '');
  const createLayout = useCreateDashboardLayout(workspaceId || '');
  const deleteLayout = useDeleteDashboardLayout(workspaceId || '');
  const setDefaultLayout = useSetDefaultLayout(workspaceId || '');

  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>([]);

  const selectedLayout = useMemo(
    () => layouts.find((layout) => layout.id === selectedLayoutId) || null,
    [layouts, selectedLayoutId]
  );

  const updateLayout = useUpdateDashboardLayout(workspaceId || '', selectedLayout?.id || '');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  useEffect(() => {
    if (!layouts.length) {
      setSelectedLayoutId('');
      setLocalWidgets([]);
      return;
    }

    if (!selectedLayoutId || !layouts.some((layout) => layout.id === selectedLayoutId)) {
      const activeLayout = layouts.find((layout) => layout.is_active) || layouts[0];
      setSelectedLayoutId(activeLayout.id);
      setLocalWidgets(withPositionIndex(activeLayout.widgets || []));
      return;
    }

    const nextLayout = layouts.find((layout) => layout.id === selectedLayoutId);
    if (nextLayout) {
      setLocalWidgets(withPositionIndex(nextLayout.widgets || []));
    }
  }, [layouts, selectedLayoutId]);

  const persistWidgets = (nextWidgets: DashboardWidget[]) => {
    if (!selectedLayout) {
      return;
    }

    const widgetsWithPosition = withPositionIndex(nextWidgets);
    setLocalWidgets(widgetsWithPosition);
    updateLayout.mutate({
      layout_config: {
        widgets: widgetsWithPosition,
      },
    });
  };

  const handleCreateLayout = () => {
    if (!workspaceId) {
      return;
    }

    const newLayout: CreateDashboardLayoutDTO = {
      name: `Dashboard ${layouts.length + 1}`,
      workspace_id: workspaceId,
      is_active: layouts.length === 0,
      layout_config: { widgets: [] },
    };

    createLayout.mutate(newLayout);
  };

  const handleAddWidget = (template: WidgetTemplate) => {
    if (!selectedLayout) {
      return;
    }

    const newWidget: DashboardWidget = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      title: template.name,
      description: template.description,
      icon: template.id,
      is_enabled: true,
      size: template.defaultSize,
      position: { x: 0, y: localWidgets.length },
      config: {},
    };

    persistWidgets([...localWidgets, newWidget]);
  };

  const handleToggleWidget = (widgetId: string) => {
    persistWidgets(
      localWidgets.map((widget) =>
        widget.id === widgetId ? { ...widget, is_enabled: !widget.is_enabled } : widget
      )
    );
  };

  const handleResizeWidget = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    persistWidgets(localWidgets.map((widget) => (widget.id === widgetId ? { ...widget, size } : widget)));
  };

  const handleRemoveWidget = (widgetId: string) => {
    persistWidgets(localWidgets.filter((widget) => widget.id !== widgetId));
  };

  const handleSetDefault = (layoutId: string) => {
    setDefaultLayout.mutate(layoutId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localWidgets.findIndex((widget) => widget.id === active.id);
    const newIndex = localWidgets.findIndex((widget) => widget.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    persistWidgets(arrayMove(localWidgets, oldIndex, newIndex));
  };

  const filteredTemplates =
    selectedCategory === 'all'
      ? WIDGET_TEMPLATES
      : WIDGET_TEMPLATES.filter((template) => template.category === selectedCategory);

  if (!workspaceId) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center">
        <LayoutGrid className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 dark:text-slate-400">Select a workspace to customize dashboard layout.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Customization</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Personalize your dashboard with widgets, drag-drop ordering, and layout persistence.
          </p>
        </div>
        <button
          onClick={handleCreateLayout}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Layout
        </button>
      </div>

      {layouts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Layouts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                type="button"
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedLayout?.id === layout.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                onClick={() => setSelectedLayoutId(layout.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-900 dark:text-white">{layout.name}</span>
                  </div>
                  {(layout.is_active || layout.is_default) && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {(layout.widgets || []).length} widgets
                </p>
                <div className="flex items-center gap-2">
                  {!layout.is_active && !layout.is_default && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSetDefault(layout.id);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteLayout.mutate(layout.id);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedLayout && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Widget Library</h3>
              <div className="flex items-center gap-2">
                {(['all', 'productivity', 'analytics', 'collaboration'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      selectedCategory === category
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category === 'all' ? 'All' : category[0].toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                const isAdded = localWidgets.some((widget) => widget.type === template.type);

                return (
                  <div
                    key={template.id}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-1">{template.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddWidget(template)}
                      disabled={isAdded}
                      className={`w-full px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                        isAdded
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isAdded ? 'Added' : 'Add Widget'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Current Widgets ({localWidgets.length})
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Drag to reorder. Resize with S/M/L controls. Changes are saved automatically.
            </p>

            {localWidgets.length === 0 ? (
              <div className="text-center py-12">
                <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No widgets added yet. Add some from the library above.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={localWidgets.map((widget) => widget.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {localWidgets.map((widget) => (
                      <SortableWidgetRow
                        key={widget.id}
                        widget={widget}
                        onToggle={handleToggleWidget}
                        onResize={handleResizeWidget}
                        onRemove={handleRemoveWidget}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </>
      )}

      {!selectedLayout && layouts.length > 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Select a layout to customize</p>
        </div>
      )}

      {layouts.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 mb-3">No dashboard layout yet for this workspace.</p>
          <button
            onClick={handleCreateLayout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            <Plus className="w-4 h-4" />
            Create First Layout
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardCustomizer;
