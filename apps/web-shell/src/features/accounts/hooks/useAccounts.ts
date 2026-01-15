import { useQuery } from '@tanstack/react-query';
import { accountKeys } from '@repo/core/domains/accounts';
import { accountsService } from '@/services';

/**
 * Hook to get all user accounts.
 */
export function useAccounts() {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: accountsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
