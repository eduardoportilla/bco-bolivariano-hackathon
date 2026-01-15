import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transferKeys, accountKeys, type CreateTransferData } from '@repo/core/domains/transfers';
import { transfersService } from '@/services';

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

/**
 * Hook to cancel a transfer.
 */
export function useCancelTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transfersService.cancel(id),
    onSuccess: (data) => {
      // Update the specific transfer in cache
      queryClient.setQueryData(transferKeys.detail(data.id), data);
      // Invalidate transfers list
      queryClient.invalidateQueries({ queryKey: transferKeys.lists() });
    },
  });
}
