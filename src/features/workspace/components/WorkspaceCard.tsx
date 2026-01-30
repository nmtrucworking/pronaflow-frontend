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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building2, Users, Settings, MoreVertical, Trash2, Edit2 } from 'lucide-react';

interface WorkspaceCardProps {
  workspace: Workspace;
  role?: WorkspaceRole;
  onSelect?: (workspace: Workspace) => void;
  onEdit?: (workspace: Workspace) => void;
  onDelete?: (workspaceId: string) => void;
  onManageMembers?: (workspaceId: string) => void;
  onManageSettings?: (workspaceId: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  role = 'member',
  onSelect,
  onEdit,
  onDelete,
  onManageMembers,
  onManageSettings,
}) => {
  const canManage = role === 'owner' || role === 'admin';

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelect?.(workspace)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex-1">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            {workspace.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {role === 'owner' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">Owner</span>}
            {role === 'admin' && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Admin</span>}
            {role === 'member' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Member</span>}
          </CardDescription>
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(workspace)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageMembers?.(workspace.id)}>
                <Users className="w-4 h-4 mr-2" />
                Manage Members
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageSettings?.(workspace.id)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
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

      <CardContent>
        {workspace.description && (
          <p className="text-sm text-gray-600 mb-4">{workspace.description}</p>
        )}
        <div className="flex gap-2 text-xs text-gray-500">
          <span>Created: {new Date(workspace.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
