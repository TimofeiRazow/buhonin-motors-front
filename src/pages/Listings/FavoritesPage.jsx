// src/pages/Listings/FavoritesPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ListingGrid from '../../components/Listings/ListingGrid';
import Pagination from '../../components/Common/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { usePagination } from '../../hooks/common/usePagination';

const FavoritesPage = () => {
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const queryClient = useQueryClient();

  // Загружаем избранные объявления
  const { data: favorites, isLoading, error } = useQuery(
    ['favorites', sortBy],
    () => api.get('/api/listings/favorites', { 
      params: { 
        sort: sortBy,
        include_expired: true 
      } 
    }),
    {
      retry: 1
    }
  );

  // Удаление из избранного
  const removeFavoriteMutation = useMutation(
    (listingId) => api.post(`/api/listings/${listingId}/favorite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
      },
      onError: (error) => {
        console.error('Error removing from favorites:', error);
        alert('Ошибка при удалении из избранного');
      }
    }
  );

  // Массовое удаление
  const bulkRemoveMutation = useMutation(
    (listingIds) => Promise.all(
      listingIds.map(id => api.post(`/api/listings/${id}/favorite`))
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favorites');
        setSelectedItems(new Set());
        setBulkAction('');
      },
      onError: (error) => {
        console.error('Error bulk removing favorites:', error);
        alert('Ошибка при удалении избранных объявлений');
      }
    }
  );

  const favoritesData = favorites?.data || [];
  
  // Пагинация
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious
  } = usePagination(favoritesData, 20);

  // Группировка по статусу
  const groupedFavorites = favoritesData.reduce((acc, listing) => {
    const status = listing.status || 'active';
    if (!acc[status]) acc[status] = [];
    acc[status].push(listing);
    return acc;
  }, {});

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleRemoveFavorite = (listingId) => {
    if (window.confirm('Удалить из избранного?')) {
      removeFavoriteMutation.mutate(listingId);
    }
  };

  const handleSelectItem = (listingId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(listingId)) {
      newSelected.delete(listingId);
    } else {
      newSelected.add(listingId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedData.map(item => item.listing_id)));
    }
  };

  const handleBulkAction = () => {
    if (bulkAction === 'remove' && selectedItems.size > 0) {
      if (window.confirm(`Удалить ${selectedItems.size} объявлений из избранного?`)) {
        bulkRemoveMutation.mutate(Array.from(selectedItems));
      }
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      active: 'АКТИВНОЕ',
      sold: 'ПРОДАНО',
      expired: 'ИСТЕК СРОК',
      archived: 'В АРХИВЕ',
      rejected: 'ОТКЛОНЕНО'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-600',
      sold: 'bg-blue-600',
      expired: 'bg-yellow-600',
      archived: 'bg-gray-600',
      rejected: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 right-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-1/3 left-10 w-4 h-4 bg-orange-600 rotate-12 opacity-30"></div>

      {/* Заголовок */}
      <div className="bg-black border-4 border-orange-600 p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
        <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2 flex items-center">
              ❤️ ИЗБРАННОЕ
            </h1>
            {favoritesData.length > 0 && (
              <p className="text-orange-300 font-bold uppercase tracking-wide text-sm">
                СОХРАНЕНО {favoritesData.length} ОБЪЯВЛЕНИЙ
              </p>
            )}
          </div>

          {favoritesData.length > 0 && (
            <Link
              to="/search"
              className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 border-2 border-black hover:border-orange-600 uppercase tracking-wider no-underline transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🔍 НАЙТИ ЕЩЕ</span>
              <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
              <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
            </Link>
          )}
        </div>
      </div>

      {/* Загрузка */}
      {isLoading && (
        <div className="bg-black border-4 border-orange-600 p-16 text-center">
          <div className="text-6xl mb-6">❤️</div>
          <p className="text-orange-100 font-black uppercase tracking-wider text-xl mb-6">
            ЗАГРУЖАЕМ ИЗБРАННОЕ...
          </p>
          <LoadingSpinner />
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-600 border-4 border-black p-8 text-center relative">
          <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
          <div className="absolute bottom-2 right-2 w-6 h-1 bg-black"></div>
          
          <div className="text-5xl mb-4">💔</div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
            ОШИБКА ЗАГРУЗКИ
          </h3>
          <p className="text-white font-bold mb-6 uppercase">
            НЕ УДАЛОСЬ ЗАГРУЗИТЬ ИЗБРАННЫЕ ОБЪЯВЛЕНИЯ
          </p>
          <button
            onClick={() => window.location.reload()}
            className="group relative bg-black hover:bg-white text-red-600 hover:text-black font-black px-8 py-4 border-2 border-red-600 hover:border-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative">🔄 ПОПРОБОВАТЬ СНОВА</span>
            <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 group-hover:bg-black transition-colors"></div>
          </button>
        </div>
      )}

      {/* Пустое состояние */}
      {!isLoading && !error && favoritesData.length === 0 && (
        <div className="bg-black border-4 border-orange-600 p-16 text-center relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>
          
          <div className="text-8xl mb-8">💙</div>
          <h3 className="text-4xl font-black text-white uppercase tracking-wider mb-6">
            В ИЗБРАННОМ
            <span className="block text-orange-500">ПОКА ПУСТО</span>
          </h3>
          <p className="text-orange-300 font-bold uppercase tracking-wide text-lg mb-12">
            ДОБАВЛЯЙТЕ ПОНРАВИВШИЕСЯ ОБЪЯВЛЕНИЯ<br />
            В ИЗБРАННОЕ, НАЖИМАЯ НА ❤️
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link
              to="/search"
              className="group relative bg-orange-600 hover:bg-white text-black font-black px-10 py-6 text-lg border-2 border-black hover:border-orange-600 uppercase tracking-wider no-underline transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🚗 НАЙТИ АВТОМОБИЛЬ</span>
              <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
            </Link>
            
            <Link
              to="/"
              className="group relative bg-gray-900 hover:bg-orange-600 text-orange-100 hover:text-black font-black px-10 py-6 text-lg border-2 border-orange-600 hover:border-black uppercase tracking-wider no-underline transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🏠 НА ГЛАВНУЮ</span>
              <div className="absolute top-1 right-1 w-3 h-3 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </Link>
          </div>
        </div>
      )}

      {/* Контент с объявлениями */}
      {!isLoading && !error && favoritesData.length > 0 && (
        <>
          {/* Панель управления */}
          <div className="bg-black border-4 border-orange-600 p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>
            
            <div className="relative z-10 flex justify-between items-center">
              {/* Массовые операции */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors duration-300 ${
                      selectedItems.size === paginatedData.length && paginatedData.length > 0
                        ? 'bg-orange-600 border-orange-600' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      {selectedItems.size === paginatedData.length && paginatedData.length > 0 && (
                        <span className="text-black font-black">✓</span>
                      )}
                    </div>
                  </div>
                  <span className="text-orange-100 font-bold uppercase tracking-wide text-sm">
                    ВЫБРАТЬ ВСЕ ({selectedItems.size})
                  </span>
                </label>

                {selectedItems.size > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value)}
                        className="bg-gray-900 text-orange-100 font-bold border-2 border-gray-700 focus:border-orange-500 p-3 focus:outline-none appearance-none cursor-pointer uppercase tracking-wide text-sm"
                      >
                        <option value="">ДЕЙСТВИЕ</option>
                        <option value="remove">УДАЛИТЬ ИЗ ИЗБРАННОГО</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
                      </div>
                      <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                    </div>
                    
                    <button
                      onClick={handleBulkAction}
                      disabled={!bulkAction || bulkRemoveMutation.isLoading}
                      className={`group relative font-black px-6 py-3 border-2 uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105 ${
                        bulkAction && !bulkRemoveMutation.isLoading
                          ? 'bg-red-600 hover:bg-white text-white hover:text-black border-black hover:border-red-600 cursor-pointer'
                          : 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span className="relative">
                        {bulkRemoveMutation.isLoading ? '🗑️ УДАЛЕНИЕ...' : '🗑️ ВЫПОЛНИТЬ'}
                      </span>
                      {bulkAction && !bulkRemoveMutation.isLoading && (
                        <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-red-600 transition-colors"></div>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Сортировка */}
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
                    <option value="year_desc">ПО ГОДУ (НОВЫЕ)</option>
                    <option value="mileage_asc">ПО ПРОБЕГУ (МЕНЬШЕ)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
                  </div>
                  <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика по статусам */}
          {Object.keys(groupedFavorites).length > 1 && (
            <div className="flex gap-4 mb-6 flex-wrap">
              {Object.entries(groupedFavorites).map(([status, items]) => (
                <div
                  key={status}
                  className="flex items-center gap-3 p-4 bg-gray-900 border-2 border-gray-700 relative"
                >
                  <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
                  <span className={`w-4 h-4 ${getStatusColor(status)}`}></span>
                  <span className="text-orange-100 font-bold uppercase tracking-wide text-sm">
                    {getStatusText(status)}: {items.length}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Список объявлений */}
          <div className="space-y-4 mb-8">
            {paginatedData.map((listing) => (
              <div
                key={listing.listing_id}
                className="bg-black border-4 border-gray-700 hover:border-orange-600 p-6 relative overflow-hidden transition-all duration-300"
              >
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white"></div>
                
                <div className="relative z-10 flex gap-6">
                  {/* Чекбокс */}
                  <div className="relative mt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(listing.listing_id)}
                      onChange={() => handleSelectItem(listing.listing_id)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 border-2 flex items-center justify-center cursor-pointer transition-colors duration-300 ${
                      selectedItems.has(listing.listing_id)
                        ? 'bg-orange-600 border-orange-600' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      {selectedItems.has(listing.listing_id) && (
                        <span className="text-black font-black">✓</span>
                      )}
                    </div>
                  </div>

                  {/* Изображение */}
                  <div className="w-32 h-24 flex-shrink-0 relative">
                    <Link to={`/listings/${listing.listing_id}`}>
                      <img
                        src={listing.main_image_url || '/placeholder-car.jpg'}
                        alt={listing.title}
                        className="w-full h-full object-cover border-2 border-gray-600 hover:border-orange-500 transition-colors"
                      />
                    </Link>
                    <div className="absolute top-1 right-1 w-2 h-2 bg-orange-600"></div>
                  </div>

                  {/* Информация */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/listings/${listing.listing_id}`}
                          className="text-orange-100 hover:text-orange-300 no-underline transition-colors"
                        >
                          <h4 className="text-lg font-black uppercase tracking-wide mb-2">
                            {listing.title}
                          </h4>
                        </Link>
                        
                        <div className="bg-orange-600 text-black font-black text-xl p-2 mb-3 inline-block">
                          {listing.price?.toLocaleString()} {listing.currency_code || '₸'}
                        </div>

                        <div className="text-orange-300 font-bold text-sm flex items-center">
                          <div className="w-2 h-2 bg-orange-500 mr-3"></div>
                          <span className="uppercase tracking-wide">
                            {listing.city_name}
                            {listing.year && ` • ${listing.year} Г.`}
                            {listing.mileage && ` • ${listing.mileage.toLocaleString()} КМ`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Статус */}
                        <span className={`${getStatusColor(listing.status)} text-white font-black px-3 py-1 text-xs uppercase tracking-wider border-2 border-black`}>
                          {getStatusText(listing.status)}
                        </span>

                        {/* Кнопка удаления */}
                        <button
                          onClick={() => handleRemoveFavorite(listing.listing_id)}
                          disabled={removeFavoriteMutation.isLoading}
                          className="group relative bg-red-600 hover:bg-white text-white hover:text-black font-black px-4 py-2 border-2 border-black hover:border-red-600 transition-all duration-300 transform hover:scale-105"
                          title="УДАЛИТЬ ИЗ ИЗБРАННОГО"
                        >
                          <span className="relative">🗑️</span>
                          <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-red-600 transition-colors"></div>
                        </button>
                      </div>
                    </div>

                    <div className="text-orange-400 font-bold text-xs uppercase tracking-wider mt-3 flex items-center">
                      <div className="w-1 h-1 bg-orange-500 mr-2"></div>
                      ДОБАВЛЕНО В ИЗБРАННОЕ: {new Date(listing.favorite_date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}

          {/* Советы */}
          <div className="bg-blue-900 border-4 border-blue-600 p-6 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
            
            <h4 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center">
              💡 ПОЛЕЗНЫЕ СОВЕТЫ
            </h4>
            <ul className="text-blue-200 font-bold space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                РЕГУЛЯРНО ПРОВЕРЯЙТЕ ИЗБРАННЫЕ - ЦЕНЫ МОГУТ ИЗМЕНИТЬСЯ
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                СВЯЖИТЕСЬ С ПРОДАВЦОМ КАК МОЖНО СКОРЕЕ
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                НАСТРОЙТЕ УВЕДОМЛЕНИЯ О СНИЖЕНИИ ЦЕН
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 mr-3"></div>
                УДАЛЯЙТЕ НЕАКТУАЛЬНЫЕ ОБЪЯВЛЕНИЯ
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;