/**
 * Invitation Card Component
 * Displays pending workspace invitations
 */

import React from 'react';
import { WorkspaceInvitation } from '@/types/workspace';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Copy, Clock, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui';
import { formatDate } from '@/lib/localeFormatters';

interface InvitationCardProps {
  invitation: WorkspaceInvitation;
  onCancel?: (invitationId: string) => void;
  onResend?: (invitationId: string) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onCancel,
  onResend,
}) => {
  const isExpired = new Date(invitation.expires_at) < new Date();
  const hoursUntilExpiry = Math.max(
    0,
    Math.round(
      (new Date(invitation.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60)
    )
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(invitation.email);
    toast.success('Email copied to clipboard!');
  };

  return (
    <Card className={isExpired ? 'opacity-50' : ''}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" />
            {invitation.email}
          </CardTitle>
          <CardDescription className="text-xs">
            {isExpired ? (
              <span className="text-red-600">Expired</span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expires in {hoursUntilExpiry} hours
              </span>
            )}
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                title="Invitation actions"
                aria-label="Invitation actions"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Manage invitation</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleCopyEmail}>
                <Copy className="w-4 h-4 mr-2" />
                Copy email
              </DropdownMenuItem>
              {!isExpired && (
                <DropdownMenuItem onClick={() => onResend?.(invitation.id)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend invitation
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onCancel?.(invitation.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancel invitation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2">
          <Tooltip content={`Role to be granted after acceptance: ${invitation.invited_role}`} placement="top" delay={150}>
            <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-700">
              {invitation.invited_role.charAt(0).toUpperCase() + invitation.invited_role.slice(1)}
            </span>
          </Tooltip>
          <span className="text-xs text-gray-500">
            Invited {formatDate(invitation.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationCard;
