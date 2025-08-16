import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      {/* Контейнер поиска */}
      <div className={`
        flex w-full border-4 transition-all duration-300 overflow-hidden
        ${isFocused 
          ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
          : 'border-gray-700 group-hover:border-gray-600'
        }
      `}>
        {/* Поле ввода */}
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="ПОИСК АВТОМОБИЛЕЙ..."
            className={`
              w-full px-4 py-3 bg-gray-900 text-white font-bold placeholder-gray-500 
              focus:outline-none transition-all duration-300 uppercase tracking-wider text-sm
              ${isFocused ? 'bg-black' : 'group-hover:bg-gray-800'}
            `}
          />
          
          {/* Декоративные элементы поля */}
          <div className={`
            absolute top-2 left-2 w-2 h-2 transition-colors duration-300
            ${isFocused ? 'bg-orange-500' : 'bg-gray-700'}
          `}></div>
          
          {/* Индикатор активности */}
          <div className={`
            absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-300
            ${isFocused ? 'w-full' : 'w-0'}
          `}></div>
        </div>

        {/* Кнопка поиска */}
        <button
          type="submit"
          className={`
            group/btn relative px-6 py-3 bg-orange-600 hover:bg-white text-black font-black 
            uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105
            ${query.trim() ? 'shadow-lg shadow-orange-500/30' : ''}
          `}
        >
          {/* Основной контент кнопки */}
          <span className="relative flex items-center group-hover/btn:text-black">
            <span className="mr-2"><SearchIcon size={18} /></span>
            НАЙТИ
          </span>

          {/* Декоративные элементы кнопки */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-black group-hover/btn:bg-orange-600 transition-colors"></div>
          <div className="absolute bottom-1 left-1 w-3 h-0.5 bg-black group-hover/btn:bg-orange-600 transition-colors"></div>

          {/* Hover эффекты */}
          <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <div className="absolute top-0 left-0 w-0 h-0 border-r-4 border-r-transparent border-b-4 border-b-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-0 h-0 border-l-4 border-l-transparent border-t-4 border-t-black"></div>
          </div>

          {/* Пульсация при наличии текста */}
          {query.trim() && (
            <div className="absolute inset-0 bg-orange-400 animate-ping opacity-20"></div>
          )}
        </button>
      </div>

      {/* Дополнительные декоративные элементы */}
      <div className={`
        absolute -top-1 left-4 w-8 h-0.5 bg-orange-600 transition-all duration-300
        ${isFocused ? 'w-16' : 'w-8'}
      `}></div>
      
      <div className="absolute -bottom-1 right-8 w-4 h-0.5 bg-white opacity-50"></div>

      {/* Геометрические элементы по углам */}
      <div className={`
        absolute -top-2 -left-2 w-3 h-3 border-l-2 border-t-2 transition-colors duration-300
        ${isFocused ? 'border-orange-500' : 'border-gray-700'}
      `}></div>
      
      <div className={`
        absolute -bottom-2 -right-2 w-3 h-3 border-r-2 border-b-2 transition-colors duration-300
        ${isFocused ? 'border-orange-500' : 'border-gray-700'}
      `}></div>

      {/* Фоновые элементы для глубины */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-50 blur-sm"></div>
    </form>
  );
};

export default SearchBar;