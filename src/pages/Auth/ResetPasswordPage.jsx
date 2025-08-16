// src/pages/Auth/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Key, Phone, Shield, AlertTriangle, Loader, Save, ArrowLeft } from 'lucide-react';
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

  // Получаем информацию о текущем шаге
  const getStepInfo = () => {
    switch (step) {
      case 'request':
        return { 
          title: 'ВОССТАНОВЛЕНИЕ', 
          subtitle: 'ПАРОЛЯ', 
          icon: <Key size={48} className="text-orange-500" />, 
          description: 'ВВЕДИТЕ НОМЕР ТЕЛЕФОНА' 
        };
      case 'verify':
        return { 
          title: 'ПОДТВЕРЖДЕНИЕ', 
          subtitle: 'ТЕЛЕФОНА', 
          icon: <Phone size={48} className="text-orange-500" />, 
          description: 'ВВЕДИТЕ КОД ИЗ СМС' 
        };
      case 'reset':
        return { 
          title: 'НОВЫЙ', 
          subtitle: 'ПАРОЛЬ', 
          icon: <Shield size={48} className="text-orange-500" />, 
          description: 'УСТАНОВИТЕ БЕЗОПАСНЫЙ ПАРОЛЬ' 
        };
      default:
        return { title: '', subtitle: '', icon: null, description: '' };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="relative w-full max-w-md">
        {/* Фоновые декоративные элементы */}
        <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-orange-600 rotate-45 opacity-30"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-orange-600 rotate-12 opacity-40"></div>
        <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-white opacity-30"></div>
        <div className="absolute -bottom-8 -right-8 w-12 h-12 border-2 border-white rotate-45 opacity-20"></div>

        {/* Основной контейнер */}
        <div className="bg-black border-4 border-orange-600 p-8 relative overflow-hidden">
          {/* Геометрические элементы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
          <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>

          <div className="relative z-10">
            {/* Прогресс бар */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-sm ${
                  step === 'request' ? 'bg-orange-600 border-orange-600 text-black' : 
                  (step === 'verify' || step === 'reset') ? 'bg-gray-600 border-gray-600 text-white' : 
                  'bg-gray-800 border-gray-600 text-gray-400'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  (step === 'verify' || step === 'reset') ? 'bg-orange-600' : 'bg-gray-700'
                }`}></div>
                <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-sm ${
                  step === 'verify' ? 'bg-orange-600 border-orange-600 text-black' : 
                  step === 'reset' ? 'bg-gray-600 border-gray-600 text-white' : 
                  'bg-gray-800 border-gray-600 text-gray-400'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  step === 'reset' ? 'bg-orange-600' : 'bg-gray-700'
                }`}></div>
                <div className={`w-8 h-8 border-2 flex items-center justify-center font-black text-sm ${
                  step === 'reset' ? 'bg-orange-600 border-orange-600 text-black' : 
                  'bg-gray-800 border-gray-600 text-gray-400'
                }`}>
                  3
                </div>
              </div>
              <div className="text-center">
                <p className="text-orange-400 font-bold uppercase tracking-wider text-xs">
                  ШАГ {step === 'request' ? '1' : step === 'verify' ? '2' : '3'} ИЗ 3
                </p>
              </div>
            </div>

            {/* Заголовок */}
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">{stepInfo.icon}</div>
              <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2">
                {stepInfo.title}
                <span className="block text-orange-500 text-3xl">{stepInfo.subtitle}</span>
              </h1>
              <p className="text-orange-300 font-bold uppercase tracking-wide text-sm mb-2">
                {stepInfo.description}
              </p>
              <div className="w-16 h-1 bg-orange-600 mx-auto mt-4"></div>
            </div>

            {/* Контент по шагам */}
            {step === 'request' && (
              <div className="space-y-6">
                {/* Брутальная форма восстановления пароля */}
                <div className="space-y-6">
                  {error && (
                    <div className="bg-red-600 border-2 border-black text-white p-4 relative">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
                      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
                      <p className="font-bold uppercase tracking-wide text-sm flex items-center">
                        <AlertTriangle size={16} className="mr-2" />
                        {error}
                      </p>
                    </div>
                  )}

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!phoneNumber.trim()) {
                      setError('Введите номер телефона');
                      return;
                    }
                    if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(phoneNumber)) {
                      setError('Некорректный номер телефона');
                      return;
                    }
                    setLoading(true);
                    setError('');
                    // Симуляция API вызова
                    setTimeout(() => {
                      setLoading(false);
                      handleForgotPasswordSuccess(phoneNumber);
                    }, 1000);
                  }} className="space-y-6">
                    
                    {/* Поле номера телефона */}
                    <div className="group">
                      <label className="block mb-3 text-orange-100 font-black uppercase tracking-wider text-sm">
                        НОМЕР ТЕЛЕФОНА
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+7 (777) 123-45-67"
                          className="w-full p-4 bg-gray-900 text-orange-100 font-bold text-lg border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-orange-300 placeholder-opacity-60 transition-all duration-300"
                        />
                        <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                          <Phone size={20} />
                        </div>
                      </div>
                    </div>

                    {/* Кнопка восстановления */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`
                        group relative w-full p-4 font-black uppercase tracking-wider text-lg
                        transition-all duration-300 transform border-2
                        ${loading
                          ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                          : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
                        }
                      `}
                    >
                      <span className="relative flex items-center justify-center">
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 mr-3 animate-spin" />
                            ОТПРАВЛЯЕМ КОД...
                          </>
                        ) : (
                          <>
                            <Key className="w-5 h-5 mr-3" />
                            ВОССТАНОВИТЬ ПАРОЛЬ
                          </>
                        )}
                      </span>
                      
                      {!loading && (
                        <>
                          <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-6">
                <div className="bg-gray-900 border-2 border-orange-500 p-4 mb-6">
                  <p className="text-orange-100 font-bold text-center">
                    КОД ОТПРАВЛЕН НА НОМЕР:
                    <span className="block text-orange-400 text-lg mt-1 font-black">{phoneNumber}</span>
                  </p>
                </div>
                <PhoneVerification 
                  phoneNumber={phoneNumber}
                  onSuccess={handleVerificationSuccess}
                />
              </div>
            )}

            {step === 'reset' && (
              <div className="space-y-6">
                {/* Общая ошибка */}
                {error && (
                  <div className="bg-red-600 border-2 border-black text-white p-4 relative">
                    <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
                    <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
                    <p className="font-bold uppercase tracking-wide text-sm flex items-center">
                      <AlertTriangle size={16} className="mr-2" />
                      {error}
                    </p>
                  </div>
                )}

                <form onSubmit={handlePasswordReset} className="space-y-6">
                  {/* Новый пароль */}
                  <div className="group">
                    <label className="block mb-3 text-orange-100 font-black uppercase tracking-wider text-sm">
                      НОВЫЙ ПАРОЛЬ
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="МИНИМУМ 6 СИМВОЛОВ"
                        required
                        minLength={6}
                        className="w-full p-4 bg-gray-900 text-orange-100 font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-orange-300 placeholder-opacity-60 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        <Key size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Подтвердите пароль */}
                  <div className="group">
                    <label className="block mb-3 text-orange-100 font-black uppercase tracking-wider text-sm">
                      ПОДТВЕРДИТЕ ПАРОЛЬ
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="ПОВТОРИТЕ ПАРОЛЬ"
                        required
                        minLength={6}
                        className="w-full p-4 bg-gray-900 text-orange-100 font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-orange-300 placeholder-opacity-60 transition-all duration-300"
                      />
                      <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        <Shield size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Кнопка сохранения */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      group relative w-full p-4 font-black uppercase tracking-wider text-lg
                      transition-all duration-300 transform border-2
                      ${loading
                        ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
                      }
                    `}
                  >
                    <span className="relative flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 mr-3 animate-spin" />
                          СОХРАНЯЕМ...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-3" />
                          ИЗМЕНИТЬ ПАРОЛЬ
                        </>
                      )}
                    </span>
                    
                    {!loading && (
                      <>
                        <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                        <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Навигация назад */}
            {step !== 'request' && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    if (step === 'verify') setStep('request');
                    if (step === 'reset') setStep('verify');
                  }}
                  className="group inline-flex items-center text-orange-300 hover:text-orange-100 font-bold uppercase tracking-wider text-sm transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-orange-500 mr-3 group-hover:bg-orange-300 transition-colors"></div>
                  <ArrowLeft size={16} className="mr-2" />
                  НАЗАД
                </button>
              </div>
            )}

            {/* Ссылка на вход */}
            <div className="mt-8 text-center">
              <div className="relative mb-6">
                <div className="h-px bg-gray-800"></div>
                <div className="absolute top-0 left-1/4 w-8 h-px bg-orange-600"></div>
                <div className="absolute top-0 right-1/4 w-12 h-px bg-white opacity-50"></div>
              </div>
              
              <p className="text-orange-300 font-bold uppercase tracking-wide text-sm mb-4">
                ВСПОМНИЛИ ПАРОЛЬ?
              </p>
              <button
                onClick={() => navigate('/login')}
                className="group relative inline-block bg-gray-900 hover:bg-orange-600 text-white hover:text-black font-black px-8 py-3 border-2 border-orange-600 hover:border-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">ВОЙТИ В СИСТЕМУ</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
                <div className="absolute bottom-1 left-1 w-3 h-0.5 bg-orange-600 group-hover:bg-black transition-colors"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;