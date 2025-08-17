// src/pages/Profile/StatisticsPage.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Eye, MessageCircle, Heart, ShoppingBag, TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';
import api from '../../services/api';

const StatisticsPage = () => {
  const [period, setPeriod] = useState('month'); // week, month, year

  const { data: stats, isLoading } = useQuery(
    ['user-detailed-stats', period],
    () => api.get(`/api/users/stats?period=${period}`)
  );

  const getPeriodText = (period) => {
    const periods = {
      week: 'НЕДЕЛЮ',
      month: 'МЕСЯЦ', 
      year: 'ГОД'
    };
    return periods[period] || period.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-xl mt-4 uppercase tracking-wider">
            ЗАГРУЖАЕМ СТАТИСТИКУ...
          </p>
        </div>
      </div>
    );
  }

  const statistics = stats?.data || {};

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border-4 border-orange-500 rotate-45"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-orange-600 rotate-12"></div>
        </div>
        
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-wider">
              <span className="text-white">СТАТИСТИКА</span>
            </h1>
            <p className="text-xl font-bold text-gray-300 uppercase">
              АНАЛИЗИРУЙТЕ ЭФФЕКТИВНОСТЬ ВАШИХ ОБЪЯВЛЕНИЙ
            </p>
          </div>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-black p-6 border-4 border-orange-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                ПЕРИОД АНАЛИЗА:
              </h2>
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-gray-900 text-white font-bold px-6 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider text-lg"
              >
                <option value="week">НЕДЕЛЯ</option>
                <option value="month">МЕСЯЦ</option>
                <option value="year">ГОД</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Views */}
            <div className="group bg-gray-900 hover:bg-gray-800 border-4 border-blue-600 p-6 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Eye size={32} className="text-blue-500" />
                <div className="w-8 h-8 border-4 border-blue-600 rotate-45"></div>
              </div>
              <div className="text-4xl font-black text-blue-500 mb-2">
                {statistics.total_views?.toLocaleString() || 0}
              </div>
              <div className="text-white font-black uppercase tracking-wider">
                ПРОСМОТРЫ
              </div>
              <div className="text-gray-400 font-bold text-sm uppercase mt-2">
                ЗА {getPeriodText(period)}
              </div>
            </div>

            {/* Messages */}
            <div className="group bg-gray-900 hover:bg-gray-800 border-4 border-green-600 p-6 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <MessageCircle size={32} className="text-green-500" />
                <div className="w-8 h-8 border-4 border-green-600 rotate-45"></div>
              </div>
              <div className="text-4xl font-black text-green-500 mb-2">
                {statistics.messages_received?.toLocaleString() || 0}
              </div>
              <div className="text-white font-black uppercase tracking-wider">
                СООБЩЕНИЯ
              </div>
              <div className="text-gray-400 font-bold text-sm uppercase mt-2">
                ПОЛУЧЕНО ЗА ПЕРИОД
              </div>
            </div>

            {/* Favorites */}
            <div className="group bg-gray-900 hover:bg-gray-800 border-4 border-yellow-600 p-6 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Heart size={32} className="text-yellow-500" />
                <div className="w-8 h-8 border-4 border-yellow-600 rotate-45"></div>
              </div>
              <div className="text-4xl font-black text-yellow-500 mb-2">
                {statistics.favorites_added?.toLocaleString() || 0}
              </div>
              <div className="text-white font-black uppercase tracking-wider">
                В ИЗБРАННОМ
              </div>
              <div className="text-gray-400 font-bold text-sm uppercase mt-2">
                ДОБАВЛЕНИЙ ЗА ПЕРИОД
              </div>
            </div>

            {/* Sales */}
            <div className="group bg-gray-900 hover:bg-gray-800 border-4 border-red-600 p-6 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag size={32} className="text-red-500" />
                <div className="w-8 h-8 border-4 border-red-600 rotate-45"></div>
              </div>
              <div className="text-4xl font-black text-red-500 mb-2">
                {statistics.listings_sold?.toLocaleString() || 0}
              </div>
              <div className="text-white font-black uppercase tracking-wider">
                ПРОДАЖИ
              </div>
              <div className="text-gray-400 font-bold text-sm uppercase mt-2">
                ПРОДАННЫХ ОБЪЯВЛЕНИЙ
              </div>
            </div>
          </div>

          {/* Popular Listings */}
          {statistics.popular_listings && statistics.popular_listings.length > 0 && (
            <div className="mb-12">
              <div className="bg-gray-900 border-4 border-orange-600 p-8">
                <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-4">
                  <TrendingUp size={32} className="text-orange-500" />
                  ПОПУЛЯРНЫЕ ОБЪЯВЛЕНИЯ
                </h3>
                
                <div className="space-y-4">
                  {statistics.popular_listings.map((listing, index) => (
                    <div 
                      key={listing.listing_id} 
                      className="bg-black border-4 border-gray-600 hover:border-orange-600 p-6 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="bg-orange-600 text-black font-black px-3 py-1 text-sm">
                              #{index + 1}
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-wide">
                              {listing.title}
                            </h4>
                          </div>
                          <p className="text-orange-500 font-bold text-lg">
                            {listing.price?.toLocaleString()} {listing.currency_code}
                          </p>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                          <div className="text-center">
                            <div className="text-2xl font-black text-blue-500">
                              {listing.view_count}
                            </div>
                            <div className="text-gray-400 font-bold text-sm uppercase">
                              ПРОСМОТРОВ
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-black text-yellow-500">
                              {listing.favorite_count}
                            </div>
                            <div className="text-gray-400 font-bold text-sm uppercase">
                              В ИЗБРАННОМ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chart Placeholder */}
          <div className="bg-gray-900 border-4 border-orange-600 p-8">
            <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-4">
              <BarChart3 size={32} className="text-orange-500" />
              ГРАФИК ПРОСМОТРОВ
            </h3>
            
            <div className="bg-black border-4 border-gray-600 p-12 text-center">
              <PieChart size={64} className="text-orange-500 mx-auto mb-6" />
              <h4 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
                ГРАФИКИ И АНАЛИТИКА
              </h4>
              <p className="text-gray-400 font-bold uppercase tracking-wide">
                ДЕТАЛЬНАЯ АНАЛИТИКА БУДЕТ ДОСТУПНА
                <br />
                В СЛЕДУЮЩЕЙ ВЕРСИИ ПЛАТФОРМЫ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-orange-600 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-black mb-8 uppercase tracking-wider">
            ХОТИТЕ БОЛЬШЕ СТАТИСТИКИ?
          </h2>
          <p className="text-xl font-bold text-black mb-8 uppercase">
            ПРОДВИГАЙТЕ ОБЪЯВЛЕНИЯ ДЛЯ ДЕТАЛЬНОЙ АНАЛИТИКИ
          </p>
          
          <button className="group relative bg-black hover:bg-gray-900 text-white font-black px-12 py-6 text-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105">
            <div className="absolute inset-0 border-4 border-black group-hover:border-white transition-colors"></div>
            <span className="relative flex items-center gap-3">
              <TrendingUp size={24} />
              КУПИТЬ ПРОДВИЖЕНИЕ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;