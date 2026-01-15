import { useQuery } from '@tanstack/react-query';
import { accountKeys } from '@repo/core/domains/accounts';
import { accountsService } from '../services';

/**
 * Hook to fetch a single account by ID.
 */
export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}
