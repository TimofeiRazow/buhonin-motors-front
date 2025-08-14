import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Введите номер телефона';
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Некорректный номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Ошибка входа. Проверьте данные и попробуйте снова.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Вход в аккаунт
      </h1>

      {errors.general && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold'
          }}>
            Номер телефона
          </label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+7 (777) 123-45-67"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.phone_number ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.phone_number && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.phone_number}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold'
          }}>
            Пароль
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
          {errors.password && (
            <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
              {errors.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px'
      }}>
        <Link 
          to="/reset-password"
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          Забыли пароль?
        </Link>
      </div>

      <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <div style={{
        textAlign: 'center',
        fontSize: '14px'
      }}>
        Нет аккаунта?{' '}
        <Link 
          to="/register"
          style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;