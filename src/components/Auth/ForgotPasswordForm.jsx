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
    setMessage('');

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
    <div className="bg-black border-4 border-orange-500 p-8 relative">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">ВОССТАНОВЛЕНИЕ</span> ПАРОЛЯ
        </h2>
        <div className="w-full h-1 bg-orange-500 mb-4"></div>
        <p className="text-gray-300 font-bold text-sm uppercase">
          ПОЛУЧИТЕ КОД ДЛЯ СБРОСА ПАРОЛЯ
        </p>
      </div>

      <div className="space-y-6">
        {/* Поле телефона */}
        <div>
          <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
            <span className="text-orange-500">📱</span> НОМЕР ТЕЛЕФОНА
          </label>
          
          <div className="relative group">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (xxx) xxx-xx-xx"
              required
              className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black
                         focus:outline-none focus:border-orange-500 focus:bg-orange-100
                         hover:bg-gray-100 transition-all duration-300
                         placeholder:text-gray-500 placeholder:font-normal"
            />
            
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Сообщение об успехе */}
        {message && (
          <div className="bg-green-900 border-4 border-green-500 p-4">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <span className="text-green-300 font-bold uppercase">{message}</span>
            </div>
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-900 border-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠</span>
              <span className="text-red-300 font-bold uppercase">{error}</span>
            </div>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          onClick={handleSubmit}
          disabled={loading || !phone}
          className={`w-full py-6 font-black text-xl uppercase tracking-wider border-4 transition-all duration-300 transform
            ${loading || !phone
              ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 border-black text-black hover:bg-orange-400 hover:scale-105 active:scale-95'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ОТПРАВЛЯЕМ...
            </div>
          ) : (
            <>🔄 ВОССТАНОВИТЬ ПАРОЛЬ</>
          )}
        </button>

        {/* Статус заполнения */}
        <div className="bg-gray-900 border-2 border-gray-600 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-sm uppercase tracking-wider">
              ГОТОВНОСТЬ К ОТПРАВКЕ:
            </span>
            <span className="text-orange-500 font-black text-sm">
              {phone ? '100%' : '0%'}
            </span>
          </div>
          <div className="w-full bg-black border-2 border-gray-600 h-3">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: phone ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        {/* Инструкции */}
        <div className="bg-gray-900 border-2 border-blue-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">📋</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-2 text-blue-400">КАК ЭТО РАБОТАЕТ:</p>
              <ol className="text-xs normal-case space-y-1 list-decimal list-inside">
                <li>Введите номер телефона, привязанный к аккаунту</li>
                <li>Получите SMS с кодом восстановления</li>
                <li>Введите код и установите новый пароль</li>
                <li>Войдите в систему с новым паролем</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Альтернативные действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Вернуться к входу */}
          <button className="bg-gray-900 border-2 border-white text-white font-black text-sm uppercase tracking-wider py-3 px-4
                           hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            ← НАЗАД К ВХОДУ
          </button>

          {/* Связаться с поддержкой */}
          <button className="bg-white border-2 border-black text-black font-black text-sm uppercase tracking-wider py-3 px-4
                           hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 transform hover:scale-105">
            💬 ПОДДЕРЖКА
          </button>
        </div>

        {/* Безопасность */}
        <div className="bg-gray-900 border-2 border-green-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg">🛡️</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-1 text-green-400">БЕЗОПАСНОСТЬ</p>
              <p className="text-xs normal-case">
                Код восстановления действует 15 минут и может быть использован только один раз
              </p>
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

export default ForgotPasswordForm;