// src/pages/Profile/MyPromotionsPage.jsx
import React from 'react';
import { usePayments } from '../../hooks/api/usePayments';

const MyPromotionsPage = () => {
  const { promotions } = usePayments();

  const getStatusColor = (status) => {
    const colors = {
      active: '#28a745',
      expired: '#dc3545',
      cancelled: '#6c757d'
    };
    return colors[status] || '#333';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (promotions.isLoading) {
    return <div>Загрузка продвижений...</div>;
  }

  const promotionsList = promotions.data?.data || [];

  return (
    <div>
      <h1>Мои продвижения</h1>

      {promotionsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          У вас пока нет активных продвижений
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => window.location.href = '/payments/services'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Купить продвижение
            </button>
          </div>
        </div>
      ) : (
        <div>
          {promotionsList.map((promotion) => (
            <div key={promotion.promotion_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{promotion.service_name}</h3>
                  <p style={{ color: '#666' }}>Объявление: {promotion.listing_title}</p>
                  
                  <div style={{ marginTop: '10px' }}>
                    <p><strong>Начало:</strong> {formatDate(promotion.start_date)}</p>
                    <p><strong>Окончание:</strong> {formatDate(promotion.end_date)}</p>
                  </div>

                  {promotion.status === 'active' && new Date(promotion.end_date) > new Date() && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                      Продвижение активно! Осталось: {Math.ceil((new Date(promotion.end_date) - new Date()) / (1000 * 60 * 60 * 24))} дней
                    </div>
                  )}
                </div>

                <div style={{ marginLeft: '20px' }}>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(promotion.status)
                  }}>
                    {promotion.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPromotionsPage;