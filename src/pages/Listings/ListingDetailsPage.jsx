import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Car,
  AlertTriangle,
  Search,
  MapPin,
  ChevronRight,
  Camera,
  FileText,
  Settings,
  User,
  Star,
  Edit,
  Heart,
  Share2,
  BarChart3,
  Eye,
  Calendar,
  RefreshCw,
  Zap,
  Crown
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ImageGallery from '../../components/Listings/ImageGallery';
import ContactButtons from '../../components/Listings/ContactButtons';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Загружаем данные объявления
  const { data: listing, isLoading, error } = useQuery(
    ['listing', id],
    () => api.get(`/api/listings/${id}`),
    {
      onSuccess: () => {
        // Увеличиваем счетчик просмотров
        incrementViewMutation.mutate();
      }
    }
  );

  // Мутация для увеличения просмотров
  const incrementViewMutation = useMutation(
    () => api.post(`/api/listings/${id}/view`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['listing', id]);
      }
    }
  );

  // Мутация для избранного
  const favoriteMutation = useMutation(
    () => api.post(`/api/listings/${id}/favorite`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['listing', id]);
        queryClient.invalidateQueries('favorites');
      }
    }
  );

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      alert('Для добавления в избранное необходимо войти в аккаунт');
      return;
    }
    favoriteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="bg-black border-4 border-orange-600 p-16 text-center">
        <Car className="w-16 h-16 text-orange-500 mx-auto mb-6" />
        <p className="text-orange-100 font-black uppercase tracking-wider text-xl mb-6">
          ЗАГРУЖАЕМ ОБЪЯВЛЕНИЕ...
        </p>
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-600 border-4 border-black p-12 text-center relative">
        <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
        <div className="absolute bottom-2 right-2 w-6 h-1 bg-black"></div>
        
        <AlertTriangle className="w-16 h-16 text-white mx-auto mb-6" />
        <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
          ОБЪЯВЛЕНИЕ
          <span className="block">НЕ НАЙДЕНО</span>
        </h2>
        <p className="text-white font-bold mb-8 uppercase tracking-wide">
          ОБЪЯВЛЕНИЕ МОЖЕТ БЫТЬ УДАЛЕНО ИЛИ<br />
          У ВАС НЕТ ПРАВ ДЛЯ ЕГО ПРОСМОТРА
        </p>
        <Link 
          to="/search"
          className="group relative inline-flex items-center gap-2 bg-black hover:bg-white text-red-600 hover:text-black font-black px-8 py-4 border-2 border-red-600 hover:border-black uppercase tracking-wider no-underline transition-all duration-300 transform hover:scale-105"
        >
          <Search className="w-5 h-5" />
          <span className="relative">ВЕРНУТЬСЯ К ПОИСКУ</span>
          <div className="absolute top-1 left-1 w-3 h-3 bg-red-600 group-hover:bg-black transition-colors"></div>
        </Link>
      </div>
    );
  }

  const listingData = listing?.data;
  if (!listingData) return null;

  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOwner = user && user.user_id === listingData.user_id;

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 right-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-1/3 left-10 w-4 h-4 bg-orange-600 rotate-12 opacity-30"></div>
      
      {/* Breadcrumbs */}
      <nav className="mb-6 p-4 bg-gray-900 border-2 border-orange-600 relative">
        <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
        <div className="text-orange-300 font-bold uppercase tracking-wider text-sm flex items-center">
          <Link to="/" className="text-orange-400 hover:text-orange-200 no-underline transition-colors">
            ГЛАВНАЯ
          </Link>
          <ChevronRight className="w-4 h-4 text-white mx-2" />
          <Link to="/search" className="text-orange-400 hover:text-orange-200 no-underline transition-colors">
            ПОИСК
          </Link>
          <ChevronRight className="w-4 h-4 text-white mx-2" />
          <span className="text-orange-100">{listingData.title.toUpperCase()}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка - основной контент */}
        <div className="lg:col-span-2 space-y-6">
          {/* Заголовок */}
          <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-wider flex-1 mr-4">
                  {listingData.title}
                </h1>
                {(listingData.is_featured || listingData.is_urgent) && (
                  <div className="flex gap-2">
                    {listingData.is_featured && (
                      <span className="bg-orange-600 text-black font-black px-3 py-1 text-xs uppercase tracking-wider border-2 border-black flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        VIP
                      </span>
                    )}
                    {listingData.is_urgent && (
                      <span className="bg-red-600 text-white font-black px-3 py-1 text-xs uppercase tracking-wider border-2 border-black flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        СРОЧНО
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="bg-orange-600 text-black font-black text-4xl p-4 mb-4 relative">
                <div className="absolute top-1 right-1 w-3 h-3 bg-black"></div>
                {formatPrice(listingData.price, listingData.currency_code)}
              </div>

              <div className="text-orange-300 font-bold text-lg flex items-center">
                <div className="w-2 h-2 bg-orange-500 mr-3"></div>
                <MapPin className="w-5 h-5 mr-2" />
                {listingData.city_name?.toUpperCase()}
                {listingData.region_name && `, ${listingData.region_name?.toUpperCase()}`}
              </div>
            </div>
          </div>

          {/* Галерея изображений */}
          <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
                <Camera className="w-6 h-6 mr-2" />
                ФОТОГРАФИИ
                <div className="w-12 h-1 bg-orange-600 ml-4"></div>
              </h3>
              <ImageGallery images={listingData.images || []} />
            </div>
          </div>

          {/* Описание */}
          {listingData.description && (
            <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
              <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  ОПИСАНИЕ
                  <div className="w-12 h-1 bg-orange-600 ml-4"></div>
                </h3>
                <div className="text-orange-100 font-medium leading-relaxed whitespace-pre-wrap">
                  {listingData.description}
                </div>
              </div>
            </div>
          )}

          {/* Характеристики */}
          {listingData.attributes && (
            <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  ХАРАКТЕРИСТИКИ
                  <div className="w-12 h-1 bg-orange-600 ml-4"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(listingData.attributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-900 border-2 border-gray-700 relative">
                      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
                      <span className="text-orange-300 font-bold uppercase tracking-wide text-sm">
                        {key}:
                      </span>
                      <span className="text-orange-100 font-black">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Правая колонка - информация о продавце и действия */}
        <div className="space-y-6">
          {/* Информация о продавце */}
          <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute top-4 right-4 w-3 h-3 bg-white"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                ПРОДАВЕЦ
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-600 border-2 border-black flex items-center justify-center text-black font-black text-2xl">
                  {listingData.seller?.first_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-orange-100 font-black text-lg uppercase">
                    {listingData.seller?.first_name} {listingData.seller?.last_name}
                  </div>
                  {listingData.seller?.rating_average > 0 && (
                    <div className="text-orange-300 font-bold text-sm flex items-center">
                      <div className="w-2 h-2 bg-orange-500 mr-2"></div>
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      {listingData.seller.rating_average.toFixed(1)} 
                      ({listingData.seller.reviews_count} ОТЗЫВОВ)
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && <ContactButtons listing={listingData} />}

              {isOwner && (
                <Link
                  to={`/edit-listing/${listingData.listing_id}`}
                  className="group relative flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-white text-black font-black py-4 text-center border-2 border-black hover:border-orange-600 uppercase tracking-wider no-underline transition-all duration-300 transform hover:scale-105"
                >
                  <Edit className="w-5 h-5" />
                  <span className="relative">РЕДАКТИРОВАТЬ</span>
                  <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                </Link>
              )}
            </div>
          </div>

          {/* Действия */}
          {!isOwner && (
            <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>
              
              <div className="relative z-10 space-y-4">
                <button
                  onClick={handleFavoriteClick}
                  disabled={favoriteMutation.isLoading}
                  className={`group relative w-full py-4 font-black uppercase tracking-wider border-2 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                    listingData.is_favorite 
                      ? 'bg-red-600 text-white border-black' 
                      : 'bg-gray-900 text-red-400 border-red-600 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${listingData.is_favorite ? 'fill-current' : ''}`} />
                  <span className="relative">
                    {listingData.is_favorite ? 'В ИЗБРАННОМ' : 'В ИЗБРАННОЕ'}
                  </span>
                  <div className={`absolute top-1 right-1 w-3 h-3 transition-colors ${
                    listingData.is_favorite ? 'bg-black' : 'bg-red-600 group-hover:bg-black'
                  }`}></div>
                </button>

                <button
                  onClick={() => navigator.share ? 
                    navigator.share({
                      title: listingData.title,
                      text: listingData.description,
                      url: window.location.href
                    }) :
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="group relative w-full bg-gray-900 hover:bg-orange-600 text-orange-100 hover:text-black py-4 font-black uppercase tracking-wider border-2 border-orange-600 hover:border-black transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="relative">ПОДЕЛИТЬСЯ</span>
                  <div className="absolute top-1 left-1 w-3 h-3 bg-orange-600 group-hover:bg-black transition-colors"></div>
                </button>
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="bg-black border-4 border-orange-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
            <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-orange-600"></div>
            
            <div className="relative z-10">
              <h4 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                СТАТИСТИКА
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-900 border-2 border-gray-700">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-300" />
                    <span className="text-orange-300 font-bold uppercase text-sm">ПРОСМОТРОВ:</span>
                  </div>
                  <span className="text-orange-100 font-black">{listingData.view_count || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900 border-2 border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-300" />
                    <span className="text-orange-300 font-bold uppercase text-sm">ДОБАВЛЕНО:</span>
                  </div>
                  <span className="text-orange-100 font-black text-xs">{formatDate(listingData.created_date)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900 border-2 border-gray-700">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-orange-300" />
                    <span className="text-orange-300 font-bold uppercase text-sm">ОБНОВЛЕНО:</span>
                  </div>
                  <span className="text-orange-100 font-black text-xs">{formatDate(listingData.updated_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;