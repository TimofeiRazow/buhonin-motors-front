import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const PopularBrands = () => {
  const { data: brands, isLoading, error } = useQuery(
    'popular-brands',
    () => api.get('/api/cars/brands?popular=true&limit=12')
  );

  if (isLoading) return <LoadingSpinner text="Загружаем популярные марки..." />;
  if (error) return null;

  const brandsData = brands?.data || [];
  console.log("Проблема в PopularBrands", brandsData)

  if (brandsData.length === 0) return null;

  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Популярные марки</h2>
        <Link 
          to="/search"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Все марки →
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px'
      }}>

        {brandsData.data ? brandsData.data.map(brand => (
          <BrandCard key={brand.brand_id} brand={brand} />
        ))
      : <></>}
      </div>
    </section>
  );
};

const BrandCard = ({ brand }) => {
  console.log("Проблема в BrandCard", brand)
  return (
    <Link
      to={`/search?brand_id=${brand.brand_id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block'
      }}
    >
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'white',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      >
        {/* Логотип */}
        <div style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.brand_name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : (
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              {brand.brand_name.charAt(0)}
            </div>
          )}
          <div style={{
            display: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            {brand.brand_name.charAt(0)}
          </div>
        </div>

        {/* Название */}
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          {brand.brand_name}
        </h3>

        {/* Количество объявлений */}
        {brand.listings_count && (
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#666'
          }}>
            {brand.listings_count} объявлений
          </p>
        )}

        {/* Страна происхождения */}
        {brand.country_origin && (
          <p style={{
            margin: '5px 0 0 0',
            fontSize: '12px',
            color: '#999'
          }}>
            {brand.country_origin}
          </p>
        )}
      </div>
    </Link>
  );
};

export default PopularBrands;