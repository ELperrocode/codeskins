const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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

interface AuthResponse {
  user: User;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
}

interface Template {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  fileUrl: string;
  previewImages?: string[];
  previewUrl?: string;
  features: string[];
  status: 'active' | 'inactive' | 'draft';
  downloads: number;
  sales: number;
  rating: number;
  reviewCount: number;
  licenseId?: {
    _id: string;
    name: string;
    price: number;
  };
  ownerId: {
    _id: string;
    username: string;
  };
}

interface CartItem {
  templateId: string;
  title: string;
  price: number;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Only add Content-Type header if there's a body or if it's not a DELETE request
  // Special case: don't add Content-Type for logout endpoint
  if ((options.body || options.method !== 'DELETE') && !endpoint.includes('/api/auth/logout')) {
    defaultOptions.headers = {
      'Content-Type': 'application/json',
      ...defaultOptions.headers,
    };
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      let errorMessage = 'API request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (jsonError) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth API
export const login = async (username: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const register = async (username: string, email: string, password: string, role: 'customer' | 'admin'): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, role }),
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

// Templates API
export const getTemplates = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  tags?: string;
}): Promise<ApiResponse<{ templates: Template[]; pagination: any }>> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = searchParams.toString();
  const endpoint = `/api/templates${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<{ templates: Template[]; pagination: any }>(endpoint);
};

// Función específica para el admin que obtiene todos los templates
export const getAllTemplatesForAdmin = async (): Promise<ApiResponse<{ templates: Template[] }>> => {
  return apiRequest<{ templates: Template[] }>('/api/templates?limit=1000&status=all');
};

export const getTemplate = async (id: string): Promise<ApiResponse<{ template: Template }>> => {
  return apiRequest<{ template: Template }>(`/api/templates/${id}`);
};

export const getTemplateCategories = async (): Promise<ApiResponse<{ categories: string[] }>> => {
  return apiRequest<{ categories: string[] }>('/api/templates/categories');
};

export const getCategoriesWithImages = async (): Promise<ApiResponse<{ categories: Array<{ _id: string; name: string; description?: string; imageUrl?: string; templateCount: number; isActive: boolean }> }>> => {
  return apiRequest<{ categories: Array<{ _id: string; name: string; description?: string; imageUrl?: string; templateCount: number; isActive: boolean }> }>('/api/categories?active=true');
};

export const getTemplateTags = async (): Promise<ApiResponse<{ tags: string[] }>> => {
  return apiRequest<{ tags: string[] }>('/api/templates/tags');
};

export const createTemplate = async (data: {
  title: string;
  description: string;
  category: string;
  price: number;
  tags?: string[];
  fileUrl: string;
  previewUrl?: string;
  previewImages?: string[];
  features?: string[];
  status?: 'active' | 'inactive' | 'draft';
  licenseId?: string;
}): Promise<ApiResponse<{ template: Template }>> => {
  return apiRequest<{ template: Template }>('/api/templates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTemplate = async (id: string, data: {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  tags?: string[];
  fileUrl?: string;
  previewUrl?: string;
  previewImages?: string[];
  features?: string[];
  status?: 'active' | 'inactive' | 'draft';
  licenseId?: string;
}): Promise<ApiResponse<{ template: Template }>> => {
  return apiRequest<{ template: Template }>(`/api/templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteTemplate = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/templates/${id}`, {
    method: 'DELETE',
  });
};

// Cart API
export const getCart = async (): Promise<ApiResponse<{ cart: Cart }>> => {
  return apiRequest<{ cart: Cart }>('/api/cart');
};

export const addToCart = async (templateId: string, quantity: number = 1): Promise<ApiResponse<{ cart: Cart }>> => {
  return apiRequest<{ cart: Cart }>('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ templateId, quantity }),
  });
};

export const updateCartItem = async (templateId: string, quantity: number): Promise<ApiResponse<{ cart: Cart }>> => {
  return apiRequest<{ cart: Cart }>('/api/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ templateId, quantity }),
  });
};

export const removeFromCart = async (templateId: string): Promise<ApiResponse<{ cart: Cart }>> => {
  return apiRequest<{ cart: Cart }>(`/api/cart/remove/${templateId}`, {
    method: 'DELETE',
  });
};

export const clearCart = async (): Promise<ApiResponse> => {
  return apiRequest('/api/cart/clear', {
    method: 'DELETE',
  });
};

export const getCartCount = async (): Promise<ApiResponse<{ count: number }>> => {
  return apiRequest<{ count: number }>('/api/cart/count');
};

// Orders API
export const getOrders = async (): Promise<ApiResponse<{ orders: any[] }>> => {
  return apiRequest<{ orders: any[] }>('/api/orders');
};

export const getOrder = async (id: string): Promise<ApiResponse<{ order: any }>> => {
  return apiRequest<{ order: any }>(`/api/orders/${id}`);
};

// Stripe API
export const createCheckoutSession = async (items: Array<{
  templateId: string;
  title: string;
  price: number;
  quantity: number;
}>): Promise<ApiResponse<{ sessionId: string; url: string }>> => {
  return apiRequest<{ sessionId: string; url: string }>('/api/stripe/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
};

// Analytics API
export const getAnalytics = async (): Promise<ApiResponse<any>> => {
  return apiRequest('/api/analytics/overview');
};

export const getCustomerAnalytics = async (): Promise<ApiResponse<any>> => {
  return apiRequest('/api/analytics/customer');
}; 

// Users API (Admin)
export const getUsers = async (params?: {
  search?: string;
  role?: 'customer' | 'admin';
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ users: User[]; pagination: any }>> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }
  const queryString = searchParams.toString();
  const endpoint = `/api/users${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{ users: User[]; pagination: any }>(endpoint);
};

