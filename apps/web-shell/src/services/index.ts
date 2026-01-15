import { httpClient } from '../adapters/http.web';
import { createAuthService } from '@repo/core/domains/auth';
import { createAccountsService } from '@repo/core/domains/accounts';
import { createTransfersService } from '@repo/core/domains/transfers';

/**
 * Auth service instance for web.
 */
export const authService = createAuthService(httpClient);

/**
 * Accounts service instance for web.
 */
export const accountsService = createAccountsService(httpClient);

/**
 * Transfers service instance for web.
 */
export const transfersService = createTransfersService(httpClient);

// Re-export for convenience
export { httpClient };
