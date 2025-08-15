import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '10px 20px', 
      borderBottom: '1px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          Kolesa.kz
        </Link>
        
        <nav style={{ display: 'flex', gap: '15px' }}>
          <Link to="/search" style={{ textDecoration: 'none', color: '#333' }}>Поиск</Link>
          {isAuthenticated && (
            <>
              <Link to="/my-listings" style={{ textDecoration: 'none', color: '#333' }}>Мои объявления</Link>
              <Link to="/messages" style={{ textDecoration: 'none', color: '#333' }}>Сообщения</Link>
              <Link to="/favorites" style={{ textDecoration: 'none', color: '#333' }}>Избранное</Link>
            </>
          )}
        </nav>
      </div>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px' }}>
        <SearchBar />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isAuthenticated ? (
          <>
            <button 
              onClick={() => navigate('/create-listing')}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Подать объявление
            </button>
            <UserMenu user={user} />
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link 
              to="/login" 
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                border: '1px solid #007bff',
                borderRadius: '4px',
                color: '#007bff'
              }}
            >
              Войти
            </Link>
            <Link 
              to="/register"
              style={{
                textDecoration: 'none',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px'
              }}
            >
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;