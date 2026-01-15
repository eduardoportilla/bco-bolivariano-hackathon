import { useQuery } from '@tanstack/react-query';
import { accountKeys } from '@repo/core/domains/accounts';
import { accountsService } from '../../../services';

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
