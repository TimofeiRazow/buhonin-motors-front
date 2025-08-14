import React from 'react';
import { Link } from 'react-router-dom';
import SearchSection from './SearchSection';
import FeaturedListings from './FeaturedListings';
import PopularBrands from './PopularBrands';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
          Найдите свой автомобиль
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
          Более 50 000 объявлений о продаже автомобилей в Казахстане
        </p>
        <SearchSection />
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <Link
          to="/create-listing"
          style={{
            display: 'block',
            padding: '30px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>Продать автомобиль</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Разместите объявление бесплатно</p>
        </Link>
        
        <Link
          to="/search"
          style={{
            display: 'block',
            padding: '30px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>Купить автомобиль</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Найдите автомобиль мечты</p>
        </Link>
        
        <Link
          to="/services"
          style={{
            display: 'block',
            padding: '30px',
            backgroundColor: '#ffc107',
            color: '#333',
            textDecoration: 'none',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>Услуги</h3>
          <p style={{ margin: 0, opacity: 0.8 }}>Продвижение и реклама</p>
        </Link>
      </div>

      {/* Popular Brands */}
      <PopularBrands />

      {/* Featured Listings */}
      <FeaturedListings />

      {/* Statistics */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '40px 20px',
        marginTop: '40px',
        borderRadius: '8px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Kolesa.kz в цифрах
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: '#007bff', margin: '0 0 10px 0' }}>
              50,000+
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Активных объявлений</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: '#007bff', margin: '0 0 10px 0' }}>
              100,000+
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Зарегистрированных пользователей</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: '#007bff', margin: '0 0 10px 0' }}>
              1,000+
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Продаж в месяц</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: '#007bff', margin: '0 0 10px 0' }}>
              15
            </h3>
            <p style={{ margin: 0, color: '#666' }}>Лет на рынке</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;