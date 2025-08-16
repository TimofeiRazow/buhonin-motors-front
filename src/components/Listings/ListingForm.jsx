// src/components/Listings/ListingForm.jsx (redesigned)
import React, { useState } from 'react';
import { 
  FileText,
  MessageSquare,
  Car,
  Tag,
  Settings,
  DollarSign,
  Handshake,
  Phone,
  User,
  MapPin,
  Home,
  Camera,
  ArrowLeft,
  ArrowRight,
  Rocket,
  Check,
  Loader,
  BarChart3,
  Banknote,
  Upload
} from 'lucide-react';
import BrandSelector from '../Cars/BrandSelector';
import ModelSelector from '../Cars/ModelSelector';
import CarAttributes from '../Cars/CarAttributes';
import LocationSelector from '../Common/LocationSelector';
import ImageUploader from '../Common/ImageUploader';

const ListingForm = ({ initialData, onSubmit, loading = false, mode = 'create' }) => {
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
  const [currentSection, setCurrentSection] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'ЗАГОЛОВОК ОБЯЗАТЕЛЕН';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'УКАЖИТЕ КОРРЕКТНУЮ ЦЕНУ';
    }
    
    if (!formData.brand_id) {
      newErrors.brand_id = 'ВЫБЕРИТЕ МАРКУ АВТОМОБИЛЯ';
    }
    
    if (!formData.model_id) {
      newErrors.model_id = 'ВЫБЕРИТЕ МОДЕЛЬ АВТОМОБИЛЯ';
    }
    
    if (!formData.city_id) {
      newErrors.city_id = 'ВЫБЕРИТЕ ГОРОД';
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

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const sections = [
    { id: 1, title: 'ОСНОВНАЯ ИНФОРМАЦИЯ', icon: FileText },
    { id: 2, title: 'ХАРАКТЕРИСТИКИ', icon: Settings },
    { id: 3, title: 'ЦЕНА И КОНТАКТЫ', icon: DollarSign },
    { id: 4, title: 'МЕСТОПОЛОЖЕНИЕ', icon: MapPin },
    { id: 5, title: 'ФОТОГРАФИИ', icon: Camera }
  ];

  return (
    <div className="bg-black border-4 border-orange-600 relative overflow-hidden">
      {/* Геометрические элементы */}
      <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
      <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>
      <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>

      <div className="relative z-10 p-8">
        {/* Заголовок формы */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-4">
            {mode === 'create' ? 'СОЗДАТЬ ОБЪЯВЛЕНИЕ' : 'РЕДАКТИРОВАТЬ ОБЪЯВЛЕНИЕ'}
          </h1>
          <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
        </div>

        {/* Навигация по секциям */}
        <div className="mb-8 bg-gray-900 border-2 border-gray-700 p-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setCurrentSection(section.id)}
                className={`
                  group relative px-4 py-2 font-black uppercase tracking-wider text-sm transition-all duration-300 border-2
                  ${currentSection === section.id
                    ? 'bg-orange-600 border-black text-black'
                    : 'bg-gray-800 border-gray-600 text-white hover:border-orange-500'
                  }
                `}
              >
                <span className="relative flex items-center gap-2">
                  <section.icon size={16} />
                  {section.title}
                </span>
                {currentSection === section.id && (
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Секция 1: Основная информация */}
          {currentSection === 1 && (
            <FormSectionRedesigned title="ОСНОВНАЯ ИНФОРМАЦИЯ" icon={FileText}>
              <FormFieldRedesigned
                label="ЗАГОЛОВОК ОБЪЯВЛЕНИЯ *"
                error={errors.title}
                icon={FileText}
              >
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="НАПРИМЕР: TOYOTA CAMRY 2018"
                  maxLength={255}
                  className={`
                    w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                    focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide
                    ${errors.title 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                    }
                  `}
                />
              </FormFieldRedesigned>

              <FormFieldRedesigned
                label="ОПИСАНИЕ"
                icon={MessageSquare}
              >
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="ПОДРОБНОЕ ОПИСАНИЕ АВТОМОБИЛЯ..."
                  rows={6}
                  maxLength={5000}
                  className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide resize-vertical transition-all duration-300"
                />
                <div className="text-gray-500 font-bold text-xs uppercase tracking-wide mt-2">
                  {formData.description.length}/5000 СИМВОЛОВ
                </div>
              </FormFieldRedesigned>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldRedesigned
                  label="МАРКА *"
                  error={errors.brand_id}
                  icon={Car}
                >
                  <BrandSelectorRedesigned
                    value={formData.brand_id}
                    onChange={(value) => {
                      handleChange('brand_id', value);
                      handleChange('model_id', ''); // Сбрасываем модель при смене марки
                    }}
                    error={!!errors.brand_id}
                  />
                </FormFieldRedesigned>

                <FormFieldRedesigned
                  label="МОДЕЛЬ *"
                  error={errors.model_id}
                  icon={Tag}
                >
                  <ModelSelectorRedesigned
                    brandId={formData.brand_id}
                    value={formData.model_id}
                    onChange={(value) => handleChange('model_id', value)}
                    error={!!errors.model_id}
                    disabled={!formData.brand_id}
                  />
                </FormFieldRedesigned>
              </div>
            </FormSectionRedesigned>
          )}

          {/* Секция 2: Характеристики */}
          {currentSection === 2 && (
            <FormSectionRedesigned title="ХАРАКТЕРИСТИКИ" icon={Settings}>
              <CarAttributesRedesigned
                attributes={formData.attributes}
                onChange={handleAttributesChange}
              />
            </FormSectionRedesigned>
          )}

          {/* Секция 3: Цена и контакты */}
          {currentSection === 3 && (
            <FormSectionRedesigned title="ЦЕНА И КОНТАКТЫ" icon={DollarSign}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <FormFieldRedesigned
                    label="ЦЕНА *"
                    error={errors.price}
                    icon={DollarSign}
                  >
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      min="0"
                      step="1000"
                      placeholder="5000000"
                      className={`
                        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                        focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide
                        ${errors.price 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
                        }
                      `}
                    />
                  </FormFieldRedesigned>
                </div>

                <FormFieldRedesigned
                  label="ВАЛЮТА"
                  icon={Banknote}
                >
                  <select
                    value={formData.currency_id}
                    onChange={(e) => handleChange('currency_id', e.target.value)}
                    className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none uppercase tracking-wide transition-all duration-300"
                  >
                    <option value={1}>KZT (₸)</option>
                    <option value={2}>USD ($)</option>
                    <option value={3}>EUR (€)</option>
                  </select>
                </FormFieldRedesigned>
              </div>

              <FormCheckboxRedesigned
                label="ЦЕНА ДОГОВОРНАЯ"
                checked={formData.is_negotiable}
                onChange={(checked) => handleChange('is_negotiable', checked)}
                icon={Handshake}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormFieldRedesigned
                  label="КОНТАКТНЫЙ ТЕЛЕФОН"
                  icon={Phone}
                >
                  <input
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
                  />
                </FormFieldRedesigned>

                <FormFieldRedesigned
                  label="КОНТАКТНОЕ ЛИЦО"
                  icon={User}
                >
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => handleChange('contact_name', e.target.value)}
                    placeholder="ИМЯ ДЛЯ СВЯЗИ"
                    className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
                  />
                </FormFieldRedesigned>
              </div>
            </FormSectionRedesigned>
          )}

          {/* Секция 4: Местоположение */}
          {currentSection === 4 && (
            <FormSectionRedesigned title="МЕСТОПОЛОЖЕНИЕ" icon={MapPin}>
              <FormFieldRedesigned
                label="ГОРОД *"
                error={errors.city_id}
                icon={MapPin}
              >
                <LocationSelectorRedesigned
                  value={formData.city_id}
                  onChange={(value) => handleChange('city_id', value)}
                  error={!!errors.city_id}
                />
              </FormFieldRedesigned>

              <FormFieldRedesigned
                label="АДРЕС (НЕОБЯЗАТЕЛЬНО)"
                icon={Home}
              >
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="УЛИЦА, ДОМ"
                  className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
                />
              </FormFieldRedesigned>
            </FormSectionRedesigned>
          )}

          {/* Секция 5: Фотографии */}
          {currentSection === 5 && (
            <FormSectionRedesigned title="ФОТОГРАФИИ" icon={Camera}>
              <ImageUploaderRedesigned
                images={formData.images}
                onUpload={handleImagesUpload}
                onRemove={removeImage}
              />
            </FormSectionRedesigned>
          )}

          {/* Кнопки навигации и отправки */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-gray-700">
            <button
              type="button"
              onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
              disabled={currentSection === 1}
              className={`
                group relative px-6 py-3 font-black uppercase tracking-wider transition-all duration-300 border-2 flex items-center gap-2
                ${currentSection === 1
                  ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600 hover:border-gray-500'
                }
              `}
            >
              <ArrowLeft size={18} />
              НАЗАД
            </button>

            <div className="flex items-center space-x-4">
              {currentSection < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentSection(Math.min(5, currentSection + 1))}
                  className="group relative bg-orange-600 hover:bg-white text-black hover:text-black font-black px-6 py-3 border-2 border-black hover:border-orange-600 uppercase tracking-wider transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="relative">ДАЛЕЕ</span>
                  <ArrowRight size={18} />
                  <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    group relative font-black px-8 py-4 border-2 uppercase tracking-wider text-lg transition-all duration-300 transform flex items-center gap-3
                    ${loading
                      ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-white text-white hover:text-black border-black hover:border-green-600 hover:scale-105'
                    }
                  `}
                >
                  <span className="relative flex items-center gap-3">
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        СОХРАНЯЕМ...
                      </>
                    ) : (
                      <>
                        <Rocket size={20} />
                        {mode === 'create' ? 'ОПУБЛИКОВАТЬ' : 'СОХРАНИТЬ'}
                      </>
                    )}
                  </span>
                  
                  {!loading && (
                    <>
                      <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-green-600 transition-colors"></div>
                      <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-green-600 transition-colors"></div>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Компонент секции формы
const FormSectionRedesigned = ({ title, icon: IconComponent, children }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-6 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3">
          <IconComponent size={28} />
          {title}
        </h2>
        <div className="w-16 h-0.5 bg-orange-600 mb-6"></div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Компонент поля формы
const FormFieldRedesigned = ({ label, error, icon: IconComponent, children }) => {
  return (
    <div className="group">
      <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
        {IconComponent && <IconComponent size={16} />}
        {label}
      </label>
      <div className="relative">
        {children}
        <div className={`
          absolute top-2 left-2 w-2 h-2 transition-colors duration-300
          ${error ? 'bg-red-500' : 'bg-orange-600'}
        `}></div>
      </div>
      {error && (
        <div className="mt-2 text-red-400 font-bold uppercase tracking-wide text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500"></div>
          {error}
        </div>
      )}
    </div>
  );
};

// Компонент чекбокса
const FormCheckboxRedesigned = ({ label, checked, onChange, icon: IconComponent }) => {
  return (
    <label className="flex items-center gap-4 cursor-pointer p-4 bg-gray-800 border-2 border-gray-600 hover:border-orange-500 transition-colors duration-300 group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors duration-300 ${
          checked 
            ? 'bg-orange-600 border-orange-600' 
            : 'bg-gray-700 border-gray-500 group-hover:border-orange-500'
        }`}>
          {checked && (
            <Check size={16} className="text-black" />
          )}
        </div>
      </div>
      <span className="text-white font-bold uppercase tracking-wide flex items-center gap-2">
        {IconComponent && <IconComponent size={16} />}
        {label}
      </span>
    </label>
  );
};

// Заглушки для компонентов селекторов (нужно будет создать отдельно)
const BrandSelectorRedesigned = ({ value, onChange, error }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
        focus:outline-none uppercase tracking-wide
        ${error 
          ? 'border-red-500 focus:border-red-400' 
          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
        }
      `}
    >
      <option value="">ВЫБЕРИТЕ МАРКУ</option>
      {/* Здесь будут опции из API */}
    </select>
  );
};

const ModelSelectorRedesigned = ({ brandId, value, onChange, error, disabled }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full p-4 text-white font-bold border-2 transition-all duration-300
        focus:outline-none uppercase tracking-wide
        ${disabled 
          ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed' 
          : error 
            ? 'bg-gray-900 border-red-500 focus:border-red-400' 
            : 'bg-gray-900 border-gray-700 focus:border-orange-500 hover:border-gray-600'
        }
      `}
    >
      <option value="">ВЫБЕРИТЕ МОДЕЛЬ</option>
      {/* Здесь будут опции из API */}
    </select>
  );
};

