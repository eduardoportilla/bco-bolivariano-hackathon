import { useQuery } from '@tanstack/react-query';
import { accountKeys, type TransactionFilters } from '@repo/core/domains/accounts';
import { accountsService } from '../services';

/**
 * Hook to fetch transactions for an account.
 */
export function useTransactions(accountId: string, filters?: TransactionFilters) {
  return useQuery({
    queryKey: accountKeys.transactions(accountId, filters),
    queryFn: () => accountsService.getTransactions(accountId, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!accountId,
  });
}
