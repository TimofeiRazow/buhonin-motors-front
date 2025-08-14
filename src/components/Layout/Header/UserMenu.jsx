import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '8px',
          border: 'none',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px'
        }}>
          {user?.first_name?.charAt(0) || user?.phone_number?.charAt(-4) || 'U'}
        </div>
        <span>{user?.first_name || 'Пользователь'}</span>
        <span style={{ fontSize: '12px' }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          minWidth: '200px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #eee'
            }}
          >
            Мой профиль
          </Link>
          <Link
            to="/my-listings"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #eee'
            }}
          >
            Мои объявления
          </Link>
          <Link
            to="/messages"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #eee'
            }}
          >
            Сообщения
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'block',
              padding: '12px 16px',
              textDecoration: 'none',
              color: '#333',
              borderBottom: '1px solid #eee'
            }}
          >
            Настройки
          </Link>
          {user?.user_type === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '12px 16px',
                textDecoration: 'none',
                color: '#333',
                borderBottom: '1px solid #eee'
              }}
            >
              Админ-панель
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#dc3545',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;