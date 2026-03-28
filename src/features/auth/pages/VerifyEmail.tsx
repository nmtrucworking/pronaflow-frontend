import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';
import { useVerifyEmail } from '../../../hooks/useAuth';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'invalid_or_expired';

const VerifyEmail = () => {
  const { verifyEmail, resendVerification, isLoading, error } = useVerifyEmail();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const token = searchParams.get('token') || '';
  const userId = searchParams.get('user_id') || searchParams.get('uid') || '';

  const canAutoVerify = useMemo(() => !!token && !!userId, [token, userId]);

  useEffect(() => {
    const runVerify = async () => {
      setStatus('loading');
      const result = await verifyEmail({ user_id: userId, token });
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('invalid_or_expired');
      }
    };

    if (canAutoVerify) {
      runVerify();
    } else {
      setStatus('idle');
    }
  }, [canAutoVerify, token, userId, verifyEmail]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResendMessage('');
    if (!email) {
      setResendMessage('Please enter your email to resend verification.');
      return;
    }

    const result = await resendVerification({ email });
    if (result.success) {
      setResendMessage('Verification email has been resent.');
    } else {
      setResendMessage(result.error || 'Unable to resend verification email right now.');
    }
  };

  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2">
          <MailCheck className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900">Verify Email</h1>
        </div>

        {canAutoVerify ? (
          <div className="mt-6 space-y-4">
            {(isLoading || status === 'loading') && (
              <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700 inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying your email...
              </div>
            )}

            {!isLoading && status === 'success' && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                Email verified successfully. You can sign in now.
              </div>
            )}

            {!isLoading && (status === 'invalid_or_expired' || error) && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {error || 'Verification link is invalid or expired. Please request a new one.'}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Verification link is invalid or expired. Enter your email below to resend a new verification message.
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleResend}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              placeholder="name@company.com"
              disabled={isLoading}
              className="token-input-base mt-1 w-full rounded-md py-2 px-3"
            />
          </div>

          {resendMessage && (
            <div className="rounded-md bg-slate-100 p-3 text-sm text-slate-700">
              {resendMessage}
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
              'Resend verification email'
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

export default VerifyEmail;
