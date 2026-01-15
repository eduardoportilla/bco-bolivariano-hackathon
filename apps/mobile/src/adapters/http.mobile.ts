import Config from 'react-native-config';
import { createHttpClient } from '@repo/core/adapters';
import { secureStorage } from '../services/security/secureStorage';

/**
 * Mobile HTTP client implementation.
 * Uses Axios with Bearer token authentication from Keychain/Keystore.
 */
export const httpClient = createHttpClient(
  {
    baseURL: Config.API_URL || 'http://localhost:3000/api',
  },
  {
    onRequest: async (config) => {
      const token = await secureStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        await secureStorage.removeItem('accessToken');
        await secureStorage.removeItem('refreshToken');
        // Navigation to login will be handled by auth state listener
      }
      return Promise.reject(error.response?.data ?? error);
    },
  }
);
