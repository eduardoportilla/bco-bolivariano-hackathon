/**
 * Secure storage adapter interface.
 * Platform-specific implementations:
 * - Web: Not typically used (httpOnly cookies handled by backend)
 * - Mobile: Keychain (iOS) / Keystore (Android)
 */
export interface SecureStorage {
  /**
   * Get an item from secure storage
   */
  getItem(key: string): Promise<string | null>;

  /**
   * Set an item in secure storage
   */
  setItem(key: string, value: string): Promise<void>;

  /**
   * Remove an item from secure storage
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items from secure storage
   */
  clear(): Promise<void>;
}

/**
 * Storage keys used across the application
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
