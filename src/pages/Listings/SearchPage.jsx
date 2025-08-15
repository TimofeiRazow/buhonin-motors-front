// src/pages/Listings/SearchPage.jsx (завершенная версия)
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import SearchFilters from '../../components/Listings/SearchFilters';
import ListingGrid from '../../components/Listings/ListingGrid';
import Pagination from '../../components/Common/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date_desc');

  // Извлекаем фильтры из URL
  const filters = {
    q: searchParams.get('q') || '',
    brand_id: searchParams.get('brand_id') || '',
    model_id: searchParams.get('model_id') || '',
    city_id: searchParams.get('city_id') || '',
    price_from: searchParams.get('price_from') || '',
    price_to: searchParams.get('price_to') || '',
    year_from: searchParams.get('year_from') || '',
    year_to: searchParams.get('year_to') || '',
    mileage_to: searchParams.get('mileage_to') || '',
    body_type_id: searchParams.get('body_type_id') || '',
    engine_type_id: searchParams.get('engine_type_id') || '',
    transmission_id: searchParams.get('transmission_id') || '',
    drive_type_id: searchParams.get('drive_type_id') || '',
    color_id: searchParams.get('color_id') || '',
    featured: searchParams.get('featured') || '',
    urgent: searchParams.get('urgent') || '',
    page: currentPage,
    limit: 20,
    sort: sortBy
  };

  // Загружаем объявления
  const { data: listings, isLoading, error } = useQuery(
    ['listings', filters],
    () => api.get('/api/listings/', { params: filters }),
    { 
      keepPreviousData: true,
      retry: 1
    }
  );

  // Обновляем страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const updatedParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== 'page' && key !== 'limit' && key !== 'sort') {
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const listingsData = listings?.data?.listings || [];
  const totalPages = Math.ceil((listings?.data?.total || 0) / 20);
  const totalCount = listings?.data?.total || 0;

  return (
    <div className="flex gap-6 min-h-screen relative">
      {/* Фоновые декоративные элементы */}
      <div className="fixed top-20 right-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-20 pointer-events-none"></div>
      <div className="fixed top-1/3 left-10 w-4 h-4 bg-orange-600 rotate-12 opacity-30 pointer-events-none"></div>
      
      {/* Фильтры */}
      <div className="w-80 flex-shrink-0 sticky top-6 h-fit">
        <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-orange-600 rotate-45"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6">
              ФИЛЬТРЫ
              <span className="block text-orange-500 text-lg">ПОИСКА</span>
            </h2>
            <div className="w-12 h-1 bg-orange-600 mb-6"></div>
            
            <SearchFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Результаты поиска */}
      <div className="flex-1">
        {/* Заголовок и сортировка */}
        <div className="bg-black border-4 border-orange-600 p-6 mb-6 relative overflow-hidden">
          {/* Декоративные элементы заголовка */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
          <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                {filters.q ? (
                  <>
                    ПОИСК:
                    <span className="block text-orange-500 text-2xl">"{filters.q}"</span>
                  </>
                ) : (
                  <>
                    ВСЕ
                    <span className="text-orange-500"> ОБЪЯВЛЕНИЯ</span>
                  </>
                )}
              </h1>
              {totalCount > 0 && (
                <p className="text-orange-300 font-bold uppercase tracking-wide text-sm">
                  НАЙДЕНО {totalCount.toLocaleString()} ОБЪЯВЛЕНИЙ
                </p>
              )}
            </div>

            {totalCount > 0 && (
              <div className="flex items-center gap-4">
                <label className="text-orange-100 font-black uppercase tracking-wider text-sm">
                  СОРТИРОВКА:
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-900 text-orange-100 font-bold border-2 border-gray-700 focus:border-orange-500 p-3 focus:outline-none appearance-none cursor-pointer uppercase tracking-wide text-sm"
                  >
                    <option value="date_desc">ПО ДАТЕ (НОВЫЕ)</option>
                    <option value="date_asc">ПО ДАТЕ (СТАРЫЕ)</option>
                    <option value="price_asc">ПО ЦЕНЕ (ДЕШЕВЫЕ)</option>
                    <option value="price_desc">ПО ЦЕНЕ (ДОРОГИЕ)</option>
                    <option value="mileage_asc">ПО ПРОБЕГУ (МЕНЬШЕ)</option>
                    <option value="mileage_desc">ПО ПРОБЕГУ (БОЛЬШЕ)</option>
                    <option value="year_desc">ПО ГОДУ (НОВЫЕ)</option>
                    <option value="year_asc">ПО ГОДУ (СТАРЫЕ)</option>
                    <option value="views_desc">ПО ПОПУЛЯРНОСТИ</option>
                  </select>
                  {/* Кастомная стрелка */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
                  </div>
                  <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Быстрые фильтры */}
        {totalCount > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            <button
              onClick={() => handleFilterChange({ ...filters, featured: filters.featured ? '' : 'true' })}
              className={`group relative px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                filters.featured 
                  ? 'bg-orange-600 border-black text-black' 
                  : 'bg-gray-900 border-orange-600 text-orange-100 hover:bg-orange-600 hover:text-black'
              }`}
            >
              <span className="relative flex items-center">
                ⭐ РЕКОМЕНДУЕМЫЕ
              </span>
              <div className={`absolute top-1 right-1 w-2 h-2 transition-colors ${
                filters.featured ? 'bg-black' : 'bg-orange-600 group-hover:bg-black'
              }`}></div>
            </button>
            
            <button
              onClick={() => handleFilterChange({ ...filters, urgent: filters.urgent ? '' : 'true' })}
              className={`group relative px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                filters.urgent 
                  ? 'bg-red-600 border-black text-white' 
                  : 'bg-gray-900 border-red-600 text-red-400 hover:bg-red-600 hover:text-white'
              }`}
            >
              <span className="relative flex items-center">
                🔥 СРОЧНО
              </span>
              <div className={`absolute top-1 right-1 w-2 h-2 transition-colors ${
                filters.urgent ? 'bg-black' : 'bg-red-600 group-hover:bg-black'
              }`}></div>
            </button>

            <button
              onClick={() => handleFilterChange({ ...filters, price_to: filters.price_to ? '' : '2000000' })}
              className={`group relative px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                filters.price_to === '2000000' 
                  ? 'bg-green-600 border-black text-white' 
                  : 'bg-gray-900 border-green-600 text-green-400 hover:bg-green-600 hover:text-white'
              }`}
            >
              <span className="relative flex items-center">
                💰 ДО 2 МЛН
              </span>
              <div className={`absolute top-1 right-1 w-2 h-2 transition-colors ${
                filters.price_to === '2000000' ? 'bg-black' : 'bg-green-600 group-hover:bg-black'
              }`}></div>
            </button>

            <button
              onClick={() => handleFilterChange({ ...filters, year_from: filters.year_from ? '' : '2015' })}
              className={`group relative px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all duration-300 transform hover:scale-105 ${
                filters.year_from === '2015' 
                  ? 'bg-blue-600 border-black text-white' 
                  : 'bg-gray-900 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white'
              }`}
            >
              <span className="relative flex items-center">
                🚗 ОТ 2015 ГОДА
              </span>
              <div className={`absolute top-1 right-1 w-2 h-2 transition-colors ${
                filters.year_from === '2015' ? 'bg-black' : 'bg-blue-600 group-hover:bg-black'
              }`}></div>
            </button>
          </div>
        )}

        {/* Загрузка */}
        {isLoading && (
          <div className="bg-black border-4 border-orange-600 p-16 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <p className="text-orange-100 font-black uppercase tracking-wider text-lg">
              ЗАГРУЖАЕМ ОБЪЯВЛЕНИЯ...
            </p>
            <LoadingSpinner />
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-600 border-4 border-black p-8 text-center relative">
            <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
            <div className="absolute bottom-2 right-2 w-6 h-1 bg-black"></div>
            
            <div className="text-5xl mb-4">💥</div>
            <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
              ОШИБКА ЗАГРУЗКИ
            </h3>
            <p className="text-white font-bold mb-6">
              НЕ УДАЛОСЬ ЗАГРУЗИТЬ ОБЪЯВЛЕНИЯ. ПОПРОБУЙТЕ ОБНОВИТЬ СТРАНИЦУ.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="group relative bg-black hover:bg-white text-red-600 hover:text-black font-black px-8 py-4 border-2 border-red-600 hover:border-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🔄 ОБНОВИТЬ</span>
              <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 group-hover:bg-black transition-colors"></div>
            </button>
          </div>
        )}

        {/* Нет результатов */}
        {!isLoading && !error && totalCount === 0 && (
          <div className="bg-black border-4 border-orange-600 p-12 text-center relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>
            
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
              ОБЪЯВЛЕНИЯ
              <span className="block text-orange-500">НЕ НАЙДЕНЫ</span>
            </h3>
            <p className="text-orange-300 font-bold uppercase tracking-wide text-sm mb-8">
              ПОПРОБУЙТЕ ИЗМЕНИТЬ ПАРАМЕТРЫ ПОИСКА<br />
              ИЛИ РАСШИРИТЬ КРИТЕРИИ ФИЛЬТРАЦИИ
            </p>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setCurrentPage(1);
                }}
                className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 border-2 border-black hover:border-orange-600 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">🗑️ СБРОСИТЬ ФИЛЬТРЫ</span>
                <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
              </button>
              
              <button
                onClick={() => window.location.href = '/create-listing'}
                className="group relative bg-gray-900 hover:bg-orange-600 text-orange-100 hover:text-black font-black px-8 py-4 border-2 border-orange-600 hover:border-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">➕ ПОДАТЬ ОБЪЯВЛЕНИЕ</span>
                <div className="absolute top-1 right-1 w-3 h-3 bg-orange-600 group-hover:bg-black transition-colors"></div>
              </button>
            </div>
          </div>
        )}

        {/* Список объявлений */}
        {!isLoading && !error && totalCount > 0 && (
          <>
            <ListingGrid listings={listingsData} />
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Информация о результатах */}
            <div className="mt-6 bg-gray-900 border-2 border-orange-600 p-4 text-center relative">
              <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
              <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white"></div>
              <p className="text-orange-200 font-bold uppercase tracking-wide text-sm">
                ПОКАЗАНО {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} ИЗ {totalCount.toLocaleString()} ОБЪЯВЛЕНИЙ
              </p>
            </div>
          </>
        )}

        {/* Советы по поиску */}
        {!isLoading && totalCount > 0 && totalCount < 5 && (
          <div className="mt-8 bg-blue-900 border-4 border-blue-600 p-6 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
            
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center">
              💡 СОВЕТЫ ДЛЯ ЛУЧШЕГО ПОИСКА
            </h4>
            <ul className="text-blue-200 font-bold space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                ПОПРОБУЙТЕ РАСШИРИТЬ ДИАПАЗОН ЦЕН
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                УБЕРИТЕ НЕКОТОРЫЕ ФИЛЬТРЫ
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                РАССМОТРИТЕ ДРУГИЕ ГОРОДА
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                ПОПРОБУЙТЕ ПОХОЖИЕ МАРКИ ИЛИ МОДЕЛИ
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;