'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth/authService';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('meetlocal_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('meetlocal_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.success && response.data) {
      const { user: userData, token: jwtToken } = response.data;
      localStorage.setItem('meetlocal_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
    } else {
      throw new Error(response.message || 'Login failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('meetlocal_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
