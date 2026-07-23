import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  if (!url) return null;
  return url.replace(/\/+$/, '');
};

export const getApiBaseUrl = () => {
  const configuredBaseUrl = normalizeApiBaseUrl(
    process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL
  );
  if (configuredBaseUrl) return configuredBaseUrl;

  if (typeof window !== 'undefined') {
    return `${window.location.origin.replace(/\/$/, '')}/api`;
  }

  return '/api';
};

const API = axios.create({ baseURL: getApiBaseUrl() });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  verifyOtp: (data) => API.post('/auth/verify-otp', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getRelated: (id) => API.get(`/products/${id}/related`),
  createReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};

export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (data) => API.put('/user/profile', data),
  getWishlist: () => API.get('/user/wishlist'),
  toggleWishlist: (id) => API.post(`/user/wishlist/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getAll: () => API.get('/orders/my'),
  getById: (id) => API.get(`/orders/${id}`),
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payment/create-order', data),
  verify: (data) => API.post('/payment/verify', data),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getProducts: (params) => API.get('/admin/products', { params }),
  createProduct: (data) => API.post('/admin/products', data),
  updateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
  toggleProductStock: (id, qty) => API.put(`/admin/products/${id}/stock`, { stock: qty }),
  getOrders: (params) => API.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => API.put(`/admin/orders/${id}`, data),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  getAnalytics: () => API.get('/admin/analytics'),
};

export default API;
