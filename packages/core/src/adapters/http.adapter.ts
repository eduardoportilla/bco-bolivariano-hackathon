/**
 * HTTP Client adapter interface.
 * Platform-specific implementations (web/mobile) must implement this interface.
 */
export interface HttpClient {
  /**
   * Perform a GET request
   */
  get<T>(url: string): Promise<T>;

  /**
   * Perform a POST request
   */
  post<T>(url: string, data?: unknown): Promise<T>;

  /**
   * Perform a PUT request
   */
  put<T>(url: string, data?: unknown): Promise<T>;

  /**
   * Perform a PATCH request
   */
  patch<T>(url: string, data?: unknown): Promise<T>;

  /**
   * Perform a DELETE request
   */
  delete<T>(url: string): Promise<T>;
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
