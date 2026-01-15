import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { HttpClient, HttpError } from '@repo/core/adapters';

/**
 * Create Axios instance with base configuration.
 */
function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000,
    withCredentials: true, // Send cookies with requests (httpOnly auth)
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<HttpError>) => {
      if (error.response?.status === 401) {
        // Redirect to login on unauthorized
        window.location.href = '/login';
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

/**
 * Web HTTP client implementation.
 * Uses Axios with httpOnly cookie authentication.
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
