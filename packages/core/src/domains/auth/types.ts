/**
 * User information returned from API.
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Login credentials.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data.
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

/**
 * Authentication response from login/register.
 */
export interface AuthResponse {
  user: User;
  expiresAt: string;
}

/**
 * Token refresh response.
 */
export interface RefreshResponse {
  expiresAt: string;
}
