// src/components/Auth/EmailVerification.jsx
import React, { useState } from 'react';
import api from '../../services/api';

const EmailVerification = ({ email, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resendEmail = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/send-email-verification', { email });
      setMessage('Письмо с подтверждением отправлено на ваш email');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при отправке письма');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Письмо с подтверждением отправлено на {email}</p>
      <p>Проверьте свою почту и перейдите по ссылке в письме</p>

      {error && <div style={{color: 'red'}}>{error}</div>}
      {message && <div style={{color: 'green'}}>{message}</div>}

      <button onClick={resendEmail} disabled={loading}>
        {loading ? 'Отправляем...' : 'Отправить письмо повторно'}
      </button>

      <button onClick={onSuccess}>
        Я подтвердил email
      </button>
    </div>
  );
};

export default EmailVerification;