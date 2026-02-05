import type { HttpClient } from '../../adapters';
import { API_ENDPOINTS } from '../../shared/constants';
import type { User, LoginCredentials, RegisterData, AuthResponse, RefreshResponse } from './types';
import type { AuthResponseBD } from './auth-db.reponse';
import { AuthMapper } from './mappers';

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
    login: async (credentials: LoginCredentials) => {
      const response = await http.post<AuthResponseBD>(API_ENDPOINTS.auth.login, credentials);
      return AuthMapper.toAuthResponse(response);
    },

    logout: () => {
      return http.post<void>(API_ENDPOINTS.auth.logout);
    },

    register: async (data: RegisterData) => {
      const response = await http.post<AuthResponseBD>(API_ENDPOINTS.auth.register, data);
      return AuthMapper.toAuthResponse(response);
    },

    refresh: () => {
      return http.post<RefreshResponse>(API_ENDPOINTS.auth.refresh);
    },

    getMe: () => {
      return http.get<User>(API_ENDPOINTS.auth.me);
    },
  };
}
