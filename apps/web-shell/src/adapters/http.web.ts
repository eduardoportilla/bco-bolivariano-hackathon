import { createHttpClient } from '@repo/core/adapters';

/**
 * Web HTTP client implementation.
 * Uses Axios with httpOnly cookie authentication.
 * 401 is not redirected here to avoid full page reload; auth state is handled by
 * useAuth and ProtectedRoute (redirect to /login when unauthenticated).
 */
export const httpClient = createHttpClient(
  {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
  },
  {
    onError: (error) => {
      return Promise.reject(error.response?.data ?? error);
    },
  }
);
