// src/components/Listings/ListingForm.jsx
import React, { useState } from 'react';
import BrandSelector from '../Cars/BrandSelector';
import ModelSelector from '../Cars/ModelSelector';
import CarAttributes from '../Cars/CarAttributes';
import LocationSelector from '../Common/LocationSelector';
import ImageUploader from '../Common/ImageUploader';

const ListingForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency_id: 1, // KZT по умолчанию
    city_id: '',
    address: '',
    contact_phone: '',
    contact_name: '',
    is_negotiable: false,
    brand_id: '',
    model_id: '',
    attributes: {},
    images: [],
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Укажите корректную цену';
    }
    
    if (!formData.brand_id) {
      newErrors.brand_id = 'Выберите марку автомобиля';
    }
    
    if (!formData.model_id) {
      newErrors.model_id = 'Выберите модель автомобиля';
    }
    
    if (!formData.city_id) {
      newErrors.city_id = 'Выберите город';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleAttributesChange = (attributes) => {
    setFormData(prev => ({
      ...prev,
      attributes
    }));
  };

  const handleImagesUpload = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Основная информация</h2>
        
        <div>
          <label>Заголовок объявления *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Например: Toyota Camry 2018"
            maxLength={255}
          />
          {errors.title && <div style={{color: 'red'}}>{errors.title}</div>}
        </div>

        <div>
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Подробное описание автомобиля..."
            rows={6}
            maxLength={5000}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label>Марка *</label>
            <BrandSelector
              value={formData.brand_id}
              onChange={(value) => {
                handleChange('brand_id', value);
                handleChange('model_id', ''); // Сбрасываем модель при смене марки
              }}
            />
            {errors.brand_id && <div style={{color: 'red'}}>{errors.brand_id}</div>}
          </div>

          <div>
            <label>Модель *</label>
            <ModelSelector
              brandId={formData.brand_id}
              value={formData.model_id}
              onChange={(value) => handleChange('model_id', value)}
            />
            {errors.model_id && <div style={{color: 'red'}}>{errors.model_id}</div>}
          </div>
        </div>
      </div>

      <div>
        <h3>Характеристики</h3>
        <CarAttributes
          attributes={formData.attributes}
          onChange={handleAttributesChange}
        />
      </div>

      <div>
        <h3>Цена и контакты</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
          <div>
            <label>Цена *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              min="0"
              step="1000"
            />
            {errors.price && <div style={{color: 'red'}}>{errors.price}</div>}
          </div>

          <div>
            <label>Валюта</label>
            <select
              value={formData.currency_id}
              onChange={(e) => handleChange('currency_id', e.target.value)}
            >
              <option value={1}>KZT (₸)</option>
              <option value={2}>USD ($)</option>
              <option value={3}>EUR (€)</option>
            </select>
          </div>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.is_negotiable}
              onChange={(e) => handleChange('is_negotiable', e.target.checked)}
            />
            Цена договорная
          </label>
        </div>

        <div>
          <label>Контактный телефон</label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            placeholder="+7 (xxx) xxx-xx-xx"
          />
        </div>

        <div>
          <label>Контактное лицо</label>
          <input
            type="text"
            value={formData.contact_name}
            onChange={(e) => handleChange('contact_name', e.target.value)}
            placeholder="Имя для связи"
          />
        </div>
      </div>

      <div>
        <h3>Местоположение</h3>
        <LocationSelector
          value={formData.city_id}
          onChange={(value) => handleChange('city_id', value)}
        />
        {errors.city_id && <div style={{color: 'red'}}>{errors.city_id}</div>}

        <div>
          <label>Адрес (необязательно)</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Улица, дом"
          />
        </div>
      </div>

      <div>
        <h3>Фотографии</h3>
        <ImageUploader onUpload={handleImagesUpload} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Сохраняем...' : 'Опубликовать объявление'}
      </button>
    </form>
  );
};

export default ListingForm;