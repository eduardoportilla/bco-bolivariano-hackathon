import { useQuery } from '@tanstack/react-query';
import { accountKeys } from '@repo/core/domains/accounts';
import { accountsService } from '@/services';

/**
 * Hook to get a single account by ID.
 */
export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to get account balance.
 */
export function useAccountBalance(id: string) {
  return useQuery({
    queryKey: accountKeys.balance(id),
    queryFn: () => accountsService.getBalance(id),
    enabled: !!id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
