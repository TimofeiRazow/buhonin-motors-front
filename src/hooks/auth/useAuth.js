import { useState, useEffect, createContext, useContext } from 'react';
import api from '../../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken && storedToken.split('.').length === 3) {
        try {
          const response = await api.get('/api/auth/me');
          setUser(response.data.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          // Если токен недействителен, очищаем его
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          setToken(null);
        }
      } else if (storedToken) {
        // Токен имеет неправильный формат
        console.warn('Invalid token format in localStorage, removing...');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setToken(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log('Login response:', response);
      
      const { tokens, user } = response.data.data;
      
      // Проверяем токены перед сохранением
      if (tokens?.access_token && tokens.access_token.split('.').length === 3) {
        localStorage.setItem('token', tokens.access_token);
        setToken(tokens.access_token);
      } else {
        throw new Error('Invalid access token received');
      }
      
      if (tokens?.refresh_token && tokens.refresh_token.split('.').length === 3) {
        localStorage.setItem('refresh_token', tokens.refresh_token);
      } else {
        console.warn('Invalid refresh token received');
      }
      
      setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      console.log('Register response:', response);
      
      // При регистрации токены обычно не возвращаются сразу
      // Пользователь должен сначала верифицировать телефон
      const { user } = response.data.data;
      
      // Если сервер все же возвращает токены при регистрации
      if (response.data.data.tokens) {
        const { tokens } = response.data.data;
        
        if (tokens?.access_token && tokens.access_token.split('.').length === 3) {
          localStorage.setItem('token', tokens.access_token);
          setToken(tokens.access_token);
        }
        
        if (tokens?.refresh_token && tokens.refresh_token.split('.').length === 3) {
          localStorage.setItem('refresh_token', tokens.refresh_token);
        }
        
        setUser(user);
      }
      
      return user;
    } catch (error) {
      console.error('Register error:', error);
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
  return context;
};