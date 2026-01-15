/**
 * Transfer status.
 */
export type TransferStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

/**
 * Transfer information.
 */
export interface Transfer {
  id: string;
  fromAccountId: string;
  fromAccountNumber: string;
  toAccountId: string;
  toAccountNumber: string;
  toBeneficiaryName: string;
  toBankName?: string;
  amount: number;
  currency: string;
  description?: string;
  reference: string;
  status: TransferStatus;
  createdAt: string;
  completedAt?: string;
}

/**
 * Data required to create a transfer.
 */
export interface CreateTransferData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}

/**
 * Contact/beneficiary for transfers.
 */
export interface Contact {
  id: string;
  name: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  bank: string;
  bankCode?: string;
  isFavorite: boolean;
  createdAt: string;
}

/**
 * Data required to create a contact.
 */
export interface CreateContactData {
  name: string;
  accountNumber: string;
  accountType: 'checking' | 'savings';
  bank: string;
  bankCode?: string;
}

/**
 * Transfer filters for listing.
 */
export interface TransferFilters {
  status?: TransferStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * Transfer limits.
 */
export interface TransferLimits {
  perTransaction: number;
  daily: number;
  dailyUsed: number;
  dailyRemaining: number;
}
