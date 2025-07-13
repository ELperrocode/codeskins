const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface User {
  _id: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'customer' | 'seller' | 'admin';
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication API functions
export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (email: string, password: string, role: 'customer' | 'seller' | 'admin'): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  });
};

export const getProfile = async (): Promise<ApiResponse<{ user: User }>> => {
  return apiRequest<{ user: User }>('/api/auth/me');
};

export const logout = async (): Promise<ApiResponse> => {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  });
};

// Template API functions (for future use)
export const getTemplates = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>('/api/templates');
};

export const getTemplate = async (id: string): Promise<ApiResponse<any>> => {
  return apiRequest<any>(`/api/templates/${id}`);
};

// Order API functions (for future use)
export const createOrder = async (templateId: string): Promise<ApiResponse<any>> => {
  return apiRequest<any>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ templateId }),
  });
};

export const getOrders = async (): Promise<ApiResponse<any[]>> => {
  return apiRequest<any[]>('/api/orders');
}; 