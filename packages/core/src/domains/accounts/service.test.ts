import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HttpClient } from '../../adapters';
import { BeneficiaryTypeCode, DocumentType } from '../auth/auth-db.reponse';
import type { AccountElement } from '../auth/auth-db.reponse';
import { createAccountsService } from './service';
import type { Account, AccountBalance } from './types';

const MAPPED_CREATED_AT = '1970-01-01T00:00:00Z';

function buildMockAccountElement(overrides: Partial<AccountElement> = {}): AccountElement {
  return {
    accountId: 1,
    accountIdentifier: '1',
    accountNumber: '1234567890',
    allowDownloadStatements: false,
    accountTypeCode: DocumentType.C,
    accountType: 'checking',
    accountTypeLabel: 'Corriente',
    accountOwnerName: 'Owner',
    accountAliasName: 'Cuenta Corriente',
    relationTypeCode: '',
    isFavorite: true,
    balances: [
      { balanceType: 'TOTAL', amount: 5000, currency: 'USD' },
      { balanceType: 'AVAILABLE', amount: 4500, currency: 'USD' },
    ],
    transactionType: '',
    allowAdditionalCard: false,
    allowNewCard: false,
    allowBalanceDebit: true,
    allowBalanceCredit: true,
    institutionCode: '',
    institutionName: '',
    beneficiaryTypeCode: BeneficiaryTypeCode.OwnerBankAccount,
    typeTransactionConfigurations: [],
    scheduledSaving: [],
    predefinedAmounts: { '$ 10': 0, '$ 20': 0, '$ 30': 0, '$ 100': 0 },
    ...overrides,
  };
}

describe('AccountsService', () => {
  let mockHttp: HttpClient;
  let accountsService: ReturnType<typeof createAccountsService>;

  const expectedMappedAccount: Account = {
    id: '1',
    name: 'Cuenta Corriente',
    number: '1234567890',
    type: 'checking',
    balance: 5000,
    availableBalance: 4500,
    currency: 'USD',
    isPrimary: true,
    createdAt: MAPPED_CREATED_AT,
  };

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    accountsService = createAccountsService(mockHttp);
  });

  describe('getAll', () => {
    it('should return list of accounts mapped from AccountElement', async () => {
      // Arrange
      const mockAccountElements: AccountElement[] = [buildMockAccountElement()];
      vi.mocked(mockHttp.get).mockResolvedValue({ accounts: mockAccountElements });

      // Act
      const result = await accountsService.getAll();

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/accounts');
      expect(result).toEqual([expectedMappedAccount]);
    });
  });

  describe('getById', () => {
    it('should return single account by id', async () => {
      // Arrange
      vi.mocked(mockHttp.get).mockResolvedValue(expectedMappedAccount);

      // Act
      const result = await accountsService.getById('1');

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/accounts/1');
      expect(result).toEqual(expectedMappedAccount);
    });
  });

  describe('getBalance', () => {
    it('should return account balance', async () => {
      // Arrange
      const mockBalance: AccountBalance = {
        accountId: '1',
        balance: 5000,
        availableBalance: 4500,
        lastUpdated: '2024-01-01T00:00:00Z',
      };
      vi.mocked(mockHttp.get).mockResolvedValue(mockBalance);

      // Act
      const result = await accountsService.getBalance('1');

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/accounts/1/balance');
      expect(result).toEqual(mockBalance);
    });
  });

  describe('getTransactions', () => {
    it('should return transactions without filters', async () => {
      // Arrange
      const mockTransactions = [
        {
          id: 't1',
          accountId: '1',
          type: 'debit',
          amount: 100,
          description: 'Test transaction',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];
      vi.mocked(mockHttp.get).mockResolvedValue({ transactions: mockTransactions });

      // Act
      const result = await accountsService.getTransactions('1');

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/accounts/1/transactions');
      expect(result).toEqual(mockTransactions);
    });

    it('should include filters in query string', async () => {
      // Arrange
      vi.mocked(mockHttp.get).mockResolvedValue({ transactions: [] });
      const filters = { startDate: '2024-01-01', limit: 10 };

      // Act
      await accountsService.getTransactions('1', filters);

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/accounts/1/transactions?startDate=2024-01-01&limit=10'
      );
    });
  });
});
