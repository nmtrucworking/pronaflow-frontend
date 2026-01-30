/**
 * Member Card Component
 * Displays workspace member information with actions
 */

import React from 'react';
import { WorkspaceMember, WorkspaceRole } from '@/types/workspace';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Trash2, UserCog, Shield } from 'lucide-react';

interface MemberCardProps {
  member: WorkspaceMember;
  currentUserRole?: WorkspaceRole;
  onChangeRole?: (member: WorkspaceMember, newRole: WorkspaceRole) => void;
  onRemove?: (memberId: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currentUserRole,
  onChangeRole,
  onRemove,
}) => {
  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';

  const getRoleColor = (role: WorkspaceRole) => {
    switch (role) {
      case 'owner':
        return 'bg-orange-100 text-orange-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'member':
        return 'bg-gray-100 text-gray-700';
      case 'viewer':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.user?.avatar} />
            <AvatarFallback>{member.user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm">{member.user?.username || 'Unknown'}</CardTitle>
            <CardDescription className="text-xs">{member.user?.email}</CardDescription>
          </div>
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {member.role !== 'owner' && (
                <>
                  <DropdownMenuItem onClick={() => onChangeRole?.(member, 'admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Make Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeRole?.(member, 'member')}>
                    <UserCog className="w-4 h-4 mr-2" />
                    Make Member
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => onRemove?.(member.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded ${getRoleColor(member.role)}`}>
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            Joined {new Date(member.joined_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
