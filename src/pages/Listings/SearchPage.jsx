import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';
import SearchFilters from '../../components/Listings/SearchFilters';
import ListingGrid from '../../components/Listings/ListingGrid';
import Pagination from '../../components/Common/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';

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