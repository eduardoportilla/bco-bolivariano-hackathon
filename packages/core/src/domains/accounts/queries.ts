import type { AccountFilters, TransactionFilters } from './types';

/**
 * React Query key factory for accounts domain.
 */
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters?: AccountFilters) => [...accountKeys.lists(), filters] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  balances: () => [...accountKeys.all, 'balance'] as const,
  balance: (id: string) => [...accountKeys.balances(), id] as const,
  transactions: (id: string, filters?: TransactionFilters) =>
    [...accountKeys.detail(id), 'transactions', filters] as const,
};
