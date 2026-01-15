import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HttpClient } from '../../adapters';
import { createTransfersService } from './service';
import type { Transfer, Contact } from './types';

describe('TransfersService', () => {
  let mockHttp: HttpClient;
  let transfersService: ReturnType<typeof createTransfersService>;

  const mockTransfer: Transfer = {
    id: 't1',
    fromAccountId: 'a1',
    fromAccountNumber: '1234567890',
    toAccountId: 'a2',
    toAccountNumber: '0987654321',
    toBeneficiaryName: 'Juan Perez',
    amount: 100,
    currency: 'USD',
    reference: 'REF123',
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    completedAt: '2024-01-01T00:01:00Z',
  };

  const mockContact: Contact = {
    id: 'c1',
    name: 'Juan Perez',
    accountNumber: '0987654321',
    accountType: 'checking',
    bank: 'Banco Bolivariano',
    isFavorite: true,
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    transfersService = createTransfersService(mockHttp);
  });

  describe('getAll', () => {
    it('should return list of transfers', async () => {
      // Arrange
      vi.mocked(mockHttp.get).mockResolvedValue({ transfers: [mockTransfer] });

      // Act
      const result = await transfersService.getAll();

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/transfers');
      expect(result).toEqual([mockTransfer]);
    });

    it('should include filters in query string', async () => {
      // Arrange
      vi.mocked(mockHttp.get).mockResolvedValue({ transfers: [] });

      // Act
      await transfersService.getAll({ status: 'completed', limit: 10 });

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/transfers?status=completed&limit=10');
    });
  });

  describe('create', () => {
    it('should create a new transfer', async () => {
      // Arrange
      const createData = {
        fromAccountId: 'a1',
        toAccountId: 'a2',
        amount: 100,
        description: 'Test transfer',
      };
      vi.mocked(mockHttp.post).mockResolvedValue(mockTransfer);

      // Act
      const result = await transfersService.create(createData);

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/transfers', createData);
      expect(result).toEqual(mockTransfer);
    });
  });

  describe('cancel', () => {
    it('should cancel a transfer', async () => {
      // Arrange
      const cancelledTransfer = { ...mockTransfer, status: 'cancelled' as const };
      vi.mocked(mockHttp.post).mockResolvedValue(cancelledTransfer);

      // Act
      const result = await transfersService.cancel('t1');

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/transfers/t1/cancel');
      expect(result.status).toBe('cancelled');
    });
  });

  describe('getContacts', () => {
    it('should return list of contacts', async () => {
      // Arrange
      vi.mocked(mockHttp.get).mockResolvedValue({ contacts: [mockContact] });

      // Act
      const result = await transfersService.getContacts();

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/contacts');
      expect(result).toEqual([mockContact]);
    });
  });

  describe('createContact', () => {
    it('should create a new contact', async () => {
      // Arrange
      const createData = {
        name: 'Juan Perez',
        accountNumber: '0987654321',
        accountType: 'checking' as const,
        bank: 'Banco Bolivariano',
      };
      vi.mocked(mockHttp.post).mockResolvedValue(mockContact);

      // Act
      const result = await transfersService.createContact(createData);

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/contacts', createData);
      expect(result).toEqual(mockContact);
    });
  });

  describe('deleteContact', () => {
    it('should delete a contact', async () => {
      // Arrange
      vi.mocked(mockHttp.delete).mockResolvedValue(undefined);

      // Act
      await transfersService.deleteContact('c1');

      // Assert
      expect(mockHttp.delete).toHaveBeenCalledWith('/contacts/c1');
    });
  });
});
