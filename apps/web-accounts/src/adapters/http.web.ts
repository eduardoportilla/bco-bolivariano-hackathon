import { createHttpClient } from '@repo/core/adapters';

/**
 * Web HTTP client implementation.
 * Uses Axios with httpOnly cookie authentication.
 */
export const httpClient = createHttpClient(
  {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
  },
  {
    onError: (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error.response?.data ?? error);
    },
  }
);
