import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAdminSession, loginAdmin as apiLogin, logoutAdmin as apiLogout } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await checkAdminSession();
        setIsAuthenticated(!!res.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (password) => {
    const res = await apiLogin(password);
    if (res.success) {
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
