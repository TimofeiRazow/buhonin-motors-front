// src/hooks/auth/useLogin.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../services/api';

export const useLogin = () => {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginMutation = useMutation(
    (credentials) => api.post('/api/auth/login', credentials),
    {
      onSuccess: (response) => {
        console.log(response)
        const { access_token, refresh_token, user } = response.data.data;
        
        localStorage.setItem('token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        dispatch(loginSuccess({ user, token: access_token }));
        
        navigate('/profile');
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Ошибка при входе');
      }
    }
  );

  const login = async (credentials) => {
    setError('');
    return loginMutation.mutateAsync(credentials);
  };

  return {
    login,
    loading: loginMutation.isLoading,
    error
  };
};