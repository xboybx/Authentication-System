import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && AuthService.isAuthenticated()) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      const response = await AuthService.login(credentials);
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);

      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await AuthService.register(userData);
      return response;
    } catch (error) {
      const errorMessage = error?.message || 'Registration failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user data even if API call fails
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    logout,
    updateUser,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};