import { httpClient } from '../adapters/http.mobile';
import { createAuthService } from '@repo/core/domains/auth';
import { createAccountsService } from '@repo/core/domains/accounts';
import { createTransfersService } from '@repo/core/domains/transfers';

/**
 * Auth service instance for mobile.
 */
export const authService = createAuthService(httpClient);

/**
 * Accounts service instance for mobile.
 */
export const accountsService = createAccountsService(httpClient);

/**
 * Transfers service instance for mobile.
 */
export const transfersService = createTransfersService(httpClient);

// Re-export for convenience
export { httpClient };
export { secureStorage } from './security/secureStorage';
