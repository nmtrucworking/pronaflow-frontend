/**
 * Workspace Forms
 * Reusable form components for workspace operations
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateWorkspaceDTO, UpdateWorkspaceDTO, CreateInvitationDTO, UpdateSettingsDTO } from '@/types/workspace';
import { FieldValues, UseFormRegister } from 'react-hook-form';

// ============================================================================
// Validation Schemas
// ============================================================================

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().optional(),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
});

const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  invited_role: z.enum(['owner', 'admin', 'member', 'viewer', 'guest']).default('member'),
});

const settingsSchema = z.object({
  timezone: z.string().optional(),
  work_days: z.string().optional(),
  work_hours: z.string().optional(),
  logo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// ============================================================================
// Create Workspace Form
// ============================================================================

interface CreateWorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceDTO) => void;
  isLoading?: boolean;
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<CreateWorkspaceDTO>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="name"
          render={({ field }: { field: UseFormRegister<CreateWorkspaceDTO> }) => (
            <FormItem>
              <FormLabel>Workspace Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Engineering Team"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>The name of your workspace (max 50 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }: { field: UseFormRegister<CreateWorkspaceDTO> }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your workspace..."
                  {...field}
                  disabled={isLoading}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Workspace'}
        </Button>
      </form>
    </Form>
  );
};

// ============================================================================
// Update Workspace Form
// ============================================================================

interface UpdateWorkspaceFormProps {
  defaultValues?: UpdateWorkspaceDTO;
  onSubmit: (data: UpdateWorkspaceDTO) => void;
  isLoading?: boolean;
}

export const UpdateWorkspaceForm: React.FC<UpdateWorkspaceFormProps> = ({
  defaultValues = {},
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<UpdateWorkspaceDTO>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="name"
          render={({ field }: { field: UseFormRegister<UpdateWorkspaceDTO> }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }: { field: UseFormRegister<UpdateWorkspaceDTO> }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading} className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Workspace'}
        </Button>
      </form>
    </Form>
  );
};

// ============================================================================
// Invite User Form
// ============================================================================

interface InviteUserFormProps {
  onSubmit: (data: CreateInvitationDTO) => void;
  isLoading?: boolean;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<CreateInvitationDTO>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      invited_role: 'member',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="email"
          render={({ field }: { field: UseFormRegister<CreateInvitationDTO> }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="invited_role"
          render={({ field }: { field: UseFormRegister<CreateInvitationDTO> }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The role this user will have in the workspace</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </form>
    </Form>
  );
};

// ============================================================================
// Workspace Settings Form
// ============================================================================

interface WorkspaceSettingsFormProps {
  defaultValues?: UpdateSettingsDTO;
  onSubmit: (data: UpdateSettingsDTO) => void;
  isLoading?: boolean;
}

export const WorkspaceSettingsForm: React.FC<WorkspaceSettingsFormProps> = ({
  defaultValues = {},
  onSubmit,
  isLoading = false,
}) => {
  const form = useForm<UpdateSettingsDTO>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="timezone"
          render={({ field }: { field: UseFormRegister<UpdateSettingsDTO> }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Asia/Ho_Chi_Minh">Ho Chi Minh City</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="work_days"
          render={({ field }: { field: UseFormRegister<UpdateSettingsDTO> }) => (
            <FormItem>
              <FormLabel>Working Days</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mon,Tue,Wed,Thu,Fri"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Comma-separated list of working days</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="work_hours"
          render={({ field }: { field: UseFormRegister<UpdateSettingsDTO> }) => (
            <FormItem>
              <FormLabel>Working Hours</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g., {"start": "09:00", "end": "18:00"}'
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Working hours in JSON format</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          // control={form.control} // Add this line to pass the control prop
          name="logo_url"
          render={({ field }: { field: UseFormRegister<UpdateSettingsDTO> }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </Form>
  );
};