export const updateUser = async (id: string, data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
  return apiRequest<{ user: User }>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/users/${id}`, {
    method: 'DELETE',
  });
}; 

export const uploadTemplateImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/templates/upload-image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Image upload failed');
  }
  const data = await response.json();
  if (!data.success || !data.data?.url) {
    throw new Error(data.message || 'Image upload failed');
  }
  return data.data.url;
}; 

// Categories API (Admin)
export const getCategories = async (params?: {
  active?: boolean;
}): Promise<ApiResponse<{ categories: any[] }>> => {
  const searchParams = new URLSearchParams();
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  const queryString = searchParams.toString();
  const endpoint = `/api/categories${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{ categories: any[] }>(endpoint);
};

export const getCategory = async (id: string): Promise<ApiResponse<{ category: any }>> => {
  return apiRequest<{ category: any }>(`/api/categories/${id}`);
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  imageUrl?: string;
}): Promise<ApiResponse<{ category: any }>> => {
  return apiRequest<{ category: any }>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCategory = async (id: string, data: {
  name?: string;
  description?: string;
  isActive?: boolean;
  imageUrl?: string;
}): Promise<ApiResponse<{ category: any }>> => {
  return apiRequest<{ category: any }>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCategory = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: 'DELETE',
  });
};

export const getCategoryStats = async (): Promise<ApiResponse<any>> => {
  return apiRequest('/api/categories/stats/overview');
};

