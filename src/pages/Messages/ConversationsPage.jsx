// src/pages/Messages/ConversationsPage.jsx (исправленная версия)
import React, { useState } from 'react';
import ConversationsList from '../../components/Messages/ConversationsList';
import MessageThread from '../../components/Messages/MessageThread';
import MessageInput from '../../components/Messages/MessageInput';
import { useMessages } from '../../hooks/api/useMessages';

const ConversationsPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const { sendMessage, useConversationMessages } = useMessages();

  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversationId);

  const handleSendMessage = async (messageText) => {
    if (!selectedConversationId) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversationId,
        message_text: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  return (
    <div>
      <h1>Сообщения</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', height: '600px', border: '1px solid #ddd' }}>
        <div style={{ borderRight: '1px solid #ddd', overflowY: 'auto' }}>
          <ConversationsList 
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedConversationId ? (
            <>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <MessageThread 
                  messages={messages?.data}
                  loading={messagesLoading}
                />
              </div>
              
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={sendMessage.isLoading}
              />
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#666'
            }}>
              Выберите диалог для просмотра сообщений
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;