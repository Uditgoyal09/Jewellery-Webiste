const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '/api'
);

const AUTH_TOKEN_KEY = 'ganesh-jewellers-auth-token';
const AUTH_USER_KEY = 'ganesh-jewellers-auth-user';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role?: 'customer' | 'admin';
}

export interface AdminSummary {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  pendingContactQueries: number;
  pendingCallBookings: number;
  pendingProductInquiries: number;
}

export interface AdminContactQuery {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface AdminCallBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed';
  created_at: string;
}

export interface AdminProductInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: 'buy' | 'custom';
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
  product: {
    id: string;
    name: string;
  } | null;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  weight_grams: number | null;
  purity: string | null;
  image_url: string | null;
  is_featured?: boolean | null;
  is_available?: boolean | null;
  category_id?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed.', response.status);
  }

  return data as T;
};

const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const getOptionalAuthHeaders = () => {
  const token = getAuthToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;
};

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const storeAuthSession = (token: string, user: AuthUser) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAuthToken();

    if (!token) {
      throw new ApiError('Please sign in to continue.', 401);
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
};

export const apiRegister = (payload: { fullName: string; email: string; password: string }) =>
  apiRequest<{ token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiLogin = (payload: { email: string; password: string }) =>
  apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiFetchCurrentUser = () =>
  apiRequest<{ token: string; user: AuthUser }>('/auth/me', {
    auth: true,
  });

export const apiUpdateProfile = (payload: { fullName: string; phone?: string }) =>
  apiRequest<{ token: string; user: AuthUser; message: string }>('/auth/me', {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });

export const apiFetchCategories = () =>
  apiRequest<{ categories: Category[] }>('/categories');

export const apiFetchProducts = (params?: { category?: string | null; featured?: boolean }) => {
  const query = new URLSearchParams();

  if (params?.category) {
    query.set('category', params.category);
  }

  if (params?.featured) {
    query.set('featured', 'true');
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<{ products: Product[] }>(`/products${suffix}`);
};

export const apiFetchWishlist = () =>
  apiRequest<{ products: Product[]; productIds: string[] }>('/wishlist', { auth: true });

export const apiAddToWishlist = (productId: string) =>
  apiRequest<{ message: string }>(`/wishlist/${productId}`, {
    method: 'POST',
    auth: true,
  });

export const apiRemoveFromWishlist = (productId: string) =>
  apiRequest<{ message: string }>(`/wishlist/${productId}`, {
    method: 'DELETE',
    auth: true,
  });

export const apiCreateContactQuery = (payload: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) =>
  apiRequest<{ message: string }>('/contact-queries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const apiCreateCallBooking = (payload: {
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}) =>
  apiRequest<{ message: string }>('/call-bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getOptionalAuthHeaders(),
  });

export const apiCreateProductInquiry = (payload: {
  productId: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'buy' | 'custom';
  message: string;
}) =>
  apiRequest<{ message: string }>('/product-inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: getOptionalAuthHeaders(),
  });

export const apiFetchAdminDashboard = () =>
  apiRequest<{
    summary: AdminSummary;
    users: AdminUser[];
    categories: Category[];
    products: Product[];
    contactQueries: AdminContactQuery[];
    callBookings: AdminCallBooking[];
    productInquiries: AdminProductInquiry[];
  }>('/admin/dashboard', { auth: true });

export const apiCreateAdminCategory = (payload: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}) =>
  apiRequest<{ category: Category; message: string }>('/admin/categories', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

export const apiUpdateAdminCategory = (
  categoryId: string,
  payload: { name: string; slug: string; description?: string; imageUrl?: string },
) =>
  apiRequest<{ category: Category; message: string }>(`/admin/categories/${categoryId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });

export const apiDeleteAdminCategory = (categoryId: string) =>
  apiRequest<{ message: string }>(`/admin/categories/${categoryId}`, {
    method: 'DELETE',
    auth: true,
  });

export const apiCreateAdminProduct = (payload: {
  name: string;
  description?: string;
  price: number;
  weightGrams?: number | null;
  purity?: string;
  categoryId?: string | null;
  imageUrl?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}) =>
  apiRequest<{ product: Product; message: string }>('/admin/products', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });

export const apiUpdateAdminProduct = (
  productId: string,
  payload: {
    name: string;
    description?: string;
    price: number;
    weightGrams?: number | null;
    purity?: string;
    categoryId?: string | null;
    imageUrl?: string;
    isFeatured?: boolean;
    isAvailable?: boolean;
  },
) =>
  apiRequest<{ product: Product; message: string }>(`/admin/products/${productId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(payload),
  });

export const apiDeleteAdminProduct = (productId: string) =>
  apiRequest<{ message: string }>(`/admin/products/${productId}`, {
    method: 'DELETE',
    auth: true,
  });

export const apiUpdateAdminContactStatus = (queryId: string, status: 'new' | 'in_progress' | 'resolved') =>
  apiRequest<{ message: string }>(`/admin/contact-queries/${queryId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status }),
  });

export const apiUpdateAdminCallBookingStatus = (bookingId: string, status: 'pending' | 'confirmed' | 'completed') =>
  apiRequest<{ message: string }>(`/admin/call-bookings/${bookingId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status }),
  });

export const apiUpdateAdminProductInquiryStatus = (inquiryId: string, status: 'pending' | 'contacted' | 'closed') =>
  apiRequest<{ message: string }>(`/admin/product-inquiries/${inquiryId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status }),
  });
