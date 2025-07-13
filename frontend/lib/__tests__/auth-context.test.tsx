import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../lib/auth-context';

// Mock the API calls
jest.mock('../lib/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getProfile: jest.fn(),
  logout: jest.fn(),
}));

const TestComponent = () => {
  const { user, login, logout, register, isLoading } = useAuth();
  
  return (
    <div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="user-role">{user?.role || 'No role'}</div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={() => register('test@example.com', 'password', 'customer')} data-testid="register-btn">
        Register
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should provide initial state', () => {
    renderWithAuth(<TestComponent />);
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  it('should handle successful login', async () => {
    const mockLogin = require('../lib/api').login;
    mockLogin.mockResolvedValue({
      success: true,
      data: {
        user: { email: 'test@example.com', role: 'customer' },
        token: 'mock-token'
      }
    });

    renderWithAuth(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    });
    
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle successful registration', async () => {
    const mockRegister = require('../lib/api').register;
    mockRegister.mockResolvedValue({
      success: true,
      data: {
        user: { email: 'new@example.com', role: 'customer' },
        token: 'mock-token'
      }
    });

    renderWithAuth(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('register-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('new@example.com');
      expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    });
    
    expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password', 'customer');
  });

  it('should handle logout', async () => {
    const mockLogin = require('../lib/api').login;
    const mockLogout = require('../lib/api').logout;
    
    mockLogin.mockResolvedValue({
      success: true,
      data: {
        user: { email: 'test@example.com', role: 'customer' },
        token: 'mock-token'
      }
    });
    
    mockLogout.mockResolvedValue({
      success: true,
      message: 'Logout successful'
    });

    renderWithAuth(<TestComponent />);
    
    // First login
    fireEvent.click(screen.getByTestId('login-btn'));
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
    
    // Then logout
    fireEvent.click(screen.getByTestId('logout-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
      expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
    });
  });

  it('should load user from localStorage on mount', async () => {
    const mockGetProfile = require('../lib/api').getProfile;
    mockGetProfile.mockResolvedValue({
      success: true,
      data: {
        user: { email: 'saved@example.com', role: 'seller' }
      }
    });

    const mockUser = { email: 'saved@example.com', role: 'seller' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'saved-token');

    renderWithAuth(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('saved@example.com');
      expect(screen.getByTestId('user-role')).toHaveTextContent('seller');
    });
  });
}); 