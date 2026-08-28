import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Session verification failed", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();

    const handleUnauthorized = () => {
      logout();
      toast.error('Session expired. Please re-authenticate.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await authService.login(email, password);
      const { access_token, user: userData } = res.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem('wealthpulse_saved_email', email);
      } else {
        localStorage.removeItem('wealthpulse_saved_email');
      }

      setToken(access_token);
      setUser(userData);
      toast.success(`Access granted. Welcome, ${userData.name}!`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or access key.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, seed_demo_data = false) => {
    try {
      const res = await authService.register(name, email, password, seed_demo_data);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(access_token);
      setUser(userData);
      toast.success(`Portfolio initialized! Welcome, ${userData.name}.`);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please check inputs.';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (name) => {
    try {
      const res = await authService.updateProfile({ name });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Account profile updated');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update profile';
      toast.error(msg);
      return { success: false };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      await authService.changePassword({ current_password, new_password });
      toast.success('Password updated successfully');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to change password';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    document.body.style.overflow = 'unset';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Session disconnected');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
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
