// src/components/Messages/ConversationsList.jsx
import React from 'react';
import { useMessages } from '../../hooks/api/useMessages';

const ConversationsList = ({ onSelectConversation, selectedConversationId }) => {
  const { conversations, isLoading } = useMessages();

  const formatLastMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const truncateMessage = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (isLoading) {
    return <div>Загрузка диалогов...</div>;
  }

  if (!conversations?.data?.length) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        У вас пока нет сообщений
      </div>
    );
  }

  return (
    <div>
      {conversations.data.map((conversation) => (
        <div
          key={conversation.conversation_id}
          onClick={() => onSelectConversation(conversation.conversation_id)}
          style={{
            padding: '15px',
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            backgroundColor: conversation.conversation_id === selectedConversationId ? '#f0f8ff' : 'white'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <h4 style={{ margin: 0, fontSize: '16px' }}>
                  {conversation.subject || 'Диалог'}
                </h4>
                {conversation.unread_count > 0 && (
                  <span style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '12px',
                    marginLeft: '10px'
                  }}>
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              
              <p style={{ 
                margin: 0, 
                color: '#666', 
                fontSize: '14px',
                lineHeight: '1.3'
              }}>
                {truncateMessage(conversation.last_message_text)}
              </p>
            </div>
            
            <div style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>
              {formatLastMessageTime(conversation.last_message_date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;