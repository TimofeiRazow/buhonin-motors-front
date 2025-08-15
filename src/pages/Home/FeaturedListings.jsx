import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
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
    <section style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Рекомендуемые объявления</h2>
        <Link 
          to="/search?featured=true"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Посмотреть все →
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {listingsData.map(listing => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))}
      </div>
    </section>
  );
};

const ListingCard = ({ listing }) => {
  const formatPrice = (price, currency) => {
    if (!price) return 'Цена не указана';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const getMainImage = () => {
    return listing.main_image_url || '/placeholder-car.jpg';
  };

  return (
    <Link
      to={`/listings/${listing.listing_id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        {/* Изображение */}
        <div style={{
          height: '200px',
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
          {listing.is_featured && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
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
          {listing.images_count > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              📷 {listing.images_count}
            </div>
          )}
        </div>

        {/* Информация */}
        <div style={{ padding: '15px' }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            lineHeight: 1.3,
            height: '40px',
            overflow: 'hidden'
          }}>
            {listing.title}
          </h3>

          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '8px'
          }}>
            {formatPrice(listing.price, listing.currency_code)}
          </div>

          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px'
          }}>
            {listing.year && `${listing.year} г.`}
            {listing.year && listing.mileage && ' • '}
            {listing.mileage && `${new Intl.NumberFormat('ru-KZ').format(listing.mileage)} км`}
          </div>

          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '8px'
          }}>
            📍 {listing.city_name}
            {listing.region_name && `, ${listing.region_name}`}
          </div>

          <div style={{
            fontSize: '12px',
            color: '#999',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              {new Date(listing.published_date).toLocaleDateString('ru-RU')}
            </span>
            <span>
              👁 {listing.view_count || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedListings;