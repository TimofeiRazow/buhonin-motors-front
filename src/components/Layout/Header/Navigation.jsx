// src/components/Layout/Header/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/search', label: 'Поиск', icon: '🔍' },
    { path: '/create-listing', label: 'Подать объявление', icon: '+' },
    { path: '/favorites', label: 'Избранное', icon: '❤️' },
    { path: '/messages', label: 'Сообщения', icon: '💬' }
  ];

  return (
    <nav className="relative">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-0 left-0 w-2 h-full bg-orange-600"></div>
      <div className="absolute top-0 right-0 w-1 h-full bg-white opacity-30"></div>
      
      <ul className="flex list-none m-0 p-0 gap-2 relative z-10">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path} className="relative group">
              <Link 
                to={item.path}
                className={`
                  group relative block px-6 py-4 no-underline font-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105
                  ${isActive 
                    ? 'bg-orange-600 text-black border-2 border-black' 
                    : 'bg-gray-900 text-white border-2 border-gray-700 hover:border-orange-500 hover:text-orange-500'
                  }
                `}
              >
                {/* Основной контент */}
                <span className="relative flex items-center">
                  <span className="mr-2 text-base">{item.icon}</span>
                  {item.label}
                </span>

                {/* Декоративные элементы */}
                <div className={`
                  absolute top-1 right-1 w-2 h-2 transition-colors
                  ${isActive 
                    ? 'bg-black' 
                    : 'bg-orange-600 group-hover:bg-white'
                  }
                `}></div>

                {/* Активная подсветка снизу */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-black"></div>
                )}

                {/* Hover эффект - появляющиеся элементы */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute top-0 left-0 w-0 h-0 border-r-4 border-r-transparent border-b-4 border-b-orange-500"></div>
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-4 border-l-transparent border-t-4 border-t-white"></div>
                </div>

                {/* Дополнительная геометрия для неактивных элементов */}
                {!isActive && (
                  <div className="absolute bottom-1 left-1 w-3 h-0.5 bg-gray-700 group-hover:bg-orange-500 transition-colors"></div>
                )}
              </Link>

              {/* Разделители между элементами */}
              {index < menuItems.length - 1 && (
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0.5 h-6 bg-gray-700"></div>
              )}

              {/* Числовые индикаторы для некоторых пунктов */}
              {(item.path === '/messages' || item.path === '/favorites') && (
                <div className="absolute -top-2 -right-2 bg-orange-600 text-black font-black text-xs px-2 py-1 border border-black min-w-6 text-center">
                  {item.path === '/messages' ? '3' : '12'}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Нижняя декоративная линия */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-600 via-white to-orange-600 opacity-50"></div>
      
      {/* Дополнительные геометрические элементы */}
      <div className="absolute -bottom-2 left-4 w-4 h-1 bg-orange-600"></div>
      <div className="absolute -bottom-2 right-8 w-2 h-2 bg-white rotate-45"></div>
    </nav>
  );
};

export default Navigation;