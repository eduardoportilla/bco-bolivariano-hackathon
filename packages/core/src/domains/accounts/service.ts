import type { HttpClient } from '../../adapters';
import { API_ENDPOINTS } from '../../shared/constants';
import type { Account, AccountBalance, Transaction, TransactionFilters } from './types';

/**
 * Accounts service type definition.
 */
export interface AccountsService {
  getAll: () => Promise<Account[]>;
  getById: (id: string) => Promise<Account>;
  getBalance: (id: string) => Promise<AccountBalance>;
  getTransactions: (id: string, filters?: TransactionFilters) => Promise<Transaction[]>;
}

/**
 * Create accounts service with injected HTTP client.
 */
export function createAccountsService(http: HttpClient): AccountsService {
  return {
    getAll: async () => {
      const response = await http.get<{ accounts: Account[] }>(API_ENDPOINTS.accounts.list);
      return response.accounts;
    },

    getById: (id: string) => {
      return http.get<Account>(API_ENDPOINTS.accounts.detail(id));
    },

    getBalance: (id: string) => {
      return http.get<AccountBalance>(API_ENDPOINTS.accounts.balance(id));
    },

    getTransactions: async (id: string, filters?: TransactionFilters) => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const queryString = params.toString();
      const url = `${API_ENDPOINTS.accounts.transactions(id)}${queryString ? `?${queryString}` : ''}`;

      const response = await http.get<{ transactions: Transaction[] }>(url);
      return response.transactions;
    },
  };
}
