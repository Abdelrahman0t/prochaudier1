import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenManager from '../utils/tokenManager';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status
  const checkAuth = useCallback(() => {
    const token = tokenManager.getValidToken();
    const userData = tokenManager.getUserData();
    
    setIsAuthenticated(!!token);
    setUser(userData);
    setLoading(false);
    
    return !!token;
  }, []);

  // Login function
  const login = useCallback((authData: any) => {
    tokenManager.storeTokens(authData);
    setIsAuthenticated(true);
    setUser(authData.user || {});
  }, []);

  // Logout function
  const logout = useCallback(() => {
    tokenManager.clearAllTokens();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Get valid token
  const getToken = useCallback(() => {
    return tokenManager.getValidToken();
  }, []);

  // Handle token expiration
  useEffect(() => {
    const handleTokenExpired = () => {
      console.log('Token expired event received');
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => window.removeEventListener('tokenExpired', handleTokenExpired);
  }, []);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    checkAuth
  };
};
