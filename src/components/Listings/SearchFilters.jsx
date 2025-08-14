import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Загружаем справочные данные
  const { data: brands } = useQuery('brands', () => api.get('/api/cars/brands'));
  const { data: models } = useQuery(
    ['models', localFilters.brand_id], 
    () => api.get(`/api/cars/brands/${localFilters.brand_id}/models`),
    { enabled: !!localFilters.brand_id }
  );
  const { data: cities } = useQuery('cities', () => api.get('/api/locations/cities'));
  const { data: bodyTypes } = useQuery('body-types', () => api.get('/api/cars/body-types'));
  const { data: engineTypes } = useQuery('engine-types', () => api.get('/api/cars/engine-types'));
  const { data: transmissions } = useQuery('transmissions', () => api.get('/api/cars/transmission-types'));
  const { data: driveTypes } = useQuery('drive-types', () => api.get('/api/cars/drive-types'));
  const { data: colors } = useQuery('colors', () => api.get('/api/cars/colors'));

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
      // Сбрасываем модель при изменении марки
      ...(field === 'brand_id' ? { model_id: '' } : {})
    };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const emptyFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #ddd'
    }}>
      <h3 style={{ margin: '0 0 20px 0' }}>Фильтры</h3>

      {/* Поисковый запрос */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Поиск
        </label>
        <input
          type="text"
          value={localFilters.q || ''}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          placeholder="Поиск по объявлениям..."
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Марка */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Марка
        </label>
        <select
          value={localFilters.brand_id || ''}
          onChange={(e) => handleFilterChange('brand_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любая марка</option>
          {brands?.data?.map(brand => (
            <option key={brand.brand_id} value={brand.brand_id}>
              {brand.brand_name}
            </option>
          ))}
        </select>
      </div>

      {/* Модель */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Модель
        </label>
        <select
          value={localFilters.model_id || ''}
          onChange={(e) => handleFilterChange('model_id', e.target.value)}
          disabled={!localFilters.brand_id}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: !localFilters.brand_id ? '#f5f5f5' : 'white'
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
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Город
        </label>
        <select
          value={localFilters.city_id || ''}
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

      {/* Цена */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Цена, ₸
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={localFilters.price_from || ''}
            onChange={(e) => handleFilterChange('price_from', e.target.value)}
            placeholder="От"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <input
            type="number"
            value={localFilters.price_to || ''}
            onChange={(e) => handleFilterChange('price_to', e.target.value)}
            placeholder="До"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Год выпуска */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Год выпуска
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={localFilters.year_from || ''}
            onChange={(e) => handleFilterChange('year_from', e.target.value)}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">От</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={localFilters.year_to || ''}
            onChange={(e) => handleFilterChange('year_to', e.target.value)}
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">До</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Пробег */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Пробег до, км
        </label>
        <input
          type="number"
          value={localFilters.mileage_to || ''}
          onChange={(e) => handleFilterChange('mileage_to', e.target.value)}
          placeholder="Максимальный пробег"
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Тип кузова */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Тип кузова
        </label>
        <select
          value={localFilters.body_type_id || ''}
          onChange={(e) => handleFilterChange('body_type_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любой</option>
          {bodyTypes?.data?.map(type => (
            <option key={type.body_type_id} value={type.body_type_id}>
              {type.body_type_name}
            </option>
          ))}
        </select>
      </div>

      {/* Тип двигателя */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Тип двигателя
        </label>
        <select
          value={localFilters.engine_type_id || ''}
          onChange={(e) => handleFilterChange('engine_type_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любой</option>
          {engineTypes?.data?.map(type => (
            <option key={type.engine_type_id} value={type.engine_type_id}>
              {type.engine_type_name}
            </option>
          ))}
        </select>
      </div>

      {/* Коробка передач */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Коробка передач
        </label>
        <select
          value={localFilters.transmission_id || ''}
          onChange={(e) => handleFilterChange('transmission_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любая</option>
          {transmissions?.data?.map(transmission => (
            <option key={transmission.transmission_id} value={transmission.transmission_id}>
              {transmission.transmission_name}
            </option>
          ))}
        </select>
      </div>

      {/* Привод */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Привод
        </label>
        <select
          value={localFilters.drive_type_id || ''}
          onChange={(e) => handleFilterChange('drive_type_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любой</option>
          {driveTypes?.data?.map(type => (
            <option key={type.drive_type_id} value={type.drive_type_id}>
              {type.drive_type_name}
            </option>
          ))}
        </select>
      </div>

      {/* Цвет */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Цвет
        </label>
        <select
          value={localFilters.color_id || ''}
          onChange={(e) => handleFilterChange('color_id', e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="">Любой</option>
          {colors?.data?.map(color => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name}
            </option>
          ))}
        </select>
      </div>

      {/* Дополнительные опции */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '8px'
        }}>
          <input
            type="checkbox"
            checked={localFilters.featured === 'true'}
            onChange={(e) => handleFilterChange('featured', e.target.checked ? 'true' : '')}
          />
          Только VIP объявления
        </label>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={localFilters.urgent === 'true'}
            onChange={(e) => handleFilterChange('urgent', e.target.checked ? 'true' : '')}
          />
          Срочная продажа
        </label>
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={applyFilters}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Применить
        </button>
        <button
          onClick={resetFilters}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;