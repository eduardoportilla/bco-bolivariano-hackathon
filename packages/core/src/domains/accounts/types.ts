/**
 * Account types.
 */
export type AccountType = 'checking' | 'savings';

/**
 * Account currency.
 */
export type Currency = 'USD' | 'EUR';

/**
 * Account information.
 */
export interface Account {
  id: string;
  name: string;
  number: string;
  type: AccountType;
  balance: number;
  availableBalance: number;
  currency: Currency;
  isPrimary: boolean;
  createdAt: string;
}

/**
 * Account balance response.
 */
export interface AccountBalance {
  accountId: string;
  balance: number;
  availableBalance: number;
  lastUpdated: string;
}

/**
 * Transaction types.
 */
export type TransactionType = 'credit' | 'debit';

/**
 * Account transaction.
 */
export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference?: string;
  createdAt: string;
}

/**
 * Account filters for listing.
 */
export interface AccountFilters {
  type?: AccountType;
  currency?: Currency;
}

/**
 * Transaction filters for listing.
 */
export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}
