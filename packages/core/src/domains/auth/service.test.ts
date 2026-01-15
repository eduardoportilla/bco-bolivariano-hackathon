import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HttpClient } from '../../adapters';
import { createAuthService } from './service';
import type { AuthResponse, User } from './types';

describe('AuthService', () => {
  let mockHttp: HttpClient;
  let authService: ReturnType<typeof createAuthService>;

  beforeEach(() => {
    mockHttp = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    authService = createAuthService(mockHttp);
  });

  describe('login', () => {
    it('should call POST /auth/login with credentials', async () => {
      // Arrange
      const credentials = { username: 'testuser', password: 'password123' };
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          createdAt: '2024-01-01T00:00:00Z',
        },
        expiresAt: '2024-01-02T00:00:00Z',
      };
      vi.mocked(mockHttp.post).mockResolvedValue(mockResponse);

      // Act
      const result = await authService.login(credentials);

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call POST /auth/logout', async () => {
      // Arrange
      vi.mocked(mockHttp.post).mockResolvedValue(undefined);

      // Act
      await authService.logout();

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('getMe', () => {
    it('should call GET /auth/me and return user', async () => {
      // Arrange
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: '2024-01-01T00:00:00Z',
      };
      vi.mocked(mockHttp.get).mockResolvedValue(mockUser);

      // Act
      const result = await authService.getMe();

      // Assert
      expect(mockHttp.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('register', () => {
    it('should call POST /auth/register with registration data', async () => {
      // Arrange
      const registerData = {
        email: 'new@example.com',
        password: 'Password123',
        name: 'New User',
      };
      const mockResponse: AuthResponse = {
        user: {
          id: '2',
          email: 'new@example.com',
          name: 'New User',
          createdAt: '2024-01-01T00:00:00Z',
        },
        expiresAt: '2024-01-02T00:00:00Z',
      };
      vi.mocked(mockHttp.post).mockResolvedValue(mockResponse);

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(mockHttp.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse);
    });
  });
});
