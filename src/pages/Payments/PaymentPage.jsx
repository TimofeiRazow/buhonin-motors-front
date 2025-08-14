// src/pages/Payments/PaymentPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayments } from '../../hooks/api/usePayments';

const PaymentPage = () => {
  const { serviceId, listingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  
  const { services, createPayment } = usePayments();
  
  const service = services.data?.data?.find(s => s.service_id === parseInt(serviceId));

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const response = await createPayment.mutateAsync({
        service_id: parseInt(serviceId),
        listing_id: parseInt(listingId),
        payment_method: paymentMethod
      });

      // Перенаправляем на платежную систему
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert('Платеж успешно создан!');
        navigate('/payments/history');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка при создании платежа');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return <div>Услуга не найдена</div>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Оплата услуги</h1>

      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3>{service.service_name}</h3>
        <p>{service.description}</p>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
          {service.price.toLocaleString()} {service.currency_code}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Способ оплаты:</h4>
        <div>
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Банковская карта
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="qiwi"
              checked={paymentMethod === 'qiwi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            QIWI кошелек
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="kaspi"
              checked={paymentMethod === 'kaspi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Kaspi Pay
          </label>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '18px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Обработка...' : `Оплатить ${service.price.toLocaleString()} ${service.currency_code}`}
      </button>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Нажимая кнопку "Оплатить", вы соглашаетесь с условиями предоставления услуг и политикой конфиденциальности.</p>
      </div>
    </div>
  );
};

export default PaymentPage;