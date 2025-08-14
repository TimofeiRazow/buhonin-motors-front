// src/pages/Payments/ServicesPage.jsx
import React from 'react';
import { usePayments } from '../../hooks/api/usePayments';

const ServicesPage = () => {
  const { services, promoteListing } = usePayments();

  const handlePurchaseService = async (serviceId, listingId) => {
    try {
      await promoteListing.mutateAsync({
        service_id: serviceId,
        listing_id: listingId
      });
      alert('Услуга успешно приобретена!');
    } catch (error) {
      console.error('Error purchasing service:', error);
      alert('Ошибка при покупке услуги');
    }
  };

  const formatPrice = (price, currency) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  if (services.isLoading) {
    return <div>Загрузка услуг...</div>;
  }

  return (
    <div>
      <h1>Услуги продвижения</h1>
      <p>Увеличьте количество просмотров ваших объявлений с помощью наших услуг продвижения</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {services.data?.data?.map((service) => (
          <div key={service.service_id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3>{service.service_name}</h3>
            <p style={{ color: '#666', marginBottom: '15px' }}>{service.description}</p>
            
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '10px' }}>
              {formatPrice(service.price, service.currency_code)}
            </div>
            
            {service.duration_days && (
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Срок действия: {service.duration_days} дней
              </p>
            )}

            {service.features && Object.keys(service.features).length > 0 && (
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <h4>Возможности:</h4>
                <ul>
                  {Object.entries(service.features).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                const listingId = prompt('Введите ID объявления для продвижения:');
                if (listingId) {
                  handlePurchaseService(service.service_id, parseInt(listingId));
                }
              }}
              disabled={promoteListing.isLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {promoteListing.isLoading ? 'Обработка...' : 'Приобрести'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;