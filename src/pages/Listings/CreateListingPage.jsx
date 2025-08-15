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
    
    if (!formData.brand_id) newErrors.brand_id = 'ВЫБЕРИТЕ МАРКУ';
    if (!formData.model_id) newErrors.model_id = 'ВЫБЕРИТЕ МОДЕЛЬ';
    if (!formData.year) newErrors.year = 'УКАЖИТЕ ГОД ВЫПУСКА';
    if (!formData.mileage) newErrors.mileage = 'УКАЖИТЕ ПРОБЕГ';
    if (!formData.condition) newErrors.condition = 'УКАЖИТЕ СОСТОЯНИЕ';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'ВВЕДИТЕ ЗАГОЛОВОК';
    if (!formData.price) newErrors.price = 'УКАЖИТЕ ЦЕНУ';
    if (!formData.city_id) newErrors.city_id = 'ВЫБЕРИТЕ ГОРОД';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-black uppercase tracking-wider">СОЗДАЕМ ОБЪЯВЛЕНИЕ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="relative max-w-4xl mx-auto">
        {/* Фоновые декоративные элементы */}
        <div className="absolute -top-10 -left-10 w-20 h-20 border-4 border-orange-600 rotate-45 opacity-20"></div>
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-orange-600 rotate-12 opacity-30"></div>
        <div className="absolute -bottom-8 -left-8 w-8 h-8 bg-white opacity-25"></div>
        <div className="absolute -bottom-12 -right-12 w-16 h-16 border-2 border-white rotate-45 opacity-15"></div>

        {/* Основная форма */}
        <div className="bg-black border-4 border-orange-600 relative overflow-hidden">
          {/* Геометрические элементы */}
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-50"></div>
          <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>

          <div className="relative z-10 p-8">
            {/* Заголовок */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-black text-white uppercase tracking-wider mb-4">
                ПРОДАТЬ
                <span className="block text-orange-500 text-4xl">АВТОМОБИЛЬ</span>
              </h1>
              <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mt-4">
                СОЗДАЙТЕ ОБЪЯВЛЕНИЕ И НАЙДИТЕ ПОКУПАТЕЛЯ
              </p>
            </div>

            {/* Прогресс */}
            <div className="flex items-center justify-center mb-12 bg-gray-900 border-2 border-gray-700 p-6">
              {[1, 2, 3].map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 border-2 flex items-center justify-center font-black text-lg transition-all duration-300
                      ${currentStep >= step 
                        ? 'bg-orange-600 border-orange-600 text-black' 
                        : 'bg-gray-800 border-gray-600 text-gray-400'
                      }
                    `}>
                      {step}
                    </div>
                    <div className={`
                      mt-3 font-black uppercase tracking-wider text-xs transition-colors duration-300
                      ${currentStep >= step ? 'text-orange-500' : 'text-gray-500'}
                    `}>
                      {step === 1 ? 'АВТО' : step === 2 ? 'ОПИСАНИЕ' : 'ФОТО'}
                    </div>
                  </div>
                  {index < 2 && (
                    <div className={`
                      flex-1 h-1 mx-6 transition-colors duration-300
                      ${currentStep > step ? 'bg-orange-600' : 'bg-gray-700'}
                    `}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Общая ошибка */}
            {errors.general && (
              <div className="bg-red-600 border-2 border-black text-white p-4 mb-8 relative">
                <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
                <p className="font-bold uppercase tracking-wide text-sm">
                  ⚠️ {errors.general}
                </p>
              </div>
            )}

            {/* Шаг 1: Характеристики автомобиля */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                    ХАРАКТЕРИСТИКИ
                  </h2>
                  <div className="w-16 h-0.5 bg-orange-600 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Марка */}
                  <div className="group">
                    <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                      МАРКА *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.brand_id}
                        onChange={(e) => handleInputChange('brand_id', e.target.value)}
                        className={`
                          w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                          focus:outline-none focus:bg-black uppercase tracking-wide
                          ${errors.brand_id 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                          }
                        `}
                      >
                        <option value="">ВЫБЕРИТЕ МАРКУ</option>
                        {brands?.data?.data?.map(brand => (
                          <option key={brand.brand_id} value={brand.brand_id}>
                            {brand.brand_name}
                          </option>
                        ))}
                      </select>
                      <div className={`
                        absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                        ${errors.price ? 'bg-red-500' : 'bg-orange-600'}
                      `}></div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        💰
                      </div>
                    </div>
                    {errors.price && (
                      <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                        <div className="w-2 h-2 bg-red-500 mr-2"></div>
                        {errors.price}
                      </div>
                    )}
                  </div>

                  {/* Город */}
                  <div className="group">
                    <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
                      ГОРОД *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.city_id}
                        onChange={(e) => handleInputChange('city_id', e.target.value)}
                        className={`
                          w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                          focus:outline-none focus:bg-black uppercase tracking-wide
                          ${errors.city_id 
                            ? 'border-red-500 focus:border-red-400' 
                            : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                          }
                        `}
                      >
                        <option value="">ВЫБЕРИТЕ ГОРОД</option>
                        {cities?.data?.map(city => (
                          <option key={city.city_id} value={city.city_id}>
                            {city.city_name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <div className={`
                        absolute top-2 left-2 w-2 h-2 transition-colors duration-300
                        ${errors.city_id ? 'bg-red-500' : 'bg-orange-600'}
                      `}></div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500">
                        📍
                      </div>
                    </div>
                    {errors.city_id && (
                      <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center">
                        <div className="w-2 h-2 bg-red-500 mr-2"></div>
                        {errors.city_id}
                      </div>
                    )}
                  </div>
                </div>

                {/* Переключатель торга */}
                <div className="group">
                  <label className="flex items-center gap-4 cursor-pointer p-4 bg-gray-900 border-2 border-gray-700 hover:border-orange-500 transition-colors duration-300">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.is_negotiable}
                        onChange={(e) => handleInputChange('is_negotiable', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors duration-300 ${
                        formData.is_negotiable 
                          ? 'bg-orange-600 border-orange-600' 
                          : 'bg-gray-800 border-gray-600'
                      }`}>
                        {formData.is_negotiable && (
                          <span className="text-black font-black">✓</span>
                        )}
                      </div>
                    </div>
                    <span className="text-white font-bold uppercase tracking-wide">
                      ТОРГ ВОЗМОЖЕН
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="group relative flex-1 p-4 bg-gray-600 hover:bg-gray-700 text-white font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
                  >
                    <span className="relative flex items-center justify-center">
                      ← НАЗАД
                    </span>
                    <div className="absolute top-1 left-1 w-3 h-3 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="group relative flex-1 p-4 bg-orange-600 hover:bg-white text-black hover:text-black font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-black hover:border-orange-600"
                  >
                    <span className="relative flex items-center justify-center">
                      🚀 ДАЛЕЕ
                    </span>
                    <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 3: Фотографии */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                    ФОТОГРАФИИ
                  </h2>
                  <div className="w-16 h-0.5 bg-orange-600 mx-auto"></div>
                  <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mt-4">
                    ДОБАВЬТЕ ДО 10 ФОТОГРАФИЙ АВТОМОБИЛЯ
                  </p>
                </div>
                
                {/* Зона загрузки */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    id="image-upload"
                  />
                  <div className="border-4 border-dashed border-orange-600 bg-gray-900 p-12 text-center hover:bg-gray-800 transition-colors duration-300 cursor-pointer relative overflow-hidden">
                    {/* Геометрические элементы */}
                    <div className="absolute top-4 left-4 w-4 h-4 bg-orange-600 rotate-45"></div>
                    <div className="absolute top-4 right-4 w-6 h-1 bg-white opacity-50"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-white"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 border-2 border-orange-600"></div>
                    
                    <div className="relative z-5">
                      <div className="text-6xl mb-4">📷</div>
                      <div className="text-2xl font-black text-white uppercase tracking-wider mb-4">
                        ДОБАВИТЬ ФОТО
                      </div>
                      <div className="text-gray-400 font-bold uppercase tracking-wide text-sm">
                        ПЕРЕТАЩИТЕ ФАЙЛЫ СЮДА ИЛИ НАЖМИТЕ ДЛЯ ВЫБОРА
                      </div>
                      <div className="text-orange-500 font-bold uppercase tracking-wide text-xs mt-2">
                        МАКСИМУМ 10 ФОТОГРАФИЙ • ПЕРВАЯ БУДЕТ ГЛАВНОЙ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Превью загруженных изображений */}
                {images.length > 0 && (
                  <div className="bg-gray-900 border-2 border-gray-700 p-6">
                    <h3 className="text-white font-black uppercase tracking-wider text-lg mb-4 flex items-center">
                      <span className="w-2 h-2 bg-orange-600 mr-3"></span>
                      ЗАГРУЖЕННЫЕ ФОТО ({images.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square border-2 border-gray-600 hover:border-orange-500 transition-colors duration-300 group overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Фото ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-500 text-white font-black text-sm border-2 border-black transition-colors duration-300 flex items-center justify-center"
                          >
                            ✕
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-orange-600 text-black px-2 py-1 font-black text-xs uppercase tracking-wide border border-black">
                              ГЛАВНАЯ
                            </div>
                          )}
                          <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Кнопки навигации */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="group relative flex-1 p-4 bg-gray-600 hover:bg-gray-700 text-white font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
                  >
                    <span className="relative flex items-center justify-center">
                      ← НАЗАД
                    </span>
                    <div className="absolute top-1 left-1 w-3 h-3 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
                    <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={createListingMutation.isLoading}
                    className={`
                      group relative flex-1 p-4 font-black uppercase tracking-wider text-lg
                      transition-all duration-300 transform border-2
                      ${createListingMutation.isLoading
                        ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-white text-white hover:text-black border-black hover:border-green-600 hover:scale-105'
                      }
                    `}
                  >
                    <span className="relative flex items-center justify-center">
                      {createListingMutation.isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                          СОЗДАНИЕ...
                        </>
                      ) : (
                        <>
                          🎯 ОПУБЛИКОВАТЬ
                        </>
                      )}
                    </span>
                    
                    {!createListingMutation.isLoading && (
                      <>
                        <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-green-600 transition-colors"></div>
                        <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-green-600 transition-colors"></div>
                      </>
                    )}
                  </button>
                </div>

                {/* Дополнительная информация */}
                <div className="bg-gray-900 border-2 border-gray-700 p-6 text-center">
                  <h4 className="text-orange-500 font-black uppercase tracking-wider text-lg mb-3">
                    СОВЕТЫ ПО ФОТОГРАФИЯМ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 font-bold text-sm">
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                      СНИМАЙТЕ ПРИ ХОРОШЕМ ОСВЕЩЕНИИ
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                      ПОКАЖИТЕ ВСЕ СТОРОНЫ АВТОМОБИЛЯ
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                      ВКЛЮЧИТЕ САЛОН И ДВИГАТЕЛЬ
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;