const LocationSelectorRedesigned = ({ value, onChange, error }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
        focus:outline-none uppercase tracking-wide
        ${error 
          ? 'border-red-500 focus:border-red-400' 
          : 'border-gray-700 focus:border-orange-500 hover:border-gray-600'
        }
      `}
    >
      <option value="">ВЫБЕРИТЕ ГОРОД</option>
      {/* Здесь будут опции из API */}
    </select>
  );
};

const CarAttributesRedesigned = ({ attributes, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="text-center text-gray-400 font-bold uppercase tracking-wide flex items-center justify-center gap-3">
        <Settings size={24} className="text-gray-600" />
        ХАРАКТЕРИСТИКИ БУДУТ ЗДЕСЬ
      </div>
    </div>
  );
};

const ImageUploaderRedesigned = ({ images, onUpload, onRemove }) => {
  return (
    <div className="space-y-6">
      <div className="border-4 border-dashed border-orange-600 bg-gray-900 p-12 text-center hover:bg-gray-800 transition-colors duration-300 cursor-pointer relative overflow-hidden">
        <div className="absolute top-4 left-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-white"></div>
        
        <div className="mb-4">
          <Camera size={72} className="text-gray-500 mx-auto" />
        </div>
        <div className="text-2xl font-black text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-3">
          <Upload size={24} />
          ДОБАВИТЬ ФОТО
        </div>
        <div className="text-gray-400 font-bold uppercase tracking-wide text-sm">
          ПЕРЕТАЩИТЕ ФАЙЛЫ СЮДА ИЛИ НАЖМИТЕ ДЛЯ ВЫБОРА
        </div>
      </div>
      
      {images.length > 0 && (
        <div className="text-center text-gray-400 font-bold uppercase tracking-wide flex items-center justify-center gap-2">
          <Camera size={16} />
          ЗАГРУЖЕНО: {images.length} ФОТО
        </div>
      )}
    </div>
  );
};

export default ListingForm;