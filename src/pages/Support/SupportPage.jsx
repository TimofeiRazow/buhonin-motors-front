// src/pages/Support/SupportPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';

const SupportPage = () => {
  const { data: tickets } = useQuery('support-tickets', () => api.get('/api/support/tickets'));
  const { data: categories } = useQuery('support-categories', () => api.get('/api/support/categories'));

  const openTickets = tickets?.data?.filter(ticket => ticket.status !== 'closed') || [];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-600">
        {/* Фоновые элементы */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-orange-500 rotate-45"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-600 rotate-12"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border-4 border-white rotate-45"></div>
        </div>
        
        <div className="relative z-10 px-4 py-20 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">
            <span className="text-white">ЦЕНТР</span>
            <br />
            <span className="text-orange-500 drop-shadow-2xl">ПОДДЕРЖКИ</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-300 mb-8 max-w-2xl mx-auto uppercase">
            РЕШАЕМ ПРОБЛЕМЫ
            <br />
            <span className="text-orange-400">БЕЗ ЛИШНИХ СЛОВ</span>
          </p>
        </div>
        
        {/* Геометрические акценты */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Quick Actions - Брутальные карточки */}
      <div className="px-4 py-16 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/support/create-ticket"
            className="group relative bg-orange-600 hover:bg-orange-500 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative p-8 border-4 border-black">
              <div className="absolute top-2 right-2 w-4 h-4 bg-black"></div>
              <h3 className="text-2xl font-black mb-4 text-black uppercase tracking-wider">
                СОЗДАТЬ
                <br />
                ОБРАЩЕНИЕ
              </h3>
              <p className="text-black font-bold text-lg">
                НЕ НАШЛИ ОТВЕТ?
                <br />
                <span className="text-sm">СОЗДАЙТЕ ТИКЕТ</span>
              </p>
              <div className="absolute bottom-2 left-2 w-8 h-1 bg-black"></div>
            </div>
          </Link>
          
          <Link
            to="/support/tickets"
            className="group relative bg-white hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative p-8 border-4 border-black">
              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-600"></div>
              <h3 className="text-2xl font-black mb-4 text-black uppercase tracking-wider">
                МОИ
                <br />
                ОБРАЩЕНИЯ
              </h3>
              <p className="text-black font-bold text-lg">
                АКТИВНЫХ: {openTickets.length}
                <br />
                <span className="text-sm">СМОТРЕТЬ ВСЕ</span>
              </p>
              <div className="absolute bottom-2 left-2 w-8 h-1 bg-orange-600"></div>
            </div>
          </Link>
          
          <Link
            to="/support/faq"
            className="group relative bg-gray-900 hover:bg-gray-800 transform hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            <div className="absolute inset-0 bg-orange-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative p-8 border-4 border-orange-600">
              <div className="absolute top-2 right-2 w-4 h-4 bg-orange-600"></div>
              <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-wider">
                FAQ
              </h3>
              <p className="text-white font-bold text-lg">
                ЧАСТЫЕ ВОПРОСЫ
                <br />
                <span className="text-sm text-orange-400">И ОТВЕТЫ</span>
              </p>
              <div className="absolute bottom-2 left-2 w-8 h-1 bg-white"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 uppercase tracking-wider">
            <span className="text-white">КАТЕГОРИИ</span>
            <span className="text-orange-500"> ПОДДЕРЖКИ</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.data?.map((category) => (
              <div 
                key={category.category_id} 
                className="group relative bg-black hover:bg-gray-800 p-6 border-4 border-orange-600 transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-600"></div>
                <h4 className="text-xl font-black text-white mb-3 uppercase tracking-wide">
                  {category.category_name}
                </h4>
                {category.description && (
                  <p className="text-gray-300 font-bold text-sm uppercase">
                    {category.description}
                  </p>
                )}
                <div className="absolute bottom-2 left-2 w-6 h-1 bg-orange-600"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section - Брутальная секция */}
      <div className="relative bg-orange-600 py-20">
        {/* Геометрические элементы */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-black"></div>
          <div className="grid grid-cols-8 h-full">
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div className="border-r border-black opacity-30"></div>
            <div></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-black uppercase tracking-wider">
            КОНТАКТЫ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-black p-8 mb-4 transform group-hover:scale-110 transition-transform duration-300 border-4 border-black">
                <h3 className="text-2xl font-black text-orange-500 mb-4 uppercase tracking-wider">
                  ТЕЛЕФОН
                </h3>
                <div className="w-full h-1 bg-orange-500 mb-4"></div>
                <p className="text-white font-black text-xl mb-2">
                  +7 (777) 123-45-67
                </p>
                <p className="text-gray-300 font-bold text-sm uppercase">
                  ЕЖЕДНЕВНО
                  <br />
                  9:00 - 21:00
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-black p-8 mb-4 transform group-hover:scale-110 transition-transform duration-300 border-4 border-black">
                <h3 className="text-2xl font-black text-orange-500 mb-4 uppercase tracking-wider">
                  EMAIL
                </h3>
                <div className="w-full h-1 bg-orange-500 mb-4"></div>
                <p className="text-white font-black text-xl mb-2">
                  support@kolesa.kz
                </p>
                <p className="text-gray-300 font-bold text-sm uppercase">
                  ОТВЕТ В ТЕЧЕНИЕ
                  <br />
                  24 ЧАСОВ
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-black p-8 mb-4 transform group-hover:scale-110 transition-transform duration-300 border-4 border-black">
                <h3 className="text-2xl font-black text-orange-500 mb-4 uppercase tracking-wider">
                  ЧАТ
                </h3>
                <div className="w-full h-1 bg-orange-500 mb-4"></div>
                <p className="text-white font-black text-xl mb-2">
                  ОНЛАЙН-ЧАТ
                </p>
                <p className="text-gray-300 font-bold text-sm uppercase">
                  В РАБОЧЕЕ
                  <br />
                  ВРЕМЯ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-black py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-wider">
            <span className="text-white">СРОЧНАЯ</span>
            <span className="text-orange-500"> ПОМОЩЬ?</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-bold mb-12 uppercase">
            СВЯЗЫВАЙТЕСЬ ПРЯМО СЕЙЧАС
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href="tel:+77771234567"
              className="group relative bg-orange-600 hover:bg-white text-black font-black px-12 py-6 text-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
              <span className="relative group-hover:text-black">ПОЗВОНИТЬ</span>
            </a>
            
            <Link
              to="/support/create-ticket"
              className="group relative bg-white hover:bg-orange-600 text-black hover:text-white font-black px-12 py-6 text-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 border-4 border-black transition-colors"></div>
              <span className="relative">СОЗДАТЬ ТИКЕТ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;