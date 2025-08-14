// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';
import PhoneVerification from '../../components/Auth/PhoneVerification';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const [step, setStep] = useState('request'); // request, verify, reset
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const handleForgotPasswordSuccess = (phone) => {
    setPhoneNumber(phone);
    setStep('verify');
  };

  const handleVerificationSuccess = () => {
    setStep('reset');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/change-password', {
        phone_number: phoneNumber,
        verification_code: verificationCode,
        new_password: newPassword
      });

      alert('Пароль успешно изменен!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Восстановление пароля</h2>

      {step === 'request' && (
        <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
      )}

      {step === 'verify' && (
        <PhoneVerification 
          phoneNumber={phoneNumber}
          onSuccess={handleVerificationSuccess}
        />
      )}

      {step === 'reset' && (
        <form onSubmit={handlePasswordReset}>
          <h3>Установить новый пароль</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Новый пароль:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Подтвердите пароль:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Сохраняем...' : 'Изменить пароль'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;