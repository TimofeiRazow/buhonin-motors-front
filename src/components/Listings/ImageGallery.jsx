import React, { useState, useEffect } from 'react';

const ImageGallery = ({ images = [], autoPlay = false, autoPlayInterval = 5000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Автопроигрывание
  useEffect(() => {
    if (autoPlay && images.length > 1 && !showModal) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoPlay, images.length, showModal, autoPlayInterval]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showModal) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeModal();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showModal]);

  if (!images || images.length === 0) {
    return <EmptyGalleryRedesigned />;
  }

  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'unset';
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  // Touch handlers для мобильных устройств
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }
  };

  return (
    <>
      <div className="bg-black border-4 border-orange-600 relative overflow-hidden">
        {/* Геометрические элементы */}
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-white"></div>

        {/* Главное изображение */}
        <div 
          className="relative h-96 bg-gray-900 group cursor-pointer"
          onClick={openModal}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Изображение или заглушка */}
          {!imageError ? (
            <img
              src={currentImage?.file_url || '/placeholder-car.jpg'}
              alt={currentImage?.alt_text || 'Фото автомобиля'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🚗</div>
                <div className="font-black uppercase tracking-wider">ИЗОБРАЖЕНИЕ НЕДОСТУПНО</div>
              </div>
            </div>
          )}

          {/* Оверлей при наведении */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="text-white font-black uppercase tracking-wider text-lg transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              🔍 УВЕЛИЧИТЬ
            </div>
          </div>

          {/* Навигационные кнопки */}
          {images.length > 1 && (
            <>
              <NavigationButtonRedesigned
                direction="prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="left-4"
              />
              <NavigationButtonRedesigned
                direction="next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="right-4"
              />
            </>
          )}

          {/* Счетчик и кнопки управления */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            {/* Счетчик */}
            {images.length > 1 && (
              <div className="bg-black text-white px-3 py-1 font-black text-sm border border-orange-600">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Кнопка полноэкранного режима */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              className="bg-black text-white border border-orange-600 p-2 hover:bg-orange-600 hover:text-black transition-all duration-300 group/btn"
            >
              <span className="font-black">🔍</span>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover/btn:bg-black transition-colors"></div>
            </button>
          </div>

          {/* Индикаторы автопроигрывания */}
          {autoPlay && images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 font-black text-xs border border-orange-600">
              ⏯ AUTO
            </div>
          )}
        </div>

        {/* Миниатюры */}
        {images.length > 1 && (
          <ThumbnailsRedesigned
            images={images}
            currentIndex={currentImageIndex}
            onThumbnailClick={setCurrentImageIndex}
          />
        )}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <ModalGalleryRedesigned
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeModal}
          onNext={nextImage}
          onPrev={prevImage}
          onIndexChange={setCurrentImageIndex}
        />
      )}
    </>
  );
};

// Компонент навигационной кнопки
const NavigationButtonRedesigned = ({ direction, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`
        absolute top-1/2 transform -translate-y-1/2 ${className}
        w-12 h-12 bg-black border-2 border-orange-600 text-white 
        hover:bg-orange-600 hover:text-black transition-all duration-300
        flex items-center justify-center group/nav opacity-80 hover:opacity-100
      `}
    >
      <span className="font-black text-xl">
        {direction === 'prev' ? '‹' : '›'}
      </span>
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover/nav:bg-black transition-colors"></div>
    </button>
  );
};

