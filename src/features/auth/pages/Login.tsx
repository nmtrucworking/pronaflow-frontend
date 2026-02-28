/**
 * Login Page Component
 * Module 1: Identity and Access Management
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogin, useMFA } from '@/hooks/useAuth';
import authService from '@/services/authService';
import { LogIn, Loader2, Github, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface LoginState {
  email: string;
  password: string;
  rememberMe: boolean;
  errors: Record<string, string>;
  accountLocked: boolean;
  lockoutTimeRemaining: number;
}

interface MFAState {
  totpCode: string;
  error: string | null;
  isVerifying: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();
  const { verifyMFACode, isLoading: isMFALoading, error: mfaError } = useMFA();

  const [loginState, setLoginState] = useState<LoginState>({
    email: '',
    password: '',
    rememberMe: false,
    errors: {},
    accountLocked: false,
    lockoutTimeRemaining: 0,
  });

  const [mfaState, setMfaState] = useState<MFAState>({
    totpCode: '',
    error: null,
    isVerifying: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMFAModal, setShowMFAModal] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!loginState.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginState.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!loginState.password || loginState.password.length < 8) {
      newErrors.password = 'Password is required';
    }
    setLoginState((prev) => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setLoginState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      errors: { ...prev.errors, [name]: '' },
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm() || loginState.accountLocked) return;

    const result = await login({
      email: loginState.email,
      password: loginState.password,
    });

    if (result.success && !result.mfaRequired) {
      if (loginState.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', loginState.email);
      }
      navigate('/dashboard');
    } else if (result.mfaRequired) {
      setShowMFAModal(true);
      authService.setTokens('', '');
    }
  };

  const handleMFASubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mfaState.totpCode || mfaState.totpCode.length !== 6) {
      setMfaState((prev) => ({ ...prev, error: 'TOTP code must be 6 digits' }));
      return;
    }

    setMfaState((prev) => ({ ...prev, isVerifying: true }));
    const result = await verifyMFACode({
      email: loginState.email,
      totp_code: mfaState.totpCode,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setMfaState((prev) => ({ ...prev, error: result.error || 'MFA verification failed' }));
    }
    setMfaState((prev) => ({ ...prev, isVerifying: false }));
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `/api/v1/auth/oauth/${provider}`;
  };

  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold token-text-primary">Sign in to PronaFlow</h2>
          <p className="mt-2 text-center text-sm token-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
              Create one
            </Link>
          </p>
        </div>

        {!showMFAModal ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm font-medium text-red-800">{error}</div>
              </div>
            )}

            {loginState.accountLocked && (
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="text-sm font-medium text-yellow-800">
                  Account locked. Try again in {loginState.lockoutTimeRemaining} min.
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={loginState.email}
                onChange={handleInputChange}
                className={`token-input-base mt-1 block w-full rounded-md ${
                  loginState.errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                disabled={isLoading}
              />
              {loginState.errors.email && <p className="mt-1 text-sm text-red-600">{loginState.errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginState.password}
                  onChange={handleInputChange}
                  className={`token-input-base mt-1 block w-full pr-10 rounded-md ${
                    loginState.errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-slate-500" /> : <Eye className="w-5 h-5 text-slate-500" />}
                </button>
              </div>
              {loginState.errors.password && <p className="mt-1 text-sm text-red-600">{loginState.errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={loginState.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="token-action-primary w-full flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300 dark:border-slate-700" /></div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 token-page-shell text-slate-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="token-action-secondary-outline w-full py-2 px-4 rounded-md bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="token-action-secondary-outline w-full py-2 px-4 rounded-md bg-white dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center justify-center"
                >
                  <Github className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleMFASubmit}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Enter 2FA Code</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Enter the 6-digit code from your authenticator app</p>
              </div>
            </div>

            {(mfaError || mfaState.error) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm font-medium text-red-800">{mfaError || mfaState.error}</div>
              </div>
            )}

            <div>
              <label htmlFor="totpCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Code</label>
              <input
                id="totpCode"
                type="text"
                maxLength={6}
                inputMode="numeric"
                value={mfaState.totpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setMfaState((prev) => ({ ...prev, totpCode: value, error: null }));
                }}
                className="token-input-base mt-1 block w-full border-slate-300 rounded-md text-center text-2xl tracking-widest"
                placeholder="000000"
                disabled={isMFALoading}
              />
            </div>

            <button
              type="submit"
              disabled={isMFALoading}
              className="token-action-primary w-full py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isMFALoading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              type="button"
              onClick={() => setShowMFAModal(false)}
              className="token-action-secondary-outline w-full py-2 px-4 rounded-md text-sm font-medium bg-white dark:bg-slate-900"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
