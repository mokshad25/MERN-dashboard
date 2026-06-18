import api from './api';
import { User } from '@/types';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<{ success: boolean; user: User }> => {
    const { data } = await api.put('/auth/profile', payload);
    return data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
    return data;
  },
};
