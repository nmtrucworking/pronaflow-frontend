/**
 * Workspace Card Component
 * Displays workspace information with actions
 */

import React from 'react';
import { Workspace, WorkspaceRole } from '@/types/workspace';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Users, Settings, MoreVertical, Trash2, Edit2, UserPlus, LogOut, Mail } from 'lucide-react';
import { Tooltip } from '@/components/ui';
import { formatDate, formatDateTime } from '@/lib/localeFormatters';

interface WorkspaceCardProps {
  workspace: Workspace;
  compact?: boolean;
  role?: WorkspaceRole;
  invitationsCount?: number;
  onSelect?: (workspace: Workspace) => void;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspaceId: string) => void;
  onInviteMember?: (workspaceId: string) => void;
  onLeaveWorkspace?: (workspace: Workspace) => void;
  onViewInvitations?: (workspace: Workspace) => void;
  onManageMembers?: (workspaceId: string) => void;
  onManageSettings?: (workspaceId: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  compact = false,
  role = 'member',
  invitationsCount = 0,
  onSelect,
  onEdit,
  onDelete,
  onInviteMember,
  onLeaveWorkspace,
  onViewInvitations,
  onManageMembers,
  onManageSettings,
}) => {
  const canManage = role === 'owner' || role === 'admin';
  const canLeave = role !== 'owner';

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect?.(workspace)}>
      <CardHeader className={compact ? 'flex flex-row items-start justify-between space-y-0 pb-2' : 'flex flex-row items-start justify-between space-y-0'}>
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Building2 className={compact ? 'w-4 h-4 text-blue-500' : 'w-5 h-5 text-blue-500'} />
            {workspace.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {role === 'owner' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">Owner</span>}
            {role === 'admin' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Admin</span>}
            {role === 'member' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Member</span>}
          </CardDescription>
        </div>

        {(canManage || canLeave) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                title="Workspace actions"
                aria-label="Workspace actions"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
              {canManage && (
                <>
                  <DropdownMenuLabel>Manage workspace</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit?.(workspace)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onInviteMember?.(workspace.id)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite member
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onManageMembers?.(workspace.id)}>
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                  </DropdownMenuItem>
                  {invitationsCount > 0 && (
                    <DropdownMenuItem onClick={() => onViewInvitations?.(workspace)}>
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="flex-1">View Invitations</span>
                      <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                        {invitationsCount}
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onManageSettings?.(workspace.id)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </>
              )}

              {canLeave && (
                <>
                  {canManage && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => onLeaveWorkspace?.(workspace)}
                    className="text-amber-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave workspace
                  </DropdownMenuItem>
                </>
              )}

              {role === 'owner' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(workspace.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className={compact ? 'pt-0' : undefined}>
        {workspace.description && (
          <p className={compact ? 'text-xs text-gray-600 mb-3 line-clamp-2' : 'text-sm text-gray-600 mb-4'}>{workspace.description}</p>
        )}
        <div className={compact ? 'flex gap-2 text-[11px] text-gray-500' : 'flex gap-2 text-xs text-gray-500'}>
          <Tooltip content={`Updated: ${formatDateTime(workspace.updated_at)}`} placement="top" delay={150}>
            <span>Created: {formatDate(workspace.created_at)}</span>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
