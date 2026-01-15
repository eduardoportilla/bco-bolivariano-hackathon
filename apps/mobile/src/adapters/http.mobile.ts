import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { HttpClient, HttpError } from '@repo/core/adapters';
import { secureStorage } from '../services/security/secureStorage';
import Config from 'react-native-config';

/**
 * Create Axios instance with base configuration.
 */
function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: Config.API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(async (config) => {
    const token = await secureStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<HttpError>) => {
      if (error.response?.status === 401) {
        // Clear tokens and navigate to login
        await secureStorage.removeItem('accessToken');
        await secureStorage.removeItem('refreshToken');
        // Navigation to login will be handled by auth state listener
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

/**
 * Mobile HTTP client implementation.
 * Uses Axios with Bearer token authentication from Keychain/Keystore.
 */
export const httpClient: HttpClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.get<T>(url);
    return response.data;
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.patch<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },
};
