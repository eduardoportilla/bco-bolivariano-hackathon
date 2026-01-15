import type { HttpClient } from '../../adapters';
import { API_ENDPOINTS } from '../../shared/constants';
import type { Transfer, CreateTransferData, Contact, CreateContactData, TransferFilters } from './types';

/**
 * Transfers service type definition.
 */
export interface TransfersService {
  getAll: (filters?: TransferFilters) => Promise<Transfer[]>;
  getById: (id: string) => Promise<Transfer>;
  create: (data: CreateTransferData) => Promise<Transfer>;
  cancel: (id: string) => Promise<Transfer>;
  getContacts: () => Promise<Contact[]>;
  getContact: (id: string) => Promise<Contact>;
  createContact: (data: CreateContactData) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
}

/**
 * Create transfers service with injected HTTP client.
 */
export function createTransfersService(http: HttpClient): TransfersService {
  return {
    getAll: async (filters?: TransferFilters) => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = `${API_ENDPOINTS.transfers.list}${queryString ? `?${queryString}` : ''}`;

      const response = await http.get<{ transfers: Transfer[] }>(url);
      return response.transfers;
    },

    getById: (id: string) => {
      return http.get<Transfer>(API_ENDPOINTS.transfers.detail(id));
    },

    create: (data: CreateTransferData) => {
      return http.post<Transfer>(API_ENDPOINTS.transfers.create, data);
    },

    cancel: (id: string) => {
      return http.post<Transfer>(API_ENDPOINTS.transfers.cancel(id));
    },

    getContacts: async () => {
      const response = await http.get<{ contacts: Contact[] }>(API_ENDPOINTS.contacts.list);
      return response.contacts;
    },

    getContact: (id: string) => {
      return http.get<Contact>(API_ENDPOINTS.contacts.detail(id));
    },

    createContact: (data: CreateContactData) => {
      return http.post<Contact>(API_ENDPOINTS.contacts.create, data);
    },

    deleteContact: (id: string) => {
      return http.delete<void>(API_ENDPOINTS.contacts.delete(id));
    },
  };
}
