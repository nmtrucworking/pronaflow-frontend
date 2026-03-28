/**
 * Workspace Forms
 * Reusable form components for workspace operations
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  CreateInvitationDTO,
  UpdateSettingsDTO,
  WorkspaceRole,
} from '@/types/workspace';

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  description: z.string().optional(),
});

const updateWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
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

interface CreateWorkspaceFormProps {
  onSubmit: (data: CreateWorkspaceDTO) => void;
  isLoading?: boolean;
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceDTO>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormItem>
        <FormLabel>Workspace Name *</FormLabel>
        <Input
          placeholder="e.g., Engineering Team"
          {...register('name')}
          disabled={isLoading}
        />
        <FormDescription>The name of your workspace (max 50 characters)</FormDescription>
        <FormMessage>{errors.name?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Describe your workspace..."
          {...register('description')}
          disabled={isLoading}
          className="resize-none"
        />
        <FormMessage>{errors.description?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Workspace'}
      </Button>
    </form>
  );
};

interface UpdateWorkspaceFormProps {
  defaultValues?: UpdateWorkspaceDTO;
  onSubmit: (data: UpdateWorkspaceDTO) => void;
  isLoading?: boolean;
}

export const UpdateWorkspaceForm: React.FC<UpdateWorkspaceFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateWorkspaceDTO>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormItem>
        <FormLabel>Workspace Name</FormLabel>
        <Input {...register('name')} disabled={isLoading} />
        <FormMessage>{errors.name?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Description</FormLabel>
        <Textarea {...register('description')} disabled={isLoading} className="resize-none" />
        <FormMessage>{errors.description?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Workspace'}
      </Button>
    </form>
  );
};

interface InviteUserFormProps {
  onSubmit: (data: CreateInvitationDTO) => void;
  isLoading?: boolean;
}

const roleOptions: WorkspaceRole[] = ['owner', 'admin', 'member', 'viewer', 'guest'];

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInvitationDTO>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      invited_role: 'member',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormItem>
        <FormLabel>Email Address *</FormLabel>
        <Input
          type="email"
          placeholder="user@example.com"
          {...register('email')}
          disabled={isLoading}
        />
        <FormMessage>{errors.email?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Role</FormLabel>
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          {...register('invited_role')}
          disabled={isLoading}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        <FormDescription>The role this user will have in the workspace</FormDescription>
        <FormMessage>{errors.invited_role?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Invitation'}
      </Button>
    </form>
  );
};

interface WorkspaceSettingsFormProps {
  defaultValues?: UpdateSettingsDTO;
  onSubmit: (data: UpdateSettingsDTO) => void;
  isLoading?: boolean;
}

export const WorkspaceSettingsForm: React.FC<WorkspaceSettingsFormProps> = ({
  defaultValues,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSettingsDTO>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultValues || {},
  });

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormItem>
        <FormLabel>Timezone</FormLabel>
        <Input
          placeholder="e.g., Asia/Ho_Chi_Minh"
          {...register('timezone')}
          disabled={isLoading}
        />
        <FormMessage>{errors.timezone?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Working Days</FormLabel>
        <Input
          placeholder="e.g., Mon,Tue,Wed,Thu,Fri"
          {...register('work_days')}
          disabled={isLoading}
        />
        <FormDescription>Comma-separated list of working days</FormDescription>
        <FormMessage>{errors.work_days?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Working Hours</FormLabel>
        <Input
          placeholder='e.g., {"start": "09:00", "end": "18:00"}'
          {...register('work_hours')}
          disabled={isLoading}
        />
        <FormDescription>Working hours in JSON format</FormDescription>
        <FormMessage>{errors.work_hours?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Logo URL</FormLabel>
        <Input
          type="url"
          placeholder="https://example.com/logo.png"
          {...register('logo_url')}
          disabled={isLoading}
        />
        <FormMessage>{errors.logo_url?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Settings'}
      </Button>
    </form>
  );
};
