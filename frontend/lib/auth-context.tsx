'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi, getProfile } from './api';
import { showLoginSuccess, showLoginError, showLogoutSuccess, showRegisterSuccess, showRegisterError, handleNetworkError } from './toast';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User }>;
  register: (username: string, email: string, password: string, role: 'customer' | 'admin') => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      const response = await loginApi(username, password);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        showLoginSuccess(response.data.user.username);
        return { success: true, user: response.data.user };
      } else {
        showLoginError(response.message || 'Login failed');
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      handleNetworkError(error, 'Login failed');
      return { success: false };
    }
  };

  const register = async (username: string, email: string, password: string, role: 'customer' | 'admin'): Promise<boolean> => {
    try {
      const response = await registerApi(username, email, password, role);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        showRegisterSuccess(response.data.user.username);
        return true;
      } else {
        showRegisterError(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      handleNetworkError(error, 'Registration failed');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
      setUser(null);
      showLogoutSuccess();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      setUser(null);
      handleNetworkError(error, 'Logout failed');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 