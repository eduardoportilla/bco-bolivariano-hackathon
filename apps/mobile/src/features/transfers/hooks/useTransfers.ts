import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  transferKeys,
  accountKeys,
  type TransferFilters,
  type CreateTransferData,
} from '@repo/core/domains/transfers';
import { transfersService } from '../../../services';

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

/**
 * Hook to create a new transfer.
 */
export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransferData) => transfersService.create(data),
    onSuccess: () => {
      // Invalidate transfers list
      queryClient.invalidateQueries({ queryKey: transferKeys.all });
      // Invalidate accounts to refresh balances
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
