// src/pages/Messages/ChatPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MessageThread from '../../components/Messages/MessageThread';
import MessageInput from '../../components/Messages/MessageInput';
import { useMessages } from '../../hooks/api/useMessages';

const ChatPage = () => {
  const { conversationId } = useParams();
  const { sendMessage, getConversationMessages } = useMessages();

  const { data: conversation } = useQuery(
    ['conversation', conversationId],
    () => api.get(`/api/conversations/${conversationId}`)
  );

  const { data: messages, isLoading } = getConversationMessages(conversationId);

  const handleSendMessage = async (messageText) => {
    try {
      await sendMessage.mutateAsync({
        conversationId,
        message_text: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка при отправке сообщения');
    }
  };

  return (
    <div>
      <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
        <h2>{conversation?.data?.subject || 'Диалог'}</h2>
      </div>

      <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <MessageThread 
            messages={messages?.data}
            loading={isLoading}
          />
        </div>
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={sendMessage.isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;