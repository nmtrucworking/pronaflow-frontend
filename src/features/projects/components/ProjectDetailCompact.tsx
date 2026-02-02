import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Circle, Calendar, Users, TrendingUp, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

// ========================================================================
// Mock Data Interfaces
// ========================================================================

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface MockTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: MockUser;
}

interface MockProjectDetail {
  id: string;
  name: string;
  projectKey: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'ON_HOLD';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string;
  description: string;
  progress: number;
  team: MockUser[];
  recentTasks: MockTask[];
}

// ========================================================================
// Badge Components (Mock)
// ========================================================================

const StatusBadge: React.FC<{ status: MockProjectDetail['status'] }> = ({ status }) => {
  const styles: Record<string, string> = {
    'NOT_STARTED': 'bg-slate-100 text-slate-700',
    'IN_PROGRESS': 'bg-blue-100 text-blue-700',
    'IN_REVIEW': 'bg-amber-100 text-amber-700',
    'DONE': 'bg-green-100 text-green-700',
    'ON_HOLD': 'bg-orange-100 text-orange-700',
  };

  const labels: Record<string, string> = {
    'NOT_STARTED': 'Not Started',
    'IN_PROGRESS': 'In Progress',
    'IN_REVIEW': 'In Review',
    'DONE': 'Done',
    'ON_HOLD': 'On Hold',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {labels[status]}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: MockProjectDetail['priority'] }> = ({ priority }) => {
  const styles: Record<string, string> = {
    LOW: 'bg-blue-100 text-blue-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700',
  };

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[priority])}>
      {priority}
    </span>
  );
};

// ========================================================================
// Avatar Stack Component (Mock)
// ========================================================================

const AvatarStack: React.FC<{ users: MockUser[] }> = ({ users }) => {
  const displayUsers = users.slice(0, 4);
  const extraCount = users.length - displayUsers.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className="w-7 h-7 rounded-full bg-slate-200 border border-white flex items-center justify-center text-xs font-semibold text-slate-700 relative group"
            title={user.name}
          >
            {user.avatar || user.name.substring(0, 2).toUpperCase()}
          </div>
        ))}
      </div>
      {extraCount > 0 && (
        <span className="ml-2 text-xs text-slate-500 font-medium">+{extraCount} more</span>
      )}
    </div>
  );
};

// ========================================================================
// Progress Bar Component (Mock)
// ========================================================================

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
    <div
      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

// ========================================================================
// Skeleton Loader Component
// ========================================================================

const ProjectDetailSkeleton: React.FC = () => (
  <div className="p-6 space-y-4 animate-pulse">
    {/* Header skeleton */}
    <div className="space-y-2 mb-6">
      <div className="h-6 bg-slate-300 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/3" />
    </div>

    {/* Meta row skeleton */}
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-slate-200 rounded w-20" />
      <div className="h-6 bg-slate-200 rounded w-20" />
      <div className="h-6 bg-slate-200 rounded w-24" />
    </div>

    {/* Description skeleton */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-slate-200 rounded" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
      <div className="h-4 bg-slate-200 rounded w-4/6" />
    </div>

    {/* Team skeleton */}
    <div className="h-7 bg-slate-200 rounded w-12 mb-4" />

    {/* Progress skeleton */}
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-slate-200 rounded w-32" />
      <div className="h-2 bg-slate-200 rounded" />
    </div>

    {/* Tasks skeleton */}
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-24" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 bg-slate-200 rounded" />
      ))}
    </div>
  </div>
);

// ========================================================================
// Mock Hook for Data Fetching
// ========================================================================

