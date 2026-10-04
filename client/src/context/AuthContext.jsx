import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ezera_user');
    return saved ? JSON.parse(saved) : {
      name: 'Dr. Aris Thorne',
      email: 'architect@brainwave.io',
      role: 'Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await api.getMe();
        if (data && data.user) {
          setUser(data.user);
          localStorage.setItem('ezera_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn('Auth check skipped or offline');
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      setUser(data.user);
      localStorage.setItem('ezera_auth_token', data.token);
      localStorage.setItem('ezera_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      localStorage.setItem('ezera_auth_token', data.token);
      localStorage.setItem('ezera_user', JSON.stringify(data.user));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'Architect') => {
    setLoading(true);
    try {
      const data = await api.demoLogin(role);
      setUser(data.user);
      localStorage.setItem('ezera_auth_token', data.token);
      localStorage.setItem('ezera_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      // Offline fallback profile
      const fallbackUser = {
        name: role === 'Admin' ? 'Sarah Vance (Admin)' : role === 'Student/Client' ? 'Alex Rivera (Client)' : 'Dr. Aris Thorne',
        email: `${role.toLowerCase()}@ezeratech.ae`,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
      setUser(fallbackUser);
      localStorage.setItem('ezera_user', JSON.stringify(fallbackUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ezera_auth_token');
    localStorage.removeItem('ezera_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    demoLogin,
    logout,
    isArchitect: user?.role === 'Architect',
    isAdmin: user?.role === 'Admin',
    isClient: user?.role === 'Student/Client'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
