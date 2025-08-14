import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#343a40',
      color: 'white',
      padding: '40px 20px 20px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px'
      }}>
        <div>
          <h3 style={{ marginBottom: '15px' }}>Kolesa.kz</h3>
          <p style={{ lineHeight: 1.6, color: '#adb5bd' }}>
            Крупнейший автомобильный портал Казахстана. 
            Покупка и продажа автомобилей, запчастей и аксессуаров.
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Покупателям</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/search" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Поиск автомобилей
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/favorites" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Избранное
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/support" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Помощь покупателям
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Продавцам</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/create-listing" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Подать объявление
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/services" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Услуги продвижения
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/support" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Помощь продавцам
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Поддержка</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <Link to="/support" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                Центр поддержки
              </Link>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="tel:+77273000000" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                +7 (727) 300-00-00
              </a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="mailto:support@kolesa.kz" style={{ color: '#adb5bd', textDecoration: 'none' }}>
                support@kolesa.kz
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '30px auto 0',
        paddingTop: '20px',
        borderTop: '1px solid #495057',
        textAlign: 'center',
        color: '#adb5bd'
      }}>
        <p>&copy; 2024 Kolesa.kz. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;