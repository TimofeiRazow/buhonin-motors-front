import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';
import {
  User,
  Car,
  Heart,
  MessageCircle,
  Settings,
  CarFront,
  Truck,
  Wrench,
  Hammer,
  Phone,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Оверлей */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Сайдбар */}
      <div className="fixed top-0 left-0 w-80 h-full bg-black border-r-4 border-orange-600 z-50 overflow-y-auto">
        {/* Геометрические элементы фона */}
        <div className="absolute top-0 right-0 w-2 h-full bg-orange-600"></div>
        <div className="absolute top-10 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        <div className="absolute top-20 right-8 w-2 h-2 bg-white"></div>
        <div className="absolute bottom-20 right-6 w-3 h-3 border-2 border-orange-600 rotate-45"></div>

        <div className="relative z-10 p-6">
          {/* Кнопка закрытия */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-orange-600 hover:bg-white text-black border-2 border-black hover:border-orange-600 font-black text-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            ×
          </button>

          {/* Заголовок */}
          <div className="mb-8 pt-4">
            <h3 className="text-3xl font-black text-white uppercase tracking-wider relative">
              МЕНЮ
              <div className="absolute -bottom-2 left-0 w-16 h-1 bg-orange-600"></div>
              <div className="absolute top-1 right-12 w-2 h-2 bg-orange-600"></div>
            </h3>
          </div>

          {/* Секция пользователя */}
          {isAuthenticated ? (
            <div className="mb-8 p-4 bg-gray-900 border-2 border-orange-600 relative">
              {/* Декоративные элементы */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
              <div className="absolute bottom-2 right-2 w-3 h-0.5 bg-white"></div>
              
              <p className="text-orange-500 font-black uppercase tracking-wider text-sm mb-4">
                ПРИВЕТ, {user?.first_name?.toUpperCase() || 'ПОЛЬЗОВАТЕЛЬ'}!
              </p>
              
              <ul className="space-y-3">
                <li className="group">
                  <Link 
                    to="/profile" 
                    onClick={onClose}
                    className="flex items-center text-white hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                    <User size={16} className="mr-2" /> МОЙ ПРОФИЛЬ
                  </Link>
                </li>
                <li className="group">
                  <Link 
                    to="/my-listings" 
                    onClick={onClose}
                    className="flex items-center text-white hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                    <Car size={16} className="mr-2" /> МОИ ОБЪЯВЛЕНИЯ
                  </Link>
                </li>
                <li className="group">
                  <Link 
                    to="/favorites" 
                    onClick={onClose}
                    className="flex items-center text-white hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                    <Heart size={16} className="mr-2" /> ИЗБРАННОЕ
                  </Link>
                </li>
                <li className="group">
                  <Link 
                    to="/messages" 
                    onClick={onClose}
                    className="flex items-center text-white hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                    <MessageCircle size={16} className="mr-2" /> СООБЩЕНИЯ
                  </Link>
                </li>
                <li className="group">
                  <Link 
                    to="/settings" 
                    onClick={onClose}
                    className="flex items-center text-white hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                  >
                    <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                    <Settings size={16} className="mr-2" /> НАСТРОЙКИ
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-orange-600 border-2 border-black relative">
              {/* Декоративные элементы */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-black"></div>
              <div className="absolute bottom-2 right-2 w-3 h-0.5 bg-black"></div>
              
              <div className="space-y-4">
                <Link 
                  to="/login" 
                  onClick={onClose}
                  className="block bg-black hover:bg-white text-orange-500 hover:text-black px-4 py-3 no-underline font-black uppercase tracking-wider text-sm text-center transition-all duration-300 transform hover:scale-105"
                >
                  ВОЙТИ
                </Link>
                <Link 
                  to="/register" 
                  onClick={onClose}
                  className="block bg-white hover:bg-black text-black hover:text-orange-500 px-4 py-3 no-underline font-black uppercase tracking-wider text-sm text-center border-2 border-black transition-all duration-300 transform hover:scale-105"
                >
                  РЕГИСТРАЦИЯ
                </Link>
              </div>
            </div>
          )}

          {/* Разделитель */}
          <div className="relative mb-8">
            <div className="h-px bg-gray-800"></div>
            <div className="absolute top-0 left-1/4 w-8 h-px bg-orange-600"></div>
            <div className="absolute top-0 right-1/4 w-12 h-px bg-white"></div>
          </div>

          {/* Категории */}
          <div className="mb-8">
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-4 relative">
              КАТЕГОРИИ
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600"></div>
            </h4>
            <ul className="space-y-3">
              <li className="group">
                <Link 
                  to="/search?category=cars" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <CarFront size={16} className="mr-2" /> ЛЕГКОВЫЕ АВТОМОБИЛИ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/search?category=commercial" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Truck size={16} className="mr-2" /> КОММЕРЧЕСКИЙ ТРАНСПОРТ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/search?category=parts" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Wrench size={16} className="mr-2" /> ЗАПЧАСТИ
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/search?category=services" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Hammer size={16} className="mr-2" /> УСЛУГИ
                </Link>
              </li>
            </ul>
          </div>

          {/* Разделитель */}
          <div className="relative mb-8">
            <div className="h-px bg-gray-800"></div>
            <div className="absolute top-0 left-1/3 w-6 h-px bg-orange-600"></div>
            <div className="absolute top-0 right-1/3 w-8 h-px bg-white"></div>
          </div>

          {/* Помощь */}
          <div className="mb-8">
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-4 relative">
              ПОМОЩЬ
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-orange-600"></div>
            </h4>
            <ul className="space-y-3">
              <li className="group">
                <Link 
                  to="/support" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <Phone size={16} className="mr-2" /> ПОДДЕРЖКА
                </Link>
              </li>
              <li className="group">
                <Link 
                  to="/faq" 
                  onClick={onClose}
                  className="flex items-center text-gray-400 hover:text-orange-500 no-underline font-bold uppercase tracking-wide text-sm transition-all duration-300 transform hover:translate-x-2"
                >
                  <div className="w-2 h-2 bg-orange-600 mr-3 group-hover:bg-white transition-colors"></div>
                  <HelpCircle size={16} className="mr-2" /> FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Нижняя декоративная секция */}
          <div className="mt-auto pt-8">
            <div className="bg-orange-600 p-4 border-2 border-black relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
              <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
              <p className="text-black font-black uppercase tracking-wider text-xs text-center">
                BUHONIN MOTORS
                <br />
                <span className="text-xs">ТВОЙ АВТОМОБИЛЬ ЖДЕТ</span>
              </p>
            </div>
          </div>
        </div>

        {/* Дополнительные декоративные элементы */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-white to-orange-600"></div>
      </div>
    </>
  );
};

export default Sidebar;