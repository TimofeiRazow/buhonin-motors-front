import React, { useState } from 'react';
import api from '../../services/api';

const EmailVerification = ({ email, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const resendEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');

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
    <div className="bg-black border-4 border-orange-500 p-8 relative">
      {/* Заголовок */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">ПОДТВЕРЖДЕНИЕ</span> EMAIL
        </h2>
        <div className="w-full h-1 bg-orange-500 mb-4"></div>
        
        {/* Информация об email */}
        <div className="bg-gray-900 border-2 border-white p-4 mb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-orange-500 text-xl">📧</span>
            <div className="text-center">
              <p className="text-gray-300 font-bold text-sm uppercase mb-1">
                ПИСЬМО ОТПРАВЛЕНО НА:
              </p>
              <p className="text-white font-black text-lg tracking-wider break-all">
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Основная инструкция */}
        <div className="bg-gray-900 border-2 border-blue-500 p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="text-white font-black text-xl uppercase tracking-wider mb-4">
              ПРОВЕРЬТЕ СВОЮ ПОЧТУ
            </h3>
            <p className="text-gray-300 text-sm normal-case leading-relaxed">
              Мы отправили письмо с ссылкой для подтверждения на указанный email адрес. 
              Перейдите по ссылке в письме, чтобы активировать свой аккаунт.
            </p>
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

        {/* Действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Повторно отправить */}
          <button
            onClick={resendEmail}
            disabled={loading}
            className={`py-4 font-black text-lg uppercase tracking-wider border-4 transition-all duration-300 transform
              ${loading
                ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-black text-black hover:bg-orange-500 hover:border-orange-500 hover:scale-105 active:scale-95'
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ОТПРАВЛЯЕМ...
              </div>
            ) : (
              <>📤 ОТПРАВИТЬ ПОВТОРНО</>
            )}
          </button>

          {/* Я подтвердил */}
          <button
            onClick={onSuccess}
            className="bg-orange-500 border-4 border-black text-black font-black text-lg uppercase tracking-wider py-4
                       hover:bg-orange-400 hover:scale-105 active:scale-95 transition-all duration-300 transform"
          >
            ✅ Я ПОДТВЕРДИЛ EMAIL
          </button>
        </div>

        {/* Пошаговая инструкция */}
        <div className="bg-gray-900 border-2 border-orange-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-orange-500 text-lg">📋</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-3 text-orange-400">ЧТО ДЕЛАТЬ ДАЛЬШЕ:</p>
              <ol className="text-xs normal-case space-y-2 list-decimal list-inside">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Откройте свой почтовый ящик
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Найдите письмо от KOLESA.KZ
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Нажмите на ссылку "Подтвердить email"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Вернитесь сюда и нажмите "Я подтвердил email"
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Проблемы с получением */}
        <div className="bg-gray-900 border-2 border-yellow-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg">⚠️</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-2 text-yellow-400">НЕ ПОЛУЧИЛИ ПИСЬМО?</p>
              <ul className="text-xs normal-case space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                  Проверьте папку "Спам" или "Нежелательная почта"
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                  Убедитесь в правильности email адреса
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                  Добавьте noreply@kolesa.kz в белый список
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                  Подождите несколько минут и обновите почту
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Альтернативные действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Изменить email */}
          <button className="bg-gray-900 border-2 border-white text-white font-black text-sm uppercase tracking-wider py-3 px-4
                           hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            ✏️ ИЗМЕНИТЬ EMAIL
          </button>

          {/* Пропустить пока */}
          <button className="bg-gray-800 border-2 border-gray-600 text-gray-400 font-black text-sm uppercase tracking-wider py-3 px-4
                           hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105">
            ⏭️ ПРОПУСТИТЬ ПОКА
          </button>
        </div>

        {/* Безопасность */}
        <div className="bg-gray-900 border-2 border-green-500 p-4">
          <div className="flex items-start gap-3">
            <span className="text-green-500 text-lg">🛡️</span>
            <div className="text-gray-300 text-sm">
              <p className="font-bold uppercase mb-1 text-green-400">ЗАЧЕМ ЭТО НУЖНО?</p>
              <p className="text-xs normal-case">
                Подтверждение email защищает ваш аккаунт и позволяет восстанавливать доступ при необходимости
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

export default EmailVerification;