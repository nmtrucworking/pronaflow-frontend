/**
 * Dashboard Customizer Component
 * Module 9: User Experience Personalization
 * Widget library, drag & drop layout, dashboard management
 */

import React, { useState } from 'react';
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
} from '@/hooks/usePersonalization';
import { DashboardWidget, DashboardLayout } from '@/types/personalization';

interface WidgetTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ElementType;
  defaultSize: { w: number; h: number };
  category: 'productivity' | 'analytics' | 'collaboration';
}

interface DashboardCustomizerProps {
  userId?: string;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'tasks-overview',
    type: 'tasks-overview',
    name: 'Tasks Overview',
    description: 'Quick view of your tasks and priorities',
    icon: ListTodo,
    defaultSize: { w: 4, h: 3 },
    category: 'productivity',
  },
  {
    id: 'recent-projects',
    type: 'recent-projects',
    name: 'Recent Projects',
    description: 'Recently accessed projects',
    icon: LayoutGrid,
    defaultSize: { w: 4, h: 2 },
    category: 'productivity',
  },
  {
    id: 'calendar-widget',
    type: 'calendar',
    name: 'Calendar',
    description: 'Upcoming events and deadlines',
    icon: Calendar,
    defaultSize: { w: 3, h: 3 },
    category: 'productivity',
  },
  {
    id: 'team-activity',
    type: 'team-activity',
    name: 'Team Activity',
    description: 'Recent team member activities',
    icon: Users,
    defaultSize: { w: 4, h: 3 },
    category: 'collaboration',
  },
  {
    id: 'time-tracking',
    type: 'time-tracking',
    name: 'Time Tracking',
    description: 'Hours logged this week',
    icon: Clock,
    defaultSize: { w: 3, h: 2 },
    category: 'analytics',
  },
  {
    id: 'productivity-chart',
    type: 'productivity-chart',
    name: 'Productivity Chart',
    description: 'Task completion trends',
    icon: BarChart3,
    defaultSize: { w: 6, h: 3 },
    category: 'analytics',
  },
  {
    id: 'project-progress',
    type: 'project-progress',
    name: 'Project Progress',
    description: 'Overall project completion',
    icon: TrendingUp,
    defaultSize: { w: 4, h: 2 },
    category: 'analytics',
  },
  {
    id: 'notifications-feed',
    type: 'notifications',
    name: 'Notifications',
    description: 'Recent notifications and alerts',
    icon: AlertCircle,
    defaultSize: { w: 3, h: 4 },
    category: 'collaboration',
  },
];

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ userId = 'current-user' }) => {
  const { data: layouts, isLoading } = useDashboardLayouts(userId);
  const createLayout = useCreateDashboardLayout(userId);
  const updateLayout = useUpdateDashboardLayout(userId, selectedLayout?.id || '');
  const deleteLayout = useDeleteDashboardLayout(userId);

  const [selectedLayout, setSelectedLayout] = useState<DashboardLayout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCreateLayout = () => {
    const newLayout: Omit<DashboardLayout, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
      name: `Dashboard ${(layouts?.length || 0) + 1}`,
      is_default: layouts?.length === 0,
      widgets: [],
    };
    createLayout.mutate(newLayout as any);
  };

  const handleAddWidget = (template: WidgetTemplate) => {
    if (!selectedLayout) return;

    const newWidget: DashboardWidget = {
      id: `${template.type}-${Date.now()}`,
      type: template.type as any,
      title: template.name,
      description: template.description,
      icon: template.id,
      is_enabled: true,
      size: 'medium',
      position: { x: 0, y: 0 },
      config: {},
    };

    const updatedWidgets = [...selectedLayout.widgets, newWidget];
    updateLayout.mutate({ widgets: updatedWidgets } as any);
  };

  const handleToggleWidget = (widgetId: string) => {
    if (!selectedLayout) return;

    const updatedWidgets = selectedLayout.widgets.map((w) =>
      w.id === widgetId ? { ...w, is_enabled: !w.is_enabled } : w
    );

    updateLayout.mutate({ widgets: updatedWidgets } as any);
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (!selectedLayout) return;

    const updatedWidgets = selectedLayout.widgets.filter((w) => w.id !== widgetId);
    updateLayout.mutate({ widgets: updatedWidgets } as any);
  };

  const handleSetDefault = (layoutId: string) => {
    updateLayout.mutate({ is_default: true } as any);
  };

  const filteredTemplates =
    selectedCategory === 'all'
      ? WIDGET_TEMPLATES
      : WIDGET_TEMPLATES.filter((t) => t.category === selectedCategory);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Customization
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Personalize your dashboard with widgets and layouts
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

      {/* Layout Selector */}
      {layouts && layouts.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Your Layouts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedLayout?.id === layout.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
                onClick={() => setSelectedLayout(layout)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {layout.name}
                    </span>
                  </div>
                  {layout.is_default && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {layout.widgets.length} widgets
                </p>
                <div className="flex items-center gap-2">
                  {!layout.is_default && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(layout.id);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayout.mutate(layout.id);
                    }}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLayout && (
        <>
          {/* Widget Library */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Widget Library
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('productivity')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedCategory === 'productivity'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Productivity
                </button>
                <button
                  onClick={() => setSelectedCategory('analytics')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedCategory === 'analytics'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setSelectedCategory('collaboration')}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedCategory === 'collaboration'
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  Collaboration
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                const isAdded = selectedLayout.widgets.some(
                  (w) => w.type === template.type
                );

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
                        <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                          {template.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {template.description}
                        </p>
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

          {/* Current Widgets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Current Widgets ({selectedLayout.widgets.length})
            </h3>

            {selectedLayout.widgets.length === 0 ? (
              <div className="text-center py-12">
                <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  No widgets added yet. Add some from the library above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedLayout.widgets.map((widget) => {
                  const template = WIDGET_TEMPLATES.find((t) => t.type === widget.type);
                  if (!template) return null;

                  const Icon = template.icon;

                  return (
                    <div
                      key={widget.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                    >
                      <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                      <div className="p-2 bg-white dark:bg-slate-800 rounded">
                        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {widget.size} widget
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleWidget(widget.id)}
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
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Remove widget"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedLayout && layouts && layouts.length > 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <LayoutGrid className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">
            Select a layout to customize
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardCustomizer;
