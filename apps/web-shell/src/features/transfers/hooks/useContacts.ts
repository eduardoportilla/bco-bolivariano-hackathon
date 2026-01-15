import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactKeys, type CreateContactData } from '@repo/core/domains/transfers';
import { transfersService } from '@/services';

/**
 * Hook to get all contacts.
 */
export function useContacts() {
  return useQuery({
    queryKey: contactKeys.list(),
    queryFn: transfersService.getContacts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new contact.
 */
export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactData) => transfersService.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}

/**
 * Hook to delete a contact.
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transfersService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
}
