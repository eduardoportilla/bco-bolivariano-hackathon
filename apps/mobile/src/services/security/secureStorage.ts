import * as Keychain from 'react-native-keychain';
import type { SecureStorage } from '@repo/core/adapters';

/**
 * Secure storage implementation using Keychain (iOS) / Keystore (Android).
 * NEVER use AsyncStorage for sensitive data like tokens.
 */
export const secureStorage: SecureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({ service: key });
      return result ? result.password : null;
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: key });
  },

  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },

  async clear(): Promise<void> {
    // Clear known keys
    const keys = ['accessToken', 'refreshToken', 'userPreferences'];
    await Promise.all(keys.map((key) => this.removeItem(key)));
  },
};
