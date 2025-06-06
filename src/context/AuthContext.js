import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
      authService.setAuthToken(user.token);
    }
    setLoading(false);
  }, []);

  const handleError = useCallback((error) => {
    const message = error.code === 401 
      ? 'Sesión expirada, por favor inicia sesión nuevamente'
      : error.message;
    showNotification(message, 'error');
  }, [showNotification]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data);
      authService.setAuthToken(data.token);
      setLoading(false);
      navigate('/chat');
      return data;
    } catch (error) {
      setLoading(false);
      handleError(error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    try {
      authService.logout();
      setUser(null);
      showNotification('Has cerrado sesión exitosamente', 'info');
      navigate('/login');
    } catch (error) {
      handleError(error);
    }
  }, [navigate, showNotification, handleError]);

  const value = {
    user,
    loading,
    login,
    logout,
    handleError 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
