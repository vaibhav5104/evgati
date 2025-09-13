import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
          
          // Verify token is still valid
          const response = await authService.getCurrentUser();
          setUser(response.userData);
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Get user data
        const userResponse = await authService.getCurrentUser();
        const userData = userResponse.userData;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        return userData;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Get user data
        const userResponse = await authService.getCurrentUser();
        const newUserData = userResponse.userData;
        
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
        setIsAuthenticated(true);
        
        return newUserData;
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.extraDetails || 'Registration failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      const response = await authService.googleLogin(credential);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Get user data
        const userResponse = await authService.getCurrentUser();
        const userData = userResponse.userData;
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        return userData;
      } else {
        throw new Error('No token received from Google login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await authService.updateUser(user._id, updatedData);
      const newUserData = response.userData || response;
      
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      return newUserData;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};