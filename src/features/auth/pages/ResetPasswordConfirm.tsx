import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';
import { usePasswordReset } from '../../../hooks/useAuth';
import { validatePasswordByPolicy } from '../utils/passwordPolicy';

const ResetPasswordConfirm = () => {
  const navigate = useNavigate();
  const { confirmReset, isLoading, error } = usePasswordReset();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  const token = searchParams.get('token') || '';
  const userId = searchParams.get('user_id') || searchParams.get('uid') || '';

  const tokenError = useMemo(() => {
    if (!token || !userId) {
      return 'Reset link is invalid or missing required token information.';
    }
    return '';
  }, [token, userId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setSuccessMessage('');

    if (tokenError) {
      setFormErrors([tokenError]);
      return;
    }

    const passwordValidation = validatePasswordByPolicy(newPassword);
    const errors: string[] = [];

    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    if (!confirmPassword) {
      errors.push('Please confirm your new password.');
    } else if (newPassword !== confirmPassword) {
      errors.push('Password confirmation does not match.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await confirmReset({
      user_id: userId,
      token,
      new_password: newPassword,
    });

    if (result.success) {
      setSuccessMessage('Password reset successfully. You can now sign in with your new password.');
      setNewPassword('');
      setConfirmPassword('');
      window.setTimeout(() => {
        navigate(ROUTES.auth.login);
      }, 1200);
    }
  };

  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Update your password to complete account recovery.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New password</label>
            <div className="relative mt-1">
              <KeyRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.currentTarget.value)}
                placeholder="At least 12 chars, upper/lower/number/symbol"
                disabled={isLoading}
                className="token-input-base w-full rounded-md py-2 pl-9 pr-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              disabled={isLoading}
              className="token-input-base mt-1 w-full rounded-md py-2 px-3"
            />
          </div>

          {(tokenError || formErrors.length > 0) && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 space-y-1">
              {tokenError && <p>{tokenError}</p>}
              {formErrors.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !!tokenError}
            className="token-action-primary w-full rounded-md py-2 text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </span>
            ) : (
              'Update password'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          <Link to={ROUTES.auth.login} className="font-medium text-emerald-600 hover:text-emerald-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
