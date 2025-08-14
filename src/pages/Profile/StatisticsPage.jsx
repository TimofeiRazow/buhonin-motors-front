// src/pages/Profile/StatisticsPage.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const StatisticsPage = () => {
  const [period, setPeriod] = useState('month'); // week, month, year

  const { data: stats, isLoading } = useQuery(
    ['user-detailed-stats', period],
    () => api.get(`/api/users/stats?period=${period}`)
  );

  if (isLoading) {
    return <div>Загрузка статистики...</div>;
  }

  const statistics = stats?.data || {};

  return (
    <div>
      <h1>Статистика</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Период: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
          <option value="year">Год</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Просмотры</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {statistics.total_views?.toLocaleString() || 0}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            За {period === 'week' ? 'неделю' : period === 'month' ? 'месяц' : 'год'}
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Сообщения</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {statistics.messages_received?.toLocaleString() || 0}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Получено за период
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>В избранном</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {statistics.favorites_added?.toLocaleString() || 0}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Добавлений за период
          </div>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Продажи</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {statistics.listings_sold?.toLocaleString() || 0}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Проданных объявлений
          </div>
        </div>
      </div>

      {statistics.popular_listings && statistics.popular_listings.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Популярные объявления</h3>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px' }}>
            {statistics.popular_listings.map((listing, index) => (
              <div key={listing.listing_id} style={{
                padding: '15px',
                borderBottom: index < statistics.popular_listings.length - 1 ? '1px solid #eee' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0 }}>{listing.title}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    {listing.price?.toLocaleString()} {listing.currency_code}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{listing.view_count} просмотров</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{listing.favorite_count} в избранном</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {statistics.views_chart && (
        <div>
          <h3>График просмотров</h3>
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
            <p style={{ color: '#666' }}>
              График просмотров будет доступен в следующей версии
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;