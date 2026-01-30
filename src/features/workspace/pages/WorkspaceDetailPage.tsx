/**
 * Workspace Detail Page
 * Display workspace with tabs for members, invitations, and settings
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Settings, Users, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Tabs from '@radix-ui/react-tabs';
import { useWorkspace, useWorkspaceMembers, useInvitations } from '@/hooks/useWorkspace';
import { useWorkspaceStore } from '@/store/features/workspaceStore';
import { MemberCard } from '../components/MemberCard';
import { InvitationCard } from '../components/InvitationCard';
import { WorkspaceSettingsForm } from '../forms/WorkspaceForms';

export const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('members');

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Workspace ID is missing</p>
      </div>
    );
  }

  // Hooks
  const { data: workspace, isLoading } = useWorkspace(id);
  const { data: membersData } = useWorkspaceMembers(id, 0, 50);
  const { data: invitationsData } = useInvitations(id, 0, 50);
  const { setCurrentWorkspace } = useWorkspaceStore();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Workspace not found</p>
        <Button onClick={() => navigate('/workspaces')}>Back to Workspaces</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/workspaces')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
              {workspace.description && (
                <p className="text-sm text-gray-500 mt-1">{workspace.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{membersData?.items?.length || 0} members</span>
            <span>•</span>
            <span className="capitalize">{workspace.status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="py-8">
          <Tabs.List className="flex border-b border-gray-200 px-4">
            <Tabs.Trigger
              value="members"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Users className="w-4 h-4" />
              Members ({membersData?.items?.length || 0})
            </Tabs.Trigger>

            <Tabs.Trigger
              value="invitations"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Mail className="w-4 h-4" />
              Invitations ({invitationsData?.items?.length || 0})
            </Tabs.Trigger>

            <Tabs.Trigger
              value="settings"
              className="px-4 py-2 flex items-center gap-2 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-600"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Tabs.Trigger>
          </Tabs.List>

          {/* Members Tab */}
          <Tabs.Content value="members" className="py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {membersData?.items?.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  currentUserRole="owner"
                  onChangeRole={(role) => {
                    console.log('Change role to:', role);
                  }}
                  onRemove={() => {
                    console.log('Remove member:', member.id);
                  }}
                />
              )) || (
                <p className="text-gray-500 col-span-full">No members yet</p>
              )}
            </div>
          </Tabs.Content>

          {/* Invitations Tab */}
          <Tabs.Content value="invitations" className="py-6 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invitationsData?.items?.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onCancel={() => {
                    console.log('Cancel invitation:', invitation.id);
                  }}
                  onResend={() => {
                    console.log('Resend invitation:', invitation.id);
                  }}
                />
              )) || (
                <p className="text-gray-500 col-span-full">No pending invitations</p>
              )}
            </div>
          </Tabs.Content>

          {/* Settings Tab */}
          <Tabs.Content value="settings" className="py-6 px-4">
            <div className="max-w-2xl">
              <WorkspaceSettingsForm
                workspace={workspace}
                onSubmit={(data) => {
                  console.log('Update settings:', data);
                }}
                isLoading={false}
              />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default WorkspaceDetailPage;
