/**
 * Per-request configuration options.
 */
export interface RequestConfig {
  /**
   * Headers to include in this specific request.
   * These will be merged with the default headers.
   */
  headers?: Record<string, string>;
}

/**
 * HTTP Client adapter interface.
 * Platform-specific implementations (web/mobile) must implement this interface.
 */
export interface HttpClient {
  /**
   * Perform a GET request
   */
  get<T>(url: string, config?: RequestConfig): Promise<T>;

  /**
   * Perform a POST request
   */
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;

  /**
   * Perform a PUT request
   */
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;

  /**
   * Perform a PATCH request
   */
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;

  /**
   * Perform a DELETE request
   */
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}

/**
 * HTTP Error structure for consistent error handling
 */
export interface HttpError {
  status: number;
  code: string;
  message: string;
}

/**
 * Type guard to check if an error is an HttpError
 */
export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'code' in error &&
    'message' in error
  );
}
