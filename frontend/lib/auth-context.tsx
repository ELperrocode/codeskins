'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, getProfile, logout as apiLogout } from './api';

interface User {
  _id: string;
  username: string;
  role: 'customer' | 'seller' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'customer' | 'seller') => Promise<void>;
  logout: () => Promise<void>;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session with the server
        const response = await getProfile();
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          // No valid session
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiLogin(username, password);
      if (response.success && response.data) {
        const { user } = response.data;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, role: 'customer' | 'seller') => {
    try {
      const response = await apiRegister(username, email, password, role);
      if (response.success && response.data) {
        const { user } = response.data;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 