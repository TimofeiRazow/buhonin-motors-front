// src/components/Auth/ForgotPasswordForm.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const ForgotPasswordForm = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/reset-password', { phone_number: phone });
      setMessage('Код восстановления отправлен на ваш телефон');
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Номер телефона:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (xxx) xxx-xx-xx"
          required
        />
      </div>

      {error && <div style={{color: 'red'}}>{error}</div>}
      {message && <div style={{color: 'green'}}>{message}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Отправляем...' : 'Восстановить пароль'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;