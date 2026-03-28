import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';
import { useRegister } from '../../../hooks/useAuth';
import { validatePasswordByPolicy } from '../utils/passwordPolicy';

interface RegisterFormState {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useRegister();

  const [formState, setFormState] = useState<RegisterFormState>({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const passwordValidation = useMemo(
    () => validatePasswordByPolicy(formState.password),
    [formState.password]
  );

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (field: keyof RegisterFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formState.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!formState.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!formState.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(formState.email)) {
      nextErrors.email = 'Invalid email format.';
    }

    if (!passwordValidation.isValid) {
      nextErrors.password = passwordValidation.errors[0];
    }

    if (!formState.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (formState.password !== formState.confirmPassword) {
      nextErrors.confirmPassword = 'Password confirmation does not match.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const result = await register({
      full_name: formState.fullName.trim(),
      username: formState.username.trim(),
      email: formState.email.trim(),
      password: formState.password,
    });

    if (result.success) {
      setSuccessMessage('Registration successful. Please verify your email before signing in.');

      const registeredEmail = result.data?.email || formState.email.trim();
      const userId = result.data?.user_id;
      const query = new URLSearchParams({ email: registeredEmail });
      if (userId) {
        query.set('user_id', userId);
      }

      navigate(`${ROUTES.auth.verifyEmail}?${query.toString()}`);
    }
  };

  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start with a secure account for your workspace.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full name</label>
            <input
              id="fullName"
              type="text"
              value={formState.fullName}
              onChange={(event) => handleChange('fullName', event.currentTarget.value)}
              disabled={isLoading}
              className="token-input-base mt-1 w-full rounded-md py-2 px-3"
            />
            {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
            <input
              id="username"
              type="text"
              value={formState.username}
              onChange={(event) => handleChange('username', event.currentTarget.value)}
              disabled={isLoading}
              className="token-input-base mt-1 w-full rounded-md py-2 px-3"
            />
            {formErrors.username && <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(event) => handleChange('email', event.currentTarget.value)}
              disabled={isLoading}
              className="token-input-base mt-1 w-full rounded-md py-2 px-3"
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formState.password}
                onChange={(event) => handleChange('password', event.currentTarget.value)}
                disabled={isLoading}
                className="token-input-base w-full rounded-md py-2 px-3 pr-10"
                placeholder="12+ chars with upper/lower/number/special"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-slate-500"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm password</label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formState.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.currentTarget.value)}
                disabled={isLoading}
                className="token-input-base w-full rounded-md py-2 px-3 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-slate-500"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
          </div>

          {!passwordValidation.isValid && formState.password && (
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
              {passwordValidation.errors.join(' ')}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{successMessage}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="token-action-primary w-full rounded-md py-2 text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </span>
            ) : (
              <span className="inline-flex items-center justify-center">
                <UserPlus className="mr-2 h-4 w-4" /> Create account
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to={ROUTES.auth.login} className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
