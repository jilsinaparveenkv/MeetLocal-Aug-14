import { apiRequest } from '../../lib/api';
import { AuthResponse, User } from '../../types/auth';

export const authService = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<{ success: boolean; data: User }> {
    return apiRequest<{ success: boolean; data: User }>('/auth/me');
  },

  /**
   * Fetch list of seeded users for quick login options
   */
  async getUsers(): Promise<{ success: boolean; data: User[] }> {
    return apiRequest<{ success: boolean; data: User[] }>('/auth/users');
  },
};
