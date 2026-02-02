/**
 * Example Usage: ProjectDetailCompact Component
 * This file demonstrates how to use the ProjectDetailCompact component in your sidebar
 */

import React, { useState } from 'react';
import { ProjectDetailCompact } from './ProjectDetailCompact';

// ========================================================================
// Example 1: Basic Usage in a Sidebar
// ========================================================================

export function PreviewSidebar() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('proj-12345');

  return (
    <div className="flex h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-slate-50">
        <h1 className="text-2xl font-bold">Projects</h1>
        {/* Your main content here */}
      </div>

      {/* Preview Sidebar */}
      {selectedProjectId && (
        <div className="w-96 bg-white border-l border-slate-200 shadow-lg">
          <ProjectDetailCompact projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
        </div>
      )}
    </div>
  );
}

// ========================================================================
// Example 2: Mobile-Friendly Modal Version
// ========================================================================

export function ProjectPreviewModal({ projectId, isOpen, onClose }: { projectId: string; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-end">
      <div className="w-full md:w-96 bg-white rounded-t-2xl md:rounded-2xl max-h-screen overflow-hidden">
        <ProjectDetailCompact projectId={projectId} onClose={onClose} />
      </div>
    </div>
  );
}

// ========================================================================
// Example 3: Integration with Project List
// ========================================================================

export function ProjectListWithPreview() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Mock projects data
  const projects = [
    { id: 'proj-001', name: 'Q1 Mobile App Redesign', status: 'IN_PROGRESS' },
    { id: 'proj-002', name: 'API Performance Optimization', status: 'IN_PROGRESS' },
    { id: 'proj-003', name: 'Dashboard Analytics', status: 'NOT_STARTED' },
  ];

  return (
    <div className="flex h-screen">
      {/* Project List */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">My Projects</h1>

          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedProjectId === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{project.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Sidebar */}
      {selectedProjectId && (
        <div className="w-96 border-l border-slate-200 bg-white">
          <ProjectDetailCompact projectId={selectedProjectId} onClose={() => setSelectedProjectId(null)} />
        </div>
      )}
    </div>
  );
}

// ========================================================================
// Example 4: Standalone Component
// ========================================================================

export function StandaloneProjectDetail() {
  return <ProjectDetailCompact projectId="proj-standalone" />;
}

// ========================================================================
// Example 5: With Custom Styling (Responsive)
// ========================================================================

export function ResponsiveProjectPreview({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Project Details
      </button>

      {/* Sidebar on Desktop */}
      <div className="hidden lg:block fixed right-0 top-0 w-96 h-screen border-l border-slate-200 bg-white shadow-lg">
        <ProjectDetailCompact projectId={projectId} onClose={() => setIsOpen(false)} />
      </div>

      {/* Modal on Mobile */}
      <ProjectPreviewModal projectId={projectId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

// ========================================================================
// Example 6: With Real Data (when integrated with actual hooks)
// ========================================================================

/**
 * When you're ready to integrate with real data, replace the mock hook
 * in ProjectDetailCompact.tsx with actual hooks:
 *
 * import { useProject, useProjectMembers, useChangeRequests } from '@/hooks/projectHooks';
 *
 * Example:
 *
 * export const ProjectDetailCompact: React.FC<ProjectDetailCompactProps> = ({ projectId, onClose }) => {
 *   const { data: project, isLoading: isProjectLoading } = useProject(projectId);
 *   const { data: members, isLoading: isMembersLoading } = useProjectMembers(projectId);
 *   const { data: recentTasks } = useChangeRequests(projectId); // or use actual task hook from Module 4
 *
 *   const isLoading = isProjectLoading || isMembersLoading;
 *
 *   if (isLoading) {
 *     return <ProjectDetailSkeleton />;
 *   }
 *
 *   if (!project) {
 *     return <div>Project not found</div>;
 *   }
 *
 *   // ... rest of component
 * };
 */

export default PreviewSidebar;
