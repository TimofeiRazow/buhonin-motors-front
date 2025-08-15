// src/hooks/auth/useRegister.js
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const useRegister = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const registerMutation = useMutation(
    (userData) => api.post('/api/auth/register', userData),
    {
      onSuccess: (response) => {
        // Перенаправляем на страницу верификации телефона
        navigate('/verify-phone', { 
          state: { 
            phoneNumber: response.data.phone_number,
            message: 'Регистрация прошла успешно! Подтвердите номер телефона.' 
          }
        });
      },
      onError: (error) => {
        setError(error.response?.data?.message || 'Ошибка при регистрации');
      }
    }
  );

  const register = async (userData) => {
    setError('');
    return registerMutation.mutateAsync(userData);
  };

  return {
    register,
    loading: registerMutation.isLoading,
    error
  };
};