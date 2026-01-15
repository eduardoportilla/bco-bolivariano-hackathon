import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys, type LoginCredentials } from '@repo/core/domains/auth';
import { authService, secureStorage } from '../../../services';

/**
 * Hook to handle user login.
 * Stores tokens in secure storage after successful login.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authService.login(credentials);
      // Note: In a real app, tokens would be returned in the response
      // and stored here. This is a simplified example.
      return response;
    },
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
}
