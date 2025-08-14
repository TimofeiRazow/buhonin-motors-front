// src/components/Layout/Header/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Главная' },
    { path: '/search', label: 'Поиск' },
    { path: '/create-listing', label: 'Подать объявление' },
    { path: '/favorites', label: 'Избранное' },
    { path: '/messages', label: 'Сообщения' }
  ];

  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px' }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === item.path ? '#007bff' : '#333',
                fontWeight: location.pathname === item.path ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;