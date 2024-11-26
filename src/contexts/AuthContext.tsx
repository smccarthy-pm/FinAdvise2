import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from '../lib/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setUser(MOCK_USER);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // In development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAuthToken('mock-token');
      setUser(MOCK_USER);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}