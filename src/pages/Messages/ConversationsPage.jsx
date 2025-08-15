// src/pages/Messages/ConversationsPage.jsx (redesigned version)
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useMessages } from '../../hooks/api/useMessages';
import api from '../../services/api';

const ConversationsPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  const { sendMessage, useConversationMessages } = useMessages();

  // Загружаем список диалогов
  const { data: conversations, isLoading: conversationsLoading } = useQuery(
    'conversations',
    () => api.get('/api/conversations/')
  );

  // Загружаем сообщения выбранного диалога
  const { data: messages, isLoading: messagesLoading } = useConversationMessages(selectedConversationId);

  // Загружаем информацию о выбранном диалоге
  const { data: selectedConversation } = useQuery(
    ['conversation', selectedConversationId],
    () => api.get(`/api/conversations/${selectedConversationId}`),
    { enabled: !!selectedConversationId }
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!selectedConversationId || !messageText.trim()) return;

    try {
      await sendMessage.mutateAsync({
        conversationId: selectedConversationId,
        message_text: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleConversationSelect = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  const filteredConversations = conversations?.data?.filter(conv => 
    conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 left-10 w-12 h-12 border-4 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-20 right-20 w-8 h-8 bg-orange-600 rotate-12 opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-6 h-6 bg-white opacity-25"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rotate-45 opacity-15"></div>

      {/* Главный хедер */}
      <div className="bg-black border-b-4 border-orange-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute top-4 right-6 w-6 h-6 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-4 left-6 w-4 h-4 bg-white"></div>

        <div className="relative z-10 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-2">
                СООБЩЕНИЯ
              </h1>
              <div className="w-20 h-1 bg-orange-600"></div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mt-2">
                УПРАВЛЯЙТЕ ВАШИМИ ДИАЛОГАМИ
              </p>
            </div>

            <button
              onClick={() => setShowNewMessageModal(true)}
              className="group relative bg-orange-600 hover:bg-white text-black hover:text-black font-black px-6 py-3 border-2 border-black hover:border-orange-600 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative flex items-center">
                ✉️ НОВОЕ СООБЩЕНИЕ
              </span>
              <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
              <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Левая панель - список диалогов */}
        <div className="w-1/3 bg-gray-900 border-r-4 border-orange-600 flex flex-col relative overflow-hidden">
          {/* Геометрические элементы левой панели */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-orange-600 rotate-45"></div>
          <div className="absolute top-4 right-4 w-2 h-8 bg-white opacity-20"></div>

          {/* Поиск диалогов */}
          <div className="p-4 border-b-2 border-gray-700 relative z-10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ПОИСК ДИАЛОГОВ..."
                className="w-full p-3 bg-gray-800 text-white font-bold border-2 border-gray-600 focus:border-orange-500 hover:border-gray-500 focus:outline-none placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
              />
              <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                🔍
              </div>
            </div>
          </div>

          {/* Список диалогов */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-400 font-bold uppercase text-xs">ЗАГРУЗКА...</p>
                </div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                <div className="text-3xl mb-3">📭</div>
                <div className="text-gray-400 font-black uppercase tracking-wider text-sm mb-2">
                  {searchQuery ? 'НЕТ РЕЗУЛЬТАТОВ' : 'НЕТ ДИАЛОГОВ'}
                </div>
                <div className="text-gray-500 font-bold uppercase tracking-wide text-xs">
                  {searchQuery ? 'ПОПРОБУЙТЕ ДРУГОЙ ЗАПРОС' : 'НАЧНИТЕ НОВЫЙ ДИАЛОГ'}
                </div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <ConversationItemRedesigned
                    key={conversation.conversation_id}
                    conversation={conversation}
                    isSelected={selectedConversationId === conversation.conversation_id}
                    onClick={() => handleConversationSelect(conversation.conversation_id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Правая панель - область сообщений */}
        <div className="flex-1 bg-black flex flex-col relative">
          {selectedConversationId ? (
            <>
              {/* Хедер выбранного диалога */}
              <div className="bg-gray-900 border-b-2 border-gray-700 p-4 relative overflow-hidden">
                <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
                <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">
                      {selectedConversation?.data?.subject || 'ДИАЛОГ'}
                    </h3>
                    <div className="w-12 h-0.5 bg-orange-600 mt-1"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/messages/${selectedConversationId}`)}
                      className="group p-2 bg-gray-800 hover:bg-orange-600 border-2 border-gray-600 hover:border-black transition-all duration-300"
                      title="Открыть в полном окне"
                    >
                      <span className="text-white group-hover:text-black">🔗</span>
                    </button>
                    <button className="group p-2 bg-gray-800 hover:bg-red-600 border-2 border-gray-600 hover:border-black transition-all duration-300">
                      <span className="text-white group-hover:text-black">⚠️</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Область сообщений */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600 rotate-45 opacity-30"></div>
                
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">ЗАГРУЗКА СООБЩЕНИЙ...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <MessagesAreaRedesigned messages={messages?.data || []} />
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Поле ввода */}
              <div className="border-t-2 border-gray-700 bg-gray-900 p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
                <div className="absolute bottom-1 left-1 w-2 h-2 bg-orange-600"></div>
                
                <div className="relative z-10">
                  <MessageInputCompact
                    onSendMessage={handleSendMessage}
                    disabled={sendMessage.isLoading}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Состояние по умолчанию */
            <div className="flex-1 flex items-center justify-center relative">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-6">💬</div>
                <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
                  ВЫБЕРИТЕ ДИАЛОГ
                </h2>
                <div className="w-16 h-1 bg-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mb-8">
                  НАЖМИТЕ НА ДИАЛОГ СЛЕВА ДЛЯ ПРОСМОТРА СООБЩЕНИЙ
                </p>
                
                <button
                  onClick={() => setShowNewMessageModal(true)}
                  className="group relative bg-orange-600 hover:bg-white text-black hover:text-black font-black px-6 py-3 border-2 border-black hover:border-orange-600 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative">
                    ✉️ НАЧАТЬ НОВЫЙ ДИАЛОГ
                  </span>
                  <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                  <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
                </button>
              </div>

              {/* Декоративные элементы в пустой области */}
              <div className="absolute top-20 left-20 w-4 h-4 border border-orange-600 rotate-45 opacity-20"></div>
              <div className="absolute bottom-20 right-20 w-6 h-6 bg-white opacity-10"></div>
            </div>
          )}
        </div>
      </div>

      {/* Модал создания нового сообщения */}
      {showNewMessageModal && (
        <NewMessageModalRedesigned
          onClose={() => setShowNewMessageModal(false)}
          onSubmit={(data) => {
            // Логика создания нового диалога
            console.log('New message:', data);
            setShowNewMessageModal(false);
          }}
        />
      )}
    </div>
  );
};

// Компонент элемента диалога
const ConversationItemRedesigned = ({ conversation, isSelected, onClick }) => {
  const hasUnread = conversation.unread_count > 0;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 cursor-pointer border-2 transition-all duration-300 group
        ${isSelected 
          ? 'bg-orange-600 border-black text-black' 
          : 'bg-gray-800 border-gray-600 hover:border-orange-500 text-white hover:bg-gray-700'
        }
      `}
    >
      {/* Геометрические элементы */}
      <div className={`
        absolute top-1 left-1 w-2 h-2 transition-colors duration-300
        ${isSelected ? 'bg-black' : 'bg-orange-600'}
      `}></div>
      <div className={`
        absolute bottom-1 right-1 w-3 h-0.5 transition-colors duration-300
        ${isSelected ? 'bg-black opacity-50' : 'bg-white opacity-50'}
      `}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <h4 className={`
            font-black uppercase tracking-wide text-sm truncate flex-1 mr-2
            ${isSelected ? 'text-black' : 'text-white'}
          `}>
            {conversation.subject || 'БЕЗ ТЕМЫ'}
          </h4>
          
          {hasUnread && (
            <div className="w-6 h-6 bg-red-600 border-2 border-black flex items-center justify-center">
              <span className="text-black font-black text-xs">
                {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className={`
            text-xs font-bold uppercase tracking-wide truncate flex-1
            ${isSelected ? 'text-black opacity-70' : 'text-gray-400'}
          `}>
            {conversation.participant_name || 'ПОЛЬЗОВАТЕЛЬ'}
          </p>
          
          <span className={`
            text-xs font-bold uppercase tracking-wide
            ${isSelected ? 'text-black opacity-70' : 'text-gray-500'}
          `}>
            {conversation.last_message_date && 
              new Date(conversation.last_message_date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
              })
            }
          </span>
        </div>

        {conversation.last_message_text && (
          <p className={`
            text-xs mt-2 truncate font-bold
            ${isSelected ? 'text-black opacity-60' : 'text-gray-500'}
          `}>
            {conversation.last_message_text}
          </p>
        )}
      </div>
    </div>
  );
};

// Компонент области сообщений (упрощенная версия)
const MessagesAreaRedesigned = ({ messages }) => {
  if (!messages?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-4xl mb-4">💭</div>
        <div className="text-gray-400 font-black uppercase tracking-wider text-lg mb-2">
          НЕТ СООБЩЕНИЙ
        </div>
        <div className="text-gray-500 font-bold uppercase tracking-wide text-sm">
          НАЧНИТЕ ДИАЛОГ ПЕРВЫМ
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.message_id}
          className={`flex ${message.is_own_message ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`
            max-w-xs lg:max-w-md p-3 border-2 relative
            ${message.is_own_message 
              ? 'bg-orange-600 border-black text-black' 
              : 'bg-gray-800 border-gray-600 text-white'
            }
          `}>
            <div className={`
              absolute top-1 left-1 w-1 h-1
              ${message.is_own_message ? 'bg-black' : 'bg-orange-600'}
            `}></div>
            
            <p className="font-bold text-sm break-words mb-1">
              {message.message_text}
            </p>
            
            <div className={`
              text-xs font-bold uppercase tracking-wider flex items-center justify-between
              ${message.is_own_message ? 'text-black opacity-70' : 'text-gray-400'}
            `}>
              <span>
                {new Date(message.sent_date).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {message.is_own_message && (
                <span>{message.is_read ? '✓✓' : '✓'}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Компактное поле ввода
const MessageInputCompact = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ВВЕДИТЕ СООБЩЕНИЕ..."
          disabled={disabled}
          rows={2}
          className={`
            w-full p-3 bg-gray-800 text-white font-bold border-2 transition-all duration-300
            focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide
            resize-none border-gray-600 focus:border-orange-500 hover:border-gray-500
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <div className="absolute top-1 left-1 w-1 h-1 bg-orange-600"></div>
      </div>

      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className={`
          group relative p-3 font-black uppercase tracking-wider transition-all duration-300
          transform border-2 flex items-center
          ${disabled || !message.trim()
            ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
          }
        `}
      >
        <span className="relative">
          {disabled ? '⏳' : '🚀'}
        </span>
        
        {!disabled && message.trim() && (
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black group-hover:bg-orange-600 transition-colors"></div>
        )}
      </button>
    </form>
  );
};

// Модал создания нового сообщения
const NewMessageModalRedesigned = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-black border-4 border-orange-600 max-w-2xl w-full relative overflow-hidden">
        {/* Геометрические элементы модала */}
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-white"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider">
                НОВОЕ СООБЩЕНИЕ
              </h2>
              <div className="w-16 h-0.5 bg-orange-600 mt-1"></div>
            </div>
            
            <button
              onClick={onClose}
              className="group p-2 bg-gray-900 hover:bg-red-600 border-2 border-gray-700 hover:border-black transition-all duration-300"
            >
              <span className="text-white group-hover:text-black font-black">✕</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block mb-2 text-white font-black uppercase tracking-wider text-sm">
                ПОЛУЧАТЕЛЬ
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
                placeholder="ВВЕДИТЕ НОМЕР ТЕЛЕФОНА ИЛИ EMAIL"
                className="w-full p-3 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
                required
              />
              <div className="absolute top-8 left-1 w-1 h-1 bg-orange-600"></div>
            </div>

            <div className="relative">
              <label className="block mb-2 text-white font-black uppercase tracking-wider text-sm">
                ТЕМА
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="ТЕМА СООБЩЕНИЯ"
                className="w-full p-3 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
                required
              />
              <div className="absolute top-8 left-1 w-1 h-1 bg-orange-600"></div>
            </div>

            <div className="relative">
              <label className="block mb-2 text-white font-black uppercase tracking-wider text-sm">
                СООБЩЕНИЕ
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="ВВЕДИТЕ ВАШЕ СООБЩЕНИЕ..."
                rows={4}
                className="w-full p-3 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none placeholder-gray-500 uppercase tracking-wide resize-vertical transition-all duration-300"
                required
              />
              <div className="absolute top-8 left-1 w-1 h-1 bg-orange-600"></div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="group relative flex-1 p-3 bg-gray-600 hover:bg-gray-700 text-white font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
              >
                ОТМЕНА
              </button>
              
              <button
                type="submit"
                className="group relative flex-1 p-3 bg-orange-600 hover:bg-white text-black hover:text-black font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105 border-2 border-black hover:border-orange-600"
              >
                <span className="relative">🚀 ОТПРАВИТЬ</span>
                <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
                <div className="absolute bottom-0.5 right-0.5 w-3 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConversationsPage;