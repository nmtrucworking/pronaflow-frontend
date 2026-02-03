import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import {
  User,
  Lock,
  Shield,
  Mail,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  Smartphone,
  Tablet,
  Trash2,
  Copy,
  X,
} from 'lucide-react';
import { authService, CurrentUserResponse, SessionInfo } from '../../../services/authService';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangeEmailForm {
  newEmail: string;
  password: string;
}

export default function AccountSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showMFADialog, setShowMFADialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [mfaSetupData, setMfaSetupData] = useState<any>(null);
  const [mfaVerificationCode, setMfaVerificationCode] = useState('');

  // Form states
  const [passwordForm, setPasswordForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [emailForm, setEmailForm] = useState<ChangeEmailForm>({
    newEmail: '',
    password: '',
  });

  // Fetch current user data
  const { data: currentUser, isLoading: userLoading } = useQuery<CurrentUserResponse>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authService.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['userSessions'],
    queryFn: async () => {
      const response = await authService.getAllSessions();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      return await authService.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowChangePasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password changed successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to change password');
    },
  });

  // Change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: async (data: ChangeEmailForm) => {
      // Note: This is a placeholder - implement based on your backend
      // For now, we'll return a dummy response
      return { data: { success: true } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowChangeEmailDialog(false);
      setEmailForm({ newEmail: '', password: '' });
      alert('Email change request sent. Please verify your new email.');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to change email');
    },
  });

  // Enable MFA mutation
  const enableMFAMutation = useMutation({
    mutationFn: async () => {
      return await authService.enableMFA();
    },
    onSuccess: (response) => {
      setMfaSetupData(response.data);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to enable MFA');
    },
  });

  // Confirm MFA mutation
  const confirmMFAMutation = useMutation({
    mutationFn: async () => {
      if (!mfaVerificationCode) {
        throw new Error('Please enter the verification code');
      }
      return await authService.confirmMFA({
        totp_code: mfaVerificationCode,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setShowMFADialog(false);
      setMfaVerificationCode('');
      setMfaSetupData(null);
      alert('MFA enabled successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to confirm MFA');
    },
  });

  // Disable MFA mutation
  const disableMFAMutation = useMutation({
    mutationFn: async () => {
      return await authService.disableMFA({
        password: '',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      alert('MFA disabled successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to disable MFA');
    },
  });

  // Revoke session mutation
  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await authService.revokeSession({
        session_id: sessionId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      alert('Session revoked successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to revoke session');
    },
  });

  // Revoke all other sessions mutation
  const revokeAllSessionsMutation = useMutation({
    mutationFn: async () => {
      return await authService.revokeAllSessions();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      alert('All other sessions revoked successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to revoke sessions');
    },
  });

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Tablet className="w-4 h-4" />;
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const mfaEnabled = currentUser?.mfa_enabled || false;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account security, profile, and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Tabs.List className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          <Tabs.Trigger
            value="profile"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition"
          >
            <User className="w-4 h-4 inline-block mr-2" />
            Profile
          </Tabs.Trigger>
          <Tabs.Trigger
            value="security"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition"
          >
            <Lock className="w-4 h-4 inline-block mr-2" />
            Security
          </Tabs.Trigger>
          <Tabs.Trigger
            value="sessions"
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 transition"
          >
            <Tablet className="w-4 h-4 inline-block mr-2" />
            Sessions
          </Tabs.Trigger>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Content value="profile" className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <Avatar.Root className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
                <Avatar.Image
                  src={`https://ui-avatars.com/api/?name=${currentUser?.full_name || 'User'}`}
                  alt={currentUser?.full_name || 'User'}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <Avatar.Fallback className="text-white font-bold text-lg">
                  {currentUser?.full_name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('') || 'U'}
                </Avatar.Fallback>
              </Avatar.Root>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition">
                <Camera className="w-4 h-4" />
                Change Avatar
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">{currentUser?.full_name}</span>
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-gray-900 dark:text-white">@{currentUser?.username}</span>
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div>
                    <div className="text-gray-900 dark:text-white">{currentUser?.email}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {currentUser?.email_verified_at ? '✓ Verified' : '⚠ Not verified'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowChangeEmailDialog(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Security Tab */}
        <Tabs.Content value="security" className="space-y-6">
          {/* Password */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Change your password to keep your account secure. Use a strong, unique password.
            </p>
            <button
              onClick={() => setShowChangePasswordDialog(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Change Password
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add an extra layer of security to your account with 2FA.
            </p>

            {mfaEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">2FA is enabled</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your account is protected with 2FA
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => disableMFAMutation.mutate()}
                  disabled={disableMFAMutation.isPending}
                  className="px-4 py-2 text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                >
                  {disableMFAMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  ) : null}
                  Disable 2FA
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMFADialog(true)}
                disabled={enableMFAMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {enableMFAMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                ) : null}
                Enable 2FA
              </button>
            )}
          </div>

          {/* Account Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your account verification status and security settings
            </p>
            <div className="space-y-2">
              {currentUser?.email_verified_at ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                  <Check className="w-4 h-4" />
                  Email verified
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Email not verified
                </div>
              )}
            </div>
          </div>
        </Tabs.Content>

        {/* Sessions Tab */}
        <Tabs.Content value="sessions" className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Sessions
              </h2>
              {sessionsData?.sessions && sessionsData.sessions.length > 1 && (
                <button
                  onClick={() => revokeAllSessionsMutation.mutate()}
                  disabled={revokeAllSessionsMutation.isPending}
                  className="text-red-600 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium transition disabled:opacity-50"
                >
                  {revokeAllSessionsMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  ) : null}
                  Logout all other sessions
                </button>
              )}
            </div>

            {sessionsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : sessionsData?.sessions && sessionsData.sessions.length > 0 ? (
              <div className="space-y-2">
                {sessionsData.sessions.map((session: SessionInfo) => (
                  <div
                    key={session.session_id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getDeviceIcon(session.user_agent)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.device || 'Unknown Device'}
                          {session.is_current && (
                            <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {session.ip_address || 'Unknown IP'} • Last active{' '}
                          {formatLastActive(session.last_activity)}
                        </p>
                      </div>
                    </div>
                    {!session.is_current && (
                      <button
                        onClick={() => revokeSessionMutation.mutate(session.session_id)}
                        disabled={revokeSessionMutation.isPending}
                        className="text-red-600 hover:text-red-700 dark:hover:text-red-400 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active sessions</p>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Change Password Dialog */}
      <Dialog.Root open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 z-50">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </Dialog.Title>

            <div className="space-y-4 mb-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowChangePasswordDialog(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => changePasswordMutation.mutate(passwordForm)}
                disabled={changePasswordMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                ) : null}
                Change Password
              </button>
            </div>

            <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Change Email Dialog */}
      <Dialog.Root open={showChangeEmailDialog} onOpenChange={setShowChangeEmailDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 z-50">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Email
            </Dialog.Title>

            <div className="space-y-4 mb-6">
              {/* Current Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Email
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 disabled:opacity-50"
                />
              </div>

              {/* New Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your new email"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm with your password"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowChangeEmailDialog(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => changeEmailMutation.mutate(emailForm)}
                disabled={changeEmailMutation.isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {changeEmailMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                ) : null}
                Change Email
              </button>
            </div>

            <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Enable MFA Dialog */}
      <Dialog.Root open={showMFADialog} onOpenChange={setShowMFADialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 z-50">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Enable Two-Factor Authentication
            </Dialog.Title>

            <div className="space-y-4 mb-6">
              {!mfaSetupData ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the button below to start the 2FA setup process. You'll need an authenticator
                  app like Google Authenticator or Authy.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Scan this QR code with your authenticator app, or enter the code manually:
                  </p>
                  {mfaSetupData.qr_code && (
                    <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img
                        src={mfaSetupData.qr_code}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                  )}
                  {mfaSetupData.secret && (
                    <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <input
                        type="text"
                        value={mfaSetupData.secret}
                        readOnly
                        className="flex-1 px-0 py-0 bg-transparent border-none text-gray-900 dark:text-white font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(mfaSetupData.secret);
                          alert('Copied to clipboard');
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter verification code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={mfaVerificationCode}
                      onChange={(e) => setMfaVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2 text-center text-2xl tracking-widest bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowMFADialog(false);
                  setMfaSetupData(null);
                  setMfaVerificationCode('');
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              {!mfaSetupData ? (
                <button
                  onClick={() => enableMFAMutation.mutate()}
                  disabled={enableMFAMutation.isPending}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  {enableMFAMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  ) : null}
                  Setup 2FA
                </button>
              ) : (
                <button
                  onClick={() => confirmMFAMutation.mutate()}
                  disabled={confirmMFAMutation.isPending || mfaVerificationCode.length !== 6}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  {confirmMFAMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" />
                  ) : null}
                  Confirm & Enable
                </button>
              )}
            </div>

            <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
