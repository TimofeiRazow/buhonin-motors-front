import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Кнопка пользователя */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 p-3 bg-gray-900 border-2 border-orange-600 hover:bg-orange-600 hover:border-black transition-all duration-300 transform hover:scale-105"
      >
        {/* Аватар */}
        <div className="relative w-10 h-10 bg-orange-600 group-hover:bg-black border-2 border-black group-hover:border-orange-600 flex items-center justify-center transition-colors duration-300">
          <span className="text-black group-hover:text-orange-600 font-black text-lg">
            {user?.first_name?.charAt(0)?.toUpperCase() || user?.phone_number?.slice(-1) || 'U'}
          </span>
          {/* Декоративный квадрат */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white group-hover:bg-orange-600 transition-colors"></div>
        </div>

        {/* Имя пользователя */}
        <span className="text-white group-hover:text-black font-black uppercase tracking-wider text-sm">
          {user?.first_name?.toUpperCase() || 'ПОЛЬЗОВАТЕЛЬ'}
        </span>

        {/* Стрелка */}
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-600 group-hover:border-t-black"></div>
        </div>

        {/* Декоративные элементы кнопки */}
        <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
        <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-orange-600 group-hover:bg-black transition-colors"></div>
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black border-4 border-orange-600 min-w-64 z-50 overflow-hidden">
          {/* Заголовок меню */}
          <div className="bg-orange-600 p-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-black uppercase tracking-wider text-sm">
                МЕНЮ ПРОФИЛЯ
              </h3>
              <div className="w-3 h-3 bg-black rotate-45"></div>
            </div>
          </div>

          {/* Пункты меню */}
          <div className="bg-black">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 p-4 text-white hover:bg-orange-600 hover:text-black no-underline font-bold uppercase tracking-wider text-sm border-b-2 border-gray-800 hover:border-black transition-all duration-300"
            >
              <span className="text-lg">👤</span>
              МОЙ ПРОФИЛЬ
              <div className="ml-auto w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </Link>

            <Link
              to="/my-listings"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 p-4 text-white hover:bg-orange-600 hover:text-black no-underline font-bold uppercase tracking-wider text-sm border-b-2 border-gray-800 hover:border-black transition-all duration-300"
            >
              <span className="text-lg">🚗</span>
              МОИ ОБЪЯВЛЕНИЯ
              <div className="ml-auto w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </Link>

            <Link
              to="/messages"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 p-4 text-white hover:bg-orange-600 hover:text-black no-underline font-bold uppercase tracking-wider text-sm border-b-2 border-gray-800 hover:border-black transition-all duration-300"
            >
              <span className="text-lg">💬</span>
              СООБЩЕНИЯ
              <div className="ml-auto w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 p-4 text-white hover:bg-orange-600 hover:text-black no-underline font-bold uppercase tracking-wider text-sm border-b-2 border-gray-800 hover:border-black transition-all duration-300"
            >
              <span className="text-lg">⚙️</span>
              НАСТРОЙКИ
              <div className="ml-auto w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </Link>

            {/* Админ-панель для администраторов */}
            {user?.user_type === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 p-4 text-white hover:bg-orange-600 hover:text-black no-underline font-bold uppercase tracking-wider text-sm border-b-2 border-gray-800 hover:border-black transition-all duration-300"
              >
                <span className="text-lg">🛠️</span>
                АДМИН-ПАНЕЛЬ
                <div className="ml-auto w-2 h-2 bg-orange-600 group-hover:bg-black transition-colors"></div>
              </Link>
            )}

            {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 p-4 bg-gray-900 hover:bg-red-600 text-white hover:text-white font-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-lg">🚪</span>
              ВЫЙТИ
              <div className="ml-auto">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-red-500 group-hover:border-t-white"></div>
              </div>
              
              {/* Декоративные элементы для кнопки выхода */}
              <div className="absolute top-1 left-1 w-2 h-2 bg-red-600 group-hover:bg-white transition-colors"></div>
              <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-red-600 group-hover:bg-white transition-colors"></div>
            </button>
          </div>

          {/* Нижняя декоративная секция */}
          <div className="bg-orange-600 p-2">
            <div className="flex justify-between items-center">
              <div className="w-4 h-1 bg-black"></div>
              <div className="w-2 h-2 bg-black rotate-45"></div>
              <div className="w-6 h-1 bg-black"></div>
            </div>
          </div>
        </div>
      )}

      {/* Фоновый оверлей при открытом меню */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default UserMenu;