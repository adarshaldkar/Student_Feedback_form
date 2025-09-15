import React, { createContext, useContext, useEffect, useState } from 'react';
import appwriteService from '../services/appwriteService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await appwriteService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // Get user document from database
        const userDoc = await appwriteService.getUserDocument(currentUser.$id);
        setUserDocument(userDoc);
      } else {
        setUser(null);
        setUserDocument(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setUserDocument(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Register new admin user
  const register = async (email, password, name, username) => {
    try {
      setLoading(true);
      const newUser = await appwriteService.register(email, password, name, username, 'admin');
      
      // Auto-login after registration
      await login(email, password);
      
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const session = await appwriteService.login(email, password);
      
      if (session) {
        // Get user details after successful login
        await checkAuth();
      }
      
      return session;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      await appwriteService.logout();
      setUser(null);
      setUserDocument(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setUserDocument(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return userDocument?.role === 'admin';
  };

  // Get user role
  const getUserRole = () => {
    return userDocument?.role || 'guest';
  };

  // Get username
  const getUsername = () => {
    return userDocument?.username || user?.name || 'Unknown';
  };

  // Refresh user data
  const refreshUser = async () => {
    await checkAuth();
  };

  const value = {
    user,
    userDocument,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    isAdmin,
    getUserRole,
    getUsername,
    refreshUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;