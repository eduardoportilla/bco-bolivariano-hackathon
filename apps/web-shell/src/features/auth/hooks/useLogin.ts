import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys, type LoginCredentials } from '@repo/core/domains/auth';
import { authService } from '@/services';

/**
 * Hook to handle user login.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
}
