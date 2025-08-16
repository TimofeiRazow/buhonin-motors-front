import { useState, useEffect, createContext, useContext } from 'react';
import api from '../../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.data);
        } catch (error) {
          console.error('Auth initialization failed:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log(response);
      const { tokens, user } = response.data.data;
      console.log(tokens);
      console.log(user);
      if (tokens){
        localStorage.setItem('token', tokens.access_token);
        setToken(tokens.access_token);
      }
      if (tokens) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
      }
      
      
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { tokens, user } = response.data.data;
      console.log(tokens);
      console.log(user);
      if (tokens){
        localStorage.setItem('token', tokens.access_token);
        setToken(tokens.access_token);
      }
      if (tokens) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
      }
      
      
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser
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
  console.log("Context:", context)
  return context;
};