// Компонент миниатюр
const ThumbnailsRedesigned = ({ images, currentIndex, onThumbnailClick }) => {
  return (
    <div className="bg-gray-900 border-t-2 border-gray-700 p-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {images.map((image, index) => (
          <ThumbnailRedesigned
            key={image.media_id || index}
            image={image}
            index={index}
            isActive={index === currentIndex}
            onClick={() => onThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Компонент миниатюры
const ThumbnailRedesigned = ({ image, index, isActive, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`
        relative w-16 h-16 flex-shrink-0 cursor-pointer border-2 transition-all duration-300
        ${isActive 
          ? 'border-orange-600 scale-110' 
          : 'border-gray-600 hover:border-orange-500 hover:scale-105'
        }
      `}
    >
      {/* Геометрический элемент */}
      <div className={`
        absolute top-0.5 left-0.5 w-1 h-1 transition-colors duration-300
        ${isActive ? 'bg-orange-600' : 'bg-gray-600'}
      `}></div>

      {!imageError ? (
        <img
          src={image.thumbnail_url || image.file_url}
          alt={`Миниатюра ${index + 1}`}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-xs">🚗</span>
        </div>
      )}

      {/* Индикатор активной миниатюры */}
      {isActive && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-600"></div>
      )}
    </div>
  );
};

// Модальное окно галереи
const ModalGalleryRedesigned = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev, 
  onIndexChange 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const currentImage = images[currentIndex];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 left-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-6 h-6 bg-orange-600 rotate-12 opacity-40"></div>

      <div className="relative w-full h-full flex flex-col">
        {/* Хедер модала */}
        <div className="flex items-center justify-between p-6 bg-black border-b-2 border-orange-600">
          <div className="flex items-center space-x-4">
            <h3 className="text-white font-black uppercase tracking-wider text-lg">
              📷 ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ
            </h3>
            <div className="w-12 h-0.5 bg-orange-600"></div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Счетчик */}
            <div className="text-white font-black uppercase tracking-wider text-sm bg-gray-900 px-3 py-1 border border-gray-600">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Кнопка масштабирования */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 bg-gray-900 hover:bg-orange-600 border-2 border-gray-700 hover:border-black text-white hover:text-black transition-all duration-300"
            >
              <span className="font-black">{isZoomed ? '🔍-' : '🔍+'}</span>
            </button>

            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="p-2 bg-gray-900 hover:bg-red-600 border-2 border-gray-700 hover:border-black text-white hover:text-black transition-all duration-300"
            >
              <span className="font-black text-lg">✕</span>
            </button>
          </div>
        </div>

        {/* Основная область изображения */}
        <div className="flex-1 relative flex items-center justify-center p-6">
          <img
            src={currentImage?.file_url}
            alt={currentImage?.alt_text || 'Фото автомобиля'}
            className={`
              max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer
              ${isZoomed ? 'transform scale-150' : ''}
            `}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Навигационные кнопки в модале */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black border-2 border-orange-600 text-white hover:bg-orange-600 hover:text-black transition-all duration-300 flex items-center justify-center group/modal"
              >
                <span className="font-black text-2xl">‹</span>
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600 group-hover/modal:bg-black transition-colors"></div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black border-2 border-orange-600 text-white hover:bg-orange-600 hover:text-black transition-all duration-300 flex items-center justify-center group/modal"
              >
                <span className="font-black text-2xl">›</span>
                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-600 group-hover/modal:bg-black transition-colors"></div>
              </button>
            </>
          )}
        </div>

        {/* Нижняя панель с миниатюрами */}
        {images.length > 1 && (
          <div className="bg-gray-900 border-t-2 border-orange-600 p-4">
            <div className="flex justify-center">
              <div className="flex gap-2 overflow-x-auto max-w-full">
                {images.map((image, index) => (
                  <div
                    key={image.media_id || index}
                    onClick={() => onIndexChange(index)}
                    className={`
                      relative w-12 h-12 flex-shrink-0 cursor-pointer border-2 transition-all duration-300
                      ${index === currentIndex 
                        ? 'border-orange-600 scale-110' 
                        : 'border-gray-600 hover:border-orange-500'
                      }
                    `}
                  >
                    <img
                      src={image.thumbnail_url || image.file_url}
                      alt={`Миниатюра ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-orange-600 bg-opacity-20"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Пустая галерея
const EmptyGalleryRedesigned = () => {
  return (
    <div className="bg-black border-4 border-orange-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
      <div className="absolute top-6 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
      <div className="absolute bottom-6 left-6 w-4 h-4 bg-white"></div>

      <div className="relative z-10 h-96 flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-6">📷</div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
            ФОТОГРАФИИ ОТСУТСТВУЮТ
          </h3>
          <div className="w-16 h-1 bg-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-400 font-bold uppercase tracking-wide">
            ИЗОБРАЖЕНИЯ БУДУТ ДОБАВЛЕНЫ ПОЗЖЕ
          </p>
        </div>
      </div>
    </div>
  );
};

// Добавляем CSS для скрытия скроллбара
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('gallery-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'gallery-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ImageGallery;