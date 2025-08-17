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
      setError('');
    } catch (err) {
      setError('Ошибка при отправке кода');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-orange-500 p-8 relative">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">ВЕРИФИКАЦИЯ</span> ТЕЛЕФОНА
        </h2>
        <div className="w-full h-1 bg-orange-500 mb-4"></div>
        
        {/* Информация о номере */}
        <div className="bg-gray-900 border-2 border-white p-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-orange-500 text-xl">📱</span>
            <div className="text-center">
              <p className="text-gray-300 font-bold text-sm uppercase mb-1">
                КОД ОТПРАВЛЕН НА НОМЕР:
              </p>
              <p className="text-white font-black text-lg tracking-wider">
                {phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Поле ввода кода */}
        <div>
          <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
            <span className="text-orange-500">🔢</span> ВВЕДИТЕ КОД ИЗ SMS
          </label>
          
          <div className="relative group">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              className="w-full bg-white border-4 border-black px-4 py-6 font-black text-black text-center text-2xl tracking-widest
                         focus:outline-none focus:border-orange-500 focus:bg-orange-100
                         hover:bg-gray-100 transition-all duration-300
                         placeholder:text-gray-400"
            />
            
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
          </div>

          {/* Индикатор заполнения кода */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 border-2 transition-colors duration-300 ${
                  index < code.length 
                    ? 'bg-orange-500 border-orange-500' 
                    : 'bg-black border-gray-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="bg-red-900 border-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠</span>
              <span className="text-red-300 font-bold uppercase">{error}</span>
            </div>
          </div>
        )}

        {/* Кнопка подтверждения */}
        <button
          onClick={handleSubmit}
          disabled={loading || code.length !== 6}
          className={`w-full py-6 font-black text-xl uppercase tracking-wider border-4 transition-all duration-300 transform
            ${loading || code.length !== 6
              ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 border-black text-black hover:bg-orange-400 hover:scale-105 active:scale-95'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ПРОВЕРЯЕМ...
            </div>
          ) : (
            <>✅ ПОДТВЕРДИТЬ</>
          )}
        </button>

        {/* Таймер и повторная отправка */}
        <div className="bg-gray-900 border-2 border-white p-4">
          <div className="text-center">
            {timeLeft > 0 ? (
              <div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-orange-500 text-lg">⏱️</span>
                  <span className="text-white font-black text-lg tracking-wider">
                    ПОВТОРИТЬ ЧЕРЕЗ: {formatTime(timeLeft)}
                  </span>
                </div>
                
                {/* Прогресс таймера */}
                <div className="w-full bg-black border-2 border-gray-600 h-3">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000"
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                onClick={resendCode}
                className="bg-white border-2 border-black text-black font-black text-sm uppercase tracking-wider py-3 px-6
                           hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 transform hover:scale-105"
              >
                📤 ОТПРАВИТЬ КОД ПОВТОРНО
              </button>
            )}
          </div>
        </div>

        {/* Статус заполнения */}
        <div className="bg-gray-900 border-2 border-gray-600 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-sm uppercase tracking-wider">
              ГОТОВНОСТЬ К ПРОВЕРКЕ:
            </span>
            <span className="text-orange-500 font-black text-sm">
              {Math.round((code.length / 6) * 100)}%
            </span>
          </div>
          <div className="w-full bg-black border-2 border-gray-600 h-3">
            <div 
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(code.length / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Помощь */}
        <div className="bg-gray-900 border-2 border-blue-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">💡</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-2 text-blue-400">НЕ ПОЛУЧИЛИ КОД?</p>
              <ul className="text-xs normal-case space-y-1">
                <li>• Проверьте папку спам</li>
                <li>• Убедитесь в правильности номера</li>
                <li>• Код действует 5 минут</li>
                <li>• При проблемах обратитесь в поддержку</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-2 left-2 w-6 h-6 border-2 border-orange-500"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500"></div>
    </div>
  );
};

export default PhoneVerification;