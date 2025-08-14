// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useLogin } from '../../hooks/auth/useLogin';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      onSuccess?.();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Номер телефона:</label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="+7 (xxx) xxx-xx-xx"
          required
        />
      </div>
      
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div style={{color: 'red'}}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Входим...' : 'Войти'}
      </button>
    </form>
  );
};

export default LoginForm;