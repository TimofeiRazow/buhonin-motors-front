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
    <div style={{ display: 'flex', gap: '20px', minHeight: '600px' }}>
      {/* Фильтры */}
      <div style={{ 
        width: '300px', 
        flexShrink: 0,
        position: 'sticky',
        top: '20px',
        height: 'fit-content'
      }}>
        <SearchFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Результаты поиска */}
      <div style={{ flex: 1 }}>
        {/* Заголовок и сортировка */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>
              {filters.q ? `Поиск: "${filters.q}"` : 'Объявления'}
            </h1>
            {totalCount > 0 && (
              <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                Найдено {totalCount.toLocaleString()} объявлений
              </p>
            )}
          </div>

          {totalCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="sort-select" style={{ fontSize: '14px', color: '#666' }}>
                Сортировка:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}
              >
                <option value="date_desc">По дате (новые)</option>
                <option value="date_asc">По дате (старые)</option>
                <option value="price_asc">По цене (дешевые)</option>
                <option value="price_desc">По цене (дорогие)</option>
                <option value="mileage_asc">По пробегу (меньше)</option>
                <option value="mileage_desc">По пробегу (больше)</option>
                <option value="year_desc">По году (новые)</option>
                <option value="year_asc">По году (старые)</option>
                <option value="views_desc">По популярности</option>
              </select>
            </div>
          )}
        </div>

        {/* Быстрые фильтры */}
        {totalCount > 0 && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleFilterChange({ ...filters, featured: filters.featured ? '' : 'true' })}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: filters.featured ? '#007bff' : 'white',
                color: filters.featured ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⭐ Рекомендуемые
            </button>
            
            <button
              onClick={() => handleFilterChange({ ...filters, urgent: filters.urgent ? '' : 'true' })}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: filters.urgent ? '#dc3545' : 'white',
                color: filters.urgent ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔥 Срочно
            </button>

            <button
              onClick={() => handleFilterChange({ ...filters, price_to: filters.price_to ? '' : '2000000' })}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: filters.price_to === '2000000' ? '#28a745' : 'white',
                color: filters.price_to === '2000000' ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💰 До 2 млн
            </button>

            <button
              onClick={() => handleFilterChange({ ...filters, year_from: filters.year_from ? '' : '2015' })}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                backgroundColor: filters.year_from === '2015' ? '#17a2b8' : 'white',
                color: filters.year_from === '2015' ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🚗 От 2015 года
            </button>
          </div>
        )}

        {/* Загрузка */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
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
            <p>Не удалось загрузить объявления. Попробуйте обновить страницу.</p>
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
              Обновить
            </button>
          </div>
        )}

        {/* Нет результатов */}
        {!isLoading && !error && totalCount === 0 && (
          <div style={{
            padding: '60px 40px',
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ marginBottom: '15px' }}>Объявления не найдены</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Попробуйте изменить параметры поиска или расширить критерии фильтрации
            </p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setCurrentPage(1);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Сбросить фильтры
              </button>
              
              <button
                onClick={() => window.location.href = '/create-listing'}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Подать объявление
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
              <div style={{ marginTop: '40px' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Информация о результатах */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#666'
            }}>
              Показано {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} из {totalCount.toLocaleString()} объявлений
            </div>
          </>
        )}

        {/* Советы по поиску */}
        {!isLoading && totalCount > 0 && totalCount < 5 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#e7f3ff',
            borderRadius: '8px',
            border: '1px solid #b3d9ff'
          }}>
            <h4 style={{ marginTop: 0, color: '#0066cc' }}>💡 Советы для лучшего поиска:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#0066cc' }}>
              <li>Попробуйте расширить диапазон цен</li>
              <li>Уберите некоторые фильтры</li>
              <li>Рассмотрите другие города</li>
              <li>Попробуйте похожие марки или модели</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;