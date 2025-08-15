import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  console.log(user)
  const navigate = useNavigate();

  return (
    <header className="relative bg-black border-b-4 border-orange-600 px-4 py-4 overflow-hidden">
      {/* Геометрические элементы фона */}
      <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
      <div className="absolute top-2 right-10 w-4 h-4 bg-orange-600 rotate-45"></div>
      <div className="absolute bottom-2 left-20 w-3 h-3 bg-white"></div>
      <div className="absolute top-0 left-1/4 w-px h-full bg-gray-800 opacity-50"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gray-800 opacity-50"></div>

      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto">
        {/* Левая секция - Лого и навигация */}
        <div className="flex items-center gap-8">
          {/* Брутальный логотип */}
          <Link 
            to="/" 
            className="group relative no-underline"
          >
            <div className="bg-orange-600 px-6 py-3 border-4 border-black hover:bg-white transition-colors duration-300">
              <div className="absolute top-1 right-1 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
              <div className="text-2xl font-black text-black uppercase tracking-wider group-hover:text-black">
                BUHONIN
                <span className="block text-sm leading-none">MOTORS</span>
              </div>
            </div>
          </Link>
          
          {/* Навигационное меню */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              to="/search" 
              className="group relative text-white hover:text-orange-500 no-underline font-black uppercase tracking-wider text-sm transition-colors duration-300"
            >
              <span className="relative">
                ПОИСК
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
              </span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/my-listings" 
                  className="group relative text-white hover:text-orange-500 no-underline font-black uppercase tracking-wider text-sm transition-colors duration-300"
                >
                  <span className="relative">
                    МОИ АВТО
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                  </span>
                </Link>
                <Link 
                  to="/messages" 
                  className="group relative text-white hover:text-orange-500 no-underline font-black uppercase tracking-wider text-sm transition-colors duration-300"
                >
                  <span className="relative">
                    СООБЩЕНИЯ
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                  </span>
                </Link>
                <Link 
                  to="/favorites" 
                  className="group relative text-white hover:text-orange-500 no-underline font-black uppercase tracking-wider text-sm transition-colors duration-300"
                >
                  <span className="relative">
                    ИЗБРАННОЕ
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                  </span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Центральная секция - Поисковая строка */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Правая секция - Действия пользователя */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Кнопка "Подать объявление" */}
              <button 
                onClick={() => navigate('/create-listing')}
                className="group relative bg-orange-600 hover:bg-white text-black font-black px-6 py-3 uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 border-2 border-black group-hover:border-orange-600 transition-colors"></div>
                <span className="relative group-hover:text-black flex items-center">
                  <span className="mr-2">+</span>
                  ПОДАТЬ ОБЪЯВЛЕНИЕ
                </span>
                {/* Декоративные элементы */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
              </button>
              
              {/* Меню пользователя */}
              <UserMenu user={user} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Кнопка "Войти" */}
              <Link 
                to="/login" 
                className="group relative bg-gray-900 hover:bg-orange-600 text-white hover:text-black border-2 border-orange-600 px-4 py-2 no-underline font-black uppercase tracking-wider text-sm transition-all duration-300"
              >
                <span className="relative">ВОЙТИ</span>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-600 group-hover:bg-black transition-colors"></div>
              </Link>
              
              {/* Кнопка "Регистрация" */}
              <Link 
                to="/register"
                className="group relative bg-orange-600 hover:bg-white text-black border-2 border-black px-4 py-2 no-underline font-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative group-hover:text-black">РЕГИСТРАЦИЯ</span>
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
              </Link>
            </div>
          )}

          {/* Мобильное меню (кнопка) */}
          <button className="lg:hidden bg-gray-900 border-2 border-orange-600 p-2 text-white hover:bg-orange-600 hover:text-black transition-colors duration-300">
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
              <div className="w-full h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Дополнительные декоративные элементы */}
      <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-12 h-0.5 bg-orange-600"></div>
    </header>
  );
};

export default Header;