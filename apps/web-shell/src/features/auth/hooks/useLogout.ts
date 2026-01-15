import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services';

/**
 * Hook to handle user logout.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}
