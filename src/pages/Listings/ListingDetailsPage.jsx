import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner/LoadingSpinner';
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

  if (isLoading) return <LoadingSpinner text="Загружаем объявление..." />;
  
  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>
          Объявление не найдено
        </h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Объявление может быть удалено или у вас нет прав для его просмотра.
        </p>
        <Link 
          to="/search"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Вернуться к поиску
        </Link>
      </div>
    );
  }

  const listingData = listing?.data;
  if (!listingData) return null;

  const formatPrice = (price, currency) => {
    if (!price) return 'Цена не указана';
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Главная</Link>
        {' > '}
        <Link to="/search" style={{ color: '#007bff', textDecoration: 'none' }}>Поиск</Link>
        {' > '}
        <span>{listingData.title}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Левая колонка */}
        <div>
          {/* Заголовок */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '28px', flex: 1 }}>
                {listingData.title}
              </h1>
              {(listingData.is_featured || listingData.is_urgent) && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  {listingData.is_featured && (
                    <span style={{
                      backgroundColor: '#ffc107',
                      color: '#333',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      VIP
                    </span>
                  )}
                  {listingData.is_urgent && (
                    <span style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      СРОЧНО
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#007bff',
              marginBottom: '10px'
            }}>
              {formatPrice(listingData.price, listingData.currency_code)}
            </div>

            <div style={{ fontSize: '16px', color: '#666' }}>
              📍 {listingData.city_name}
              {listingData.region_name && `, ${listingData.region_name}`}
            </div>
          </div>

          {/* Галерея изображений */}
          <ImageGallery images={listingData.images || []} />

          {/* Описание */}
          {listingData.description && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginTop: '20px'
            }}>
              <h3 style={{ marginTop: 0 }}>Описание</h3>
              <div style={{ 
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap'
              }}>
                {listingData.description}
              </div>
            </div>
          )}

          {/* Характеристики */}
          {listingData.attributes && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginTop: '20px'
            }}>
              <h3 style={{ marginTop: 0 }}>Характеристики</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {Object.entries(listingData.attributes).map(([key, value]) => (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span style={{ color: '#666' }}>{key}:</span>
                    <span style={{ fontWeight: 'bold' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правая колонка */}
        <div>
          {/* Информация о продавце */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Продавец</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {listingData.seller?.first_name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {listingData.seller?.first_name} {listingData.seller?.last_name}
                </div>
                {listingData.seller?.rating_average > 0 && (
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    ⭐ {listingData.seller.rating_average.toFixed(1)} 
                    ({listingData.seller.reviews_count} отзывов)
                  </div>
                )}
              </div>
            </div>

            {!isOwner && <ContactButtons listing={listingData} />}

            {isOwner && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to={`/edit-listing/${listingData.listing_id}`}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  Редактировать
                </Link>
              </div>
            )}
          </div>

          {/* Действия */}
          {!isOwner && (
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginBottom: '20px'
            }}>
              <button
                onClick={handleFavoriteClick}
                disabled={favoriteMutation.isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: listingData.is_favorite ? '#dc3545' : 'white',
                  color: listingData.is_favorite ? 'white' : '#dc3545',
                  border: '2px solid #dc3545',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}
              >
                {listingData.is_favorite ? '❤️ В избранном' : '🤍 В избранное'}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'white',
                  color: '#007bff',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📤 Поделиться
              </button>
            </div>
          )}

          {/* Статистика */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h4 style={{ marginTop: 0 }}>Статистика</h4>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Просмотров:</strong> {listingData.view_count || 0}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Добавлено:</strong> {formatDate(listingData.created_date)}
              </div>
              <div>
                <strong>Обновлено:</strong> {formatDate(listingData.updated_date)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;