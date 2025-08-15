import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import api from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const CreateListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency_id: 1, // KZT по умолчанию
    city_id: '',
    brand_id: '',
    model_id: '',
    generation_id: '',
    year: '',
    mileage: '',
    condition: '',
    body_type_id: '',
    engine_type_id: '',
    engine_volume: '',
    transmission_id: '',
    drive_type_id: '',
    color_id: '',
    contact_phone: '',
    contact_name: '',
    is_negotiable: true
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Загружаем справочные данные
  const { data: brands } = useQuery('brands', () => api.get('/api/cars/brands'));
  const { data: models } = useQuery(
    ['models', formData.brand_id],
    () => api.get(`/api/cars/brands/${formData.brand_id}/models`),
    { enabled: !!formData.brand_id }
  );
  const { data: generations } = useQuery(
    ['generations', formData.model_id],
    () => api.get(`/api/cars/models/${formData.model_id}/generations`),
    { enabled: !!formData.model_id }
  );
  const { data: cities } = useQuery('cities', () => api.get('/api/locations/cities'));
  const { data: bodyTypes } = useQuery('body-types', () => api.get('/api/cars/body-types'));
  const { data: engineTypes } = useQuery('engine-types', () => api.get('/api/cars/engine-types'));
  const { data: transmissions } = useQuery('transmissions', () => api.get('/api/cars/transmission-types'));
  const { data: driveTypes } = useQuery('drive-types', () => api.get('/api/cars/drive-types'));
  const { data: colors } = useQuery('colors', () => api.get('/api/cars/colors'));

  // Мутация для создания объявления
  const createListingMutation = useMutation(
    (data) => api.post('/api/listings/', data),
    {
      onSuccess: (response) => {
        navigate(`/listings/${response.data.listing_id}`);
      },
      onError: (error) => {
        setErrors({ general: error.response?.data?.message || 'Ошибка создания объявления' });
      }
    }
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Сбрасываем связанные поля
      ...(field === 'brand_id' ? { model_id: '', generation_id: '' } : {}),
      ...(field === 'model_id' ? { generation_id: '' } : {})
    }));

    // Очищаем ошибку
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 10)); // Максимум 10 фото
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.brand_id) newErrors.brand_id = 'Выберите марку';
    if (!formData.model_id) newErrors.model_id = 'Выберите модель';
    if (!formData.year) newErrors.year = 'Укажите год выпуска';
    if (!formData.mileage) newErrors.mileage = 'Укажите пробег';
    if (!formData.condition) newErrors.condition = 'Укажите состояние';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Введите заголовок';
    if (!formData.price) newErrors.price = 'Укажите цену';
    if (!formData.city_id) newErrors.city_id = 'Выберите город';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    const submitData = {
      ...formData,
      listing_type_id: 1, // car_listing
      price: parseFloat(formData.price),
      year: parseInt(formData.year),
      mileage: parseInt(formData.mileage),
      engine_volume: formData.engine_volume ? parseFloat(formData.engine_volume) : null
    };

    // Удаляем пустые значения
    Object.keys(submitData).forEach(key => {
      if (submitData[key] === '' || submitData[key] === null) {
        delete submitData[key];
      }
    });

    createListingMutation.mutate(submitData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  if (createListingMutation.isLoading) {
    return <LoadingSpinner text="Создаем объявление..." />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Подать объявление
      </h1>

      {/* Прогресс */}
      <div style={{
        display: 'flex',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        {[1, 2, 3].map(step => (
          <div
            key={step}
            style={{
              flex: 1,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: currentStep >= step ? '#007bff' : '#e9ecef',
              color: currentStep >= step ? 'white' : '#6c757d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              margin: '0 auto 10px'
            }}>
              {step}
            </div>
            <div style={{
              fontSize: '14px',
              color: currentStep >= step ? '#007bff' : '#6c757d'
            }}>
              {step === 1 ? 'Характеристики' : step === 2 ? 'Описание' : 'Фотографии'}
            </div>
            {step < 3 && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '-50%',
                width: '100%',
                height: '2px',
                backgroundColor: currentStep > step ? '#007bff' : '#e9ecef'
              }} />
            )}
          </div>
        ))}
      </div>

      {errors.general && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {errors.general}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        {/* Шаг 1: Характеристики автомобиля */}
        {currentStep === 1 && (
          <div>
            <h2 style={{ marginTop: 0 }}>Характеристики автомобиля</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Марка *
                </label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => handleInputChange('brand_id', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${errors.brand_id ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Выберите марку</option>
                  {brands?.data?.map(brand => (
                    <option key={brand.brand_id} value={brand.brand_id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </select>
                {errors.brand_id && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.brand_id}</div>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Модель *
                </label>
                <select
                  value={formData.model_id}
                  onChange={(e) => handleInputChange('model_id', e.target.value)}
                  disabled={!formData.brand_id}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${errors.model_id ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    backgroundColor: !formData.brand_id ? '#f5f5f5' : 'white'
                  }}
                >
                  <option value="">Выберите модель</option>
                  {models?.data?.map(model => (
                    <option key={model.model_id} value={model.model_id}>
                      {model.model_name}
                    </option>
                  ))}
                </select>
                {errors.model_id && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.model_id}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Год выпуска *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${errors.year ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Год</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.year}</div>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Пробег, км *
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  placeholder="100000"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${errors.mileage ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.mileage && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.mileage}</div>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Состояние *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${errors.condition ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Выберите</option>
                  <option value="excellent">Отличное</option>
                  <option value="good">Хорошее</option>
                  <option value="satisfactory">Удовлетворительное</option>
                  <option value="repair_needed">Требует ремонта</option>
                </select>
                {errors.condition && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.condition}</div>}
              </div>
            </div>

            {/* Дополнительные характеристики */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Тип кузова
                </label>
                <select
                  value={formData.body_type_id}
                  onChange={(e) => handleInputChange('body_type_id', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Не указан</option>
                  {bodyTypes?.data?.map(type => (
                    <option key={type.body_type_id} value={type.body_type_id}>
                      {type.body_type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Тип двигателя
                </label>
                <select
                  value={formData.engine_type_id}
                  onChange={(e) => handleInputChange('engine_type_id', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Не указан</option>
                  {engineTypes?.data?.map(type => (
                    <option key={type.engine_type_id} value={type.engine_type_id}>
                      {type.engine_type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleNextStep}
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
              Далее
            </button>
          </div>
        )}

        {/* Шаг 2: Описание и цена */}
        {currentStep === 2 && (
          <div>
            <h2 style={{ marginTop: 0 }}>Описание и цена</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Заголовок объявления *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Toyota Camry 2018 в отличном состоянии"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.title ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.title && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.title}</div>}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите достоинства автомобиля, его техническое состояние, комплектацию..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Цена, ₸ *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="5000000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.price ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.price && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.price}</div>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Город *
                </label>
                <select
                  value={formData.city_id}
                  onChange={(e) => handleInputChange('city_id', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${errors.city_id ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Выберите город</option>
                  {cities?.data?.map(city => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
                {errors.city_id && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>{errors.city_id}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Назад
              </button>
              <button
                onClick={handleNextStep}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Шаг 3: Фотографии */}
        {currentStep === 3 && (
          <div>
            <h2 style={{ marginTop: 0 }}>Фотографии</h2>
            
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '20px',
              backgroundColor: '#f8f9fa'
            }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                style={{
                  cursor: 'pointer',
                  display: 'block'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                  Добавьте фотографии автомобиля
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Максимум 10 фотографий. Первая фотография будет главной.
                </div>
              </label>
            </div>

            {images.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '10px',
                marginBottom: '20px'
              }}>
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Фото ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(220, 53, 69, 0.8)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '5px',
                        backgroundColor: 'rgba(0, 123, 255, 0.8)',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        Главная
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={createListingMutation.isLoading}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {createListingMutation.isLoading ? 'Создание...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateListingPage;