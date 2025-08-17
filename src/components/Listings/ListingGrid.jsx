import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid3X3, 
  List, 
  Car, 
  Heart, 
  Camera, 
  MapPin, 
  Eye, 
  Star, 
  Search,
  DollarSign,
  Calendar,
  Gauge,
  Fuel,
  Award
} from 'lucide-react';

const ListingGrid = ({ listings, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'list'
  const navigate = useNavigate();

  if (loading) {
    return <ListingGridSkeleton />;
  }

  if (!listings || listings.length === 0) {
    return <EmptyStateRedesigned />;
  }

  return (
    <div className="relative">
      {/* Хедер с переключателем вида */}
      <div className="mb-6 bg-gray-900 border-2 border-gray-700 p-4 relative overflow-hidden">
        <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
        <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              НАЙДЕНО: {listings.length} ОБЪЯВЛЕНИЙ
            </h2>
            <div className="w-16 h-0.5 bg-orange-600 mt-1"></div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                group p-2 border-2 transition-all duration-300 flex items-center justify-center
                ${viewMode === 'grid' 
                  ? 'bg-orange-600 border-black text-black' 
                  : 'bg-gray-800 border-gray-600 text-white hover:border-orange-500'
                }
              `}
              title="Сетка"
            >
              <Grid3X3 size={16} className="font-black" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                group p-2 border-2 transition-all duration-300 flex items-center justify-center
                ${viewMode === 'list' 
                  ? 'bg-orange-600 border-black text-black' 
                  : 'bg-gray-800 border-gray-600 text-white hover:border-orange-500'
                }
              `}
              title="Список"
            >
              <List size={16} className="font-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Сетка объявлений */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }
      `}>
        {listings.map((listing, index) => (
          <ListingCardRedesigned 
            key={listing.listing_id} 
            listing={listing} 
            viewMode={viewMode}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

// Компонент карточки объявления
const ListingCardRedesigned = ({ listing, viewMode, index }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/listings/${listing.listing_id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Здесь добавить API вызов для добавления/удаления из избранного
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return <ListingCardListView listing={listing} />;
  }

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-black border-2 border-gray-700 hover:border-orange-600 cursor-pointer transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Геометрические элементы карточки */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600 group-hover:bg-white transition-colors duration-300"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Изображение */}
      <div className="relative h-48 bg-gray-800 overflow-hidden">
        {!imageError && listing.main_image_url ? (
          <img
            src={listing.main_image_url}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <Car size={32} className="text-gray-500" />
          </div>
        )}

        {/* Бадж VIP */}
        {listing.is_featured && (
          <div className="absolute top-2 left-2 bg-orange-600 text-black px-2 py-1 font-black text-xs uppercase border border-black flex items-center gap-1">
            <Award size={12} />
            VIP
          </div>
        )}

        {/* Бадж срочно */}
        {listing.is_urgent && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 font-black text-xs uppercase border border-black">
            СРОЧНО
          </div>
        )}

        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute bottom-2 right-2 w-8 h-8 border-2 border-black transition-all duration-300 flex items-center justify-center
            ${isFavorite 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-black hover:bg-red-600 hover:text-white'
            }
          `}
        >
          <Heart size={16} className={`font-black ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Количество фото */}
        {listing.images_count > 1 && (
          <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 font-bold text-xs border border-orange-600 flex items-center gap-1">
            <Camera size={12} />
            {listing.images_count}
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="p-4 relative z-10">
        <h3 className="text-white font-black uppercase tracking-wide text-sm mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
          {listing.title}
        </h3>

        <div className="mb-3">
          <div className="text-2xl font-black text-orange-600 mb-1">
            {formatPrice(listing.price)} ₸
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
              <Calendar size={10} className="mr-1" />
              {listing.year} ГОД
            </div>
          )}
          {listing.mileage && (
            <div className="flex items-center">
              <span className="w-1 h-1 bg-orange-600 mr-2"></span>
              <Gauge size={10} className="mr-1" />
              {formatPrice(listing.mileage)} КМ
            </div>
          )}
          {listing.engine_volume && (
            <div className="flex items-center">
              <span className="w-1 h-1 bg-orange-600 mr-2"></span>
              <Fuel size={10} className="mr-1" />
              {listing.engine_volume}Л
            </div>
          )}
        </div>

        {/* Локация и дата */}
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
          <span className="text-gray-500 flex items-center">
            <MapPin size={12} className="mr-1" />
            {listing.city_name}
          </span>
          <span className="text-gray-600">
            {formatDate(listing.published_date)}
          </span>
        </div>

        {/* Статистика */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
          <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wide text-gray-500">
            <span className="flex items-center">
              <Eye size={12} className="mr-1" />
              {listing.view_count}
            </span>
            {listing.favorite_count > 0 && (
              <span className="flex items-center">
                <Heart size={12} className="mr-1" />
                {listing.favorite_count}
              </span>
            )}
          </div>
          
          {listing.user_rating && (
            <div className="flex items-center text-xs font-bold text-orange-500">
              <Star size={12} className="mr-1 fill-current" />
              {listing.user_rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Список вид карточки
const ListingCardListView = ({ listing }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <div 
      onClick={() => navigate(`/listings/${listing.listing_id}`)}
      className="group bg-black border-2 border-gray-700 hover:border-orange-600 cursor-pointer transition-all duration-300 p-4 relative overflow-hidden"
    >
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>

      <div className="relative z-10 flex items-center space-x-4">
        {/* Миниатюра */}
        <div className="w-20 h-20 bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-600 flex items-center justify-center">
          {listing.main_image_url ? (
            <img
              src={listing.main_image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Car size={20} className="text-gray-500" />
          )}
        </div>

        {/* Информация */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-black uppercase tracking-wide text-sm group-hover:text-orange-500 transition-colors duration-300 truncate mr-4">
              {listing.title}
            </h3>
            <div className="text-xl font-black text-orange-600 flex-shrink-0">
              {formatPrice(listing.price)} ₸
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wide text-gray-400">
            {listing.year && (
              <span className="flex items-center">
                <Calendar size={10} className="mr-1" />
                {listing.year}
              </span>
            )}
            {listing.mileage && (
              <span className="flex items-center">
                <Gauge size={10} className="mr-1" />
                {formatPrice(listing.mileage)} КМ
              </span>
            )}
            {listing.engine_volume && (
              <span className="flex items-center">
                <Fuel size={10} className="mr-1" />
                {listing.engine_volume}Л
              </span>
            )}
            <span className="flex items-center">
              <MapPin size={10} className="mr-1" />
              {listing.city_name}
            </span>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            className={`
              w-8 h-8 border-2 border-black transition-all duration-300 flex items-center justify-center
              ${isFavorite 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }
            `}
          >
            <Heart size={16} className={`font-black ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Пустое состояние
const EmptyStateRedesigned = () => {
  return (
    <div className="bg-black border-4 border-orange-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
      <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>

      <div className="relative z-10 text-center py-20 px-8">
        <div className="text-6xl mb-6 flex justify-center">
          <Search size={64} className="text-gray-500" />
        </div>
        
        <h3 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
          ОБЪЯВЛЕНИЯ НЕ НАЙДЕНЫ
        </h3>
        <div className="w-20 h-1 bg-orange-600 mx-auto mb-6"></div>
        
        <p className="text-gray-400 font-bold uppercase tracking-wide text-lg mb-8">
          ПОПРОБУЙТЕ ИЗМЕНИТЬ ПАРАМЕТРЫ ПОИСКА
        </p>

        <div className="space-y-3 text-gray-500 font-bold uppercase tracking-wide text-sm max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            <DollarSign size={14} className="mr-2" />
            РАСШИРЬТЕ ДИАПАЗОН ЦЕН
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            <MapPin size={14} className="mr-2" />
            ВЫБЕРИТЕ ДРУГОЙ ГОРОД
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            УБЕРИТЕ НЕКОТОРЫЕ ФИЛЬТРЫ
          </div>
        </div>
      </div>
    </div>
  );
};

// Скелетон для состояния загрузки
const ListingGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index}
          className="bg-gray-900 border-2 border-gray-700 animate-pulse relative overflow-hidden"
        >
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600"></div>
          
          {/* Изображение скелетон */}
          <div className="h-48 bg-gray-800"></div>
          
          {/* Контент скелетон */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-gray-700 rounded w-1/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;