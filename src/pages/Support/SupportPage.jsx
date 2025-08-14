// src/pages/Support/SupportPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';

const SupportPage = () => {
  const { data: tickets } = useQuery('support-tickets', () => api.get('/api/support/tickets'));
  const { data: categories } = useQuery('support-categories', () => api.get('/api/support/categories'));

  const openTickets = tickets?.data?.filter(ticket => ticket.status !== 'closed') || [];

  return (
    <div>
      <h1>Центр поддержки</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Создать обращение</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Не нашли ответ на свой вопрос? Создайте обращение в поддержку
          </p>
          <Link to="/support/create-ticket">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Создать обращение
            </button>
          </Link>
        </div>

        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Мои обращения</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Активных обращений: {openTickets.length}
          </p>
          <Link to="/support/tickets">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Просмотреть
            </button>
          </Link>
        </div>

        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>Часто задаваемые вопросы</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Ответы на популярные вопросы пользователей
          </p>
          <Link to="/support/faq">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Открыть FAQ
            </button>
          </Link>
        </div>
      </div>

      <div>
        <h3>Категории поддержки</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {categories?.data?.map((category) => (
            <div key={category.category_id} style={{
              padding: '15px',
              border: '1px solid #eee',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h4>{category.category_name}</h4>
              {category.description && (
                <p style={{ fontSize: '14px', color: '#666' }}>{category.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Контакты</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <h4>Телефон поддержки</h4>
            <p>+7 (777) 123-45-67</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Ежедневно с 9:00 до 21:00</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>support@kolesa.kz</p>
            <p style={{ fontSize: '14px', color: '#666' }}>Ответ в течение 24 часов</p>
          </div>
          <div>
            <h4>Онлайн-чат</h4>
            <p>Доступен на сайте</p>
            <p style={{ fontSize: '14px', color: '#666' }}>В рабочее время</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;