import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { 
  Heart, 
  Camera, 
  MapPin, 
  Eye, 
  Star, 
  Clock, 
  Car,
  Loader
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';

const ListingCard = ({ listing, viewMode = 'grid', index = 0 }) => {
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation(
    () => api.post(`/api/listings/${listing.listing_id}/favorite`),
    {
      onSuccess: () => {
        setIsFavorite(!isFavorite);
        queryClient.invalidateQueries('listings');
        queryClient.invalidateQueries('favorites');
      },
      onError: (error) => {
        console.error('Error toggling favorite:', error);
      }
    }
  );

  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const getMainImage = () => {
    return listing.main_image_url || '/placeholder-car.jpg';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'СЕГОДНЯ';
    if (diffDays === 2) return 'ВЧЕРА';
    if (diffDays <= 7) return `${diffDays} ДНЕЙ НАЗАД`;
    return date.toLocaleDateString('ru-RU').toUpperCase();
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Показать модал входа или уведомление
      alert('ДЛЯ ДОБАВЛЕНИЯ В ИЗБРАННОЕ НЕОБХОДИМО ВОЙТИ В АККАУНТ');
      return;
    }
    
    favoriteMutation.mutate();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Список вид
  if (viewMode === 'list') {
    return <ListingCardListView listing={listing} />;
  }

  return (
    <div 
      className={`
        group bg-black border-2 border-gray-700 hover:border-orange-600 cursor-pointer 
        transition-all duration-300 transform hover:scale-105 relative overflow-hidden
        animate-fadeInUp
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Геометрические элементы карточки */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600 group-hover:bg-white transition-colors duration-300"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      <Link
        to={`/listings/${listing.listing_id}`}
        className="block text-inherit no-underline"
      >
        {/* Изображение */}
        <div className="relative h-48 bg-gray-800 overflow-hidden">
          {!imageError ? (
            <img
              src={getMainImage()}
              alt={listing.title}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Car size={48} className="text-gray-500" />
            </div>
          )}

          {/* Бейджи */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {listing.is_featured && (
              <div className="bg-orange-600 text-black px-2 py-1 font-black text-xs uppercase border border-black">
                VIP
              </div>
            )}
            {listing.is_urgent && (
              <div className="bg-red-600 text-white px-2 py-1 font-black text-xs uppercase border border-black">
                СРОЧНО
              </div>
            )}
          </div>

          {/* Количество фото */}
          {listing.images_count > 1 && (
            <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 font-bold text-xs border border-orange-600 flex items-center gap-1">
              <Camera size={12} />
              {listing.images_count}
            </div>
          )}

          {/* Кнопка избранного */}
          {isAuthenticated && (
            <FavoriteButtonRedesigned
              isFavorite={isFavorite}
              onClick={handleFavoriteClick}
              loading={favoriteMutation.isLoading}
              isHovered={isHovered}
            />
          )}

          {/* Оверлей при наведении */}
          <div className={`
            absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
            transition-all duration-300 flex items-center justify-center
          `}>
            <div className={`
              text-white font-black uppercase tracking-wider text-sm 
              transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100
              transition-all duration-300
            `}>
              ПОДРОБНЕЕ →
            </div>
          </div>
        </div>

        {/* Информация */}
        <div className="p-4 relative z-10">
          <h3 className="text-white font-black uppercase tracking-wide text-sm mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300 leading-tight">
            {listing.title}
          </h3>

          <div className="mb-3">
            <div className="text-2xl font-black text-orange-600 mb-1">
              {formatPrice(listing.price, listing.currency_code)}
            </div>
            {listing.is_negotiable && (
              <div className="text-gray-400 font-bold uppercase text-xs tracking-wide">
                ТОРГ ВОЗМОЖЕН
              </div>
            )}
          </div>

          {/* Характеристики */}
          <div className="space-y-1 mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
            {listing.year && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-orange-600 mr-2"></span>
                {listing.year} ГОД
              </div>
            )}
            {listing.mileage && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-orange-600 mr-2"></span>
                {new Intl.NumberFormat('ru-KZ').format(listing.mileage)} КМ
              </div>
            )}
            {listing.engine_volume && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-orange-600 mr-2"></span>
                {listing.engine_volume}Л
              </div>
            )}
          </div>

          {/* Локация */}
          <div className="flex items-center text-xs font-bold uppercase tracking-wide text-gray-500 mb-3 gap-1">
            <MapPin size={12} />
            {listing.city_name}
            {listing.region_name && `, ${listing.region_name}`}
          </div>

          {/* Нижняя строка */}
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
            <span className="text-gray-600">
              {formatDate(listing.published_date)}
            </span>
            <div className="flex items-center space-x-3 text-gray-500">
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {listing.view_count || 0}
              </span>
              {listing.favorite_count > 0 && (
                <span className="flex items-center gap-1">
                  <Heart size={12} />
                  {listing.favorite_count}
                </span>
              )}
            </div>
          </div>

          {/* Полоска состояния */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              {listing.user_rating && (
                <div className="flex items-center text-xs font-bold text-orange-500 gap-1">
                  <Star size={12} />
                  {listing.user_rating}
                </div>
              )}
              
              <div className={`
                text-xs font-black uppercase tracking-wider px-2 py-1 border
                ${listing.condition === 'excellent' 
                  ? 'text-green-500 border-green-500' 
                  : listing.condition === 'good'
                    ? 'text-yellow-500 border-yellow-500'
                    : 'text-gray-500 border-gray-500'
                }
              `}>
                {listing.condition ? listing.condition.toUpperCase() : 'СОСТОЯНИЕ НЕ УКАЗАНО'}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Компонент кнопки избранного
const FavoriteButtonRedesigned = ({ isFavorite, onClick, loading, isHovered }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        absolute top-2 right-2 w-10 h-10 border-2 border-black transition-all duration-300 
        transform group-button flex items-center justify-center
        ${isFavorite 
          ? 'bg-red-600 text-white hover:bg-red-500' 
          : 'bg-white text-black hover:bg-red-600 hover:text-white'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
        ${isHovered ? 'opacity-100' : 'opacity-90'}
      `}
    >
      {loading ? (
        <Loader size={16} className="animate-spin" />
      ) : (
        <Heart 
          size={16} 
          className={`${isFavorite ? 'fill-current' : ''}`}
        />
      )}
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-button-hover:bg-black transition-colors"></div>
    </button>
  );
};

// Компонент списочного вида
const ListingCardListView = ({ listing }) => {
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);
  const [imageError, setImageError] = useState(false);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation(
    () => api.post(`/api/listings/${listing.listing_id}/favorite`),
    {
      onSuccess: () => {
        setIsFavorite(!isFavorite);
        queryClient.invalidateQueries('listings');
        queryClient.invalidateQueries('favorites');
      }
    }
  );

  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU').toUpperCase();
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('ДЛЯ ДОБАВЛЕНИЯ В ИЗБРАННОЕ НЕОБХОДИМО ВОЙТИ В АККАУНТ');
      return;
    }
    
    favoriteMutation.mutate();
  };

  return (
    <div className="group bg-black border-2 border-gray-700 hover:border-orange-600 cursor-pointer transition-all duration-300 p-4 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>

      <Link to={`/listings/${listing.listing_id}`} className="block text-inherit no-underline">
        <div className="relative z-10 flex items-center space-x-4">
          {/* Миниатюра */}
          <div className="w-24 h-24 bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-600 relative">
            {!imageError && listing.main_image_url ? (
              <img
                src={listing.main_image_url}
                alt={listing.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={32} className="text-gray-500" />
              </div>
            )}

            {/* Бейджи на миниатюре */}
            {(listing.is_featured || listing.is_urgent) && (
              <div className="absolute top-1 left-1 flex flex-col gap-1">
                {listing.is_featured && (
                  <div className="bg-orange-600 text-black px-1 py-0.5 font-black text-xs">VIP</div>
                )}
                {listing.is_urgent && (
                  <div className="bg-red-600 text-white px-1 py-0.5 font-black text-xs">!</div>
                )}
              </div>
            )}
          </div>

          {/* Информация */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-black uppercase tracking-wide text-sm group-hover:text-orange-500 transition-colors duration-300 truncate mr-4 flex-1">
                {listing.title}
              </h3>
              <div className="text-xl font-black text-orange-600 flex-shrink-0">
                {formatPrice(listing.price, listing.currency_code)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                {listing.year && <span>{listing.year}</span>}
                {listing.mileage && <span>{new Intl.NumberFormat('ru-KZ').format(listing.mileage)} КМ</span>}
                {listing.engine_volume && <span>{listing.engine_volume}Л</span>}
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {listing.city_name}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                <span>{formatDate(listing.published_date)}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {listing.view_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isAuthenticated && (
              <button
                onClick={handleFavoriteClick}
                disabled={favoriteMutation.isLoading}
                className={`
                  w-8 h-8 border-2 border-black transition-all duration-300 flex items-center justify-center
                  ${isFavorite 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-black hover:bg-red-600 hover:text-white'
                  }
                  ${favoriteMutation.isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
              >
                {favoriteMutation.isLoading ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  <Heart 
                    size={14} 
                    className={`${isFavorite ? 'fill-current' : ''}`}
                  />
                )}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

// Добавляем CSS анимации
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .group-button:hover .group-button-hover\\:bg-black {
    background-color: black;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('listing-card-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'listing-card-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ListingCard;