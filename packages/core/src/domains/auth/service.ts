import type { HttpClient } from '../../adapters';
import { API_ENDPOINTS } from '../../shared/constants';
import type { User, LoginCredentials, RegisterData, AuthResponse, RefreshResponse } from './types';

/**
 * Auth service type definition.
 */
export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  refresh: () => Promise<RefreshResponse>;
  getMe: () => Promise<User>;
}

/**
 * Create auth service with injected HTTP client.
 */
export function createAuthService(http: HttpClient): AuthService {
  return {
    login: (credentials: LoginCredentials) => {
      return http.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
    },

    logout: () => {
      return http.post<void>(API_ENDPOINTS.auth.logout);
    },

    register: (data: RegisterData) => {
      return http.post<AuthResponse>(API_ENDPOINTS.auth.register, data);
    },

    refresh: () => {
      return http.post<RefreshResponse>(API_ENDPOINTS.auth.refresh);
    },

    getMe: () => {
      return http.get<User>(API_ENDPOINTS.auth.me);
    },
  };
}
