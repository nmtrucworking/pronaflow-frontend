import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../../../routes/paths';

const Unauthorized = () => {
  return (
    <div className="token-page-shell min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">
          You do not have permission to access this page.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            to={ROUTES.app.dashboard}
            className="token-action-primary w-full rounded-md py-2 text-sm font-medium"
          >
            Go to dashboard
          </Link>
          <Link
            to={ROUTES.auth.login}
            className="token-action-secondary-outline w-full rounded-md py-2 text-sm font-medium"
          >
            Sign in with another account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
