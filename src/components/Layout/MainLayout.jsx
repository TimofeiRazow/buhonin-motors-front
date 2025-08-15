import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Фоновые геометрические элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Основные декоративные линии */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gray-900 opacity-30"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-gray-800 opacity-40"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gray-900 opacity-30"></div>
        
        {/* Горизонтальные акценты */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-20"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></div>
        
        {/* Геометрические фигуры */}
        <div className="absolute top-20 right-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-30"></div>
        <div className="absolute top-1/3 left-10 w-4 h-4 bg-orange-600 rotate-12 opacity-40"></div>
        <div className="absolute bottom-1/3 right-20 w-6 h-6 border border-white rotate-45 opacity-20"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-white opacity-30"></div>
        
        {/* Дополнительные мелкие элементы */}
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-orange-600 opacity-50"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-8 bg-gray-700 opacity-40"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-12 bg-orange-600 opacity-30"></div>
      </div>

      {/* Хедер */}
      <Header />

      {/* Основной контент */}
      <main className="flex-1 relative z-10">
        {/* Контейнер контента с декоративными элементами */}
        <div className="relative">
          {/* Декоративные акценты для контентной области */}
          <div className="absolute top-0 left-0 w-8 h-1 bg-orange-600 opacity-60"></div>
          <div className="absolute top-0 right-0 w-12 h-1 bg-white opacity-40"></div>
          <div className="absolute bottom-0 left-1/4 w-6 h-1 bg-orange-600 opacity-50"></div>
          <div className="absolute bottom-0 right-1/3 w-4 h-1 bg-white opacity-30"></div>
          
          {/* Контент с отступами */}
          <div className="px-4 py-8 md:px-6 lg:px-8 min-h-96">
            {/* Дополнительный контейнер для лучшего контроля */}
            <div className="relative max-w-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Футер */}
      <Footer />

      {/* Дополнительные декоративные элементы поверх всего */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 via-transparent to-orange-600 opacity-20 pointer-events-none z-20"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-30 pointer-events-none z-20"></div>
      
      {/* Боковые акценты */}
      <div className="fixed top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-600 via-transparent to-orange-600 opacity-15 pointer-events-none z-20"></div>
      <div className="fixed top-0 right-0 w-1 h-full bg-gradient-to-b from-orange-600 via-transparent to-orange-600 opacity-15 pointer-events-none z-20"></div>
      
      {/* Угловые элементы */}
      <div className="fixed top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-orange-600 opacity-40 pointer-events-none z-20"></div>
      <div className="fixed top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-orange-600 opacity-40 pointer-events-none z-20"></div>
      <div className="fixed bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-orange-600 opacity-40 pointer-events-none z-20"></div>
      <div className="fixed bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-orange-600 opacity-40 pointer-events-none z-20"></div>
    </div>
  );
};

export default MainLayout;