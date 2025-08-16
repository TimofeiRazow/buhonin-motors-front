import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';

const SearchSection = () => {
  const [filters, setFilters] = useState({
    brand_id: '',
    model_id: '',
    city_id: '',
    price_from: '',
    price_to: ''
  });
  
  const navigate = useNavigate();

  // Загружаем справочные данные
  const brands = useQuery('brands', () => api.get('/api/cars/brands'));
  console.log("Проблема в SearchSection", brands)
  const models = useQuery(
    ['models', filters.brand_id], 
    () => api.get(`/api/cars/brands/${filters.brand_id}/models`),
    { enabled: !!filters.brand_id }
  );
  const cities = useQuery('cities', () => api.get('/api/locations/cities?popular=true'));
  console.log("Модели: ", models);
  console.log("Города: ", cities);
  console.log("Бренды: ", brands);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Сбрасываем модель при изменении марки
      ...(field === 'brand_id' ? { model_id: '' } : {})
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <form onSubmit={handleSearch}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {/* Марка */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Марка
            </label>
            <select
              value={filters.brand_id}
              onChange={(e) => handleFilterChange('brand_id', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Любая марка</option>
              {brands?.data?.data?.map(brand => (
                <option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </option>
              ))}
            </select>
          </div>

          {/* Модель */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Модель
            </label>
            <select
              value={filters.model_id}
              onChange={(e) => handleFilterChange('model_id', e.target.value)}
              disabled={!filters.brand_id}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: !filters.brand_id ? '#f5f5f5' : 'white'
              }}
            >
              <option value="">Любая модель</option>
              {models?.data?.map(model => (
                <option key={model.model_id} value={model.model_id}>
                  {model.model_name}
                </option>
              ))}
            </select>
          </div>

          {/* Город */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Город
            </label>
            <select
              value={filters.city_id}
              onChange={(e) => handleFilterChange('city_id', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="">Любой город</option>
              {cities?.data?.map(city => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Цена от */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Цена от
            </label>
            <input
              type="number"
              value={filters.price_from}
              onChange={(e) => handleFilterChange('price_from', e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>

          {/* Цена до */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Цена до
            </label>
            <input
              type="number"
              value={filters.price_to}
              onChange={(e) => handleFilterChange('price_to', e.target.value)}
              placeholder="∞"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Найти автомобили
        </button>
      </form>
    </div>
  );
};

export default SearchSection;