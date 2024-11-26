import { api } from './client';
import toast from 'react-hot-toast';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    return user;
  } catch (error) {
    toast.error('Invalid credentials');
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Logout error:', error);
  }
};