// Tags API (Admin)
export const getTags = async (params?: {
  active?: boolean;
}): Promise<ApiResponse<{ tags: any[] }>> => {
  const searchParams = new URLSearchParams();
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  const queryString = searchParams.toString();
  const endpoint = `/api/tags${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{ tags: any[] }>(endpoint);
};

export const getTag = async (id: string): Promise<ApiResponse<{ tag: any }>> => {
  return apiRequest<{ tag: any }>(`/api/tags/${id}`);
};

export const createTag = async (data: {
  name: string;
  description?: string;
  color?: string;
}): Promise<ApiResponse<{ tag: any }>> => {
  return apiRequest<{ tag: any }>('/api/tags', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTag = async (id: string, data: {
  name?: string;
  description?: string;
  isActive?: boolean;
  color?: string;
}): Promise<ApiResponse<{ tag: any }>> => {
  return apiRequest<{ tag: any }>(`/api/tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteTag = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/tags/${id}`, {
    method: 'DELETE',
  });
};

export const getTagStats = async (): Promise<ApiResponse<any>> => {
  return apiRequest('/api/tags/stats/overview');
}; 

// Licenses API (Admin)
export const getLicenses = async (params?: {
  active?: boolean;
}): Promise<ApiResponse<{ licenses: any[] }>> => {
  const searchParams = new URLSearchParams();
  if (params?.active !== undefined) {
    searchParams.append('active', params.active.toString());
  }
  const queryString = searchParams.toString();
  const endpoint = `/api/licenses${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{ licenses: any[] }>(endpoint);
};

export const getLicense = async (id: string): Promise<ApiResponse<{ license: any }>> => {
  return apiRequest<{ license: any }>(`/api/licenses/${id}`);
};

export const createLicense = async (data: {
  name: string;
  description: string;
  price: number;
  maxSales?: number;
}): Promise<ApiResponse<{ license: any }>> => {
  return apiRequest<{ license: any }>('/api/licenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLicense = async (id: string, data: {
  name?: string;
  description?: string;
  price?: number;
  maxSales?: number;
  isActive?: boolean;
}): Promise<ApiResponse<{ license: any }>> => {
  return apiRequest<{ license: any }>(`/api/licenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteLicense = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/licenses/${id}`, {
    method: 'DELETE',
  });
};

// Downloads API


// Reviews API
export const getReviews = async (templateId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{
  reviews: any[];
  pagination: any;
  averageRating: number;
  totalReviews: number;
}>> => {
  const searchParams = new URLSearchParams();
  searchParams.append('templateId', templateId);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const queryString = searchParams.toString();
  const endpoint = `/api/reviews${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{
    reviews: any[];
    pagination: any;
    averageRating: number;
    totalReviews: number;
  }>(endpoint);
};

export const getMyReview = async (templateId: string): Promise<ApiResponse<{ review: any }>> => {
  return apiRequest<{ review: any }>(`/api/reviews/my-review?templateId=${templateId}`);
};

export const createReview = async (data: {
  templateId: string;
  rating: number;
  title: string;
  comment: string;
}): Promise<ApiResponse<{ review: any }>> => {
  return apiRequest<{ review: any }>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateReview = async (id: string, data: {
  rating?: number;
  title?: string;
  comment?: string;
}): Promise<ApiResponse<{ review: any }>> => {
  return apiRequest<{ review: any }>(`/api/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteReview = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
};

// Favorites API
// Fetch all global reviews (testimonials)
export const getAllReviews = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{
  reviews: any[];
  pagination?: any;
  totalReviews?: number;
}>> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  const queryString = searchParams.toString();
  const endpoint = `/api/reviews/all${queryString ? `?${queryString}` : ''}`;
  return apiRequest<{
    reviews: any[];
    pagination?: any;
    totalReviews?: number;
  }>(endpoint);
};
export const getFavorites = async (): Promise<ApiResponse<{ favorites: any[] }>> => {
  return apiRequest<{ favorites: any[] }>('/api/favorites');
};

export const addToFavorites = async (templateId: string): Promise<ApiResponse<{ favorite: any }>> => {
  return apiRequest<{ favorite: any }>('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ templateId }),
  });
};

export const removeFromFavorites = async (templateId: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/api/favorites/${templateId}`, {
    method: 'DELETE',
  });
};

export const checkFavorite = async (templateId: string): Promise<ApiResponse<{ isFavorited: boolean }>> => {
  return apiRequest<{ isFavorited: boolean }>(`/api/favorites/check?templateId=${templateId}`);
};