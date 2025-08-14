import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';

const ContactButtons = ({ listing }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const createConversationMutation = useMutation(
    (data) => api.post('/api/conversations/', data),
    {
      onSuccess: (response) => {
        navigate(`/messages/${response.data.conversation_id}`);
      },
      onError: (error) => {
        alert('Ошибка создания диалога: ' + (error.response?.data?.message || 'Попробуйте позже'));
        setIsCreatingConversation(false);
      }
    }
  );

  const handleShowPhone = () => {
    if (!isAuthenticated) {
      alert('Для просмотра контактов необходимо войти в аккаунт');
      navigate('/login');
      return;
    }
    setShowPhone(true);
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      alert('Для отправки сообщения необходимо войти в аккаунт');
      navigate('/login');
      return;
    }

    setIsCreatingConversation(true);
    createConversationMutation.mutate({
      conversation_type: 'user_chat',
      subject: `Интересует: ${listing.title}`,
      related_entity_id: listing.entity_id,
      participant_user_id: listing.user_id
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Не указан';
    
    // Форматируем телефон для отображения
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
  };

  const phoneNumber = listing.contact_phone || listing.seller?.phone_number;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Кнопка показать телефон */}
      <button
        onClick={handleShowPhone}
        style={{
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        📞 {showPhone ? formatPhone(phoneNumber) : 'Показать телефон'}
      </button>

      {/* Кнопка написать сообщение */}
      <button
        onClick={handleSendMessage}
        disabled={isCreatingConversation}
        style={{
          padding: '12px',
          backgroundColor: isCreatingConversation ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isCreatingConversation ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        💬 {isCreatingConversation ? 'Создание диалога...' : 'Написать сообщение'}
      </button>

      {/* Дополнительные способы связи */}
      {showPhone && phoneNumber && (
        <div style={{
          display: 'flex',
          gap: '5px',
          marginTop: '5px'
        }}>
          <a
            href={`tel:${phoneNumber}`}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#17a2b8',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            📞 Позвонить
          </a>
          <a
            href={`sms:${phoneNumber}`}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: '#6f42c1',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '14px'
            }}
          >
            📱 SMS
          </a>
        </div>
      )}

      {/* WhatsApp кнопка если есть телефон */}
      {showPhone && phoneNumber && (
        <a
          href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=Здравствуйте! Интересует ваше объявление: ${listing.title}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px',
            backgroundColor: '#25d366',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          📱 Написать в WhatsApp
        </a>
      )}

      {/* Информация о контакте */}
      {listing.contact_name && (
        <div style={{
          fontSize: '14px',
          color: '#666',
          textAlign: 'center',
          marginTop: '10px'
        }}>
          Контактное лицо: <strong>{listing.contact_name}</strong>
        </div>
      )}
    </div>
  );
};

export default ContactButtons;