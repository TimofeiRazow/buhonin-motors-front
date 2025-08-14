// src/pages/Admin/AdminDashboard.jsx
import React from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery(
    'admin-stats',
    () => api.get('/api/admin/dashboard')
  );

  if (isLoading) {
    return <div>Загрузка статистики...</div>;
  }

  const dashboardStats = stats?.data || {};

  return (
    <div>
      <h1>Административная панель</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Пользователи</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {dashboardStats.total_users?.toLocaleString() || 0}
          </p>
          <p style={{ color: '#666' }}>
            Новых за сегодня: {dashboardStats.users_today || 0}
          </p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Объявления</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {dashboardStats.total_listings?.toLocaleString() || 0}
          </p>
          <p style={{ color: '#666' }}>
            Активных: {dashboardStats.active_listings || 0}
          </p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Модерация</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {dashboardStats.pending_moderation || 0}
          </p>
          <p style={{ color: '#666' }}>
            Ожидают проверки
          </p>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Жалобы</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {dashboardStats.open_reports || 0}
          </p>
          <p style={{ color: '#666' }}>
            Требуют рассмотрения
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h3>Последние действия</h3>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            {dashboardStats.recent_activities?.map((activity, index) => (
              <div key={index} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontWeight: 'bold' }}>{activity.action}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {activity.user_name} - {new Date(activity.created_date).toLocaleString('ru-RU')}
                </div>
              </div>
            )) || <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Нет данных</div>}
          </div>
        </div>

        <div>
          <h3>Быстрые действия</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              onClick={() => window.location.href = '/admin/moderation'}
              style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Модерация контента ({dashboardStats.pending_moderation || 0})
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/reports'}
              style={{ padding: '15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Рассмотреть жалобы ({dashboardStats.open_reports || 0})
            </button>
            
            <button 
              onClick={() => window.location.href = '/admin/users'}
              style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Управление пользователями
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;