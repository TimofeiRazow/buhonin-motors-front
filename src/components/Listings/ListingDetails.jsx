// src/components/Listings/ListingDetails.jsx (redesigned)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Eye,
  Heart,
  Share,
  FileText,
  Settings,
  User,
  Handshake,
  Phone,
  MessageCircle,
  Star,
  MapPin,
  BarChart3,
  X,
  Car,
  Loader
} from 'lucide-react';
import ImageGallery from './ImageGallery';
import ContactButtons from './ContactButtons';
import CarSpecifications from '../Cars/CarSpecifications';
import FavoriteButton from '../Common/FavoriteButton';
import ShareButton from '../Common/ShareButton';

const ListingDetails = ({ listing, onFavoriteToggle, loading = false }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const navigate = useNavigate();

  // Увеличиваем счетчик просмотров
  useEffect(() => {
    if (listing?.listing_id) {
      // API вызов для увеличения счетчика просмотров
      // incrementViewCount(listing.listing_id);
    }
  }, [listing?.listing_id]);

  if (loading) {
    return <ListingDetailsSkeleton />;
  }

  if (!listing) {
    return <ListingNotFound />;
  }

  const formatPrice = (price, currency) => {
    return `${new Intl.NumberFormat('ru-RU').format(price)} ${currency || '₸'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'ВЧЕРА';
    if (diffDays < 7) return `${diffDays} ДНЕЙ НАЗАД`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} НЕДЕЛЬ НАЗАД`;
    return formatDate(dateString);
  };

  const tabs = [
    { id: 'description', title: 'ОПИСАНИЕ', icon: FileText },
    { id: 'specifications', title: 'ХАРАКТЕРИСТИКИ', icon: Settings },
    { id: 'seller', title: 'ПРОДАВЕЦ', icon: User }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 left-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-orange-600 rotate-12 opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-white opacity-25"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 border border-white rotate-45 opacity-15"></div>

      <div className="relative z-10 p-6">
        {/* Хедер с заголовком и действиями */}
        <div className="bg-black border-4 border-orange-600 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
          <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-white"></div>

          <div className="relative z-10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="group p-2 bg-gray-900 hover:bg-orange-600 border-2 border-gray-700 hover:border-black transition-all duration-300"
                  >
                    <ArrowLeft size={20} className="text-white group-hover:text-black" />
                  </button>
                  
                  {listing.is_featured && (
                    <div className="bg-orange-600 text-black px-3 py-1 font-black text-sm uppercase border-2 border-black">
                      VIP
                    </div>
                  )}
                  
                  {listing.is_urgent && (
                    <div className="bg-red-600 text-white px-3 py-1 font-black text-sm uppercase border-2 border-black">
                      СРОЧНО
                    </div>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-wider mb-4 leading-tight">
                  {listing.title}
                </h1>
                <div className="w-20 h-1 bg-orange-600"></div>
                
                <div className="flex items-center space-x-6 mt-4 text-sm font-bold uppercase tracking-wide text-gray-400">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                    № {listing.listing_id}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-600 mr-2"></span>
                    {formatRelativeDate(listing.published_date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-600"></span>
                    <Eye size={14} />
                    {listing.view_count} ПРОСМОТРОВ
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FavoriteButtonRedesigned
                  listingId={listing.listing_id}
                  isFavorite={listing.is_favorite}
                  onToggle={onFavoriteToggle}
                />
                <ShareButtonRedesigned
                  url={window.location.href}
                  title={listing.title}
                  description={listing.description}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - изображения и описание */}
          <div className="lg:col-span-2 space-y-8">
            {/* Галерея изображений */}
            {listing.images && listing.images.length > 0 && (
              <div className="bg-gray-900 border-2 border-gray-700 relative overflow-hidden">
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
                
                <div className="relative z-10 p-4">
                  <ImageGalleryRedesigned 
                    images={listing.images}
                    onImageClick={() => setImageGalleryOpen(true)}
                  />
                </div>
              </div>
            )}

            {/* Табы с информацией */}
            <div className="bg-gray-900 border-2 border-gray-700 relative overflow-hidden">
              <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
              <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>

              <div className="relative z-10">
                {/* Навигация по табам */}
                <div className="flex border-b-2 border-gray-700">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 p-4 font-black uppercase tracking-wider text-sm transition-all duration-300 border-r-2 border-gray-700 last:border-r-0
                        ${activeTab === tab.id
                          ? 'bg-orange-600 text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <tab.icon size={16} />
                        {tab.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Содержимое табов */}
                <div className="p-6">
                  {activeTab === 'description' && (
                    <DescriptionTabRedesigned description={listing.description} />
                  )}
                  
                  {activeTab === 'specifications' && (
                    <SpecificationsTabRedesigned 
                      specifications={listing.specifications}
                      referenceData={listing.reference_data}
                    />
                  )}
                  
                  {activeTab === 'seller' && (
                    <SellerTabRedesigned seller={listing.seller} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - цена и контакты */}
          <div className="space-y-6">
            {/* Цена и контакты */}
            <div className="bg-black border-4 border-orange-600 relative overflow-hidden sticky top-6">
              <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
              <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white"></div>

              <div className="relative z-10 p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-orange-600 mb-2">
                    {formatPrice(listing.price, listing.currency_code)}
                  </div>
                  {listing.is_negotiable && (
                    <div className="text-white font-bold uppercase tracking-wide text-sm bg-gray-800 inline-flex items-center gap-2 px-3 py-1 border border-gray-600">
                      <Handshake size={14} />
                      ТОРГ ВОЗМОЖЕН
                    </div>
                  )}
                </div>

                <ContactButtonsRedesigned 
                  listing={listing}
                  seller={listing.seller}
                />
              </div>
            </div>

            {/* Информация о продавце */}
            <SellerInfoCardRedesigned seller={listing.seller} />

            {/* Местоположение */}
            <LocationInfoCardRedesigned 
              cityName={listing.city_name}
              regionName={listing.region_name}
              address={listing.address}
            />

            {/* Статистика */}
            <StatsCardRedesigned listing={listing} />
          </div>
        </div>
      </div>

      {/* Модал галереи */}
      {imageGalleryOpen && (
        <ImageGalleryModal
          images={listing.images}
          onClose={() => setImageGalleryOpen(false)}
        />
      )}
    </div>
  );
};

// Компонент описания
const DescriptionTabRedesigned = ({ description }) => {
  if (!description?.trim()) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <FileText size={48} className="text-gray-600 mx-auto" />
        </div>
        <div className="text-gray-400 font-black uppercase tracking-wider">
          ОПИСАНИЕ НЕ УКАЗАНО
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-3">
        <FileText size={24} />
        ОПИСАНИЕ
      </h3>
      <div className="w-16 h-0.5 bg-orange-600 mb-6"></div>
      
      <div className="text-gray-300 font-medium leading-relaxed whitespace-pre-line">
        {description}
      </div>
    </div>
  );
};

// Компонент характеристик
const SpecificationsTabRedesigned = ({ specifications, referenceData }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-3">
        <Settings size={24} />
        ХАРАКТЕРИСТИКИ
      </h3>
      <div className="w-16 h-0.5 bg-orange-600 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Основные характеристики */}
        <div className="bg-gray-800 border border-gray-600 p-4">
          <h4 className="text-orange-500 font-black uppercase tracking-wider text-sm mb-3">
            ОСНОВНЫЕ
          </h4>
          <div className="space-y-2 text-sm">
            <SpecItemRedesigned label="ГОД" value={specifications?.year} />
            <SpecItemRedesigned label="ПРОБЕГ" value={specifications?.mileage ? `${specifications.mileage.toLocaleString()} КМ` : null} />
            <SpecItemRedesigned label="СОСТОЯНИЕ" value={specifications?.condition} />
          </div>
        </div>

        {/* Двигатель */}
        <div className="bg-gray-800 border border-gray-600 p-4">
          <h4 className="text-orange-500 font-black uppercase tracking-wider text-sm mb-3">
            ДВИГАТЕЛЬ
          </h4>
          <div className="space-y-2 text-sm">
            <SpecItemRedesigned label="ОБЪЕМ" value={specifications?.engine_volume ? `${specifications.engine_volume}Л` : null} />
            <SpecItemRedesigned label="ТИП" value={specifications?.engine_type} />
            <SpecItemRedesigned label="МОЩНОСТЬ" value={specifications?.power_hp ? `${specifications.power_hp} Л.С.` : null} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Элемент характеристики
const SpecItemRedesigned = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 font-bold uppercase tracking-wide">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
};

// Компонент информации о продавце
const SellerTabRedesigned = ({ seller }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-3">
        <User size={24} />
        ПРОДАВЕЦ
      </h3>
      <div className="w-16 h-0.5 bg-orange-600 mb-6"></div>
      
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-orange-600 border-2 border-black flex items-center justify-center">
          <User size={32} className="text-black" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-white font-black uppercase tracking-wider text-lg">
            {seller?.first_name} {seller?.last_name}
          </h4>
          
          {seller?.company_name && (
            <div className="text-orange-500 font-bold uppercase tracking-wide text-sm mt-1">
              {seller.company_name}
            </div>
          )}
          
          {seller?.rating_average > 0 && (
            <div className="flex items-center mt-2 gap-2">
              <span className="text-orange-500 font-bold text-lg flex items-center gap-1">
                <Star size={16} />
                {seller.rating_average}/5
              </span>
              <span className="text-gray-400 font-bold uppercase text-xs">
                ({seller.reviews_count} ОТЗЫВОВ)
              </span>
            </div>
          )}
          
          <div className="text-gray-400 font-bold uppercase text-xs mt-2">
            НА САЙТЕ С {formatDate(seller?.registration_date).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Карточка продавца
const SellerInfoCardRedesigned = ({ seller }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10 p-4">
        <h4 className="text-white font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
          <User size={16} />
          ПРОДАВЕЦ
        </h4>
        
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-orange-600 border border-black flex items-center justify-center">
            <User size={20} className="text-black" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">
              {seller?.first_name} {seller?.last_name}
            </div>
            {seller?.rating_average > 0 && (
              <div className="text-orange-500 font-bold text-xs flex items-center gap-1">
                <Star size={12} />
                {seller.rating_average}/5
              </div>
            )}
          </div>
        </div>
        
        <button className="w-full p-2 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold uppercase text-xs tracking-wide transition-all duration-300">
          ПРОФИЛЬ ПРОДАВЦА
        </button>
      </div>
    </div>
  );
};

// Карточка местоположения
const LocationInfoCardRedesigned = ({ cityName, regionName, address }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10 p-4">
        <h4 className="text-white font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
          <MapPin size={16} />
          МЕСТОПОЛОЖЕНИЕ
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="text-white font-bold">
            {cityName}, {regionName}
          </div>
          {address && (
            <div className="text-gray-400 font-bold">
              {address}
            </div>
          )}
        </div>
        
        <button className="w-full mt-3 p-2 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold uppercase text-xs tracking-wide transition-all duration-300">
          ПОКАЗАТЬ НА КАРТЕ
        </button>
      </div>
    </div>
  );
};

// Карточка статистики
const StatsCardRedesigned = ({ listing }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10 p-4">
        <h4 className="text-white font-black uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
          <BarChart3 size={16} />
          СТАТИСТИКА
        </h4>
        
        <div className="space-y-3 text-xs font-bold uppercase tracking-wide">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">ПРОСМОТРОВ:</span>
            <span className="text-white">{listing.view_count}</span>
          </div>
          {listing.favorite_count > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">В ИЗБРАННОМ:</span>
              <span className="text-white">{listing.favorite_count}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-400">ОПУБЛИКОВАНО:</span>
            <span className="text-white">{new Date(listing.published_date).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Заглушки для компонентов (нужно создать отдельно)
const FavoriteButtonRedesigned = ({ listingId, isFavorite, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        group p-3 border-2 transition-all duration-300 transform hover:scale-110 flex items-center justify-center
        ${isFavorite 
          ? 'bg-red-600 border-black text-white' 
          : 'bg-gray-900 border-gray-700 text-white hover:bg-red-600 hover:border-black'
        }
      `}
    >
      <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
    </button>
  );
};

const ShareButtonRedesigned = ({ url, title, description }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: description, url });
    } else {
      navigator.clipboard.writeText(url);
      // Показать уведомление о копировании
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group p-3 bg-gray-900 hover:bg-orange-600 border-2 border-gray-700 hover:border-black text-white hover:text-black transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
    >
      <Share size={20} />
    </button>
  );
};

const ContactButtonsRedesigned = ({ listing, seller }) => {
  return (
    <div className="space-y-4">
      <button className="w-full p-4 bg-orange-600 hover:bg-white text-black hover:text-black font-black uppercase tracking-wider text-lg border-2 border-black hover:border-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
        <Phone size={20} />
        ПОЗВОНИТЬ
      </button>
      <button className="w-full p-3 bg-gray-800 hover:bg-orange-600 border-2 border-gray-600 hover:border-black text-white hover:text-black font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3">
        <MessageCircle size={18} />
        НАПИСАТЬ
      </button>
    </div>
  );
};

const ImageGalleryRedesigned = ({ images, onImageClick }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.slice(0, 4).map((image, index) => (
        <div 
          key={index}
          onClick={onImageClick}
          className="relative aspect-square bg-gray-800 cursor-pointer overflow-hidden border border-gray-600 hover:border-orange-500 transition-colors duration-300 group"
        >
          <img 
            src={image.file_url} 
            alt={`Фото ${index + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {index === 3 && images.length > 4 && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white font-black text-xl">
              +{images.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Скелетон для загрузки
const ListingDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-black p-6">
      <div className="animate-pulse space-y-8">
        <div className="bg-gray-900 border-2 border-gray-700 p-6">
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 border-2 border-gray-700 p-4">
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
            <div className="bg-gray-900 border-2 border-gray-700 p-6">
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-900 border-2 border-gray-700 p-6">
              <div className="h-16 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент "Не найдено"
const ListingNotFound = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Car size={72} className="text-gray-600 mx-auto" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
          ОБЪЯВЛЕНИЕ НЕ НАЙДЕНО
        </h1>
        <div className="w-20 h-1 bg-orange-600 mx-auto mb-6"></div>
        <p className="text-gray-400 font-bold uppercase tracking-wide">
          ВОЗМОЖНО, ОНО БЫЛО УДАЛЕНО ИЛИ НЕДОСТУПНО
        </p>
      </div>
    </div>
  );
};

const ImageGalleryModal = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black border-2 border-orange-600 text-white hover:bg-orange-600 hover:text-black transition-all duration-300 flex items-center justify-center"
        >
          <X size={20} />
        </button>
        
        <img 
          src={images[currentIndex]?.file_url} 
          alt={`Фото ${currentIndex + 1}`}
          className="w-full h-auto max-h-screen object-contain"
        />
        
        <div className="flex items-center justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 border transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-orange-600 border-orange-600' 
                  : 'bg-gray-800 border-gray-600 hover:border-orange-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;