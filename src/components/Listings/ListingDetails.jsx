// src/components/Listings/ListingDetails.jsx
import React from 'react';
import ImageGallery from './ImageGallery';
import ContactButtons from './ContactButtons';
import CarSpecifications from '../Cars/CarSpecifications';
import FavoriteButton from '../Common/FavoriteButton';
import ShareButton from '../Common/ShareButton';

const ListingDetails = ({ listing, onFavoriteToggle }) => {
  if (!listing) return <div>Загрузка...</div>;

  const formatPrice = (price, currency) => {
    return `${price?.toLocaleString()} ${currency || '₸'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <h1>{listing.title}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <FavoriteButton 
            listingId={listing.listing_id} 
            isFavorite={listing.is_favorite}
            onToggle={onFavoriteToggle}
          />
          <ShareButton 
            url={window.location.href}
            title={listing.title}
            description={listing.description}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div>
          {listing.images && listing.images.length > 0 && (
            <ImageGallery images={listing.images} />
          )}

          <div style={{ marginTop: '20px' }}>
            <h3>Описание</h3>
            <p>{listing.description}</p>
          </div>

          {listing.specifications && (
            <CarSpecifications 
              specifications={listing.specifications}
              brands={listing.reference_data?.brands}
              models={listing.reference_data?.models}
              bodyTypes={listing.reference_data?.body_types}
              engineTypes={listing.reference_data?.engine_types}
              transmissionTypes={listing.reference_data?.transmission_types}
              driveTypes={listing.reference_data?.drive_types}
              colors={listing.reference_data?.colors}
            />
          )}
        </div>

        <div>
          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#007bff', marginBottom: '15px' }}>
              {formatPrice(listing.price, listing.currency_code)}
            </h2>
            
            {listing.is_negotiable && (
              <p style={{ color: '#666', fontSize: '14px' }}>Цена договорная</p>
            )}

            <ContactButtons 
              listing={listing}
              seller={listing.seller}
            />
          </div>

          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h4>Информация о продавце</h4>
            <p><strong>{listing.seller?.first_name} {listing.seller?.last_name}</strong></p>
            {listing.seller?.company_name && (
              <p>{listing.seller.company_name}</p>
            )}
            {listing.seller?.rating_average > 0 && (
              <p>Рейтинг: ⭐ {listing.seller.rating_average}/5 ({listing.seller.reviews_count} отзывов)</p>
            )}
            <p>На сайте с {formatDate(listing.seller?.registration_date)}</p>
          </div>

          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px'
          }}>
            <h4>Местоположение</h4>
            <p>{listing.city_name}, {listing.region_name}</p>
            {listing.address && <p>{listing.address}</p>}
          </div>

          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p>Объявление № {listing.listing_id}</p>
            <p>Опубликовано: {formatDate(listing.published_date)}</p>
            <p>Просмотров: {listing.view_count}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
