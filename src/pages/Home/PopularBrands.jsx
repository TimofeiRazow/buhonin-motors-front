import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const PopularBrands = () => {
  const { data: brands, isLoading, error } = useQuery(
    'popular-brands',
    () => api.get('/api/cars/brands?popular=true&limit=12')
  );

  if (isLoading) return <LoadingSpinner text="Загружаем популярные марки..." />;
  if (error) return null;

  const brandsData = brands?.data || [];
  console.log("Проблема в PopularBrands", brandsData)

  if (brandsData.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider m-0">
          ПОПУЛЯРНЫЕ
          <span className="text-orange-500"> БРЕНДЫ</span>
        </h2>
        <Link 
          to="/search"
          className="group relative bg-white hover:bg-orange-600 text-black hover:text-white font-black px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
        >
          <div className="absolute inset-0 border-2 border-black transition-colors"></div>
          <span className="relative">ВСЕ МАРКИ →</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brandsData.data ? brandsData.data.map(brand => (
          <BrandCard key={brand.brand_id} brand={brand} />
        )) : <></>}
      </div>
    </section>
  );
};

const BrandCard = ({ brand }) => {
  console.log("Проблема в BrandCard", brand)
  
  return (
    <Link
      to={`/search?brand_id=${brand.brand_id}`}
      className="group block text-white hover:text-white no-underline"
    >
      <div className="relative bg-gray-900 border-4 border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl p-6 text-center overflow-hidden">
        {/* Геометрические элементы фона */}
        <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-orange-600 group-hover:bg-white transition-colors"></div>
        <div className="absolute bottom-2 left-2 w-4 h-1 bg-white group-hover:bg-orange-600 transition-colors"></div>

        {/* Логотип */}
        <div className="relative w-16 h-16 mx-auto mb-4 bg-black border-2 border-orange-500 flex items-center justify-center overflow-hidden group-hover:bg-orange-600 transition-colors">
          {/* Декоративные элементы */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-orange-500 group-hover:bg-black transition-colors"></div>
          
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.brand_name}
              className="max-w-full max-h-full object-contain filter group-hover:brightness-0 transition-all"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div className="text-2xl font-black text-orange-500 group-hover:text-black transition-colors">
              {brand.brand_name.charAt(0)}
            </div>
          )}
          <div className="hidden text-2xl font-black text-orange-500 group-hover:text-black transition-colors">
            {brand.brand_name.charAt(0)}
          </div>
        </div>

        {/* Название */}
        <h3 className="font-black text-base mb-2 text-white uppercase tracking-wider leading-tight">
          {brand.brand_name}
        </h3>

        {/* Количество объявлений */}
        {brand.listings_count && (
          <div className="bg-orange-600 text-black font-bold px-2 py-1 text-xs mb-2 inline-block uppercase tracking-wide">
            {brand.listings_count} АВТО
          </div>
        )}

        {/* Страна происхождения */}
        {brand.country_origin && (
          <p className="text-gray-400 font-bold text-xs uppercase tracking-wider m-0">
            {brand.country_origin}
          </p>
        )}

        {/* Hover эффект - дополнительные элементы */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-l-transparent border-b-8 border-b-orange-600"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-r-8 border-r-transparent border-t-8 border-t-white"></div>
        </div>
      </div>
    </Link>
  );
};

export default PopularBrands;