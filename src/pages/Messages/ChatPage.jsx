// src/pages/Messages/ChatPage.jsx (redesigned version)
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useMessages } from '../../hooks/api/useMessages';
import api from '../../services/api';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { sendMessage, useConversationMessages } = useMessages();
  const [isTyping, setIsTyping] = useState(false);

  const { data: conversation, isLoading: conversationLoading } = useQuery(
    ['conversation', conversationId],
    () => api.get(`/api/conversations/${conversationId}`)
  );

  const { data: messages, isLoading: messagesLoading } = useConversationMessages(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    setIsTyping(true);
    try {
      await sendMessage.mutateAsync({
        conversationId,
        message_text: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Можно добавить toast уведомление
    } finally {
      setIsTyping(false);
    }
  };

  const handleBack = () => {
    navigate('/messages');
  };

  if (conversationLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-black uppercase tracking-wider">ЗАГРУЗКА ДИАЛОГА...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 left-10 w-8 h-8 border-2 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-orange-600 rotate-12 opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-white opacity-25"></div>
      <div className="absolute bottom-10 right-10 w-12 h-12 border border-white rotate-45 opacity-15"></div>

      {/* Хедер диалога */}
      <div className="bg-black border-b-4 border-orange-600 relative overflow-hidden">
        {/* Геометрические элементы хедера */}
        <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
        <div className="absolute top-2 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-2 left-4 w-2 h-2 bg-white"></div>

        <div className="relative z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="group p-2 bg-gray-900 hover:bg-orange-600 border-2 border-gray-700 hover:border-black transition-all duration-300 transform hover:scale-110"
            >
              <span className="text-white group-hover:text-black font-black text-lg">←</span>
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
            </button>
            
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                {conversation?.data?.subject || 'ДИАЛОГ'}
              </h1>
              <div className="w-12 h-0.5 bg-orange-600 mt-1"></div>
            </div>
          </div>

          {/* Статус/действия */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">ОНЛАЙН</span>
            </div>
            
            <button className="group p-2 bg-gray-900 hover:bg-red-600 border-2 border-gray-700 hover:border-black transition-all duration-300">
              <span className="text-white group-hover:text-black font-black">⚠️</span>
              <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-red-600 group-hover:bg-black transition-colors"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col bg-gray-900 relative">
        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
          {/* Декоративные элементы в области сообщений */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-orange-600 rotate-45 opacity-30"></div>
          <div className="absolute top-4 right-4 w-2 h-8 bg-white opacity-10"></div>

          {messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">ЗАГРУЗКА СООБЩЕНИЙ...</p>
              </div>
            </div>
          ) : (
            <>
              <MessageThreadRedesigned 
                messages={messages?.data || []}
                loading={messagesLoading}
              />
              
              {/* Индикатор печатания */}
              {isTyping && (
                <div className="flex items-center space-x-3 p-4 bg-gray-800 border-l-4 border-orange-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">ОТПРАВКА СООБЩЕНИЯ...</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Поле ввода сообщения */}
        <div className="border-t-4 border-orange-600 bg-black relative overflow-hidden">
          {/* Геометрические элементы поля ввода */}
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-orange-600"></div>
          <div className="absolute bottom-2 right-2 w-4 h-1 bg-white opacity-50"></div>

          <div className="relative z-10 p-6">
            <MessageInputRedesigned 
              onSendMessage={handleSendMessage}
              disabled={sendMessage.isLoading || isTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент для отображения сообщений в новом стиле
const MessageThreadRedesigned = ({ messages, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-400 font-bold uppercase tracking-wider">ЗАГРУЗКА...</div>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <div className="text-4xl mb-4">💬</div>
        <div className="text-gray-400 font-black uppercase tracking-wider text-lg mb-2">
          НЕТ СООБЩЕНИЙ
        </div>
        <div className="text-gray-500 font-bold uppercase tracking-wide text-sm">
          НАЧНИТЕ ДИАЛОГ ПЕРВЫМ
        </div>
      </div>
    );
  }

  // Группируем сообщения по отправителю для оптимизации отображения
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1];
    const isNewGroup = !prevMessage || prevMessage.sender_id !== message.sender_id;
    
    if (isNewGroup) {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {groupedMessages.map((messageGroup, groupIndex) => (
        <MessageGroupRedesigned 
          key={groupIndex}
          messages={messageGroup}
          isOwnMessage={messageGroup[0].is_own_message} // предполагаем, что есть такое поле
        />
      ))}
    </div>
  );
};

// Группа сообщений от одного отправителя
const MessageGroupRedesigned = ({ messages, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Аватар и имя (только для чужих сообщений) */}
        {!isOwnMessage && (
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-orange-600 border-2 border-black flex items-center justify-center mr-3">
              <span className="text-black font-black text-sm">👤</span>
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-wide text-sm">
              {messages[0].sender_name || 'ПОЛЬЗОВАТЕЛЬ'}
            </span>
          </div>
        )}

        {/* Сообщения */}
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={message.message_id}
              className={`
                relative p-4 border-2 transition-all duration-300 group
                ${isOwnMessage 
                  ? 'bg-orange-600 border-black text-black ml-8' 
                  : 'bg-gray-800 border-gray-600 text-white mr-8'
                }
              `}
            >
              {/* Геометрические элементы сообщения */}
              <div className={`
                absolute top-1 left-1 w-2 h-2 transition-colors duration-300
                ${isOwnMessage ? 'bg-black' : 'bg-orange-600'}
              `}></div>
              <div className={`
                absolute bottom-1 right-1 w-3 h-0.5 transition-colors duration-300
                ${isOwnMessage ? 'bg-black opacity-50' : 'bg-white opacity-50'}
              `}></div>

              <div className="relative z-10">
                <p className="font-bold leading-relaxed break-words">
                  {message.message_text}
                </p>
                
                <div className={`
                  text-xs font-bold uppercase tracking-wider mt-2 flex items-center justify-between
                  ${isOwnMessage ? 'text-black opacity-70' : 'text-gray-400'}
                `}>
                  <span>
                    {new Date(message.sent_date).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {isOwnMessage && (
                    <span className="flex items-center">
                      {message.is_read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>

              {/* Хвостик сообщения */}
              {index === messages.length - 1 && (
                <div className={`
                  absolute top-4 w-0 h-0 border-solid
                  ${isOwnMessage 
                    ? '-left-2 border-l-0 border-r-8 border-t-8 border-b-8 border-transparent border-r-orange-600' 
                    : '-right-2 border-r-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800'
                  }
                `}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Поле ввода в новом стиле
const MessageInputRedesigned = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message);
    setMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="ВВЕДИТЕ СООБЩЕНИЕ..."
          disabled={disabled}
          rows={3}
          className={`
            w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
            focus:outline-none focus:bg-black placeholder-gray-500 uppercase tracking-wide
            resize-none border-gray-700 focus:border-orange-500 hover:border-gray-600
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Геометрические элементы поля ввода */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
        <div className="absolute bottom-2 right-2 w-3 h-0.5 bg-white opacity-50"></div>
        
        {/* Счетчик символов */}
        <div className="absolute bottom-2 left-4 text-gray-500 font-bold text-xs uppercase tracking-wide">
          {message.length}/1000
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Кнопки дополнительных действий */}
          <button
            type="button"
            className="group p-2 bg-gray-800 hover:bg-orange-600 border-2 border-gray-600 hover:border-black transition-all duration-300"
            title="Прикрепить файл"
          >
            <span className="text-gray-400 group-hover:text-black">📎</span>
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
          </button>
          
          <button
            type="button"
            className="group p-2 bg-gray-800 hover:bg-orange-600 border-2 border-gray-600 hover:border-black transition-all duration-300"
            title="Эмодзи"
          >
            <span className="text-gray-400 group-hover:text-black">😊</span>
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
          </button>
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`
            group relative px-6 py-3 font-black uppercase tracking-wider transition-all duration-300
            transform border-2 flex items-center space-x-2
            ${disabled || !message.trim()
              ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
            }
          `}
        >
          <span className="relative flex items-center">
            {disabled ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                ОТПРАВКА...
              </>
            ) : (
              <>
                🚀 ОТПРАВИТЬ
              </>
            )}
          </span>
          
          {!disabled && message.trim() && (
            <>
              <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
              <div className="absolute bottom-0.5 right-0.5 w-3 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatPage;