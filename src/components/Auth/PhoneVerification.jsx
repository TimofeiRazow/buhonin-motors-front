// src/components/Auth/PhoneVerification.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const PhoneVerification = ({ phoneNumber, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/verify-phone', {
        phone_number: phoneNumber,
        verification_code: code
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      await api.post('/api/auth/send-verification-code', {
        phone_number: phoneNumber
      });
      setTimeLeft(60);
    } catch (err) {
      setError('Ошибка при отправке кода');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Введите код, отправленный на номер {phoneNumber}</p>
      
      <div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Код из SMS"
          maxLength={6}
          required
        />
      </div>

      {error && <div style={{color: 'red'}}>{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Проверяем...' : 'Подтвердить'}
      </button>

      <div>
        {timeLeft > 0 ? (
          <span>Повторить отправку через {timeLeft}сек</span>
        ) : (
          <button type="button" onClick={resendCode}>
            Отправить код повторно
          </button>
        )}
      </div>
    </form>
  );
};

export default PhoneVerification;