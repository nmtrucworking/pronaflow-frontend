/**
 * Protected Route Component
 * Module 1: Identity and Access Management
 * 
 * Protects routes based on authentication status
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { useAuth } from '@/hooks/useAuth';
import authService from '@/services/authService';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !authService.isAuthenticated()) {
    return <Navigate to={ROUTES.auth.login} replace />;
  }

  if (requiredRoles && user) {
    const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.auth.unauthorized} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
