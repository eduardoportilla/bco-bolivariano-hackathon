import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '@repo/core/domains/auth';
import { authService, secureStorage } from '../../../services';

/**
 * Hook to handle user logout.
 * Clears tokens from secure storage.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
      // Clear tokens from secure storage
      await secureStorage.clear();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}
