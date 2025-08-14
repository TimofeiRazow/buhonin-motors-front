// src/components/Messages/MessageThread.jsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';

const MessageThread = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Загрузка сообщений...</div>;
  }

  if (!messages?.length) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#666',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Сообщений пока нет. Начните диалог!
      </div>
    );
  }

  return (
    <div style={{ 
      height: '400px', 
      overflowY: 'auto', 
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {messages.map((message) => {
        const isMyMessage = message.sender_id === user?.user_id;
        
        return (
          <div
            key={message.message_id}
            style={{
              display: 'flex',
              justifyContent: isMyMessage ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: isMyMessage ? '#007bff' : '#f1f1f1',
                color: isMyMessage ? 'white' : '#333'
              }}
            >
              <div style={{ marginBottom: '5px' }}>
                {message.message_text}
              </div>
              
              <div style={{
                fontSize: '11px',
                opacity: 0.7,
                textAlign: 'right'
              }}>
                {formatMessageTime(message.sent_date)}
                {message.edited_date && ' (изм.)'}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageThread;
