import { httpClient } from '../adapters/http.web';
import { createAccountsService } from '@repo/core/domains/accounts';

/**
 * Accounts service instance for web.
 */
export const accountsService = createAccountsService(httpClient);

// Re-export for convenience
export { httpClient };
