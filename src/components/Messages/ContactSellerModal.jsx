// src/components/Messages/ContactSellerModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import api from '../../services/api';

const ContactSellerModal = ({ listing, isOpen, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Для отправки сообщения необходимо войти в систему');
      return;
    }

    if (!message.trim()) {
      alert('Введите сообщение');
      return;
    }

    setLoading(true);

    try {
      // Создаем диалог или находим существующий
      const conversationResponse = await api.post('/api/conversations/', {
        related_entity_id: listing.entity_id,
        subject: `По объявлению: ${listing.title}`
      });

      // Отправляем сообщение
      await api.post(`/api/conversations/${conversationResponse.data.conversation_id}/messages`, {
        message_text: message
      });

      onSuccess?.(conversationResponse.data.conversation_id);
      onClose();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    } finally {
      setLoading(false);
    }
  };

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
          zIndex: 1000
        }}
        onClick={onClose}
      />
      
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        zIndex: 1001,
        minWidth: '400px',
        maxWidth: '90vw'
      }}>
        <h3>Написать продавцу</h3>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{listing.title}</h4>
          <p style={{ margin: 0, color: '#666' }}>
            {listing.price?.toLocaleString()} {listing.currency_code || '₸'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label>Ваше сообщение:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Здравствуйте! Меня интересует ваше объявление "${listing.title}". Пожалуйста, свяжитесь со мной.`}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
            
            <button 
              type="submit" 
              disabled={loading || !message.trim()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !message.trim() ? 0.6 : 1
              }}
            >
              {loading ? 'Отправляем...' : 'Отправить'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ContactSellerModal;