const useProjectDetail = (projectId: string) => {
  const [data, setData] = useState<MockProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Simulate 1s delay for data fetching
    const timer = setTimeout(() => {
      try {
        // Mock data based on projectId
        const mockData: MockProjectDetail = {
          id: projectId,
          name: 'Q1 Mobile App Redesign',
          projectKey: `PRJ-${projectId.slice(-4).toUpperCase()}`,
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: '2026-03-15',
          description:
            'Complete redesign of the mobile application with focus on improving user experience, performance, and accessibility. Includes new UI/UX components, API integration, and comprehensive testing.',
          progress: 65,
          team: [
            { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS' },
            { id: '3', name: 'Bob Johnson', email: 'bob@example.com', avatar: 'BJ' },
            { id: '4', name: 'Alice Williams', email: 'alice@example.com', avatar: 'AW' },
            { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'CB' },
          ],
          recentTasks: [
            { id: 't1', title: 'Design mockups and prototypes', completed: true, assignee: { id: '1', name: 'John Doe', email: 'john@example.com' } },
            { id: 't2', title: 'API integration and testing', completed: false, assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com' } },
            { id: 't3', title: 'User acceptance testing', completed: false, assignee: { id: '3', name: 'Bob Johnson', email: 'bob@example.com' } },
            { id: 't4', title: 'Performance optimization', completed: false, assignee: { id: '1', name: 'John Doe', email: 'john@example.com' } },
            { id: 't5', title: 'Documentation and deployment', completed: false, assignee: { id: '4', name: 'Alice Williams', email: 'alice@example.com' } },
          ],
        };
        setData(mockData);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [projectId]);

  return { data, isLoading, error };
};

// ========================================================================
// Main Component
// ========================================================================

interface ProjectDetailCompactProps {
  projectId: string;
  onClose?: () => void;
}

export const ProjectDetailCompact: React.FC<ProjectDetailCompactProps> = ({ projectId, onClose }) => {
  const { data, isLoading, error } = useProjectDetail(projectId);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-slate-500">{error || 'Project not found'}</p>
      </div>
    );
  }

  const formattedDueDate = new Date(data.dueDate).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  });

  const completedTasks = data.recentTasks.filter((t) => t.completed).length;
  const displayDescription = showFullDescription ? data.description : data.description;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 line-clamp-2">{data.name}</h2>
            <p className="text-xs font-mono text-slate-400 mt-1">{data.projectKey}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            title="Close"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Meta Row: Status, Priority, Due Date */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={data.status} />
            <PriorityBadge priority={data.priority} />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDueDate}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-2">
          <p
            className={clsx(
              'text-sm text-slate-600 leading-relaxed transition-all',
              showFullDescription ? '' : 'line-clamp-3'
            )}
          >
            {displayDescription}
          </p>
          {data.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {showFullDescription ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Team Section */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase">Team ({data.team.length})</span>
          </div>
          <AvatarStack users={data.team} />
        </div>

        {/* Progress Section */}
        <div className="px-6 py-4 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 uppercase">Overall Progress</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{data.progress}%</span>
          </div>
          <ProgressBar value={data.progress} />
        </div>

        {/* Recent Tasks Section */}
        <div className="px-6 py-4 space-y-3">
          <span className="block text-xs font-semibold text-slate-600 uppercase">Recent Tasks ({completedTasks}/{data.recentTasks.length})</span>

          <div className="space-y-2">
            {data.recentTasks.map((task, index) => (
              <div
                key={task.id}
                className={clsx(
                  'flex items-center gap-3 p-2 rounded-md transition-colors',
                  task.completed ? 'bg-slate-50 hover:bg-slate-100' : 'hover:bg-slate-50'
                )}
              >
                {/* Task Icon */}
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                )}

                {/* Task Title */}
                <span
                  className={clsx('text-xs font-medium flex-1 truncate', task.completed ? 'text-slate-500 line-through' : 'text-slate-700')}
                >
                  {task.title}
                </span>

                {/* Assignee Avatar */}
                {task.assignee && (
                  <div
                    className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 flex-shrink-0"
                    title={task.assignee.name}
                  >
                    {task.assignee.avatar || task.assignee.name.substring(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Open Full Page Button */}
      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <button
          className={clsx(
            'w-full inline-flex items-center justify-center gap-2 px-4 py-2.5',
            'rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium',
            'hover:bg-slate-50 hover:border-slate-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          <span>Open Full Page</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailCompact;
