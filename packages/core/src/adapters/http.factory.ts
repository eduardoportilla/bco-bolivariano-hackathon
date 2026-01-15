import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import type { HttpClient, HttpError } from './http.adapter';

/**
 * Configuration options for creating an HTTP client.
 */
export interface HttpClientConfig {
  /**
   * Base URL for all requests.
   */
  baseURL: string;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;

  /**
   * Whether to send cookies with requests (for httpOnly cookie auth).
   * @default false
   */
  withCredentials?: boolean;

  /**
   * Default headers to include in all requests.
   */
  headers?: Record<string, string>;
}

/**
 * Interceptor function types for request/response handling.
 */
export interface HttpClientInterceptors {
  /**
   * Called before each request. Use to add auth headers, etc.
   */
  onRequest?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

  /**
   * Called on successful response.
   */
  onResponse?: (response: AxiosResponse) => AxiosResponse;

  /**
   * Called on request/response error. Return a rejected promise to propagate the error.
   */
  onError?: (error: AxiosError<HttpError>) => Promise<never>;
}

/**
 * Default configuration values.
 */
const DEFAULT_CONFIG: Partial<HttpClientConfig> = {
  timeout: 30000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Creates an Axios instance with the given configuration.
 */
function createAxiosInstance(
  config: HttpClientConfig,
  interceptors?: HttpClientInterceptors
): AxiosInstance {
  const mergedConfig: AxiosRequestConfig = {
    baseURL: config.baseURL,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout ?? 30000,
    withCredentials: config.withCredentials ?? DEFAULT_CONFIG.withCredentials ?? false,
    headers: {
      ...DEFAULT_CONFIG.headers,
      ...config.headers,
    },
  };

  const instance = axios.create(mergedConfig);

  // Request interceptor
  if (interceptors?.onRequest) {
    instance.interceptors.request.use(interceptors.onRequest);
  }

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      if (interceptors?.onResponse) {
        return interceptors.onResponse(response);
      }
      return response;
    },
    (error: AxiosError<HttpError>) => {
      if (interceptors?.onError) {
        return interceptors.onError(error);
      }
      return Promise.reject(error.response?.data ?? error);
    }
  );

  return instance;
}

/**
 * Creates an HttpClient implementation with the given configuration and interceptors.
 *
 * @example
 * ```typescript
 * // Web client with cookie auth
 * const httpClient = createHttpClient({
 *   baseURL: import.meta.env.VITE_API_URL,
 *   withCredentials: true,
 * }, {
 *   onError: (error) => {
 *     if (error.response?.status === 401) {
 *       window.location.href = '/login';
 *     }
 *     return Promise.reject(error.response?.data ?? error);
 *   },
 * });
 *
 * // Mobile client with bearer token
 * const httpClient = createHttpClient({
 *   baseURL: Config.API_URL,
 * }, {
 *   onRequest: async (config) => {
 *     const token = await secureStorage.getItem('accessToken');
 *     if (token) {
 *       config.headers.Authorization = `Bearer ${token}`;
 *     }
 *     return config;
 *   },
 * });
 * ```
 */
export function createHttpClient(
  config: HttpClientConfig,
  interceptors?: HttpClientInterceptors
): HttpClient {
  const instance = createAxiosInstance(config, interceptors);

  return {
    get: async <T>(url: string): Promise<T> => {
      const response = await instance.get<T>(url);
      return response.data;
    },

    post: async <T>(url: string, data?: unknown): Promise<T> => {
      const response = await instance.post<T>(url, data);
      return response.data;
    },

    put: async <T>(url: string, data?: unknown): Promise<T> => {
      const response = await instance.put<T>(url, data);
      return response.data;
    },

    patch: async <T>(url: string, data?: unknown): Promise<T> => {
      const response = await instance.patch<T>(url, data);
      return response.data;
    },

    delete: async <T>(url: string): Promise<T> => {
      const response = await instance.delete<T>(url);
      return response.data;
    },
  };
}
