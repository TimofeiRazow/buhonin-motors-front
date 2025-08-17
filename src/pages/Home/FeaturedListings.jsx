import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Eye } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const FeaturedListings = () => {
  const { data: listings, isLoading, error } = useQuery(
    'featured-listings',
    () => api.get('/api/listings/?featured=true&limit=8')
  );

  if (isLoading) return <LoadingSpinner text="Загружаем рекомендуемые объявления..." />;
  if (error) return null;

  const listingsData = listings?.data?.listings || [];

  if (listingsData.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider m-0">
          РЕКОМЕНДУЕМЫЕ
          <span className="text-orange-500"> АВТО</span>
        </h2>
        <Link 
          to="/search?featured=true"
          className="group relative bg-orange-600 hover:bg-white text-black font-black px-6 py-3 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
        >
          <div className="absolute inset-0 border-2 border-black group-hover:border-orange-600 transition-colors"></div>
          <span className="relative group-hover:text-black">СМОТРЕТЬ ВСЕ →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listingsData.map(listing => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))}
      </div>
    </section>
  );
};

const ListingCard = ({ listing }) => {
  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const getMainImage = () => {
    return listing.main_image_url || '/placeholder-car.jpg';
  };

  return (
    <Link
      to={`/listings/${listing.listing_id}`}
      className="group block text-white hover:text-white no-underline"
    >
      <div className="bg-gray-900 border-4 border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden">
        {/* Изображение */}
        <div className="relative h-48 bg-gray-800 overflow-hidden">
          <img
            src={getMainImage()}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg';
            }}
          />
          
          {/* Overlay градиент */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {listing.is_featured && (
            <div className="absolute top-3 left-3 bg-orange-600 text-black font-black px-3 py-1 text-xs uppercase tracking-wider">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-black mr-2"></span>
                VIP
              </div>
            </div>
          )}
          
          {listing.images_count > 1 && (
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white font-bold px-3 py-1 text-xs border-2 border-orange-500 flex items-center">
              <Camera size={12} className="mr-1" />
              {listing.images_count}
            </div>
          )}

          {/* Геометрические элементы */}
          <div className="absolute top-0 right-0 w-8 h-8 bg-orange-600 transform rotate-45 translate-x-4 -translate-y-4"></div>
        </div>

        {/* Информация */}
        <div className="p-4 bg-gray-900">
          <h3 className="font-black text-lg mb-3 text-white uppercase tracking-wide leading-tight h-12 overflow-hidden">
            {listing.title}
          </h3>

          {/* Цена - брутальный блок */}
          <div className="bg-orange-600 text-black font-black text-xl p-3 mb-4 relative">
            <div className="absolute top-1 right-1 w-3 h-3 bg-black"></div>
            {formatPrice(listing.price, listing.currency_code)}
          </div>

          {/* Характеристики */}
          <div className="space-y-2 mb-4">
            {(listing.year || listing.mileage) && (
              <div className="flex items-center text-gray-300 font-bold text-sm">
                <div className="w-2 h-2 bg-orange-500 mr-3"></div>
                {listing.year && `${listing.year} Г.`}
                {listing.year && listing.mileage && ' • '}
                {listing.mileage && `${new Intl.NumberFormat('ru-KZ').format(listing.mileage)} КМ`}
              </div>
            )}
            
            <div className="flex items-center text-gray-300 font-bold text-sm">
              <div className="w-2 h-2 bg-white mr-3"></div>
              <MapPin size={14} className="mr-1" />
              {listing.city_name?.toUpperCase()}
              {listing.region_name && `, ${listing.region_name?.toUpperCase()}`}
            </div>
          </div>

          {/* Нижняя секция */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-gray-700">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">
              {new Date(listing.published_date).toLocaleDateString('ru-RU')}
            </span>
            <div className="flex items-center bg-black px-2 py-1 border border-orange-500">
              <Eye size={12} className="text-orange-500 mr-1" />
              <span className="text-orange-500 font-bold text-xs">
                {listing.view_count || 0}
              </span>
            </div>
          </div>

          {/* Декоративная линия */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-white to-orange-600"></div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedListings;