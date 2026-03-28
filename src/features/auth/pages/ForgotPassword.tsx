import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';
import { usePasswordReset } from '../../../hooks/useAuth';

const ForgotPassword = () => {
  const { requestReset, isLoading, error } = usePasswordReset();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError('');
    setSuccessMessage('');

    if (!email) {
      setEmailError('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format.');
      return;
    }

    const result = await requestReset({ email });
    if (result.success) {
      setSuccessMessage(result.message || 'If this email exists, reset instructions have been sent.');
    }
  };

  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your email and we will send a reset link.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                placeholder="name@company.com"
                disabled={isLoading}
                className="token-input-base w-full rounded-md py-2 pl-9 pr-3"
              />
            </div>
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

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
            disabled={isLoading}
            className="token-action-primary w-full rounded-md py-2 text-sm font-medium disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </span>
            ) : (
              'Send reset link'
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

export default ForgotPassword;
