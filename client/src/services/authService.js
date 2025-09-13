import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Google login
  googleLogin: async (credential) => {
    const response = await api.post('/api/auth/google-login', { credential });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/user');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/api/auth/user/${id}`);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/api/auth/users');
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/auth/user/${id}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/api/auth/user/${id}`);
    return response.data;
  },

  // Logout (clear local storage)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};