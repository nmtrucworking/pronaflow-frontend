/**
 * Protected Route Component
 * Module 1: Identity and Access Management
 * 
 * Protects routes based on authentication status
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';
import { useRBAC } from '@/hooks/useRBAC';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { hasAnyRole } = useRBAC();

  if (!isAuthenticated || !authService.isAuthenticated()) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  const normalizedStatus = user?.status?.toString().toLowerCase();
  const isPendingVerification = normalizedStatus === 'pending_verification' || !user?.email_verified_at;
  if (isPendingVerification && location.pathname !== ROUTES.auth.verifyEmail) {
    const email = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
    return <Navigate to={`${ROUTES.auth.verifyEmail}${email}`} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = hasAnyRole(requiredRoles);
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.auth.unauthorized} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
