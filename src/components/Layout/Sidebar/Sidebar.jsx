// src/components/Layout/Sidebar/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 998
        }}
        onClick={onClose}
      />
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '280px',
        height: '100vh',
        backgroundColor: 'white',
        zIndex: 999,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h3>Меню</h3>

        {isAuthenticated ? (
          <div>
            <p>Привет, {user?.first_name}!</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/profile" onClick={onClose}>Мой профиль</Link></li>
              <li><Link to="/my-listings" onClick={onClose}>Мои объявления</Link></li>
              <li><Link to="/favorites" onClick={onClose}>Избранное</Link></li>
              <li><Link to="/messages" onClick={onClose}>Сообщения</Link></li>
              <li><Link to="/settings" onClick={onClose}>Настройки</Link></li>
            </ul>
          </div>
        ) : (
          <div>
            <p><Link to="/login" onClick={onClose}>Войти</Link></p>
            <p><Link to="/register" onClick={onClose}>Регистрация</Link></p>
          </div>
        )}

        <hr />

        <div>
          <h4>Категории</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/search?category=cars" onClick={onClose}>Легковые автомобили</Link></li>
            <li><Link to="/search?category=commercial" onClick={onClose}>Коммерческий транспорт</Link></li>
            <li><Link to="/search?category=parts" onClick={onClose}>Запчасти</Link></li>
            <li><Link to="/search?category=services" onClick={onClose}>Услуги</Link></li>
          </ul>
        </div>

        <hr />

        <div>
          <h4>Помощь</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/support" onClick={onClose}>Поддержка</Link></li>
            <li><Link to="/faq" onClick={onClose}>FAQ</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;