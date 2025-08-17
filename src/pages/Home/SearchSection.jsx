import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Search } from 'lucide-react';
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
  const { data: brands } = useQuery('brands', () => api.get('/api/cars/brands'));
  console.log("Проблема в SearchSection", brands)
  const models = useQuery(
    ['models', filters.brand_id], 
    () => api.get(`/api/cars/brands/${filters.brand_id}/models`),
    { enabled: !!filters.brand_id }
  );
  const { data: cities } = useQuery('cities', () => api.get('/api/locations/cities?popular=true'));
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
    <div className="relative bg-black border-4 border-orange-600 p-8 max-w-5xl mx-auto overflow-hidden">
      {/* Геометрические элементы фона */}
      <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
      <div className="absolute bottom-0 right-0 w-full h-2 bg-white"></div>
      <div className="absolute top-4 right-4 w-6 h-6 bg-orange-600 rotate-45"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 bg-white"></div>
      
      <form onSubmit={handleSearch} className="relative z-10">
        {/* Заголовок формы */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2">
            НАЙДИ СВОЮ
            <span className="text-orange-500"> МАШИНУ</span>
          </h3>
          <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Марка */}
          <div className="group">
            <label className="block mb-3 font-black text-white uppercase tracking-wider text-sm">
              МАРКА
            </label>
            <div className="relative">
              <select
                value={filters.brand_id}
                onChange={(e) => handleFilterChange('brand_id', e.target.value)}
                className="w-full p-4 bg-gray-900 border-2 border-gray-700 text-white font-bold focus:border-orange-500 focus:outline-none transition-colors appearance-none cursor-pointer hover:border-orange-400"
              >
                <option value="" className="bg-gray-900 text-white">ЛЮБАЯ МАРКА</option>
                {brands?.data?.data?.map(brand => (
                  <option key={brand.brand_id} value={brand.brand_id} className="bg-gray-900 text-white">
                    {brand.brand_name.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* Кастомная стрелка */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
              </div>
              {/* Декоративный элемент */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
            </div>
          </div>

          {/* Модель */}
          <div className="group">
            <label className="block mb-3 font-black text-white uppercase tracking-wider text-sm">
              МОДЕЛЬ
            </label>
            <div className="relative">
              <select
                value={filters.model_id}
                onChange={(e) => handleFilterChange('model_id', e.target.value)}
                disabled={!filters.brand_id}
                className={`w-full p-4 border-2 text-white font-bold focus:outline-none transition-colors appearance-none cursor-pointer ${
                  !filters.brand_id 
                    ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-900 border-gray-700 hover:border-orange-400 focus:border-orange-500'
                }`}
              >
                <option value="" className="bg-gray-900 text-white">ЛЮБАЯ МОДЕЛЬ</option>
                {models?.data?.map(model => (
                  <option key={model.model_id} value={model.model_id} className="bg-gray-900 text-white">
                    {model.model_name.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* Кастомная стрелка */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 ${
                  !filters.brand_id ? 'border-t-gray-500' : 'border-t-orange-500'
                }`}></div>
              </div>
              {/* Декоративный элемент */}
              <div className={`absolute top-2 left-2 w-2 h-2 ${
                !filters.brand_id ? 'bg-gray-600' : 'bg-orange-600'
              }`}></div>
            </div>
          </div>

          {/* Город */}
          <div className="group">
            <label className="block mb-3 font-black text-white uppercase tracking-wider text-sm">
              ГОРОД
            </label>
            <div className="relative">
              <select
                value={filters.city_id}
                onChange={(e) => handleFilterChange('city_id', e.target.value)}
                className="w-full p-4 bg-gray-900 border-2 border-gray-700 text-white font-bold focus:border-orange-500 focus:outline-none transition-colors appearance-none cursor-pointer hover:border-orange-400"
              >
                <option value="" className="bg-gray-900 text-white">ЛЮБОЙ ГОРОД</option>
                {cities?.data?.data.map(city => (
                  <option key={city.city_id} value={city.city_id} className="bg-gray-900 text-white">
                    {city.city_name.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* Кастомная стрелка */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-orange-500"></div>
              </div>
              {/* Декоративный элемент */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
            </div>
          </div>

          {/* Цена от */}
          <div className="group">
            <label className="block mb-3 font-black text-white uppercase tracking-wider text-sm">
              ЦЕНА ОТ
            </label>
            <div className="relative">
              <input
                type="number"
                value={filters.price_from}
                onChange={(e) => handleFilterChange('price_from', e.target.value)}
                placeholder="0"
                className="w-full p-4 bg-gray-900 border-2 border-gray-700 text-white font-bold focus:border-orange-500 focus:outline-none transition-colors placeholder-gray-500 hover:border-orange-400"
              />
              {/* Декоративный элемент */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
              {/* Валюта */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500 font-black text-sm">
                ₸
              </div>
            </div>
          </div>

          {/* Цена до */}
          <div className="group">
            <label className="block mb-3 font-black text-white uppercase tracking-wider text-sm">
              ЦЕНА ДО
            </label>
            <div className="relative">
              <input
                type="number"
                value={filters.price_to}
                onChange={(e) => handleFilterChange('price_to', e.target.value)}
                placeholder="∞"
                className="w-full p-4 bg-gray-900 border-2 border-gray-700 text-white font-bold focus:border-orange-500 focus:outline-none transition-colors placeholder-gray-500 hover:border-orange-400"
              />
              {/* Декоративный элемент */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
              {/* Валюта */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500 font-black text-sm">
                ₸
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка поиска */}
        <div className="text-center">
          <button
            type="submit"
            className="group relative bg-orange-600 hover:bg-white text-black font-black px-12 py-6 text-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
            <span className="relative group-hover:text-black flex items-center justify-center">
              <Search className="mr-3" size={24} />
              НАЙТИ АВТОМОБИЛИ
              <Search className="ml-3" size={24} />
            </span>
            
            {/* Декоративные элементы кнопки */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center mt-6">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
            БОЛЕЕ 50,000 ОБЪЯВЛЕНИЙ ЖДУТ ТЕБЯ
          </p>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;