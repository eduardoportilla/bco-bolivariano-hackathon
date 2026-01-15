import { useQuery } from '@tanstack/react-query';
import { transferKeys, type TransferFilters } from '@repo/core/domains/transfers';
import { transfersService } from '@/services';

/**
 * Hook to get all transfers.
 */
export function useTransfers(filters?: TransferFilters) {
  return useQuery({
    queryKey: transferKeys.list(filters),
    queryFn: () => transfersService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single transfer by ID.
 */
export function useTransfer(id: string) {
  return useQuery({
    queryKey: transferKeys.detail(id),
    queryFn: () => transfersService.getById(id),
    enabled: !!id,
  });
}
