import { http, HttpResponse } from 'msw';
import type { User } from '../../domains/auth/types';
import type { Account, Transaction } from '../../domains/accounts/types';

/**
 * Builds AuthResponseBD-shaped payload for login/register so AuthMapper.toAuthResponse works.
 */
function mockAuthResponseBD(user: User): Record<string, unknown> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return {
    code: 200,
    responseType: 'success',
    message: 'OK',
    content: {
      infoUser: {
        documentNumber: user.id,
        email: user.email,
        fullName: user.name,
        phoneNumber: user.phone ?? '',
        urlProfileImage: user.avatarUrl ?? '',
        userAlias: '',
        documentType: 'C',
        username: user.email,
        lastSession: new Date().toISOString(),
      },
      accessToken: expiresAt,
    },
  };
}

/**
 * Mock user for development.
 */
export const MOCK_USER: User = {
  id: 'dev-user-1',
  email: 'developer@test.com',
  name: 'Usuario de Desarrollo',
  createdAt: '2024-01-01T00:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
};

/**
 * Mock accounts for development.
 */
export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Cuenta Corriente',
    number: '****1234',
    type: 'checking',
    balance: 5000.0,
    availableBalance: 4800.0,
    currency: 'USD',
    isPrimary: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'acc-2',
    name: 'Cuenta de Ahorros',
    number: '****5678',
    type: 'savings',
    balance: 15000.0,
    availableBalance: 15000.0,
    currency: 'USD',
    isPrimary: false,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

/**
 * Mock transactions for development.
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    accountId: 'acc-1',
    type: 'credit',
    amount: 1500.0,
    description: 'Deposito en efectivo',
    createdAt: '2024-06-15T10:30:00.000Z',
  },
  {
    id: 'txn-2',
    accountId: 'acc-1',
    type: 'debit',
    amount: 250.0,
    description: 'Transferencia a terceros',
    reference: 'TRF-001',
    createdAt: '2024-06-14T14:20:00.000Z',
  },
  {
    id: 'txn-3',
    accountId: 'acc-1',
    type: 'debit',
    amount: 85.5,
    description: 'Pago de servicios',
    createdAt: '2024-06-13T09:15:00.000Z',
  },
];

/**
 * Mock session state: when false, GET /auth/me returns 401 so login flow can be tested.
 */
let mockSessionActive = true;

/**
 * MSW request handlers for mocking API endpoints.
 * Use wildcard (*) prefix to match any base URL.
 */
export const handlers = [
  // ==================== Auth Endpoints ====================

  // GET /auth/me - Get current user
  http.get('*/auth/me', () => {
    if (!mockSessionActive) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(MOCK_USER);
  }),

  // POST /auth/login - Login (AuthResponseBD shape for AuthMapper.toAuthResponse)
  http.post('*/auth/login', async () => {
    mockSessionActive = true;
    return HttpResponse.json(mockAuthResponseBD(MOCK_USER));
  }),

  // POST /auth/logout - Logout (predicate matches any path ending in /auth/logout for any baseURL)
  http.post(
    ({ request }) => new URL(request.url).pathname.endsWith('/auth/logout'),
    () => {
      mockSessionActive = false;
      return new HttpResponse(null, { status: 204 });
    }
  ),

  // POST /auth/register - Register (AuthResponseBD shape for AuthMapper.toAuthResponse)
  http.post('*/auth/register', async () => {
    mockSessionActive = true;
    return HttpResponse.json(mockAuthResponseBD(MOCK_USER), { status: 201 });
  }),

  // POST /auth/refresh - Refresh token
  http.post('*/auth/refresh', () => {
    return HttpResponse.json({
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }),

  // ==================== Accounts Endpoints ====================

  // GET /accounts - List accounts
  http.get('*/accounts', () => {
    return HttpResponse.json({ accounts: MOCK_ACCOUNTS });
  }),

  // GET /accounts/:id - Get account by ID
  http.get('*/accounts/:id', ({ params }) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === params.id);
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(account);
  }),

  // GET /accounts/:id/balance - Get account balance
  http.get('*/accounts/:id/balance', ({ params }) => {
    const account = MOCK_ACCOUNTS.find((a) => a.id === params.id);
    if (!account) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      accountId: account.id,
      balance: account.balance,
      availableBalance: account.availableBalance,
      lastUpdated: new Date().toISOString(),
    });
  }),

  // GET /accounts/:id/transactions - Get account transactions
  http.get('*/accounts/:id/transactions', ({ params }) => {
    const transactions = MOCK_TRANSACTIONS.filter(
      (t) => t.accountId === params.id
    );
    return HttpResponse.json({ transactions });
  }),
];
