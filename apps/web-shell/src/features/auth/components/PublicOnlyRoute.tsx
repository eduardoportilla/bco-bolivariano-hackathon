import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

/**
 * Route guard that redirects authenticated users away from public pages.
 * Use for pages like login that shouldn't be accessible when logged in.
 */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { data: user, isLoading } = useAuth();

  // Don't redirect while loading - show the page
  if (isLoading) {
    return <>{children}</>;
  }

  // Redirect to home if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
