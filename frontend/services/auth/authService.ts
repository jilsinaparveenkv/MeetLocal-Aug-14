import { api } from '../../lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  getUsers: async () => {
    return api.get('/auth/users');
  },
};
