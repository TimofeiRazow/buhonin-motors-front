import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';

const ListingCard = ({ listing }) => {
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);
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
    if (!price) return 'Цена не указана';
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
    
    if (diffDays === 1) return 'Сегодня';
    if (diffDays === 2) return 'Вчера';
    if (diffDays <= 7) return `${diffDays} дней назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Можно добавить редирект на страницу входа
      alert('Для добавления в избранное необходимо войти в аккаунт');
      return;
    }
    
    favoriteMutation.mutate();
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white',
      transition: 'all 0.2s',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <Link
        to={`/listings/${listing.listing_id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'block'
        }}
      >
        {/* Изображение */}
        <div style={{
          height: '220px',
          backgroundColor: '#f5f5f5',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <img
            src={getMainImage()}
            alt={listing.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg';
            }}
          />
          
          {/* Бейджи */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            {listing.is_featured && (
              <div style={{
                backgroundColor: '#ffc107',
                color: '#333',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                VIP
              </div>
            )}
            {listing.is_urgent && (
              <div style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                СРОЧНО
              </div>
            )}
          </div>

          {/* Количество фото */}
          {listing.images_count > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              📷 {listing.images_count}
            </div>
          )}
        </div>

        {/* Информация */}
        <div style={{ padding: '15px' }}>
          <h3 style={{
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: 1.3,
            height: '40px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {listing.title}
          </h3>

          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '10px'
          }}>
            {formatPrice(listing.price, listing.currency_code)}
          </div>

          {/* Характеристики */}
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {listing.year && (
              <span>{listing.year} г.</span>
            )}
            {listing.mileage && (
              <span>{new Intl.NumberFormat('ru-KZ').format(listing.mileage)} км</span>
            )}
            {listing.engine_volume && (
              <span>{listing.engine_volume}л</span>
            )}
          </div>

          {/* Локация */}
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            📍 {listing.city_name}
            {listing.region_name && `, ${listing.region_name}`}
          </div>

          {/* Нижняя строка */}
          <div style={{
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {formatDate(listing.published_date)}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                👁 {listing.view_count || 0}
              </span>
              {listing.favorite_count > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ❤️ {listing.favorite_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Кнопка избранного */}
      {isAuthenticated && (
        <button
          onClick={handleFavoriteClick}
          disabled={favoriteMutation.isLoading}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '36px',
            height: '36px',
            border: 'none',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'all 0.2s',
            opacity: favoriteMutation.isLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      )}
    </div>
  );
};

export default ListingCard;