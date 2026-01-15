import { useQuery } from '@tanstack/react-query';
import { authKeys } from '@repo/core/domains/auth';
import { authService } from '../../../services';

/**
 * Hook to get current authenticated user.
 */
export function useAuth() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authService.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });
}
