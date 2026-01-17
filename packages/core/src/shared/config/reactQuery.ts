import { QueryClient } from '@tanstack/react-query';
import type { QueryClientConfig } from '@tanstack/react-query';

export const DEFAULT_QUERY_OPTIONS = {
  STATE_TIME: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 1,
} as const;

export const DEFAULT_QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERY_OPTIONS.STATE_TIME,
      retry: DEFAULT_QUERY_OPTIONS.MAX_RETRIES,
    },
  },
};

/**
 * Creates a QueryClient with default options.
 * Allows deep merging of overrides for app-specific customization.
 */
export function createQueryClient(overrides?: QueryClientConfig): QueryClient {
  if (!overrides) {
    return new QueryClient(DEFAULT_QUERY_CLIENT_CONFIG);
  }

  return new QueryClient({
    ...DEFAULT_QUERY_CLIENT_CONFIG,
    ...overrides,
    defaultOptions: {
      ...DEFAULT_QUERY_CLIENT_CONFIG.defaultOptions,
      ...overrides.defaultOptions,
      queries: {
        ...DEFAULT_QUERY_CLIENT_CONFIG.defaultOptions?.queries,
        ...overrides.defaultOptions?.queries,
      },
      mutations: {
        ...DEFAULT_QUERY_CLIENT_CONFIG.defaultOptions?.mutations,
        ...overrides.defaultOptions?.mutations,
      },
    },
  });
}
