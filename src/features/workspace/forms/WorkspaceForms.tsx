/**
 * Workspace Forms
 * Reusable form components for workspace operations
 */

import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Check } from 'lucide-react';
import {
  CreateWorkspaceDTO,
  UpdateWorkspaceDTO,
  CreateInvitationDTO,
  CreateBulkInvitationDTO,
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
  invited_role: z.enum(['admin', 'member', 'viewer']),
});

const bulkInviteUserSchema = z.object({
  emails: z.string().min(1, 'At least one email is required'),
  invited_role: z.enum(['admin', 'member', 'viewer']),
});

const settingsSchema = z.object({
  timezone: z.string().optional(),
  work_days: z.string().optional(),
  work_hours: z.string().optional(),
  logo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (UTC+7)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
  { value: 'UTC', label: 'UTC (UTC+0)' },
  { value: 'America/New_York', label: 'America/New York (UTC-5/-4)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0/+1)' },
];

const WORKING_DAY_PRESETS = [
  { value: 'Mon,Tue,Wed,Thu,Fri', label: 'Mon - Fri' },
  { value: 'Mon,Tue,Wed,Thu,Fri,Sat', label: 'Mon - Sat' },
  { value: 'Sat,Sun', label: 'Weekend only' },
  { value: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', label: 'Every day' },
];

const WORK_HOUR_PRESETS = [
  { value: '{"start":"09:00","end":"18:00"}', label: 'Standard office hours' },
  { value: '{"start":"08:00","end":"17:00"}', label: 'Early shift' },
  { value: '{"start":"10:00","end":"19:00"}', label: 'Late shift' },
  { value: '{"start":"00:00","end":"23:59"}', label: '24/7 coverage' },
];

const getLabelByValue = (options: { value: string; label: string }[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? 'Custom';

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

const roleOptions: WorkspaceRole[] = ['admin', 'member', 'viewer'];
type InviteFormValues = {
  email: string;
  invited_role: 'admin' | 'member' | 'viewer';
};

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      invited_role: 'member',
    },
  });

  const submitInvite = (data: InviteFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitInvite)} className="space-y-6">
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

interface BulkInviteUserFormProps {
  onSubmit: (data: CreateBulkInvitationDTO) => void;
  isLoading?: boolean;
}

type BulkInviteFormValues = {
  emails: string;
  invited_role: 'admin' | 'member' | 'viewer';
};

const parseEmailList = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[\n,]+/)
        .map((email) => email.trim())
        .filter(Boolean)
    )
  );

export const BulkInviteUserForm: React.FC<BulkInviteUserFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkInviteFormValues>({
    resolver: zodResolver(bulkInviteUserSchema),
    defaultValues: {
      emails: '',
      invited_role: 'member',
    },
  });

  const submitBulk = (data: BulkInviteFormValues) => {
    onSubmit({
      emails: parseEmailList(data.emails),
      invited_role: data.invited_role,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitBulk)} className="space-y-6">
      <FormItem>
        <FormLabel>Email Addresses *</FormLabel>
        <Textarea
          placeholder="user1@example.com\nuser2@example.com"
          {...register('emails')}
          disabled={isLoading}
          className="min-h-[140px] resize-y"
        />
        <FormDescription>Enter one email per line or separate multiple addresses with commas.</FormDescription>
        <FormMessage>{errors.emails?.message}</FormMessage>
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
        <FormDescription>The role assigned after the invitation is accepted</FormDescription>
        <FormMessage>{errors.invited_role?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Invitations'}
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateSettingsDTO>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultValues || {},
  });

  const timezone = watch('timezone');
  const workDays = watch('work_days');
  const workHours = watch('work_hours');

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  const selectedWorkDays = useMemo(
    () => new Set((workDays || '').split(',').map((day) => day.trim()).filter(Boolean)),
    [workDays]
  );

  const selectedWorkDaysLabel = useMemo(() => {
    const preset = WORKING_DAY_PRESETS.find((option) => option.value === workDays);
    if (preset) {
      return preset.label;
    }

    if (selectedWorkDays.size === 0) {
      return 'Choose days';
    }

    return Array.from(selectedWorkDays).join(', ');
  }, [selectedWorkDays, workDays]);

  const selectedWorkHoursLabel = useMemo(
    () => getLabelByValue(WORK_HOUR_PRESETS, workHours),
    [workHours]
  );

  const toggleWorkingDay = (day: string) => {
    const next = new Set(selectedWorkDays);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }

    setValue('work_days', Array.from(next).join(','), { shouldDirty: true, shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormItem>
        <FormLabel>Timezone</FormLabel>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
            {...register('timezone')}
            disabled={isLoading}
          >
            <option value="">Select timezone</option>
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <FormDescription>Pick the workspace timezone from a preset list.</FormDescription>
        <FormMessage>{errors.timezone?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Working Days</FormLabel>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              disabled={isLoading}
            >
              <span>{selectedWorkDaysLabel}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72">
            <DropdownMenuLabel>Working day presets</DropdownMenuLabel>
            {WORKING_DAY_PRESETS.map((preset) => (
              <DropdownMenuItem
                key={preset.value}
                onSelect={() =>
                  setValue('work_days', preset.value, { shouldDirty: true, shouldValidate: true })
                }
              >
                <span className="flex-1">{preset.label}</span>
                {workDays === preset.value && <Check className="h-4 w-4 text-indigo-600" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Custom days</DropdownMenuLabel>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <DropdownMenuItem key={day} onSelect={() => toggleWorkingDay(day)}>
                <span className="flex-1">{day}</span>
                {selectedWorkDays.has(day) && <Check className="h-4 w-4 text-indigo-600" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <FormDescription>Use a preset or pick days individually from the dropdown.</FormDescription>
        <FormMessage>{errors.work_days?.message}</FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Working Hours</FormLabel>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
            {...register('work_hours')}
            disabled={isLoading}
          >
            <option value="">Select working hours</option>
            {WORK_HOUR_PRESETS.map((preset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
        <FormDescription>
          {selectedWorkHoursLabel === 'Custom'
            ? 'Choose a preset schedule to avoid manual JSON input.'
            : `Current preset: ${selectedWorkHoursLabel}`}
        </FormDescription>
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
