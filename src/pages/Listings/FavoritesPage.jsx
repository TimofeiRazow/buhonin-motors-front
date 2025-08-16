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

  const favoritesData = favorites?.data.data || [];
  
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
      active: 'Активное',
      sold: 'Продано',
      expired: 'Истек срок',
      archived: 'В архиве',
      rejected: 'Отклонено'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#28a745',
      sold: '#007bff',
      expired: '#ffc107',
      archived: '#6c757d',
      rejected: '#dc3545'
    };
    return colors[status] || '#333';
  };

  return (
    <div>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Избранное</h1>
          {favoritesData.length > 0 && (
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Сохранено {favoritesData.length} объявлений
            </p>
          )}
        </div>

        {favoritesData.length > 0 && (
          <Link to="/search">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
              Найти еще
            </button>
          </Link>
        )}
      </div>

      {/* Загрузка */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          <h3>Ошибка загрузки</h3>
          <p>Не удалось загрузить избранные объявления.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Пустое состояние */}
      {!isLoading && !error && favoritesData.length === 0 && (
        <div style={{
          padding: '80px 40px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💙</div>
          <h3 style={{ marginBottom: '15px', fontSize: '24px' }}>В избранном пока пусто</h3>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            Добавляйте понравившиеся объявления в избранное, нажимая на ❤️
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/search">
              <button style={{
                padding: '15px 30px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none'
              }}>
                Найти автомобиль
              </button>
            </Link>
            
            <Link to="/">
              <button style={{
                padding: '15px 30px',
                backgroundColor: 'white',
                color: '#007bff',
                border: '2px solid #007bff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                textDecoration: 'none'
              }}>
                На главную
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Контент с объявлениями */}
      {!isLoading && !error && favoritesData.length > 0 && (
        <>
          {/* Панель управления */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px 20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            {/* Массовые операции */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                />
                <span style={{ fontSize: '14px' }}>
                  Выбрать все ({selectedItems.size})
                </span>
              </label>

              {selectedItems.size > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Действие</option>
                    <option value="remove">Удалить из избранного</option>
                  </select>
                  
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || bulkRemoveMutation.isLoading}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: bulkAction ? 'pointer' : 'not-allowed',
                      opacity: bulkAction ? 1 : 0.6
                    }}
                  >
                    {bulkRemoveMutation.isLoading ? 'Удаление...' : 'Выполнить'}
                  </button>
                </div>
              )}
            </div>

            {/* Сортировка */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '14px', color: '#666' }}>Сортировка:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}
              >
                <option value="date_desc">По дате добавления (новые)</option>
                <option value="date_asc">По дате добавления (старые)</option>
                <option value="price_asc">По цене (дешевые)</option>
                <option value="price_desc">По цене (дорогие)</option>
                <option value="year_desc">По году (новые)</option>
                <option value="mileage_asc">По пробегу (меньше)</option>
              </select>
            </div>
          </div>

          {/* Статистика по статусам */}
          {Object.keys(groupedFavorites).length > 1 && (
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              {Object.entries(groupedFavorites).map(([status, items]) => (
                <div
                  key={status}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                  {getStatusText(status)}: {items.length}
                </div>
              ))}
            </div>
          )}

          {/* Список объявлений с чекбоксами */}
          <div style={{ marginBottom: '30px' }}>
            {paginatedData.map((listing) => (
              <div
                key={listing.listing_id}
                style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '20px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  position: 'relative'
                }}
              >
                {/* Чекбокс */}
                <input
                  type="checkbox"
                  checked={selectedItems.has(listing.listing_id)}
                  onChange={() => handleSelectItem(listing.listing_id)}
                  style={{ marginTop: '5px' }}
                />

                {/* Изображение */}
                <div style={{ width: '120px', height: '90px', flexShrink: 0 }}>
                  <Link to={`/listings/${listing.listing_id}`}>
                    <img
                      src={listing.main_image_url || '/placeholder-car.jpg'}
                      alt={listing.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  </Link>
                </div>

                {/* Информация */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Link
                        to={`/listings/${listing.listing_id}`}
                        style={{ textDecoration: 'none', color: '#333' }}
                      >
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                          {listing.title}
                        </h4>
                      </Link>
                      
                      <p style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        color: '#007bff'
                      }}>
                        {listing.price?.toLocaleString()} {listing.currency_code || '₸'}
                      </p>

                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <span>{listing.city_name}</span>
                        {listing.year && <span> • {listing.year} г.</span>}
                        {listing.mileage && <span> • {listing.mileage.toLocaleString()} км</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Статус */}
                      <span style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(listing.status),
                        color: 'white'
                      }}>
                        {getStatusText(listing.status)}
                      </span>

                      {/* Кнопка удаления */}
                      <button
                        onClick={() => handleRemoveFavorite(listing.listing_id)}
                        disabled={removeFavoriteMutation.isLoading}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        title="Удалить из избранного"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                    Добавлено в избранное: {new Date(listing.favorite_date).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}

          {/* Советы */}
          <div style={{
            marginTop: '40px',
            padding: '20px',
            backgroundColor: '#e7f3ff',
            borderRadius: '8px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{ marginTop: 0, color: '#0066cc' }}>💡 Полезные советы:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#0066cc' }}>
              <li>Регулярно проверяйте избранные объявления - цены могут измениться</li>
              <li>Свяжитесь с продавцом как можно скорее, если объявление вас заинтересовало</li>
              <li>Настройте уведомления о снижении цен в настройках профиля</li>
              <li>Удаляйте неактуальные объявления, чтобы список оставался релевантным</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;