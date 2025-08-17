import React, { useEffect, useRef, useState } from 'react';
import { 
  ChevronDown, 
  Clock, 
  Check, 
  CheckCheck, 
  Edit3, 
  MessageCircle, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';

const MessageThread = ({ messages, loading, conversation }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setNewMessagesCount(prev => prev + 1);
    }
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;
    
    setIsAtBottom(isNearBottom);
    
    if (isNearBottom) {
      setNewMessagesCount(0);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewMessagesCount(0);
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'СЕЙЧАС';
    if (diffMins < 60) return `${diffMins} МИН НАЗАД`;
    if (diffHours < 24) return `${diffHours} Ч НАЗАД`;
    if (diffDays < 7) return `${diffDays} ДН НАЗАД`;
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).toUpperCase();
  };

  const formatDateSeparator = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'СЕГОДНЯ';
    if (date.toDateString() === yesterday.toDateString()) return 'ВЧЕРА';
    
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  // Группировка сообщений по дням
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.sent_date).toDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  if (loading) {
    return <MessageThreadSkeleton />;
  }

  if (!messages?.length) {
    return <EmptyMessageThread conversation={conversation} />;
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="relative h-full bg-gray-900 flex flex-col">
      {/* Контейнер сообщений */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#ff6600 #1f2937'
        }}
      >
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            {/* Разделитель по датам */}
            <DateSeparatorRedesigned date={group.date} />
            
            {/* Сообщения за день */}
            {group.messages.map((message, index) => {
              const isMyMessage = message.sender_id === user?.user_id;
              const prevMessage = index > 0 ? group.messages[index - 1] : null;
              const nextMessage = index < group.messages.length - 1 ? group.messages[index + 1] : null;
              
              // Определяем, нужно ли группировать сообщения
              const isGroupedWithPrev = prevMessage && 
                prevMessage.sender_id === message.sender_id &&
                (new Date(message.sent_date) - new Date(prevMessage.sent_date)) < 300000; // 5 минут
              
              const isGroupedWithNext = nextMessage && 
                nextMessage.sender_id === message.sender_id &&
                (new Date(nextMessage.sent_date) - new Date(message.sent_date)) < 300000;

              return (
                <MessageBubbleRedesigned
                  key={message.message_id}
                  message={message}
                  isMyMessage={isMyMessage}
                  isGroupedWithPrev={isGroupedWithPrev}
                  isGroupedWithNext={isGroupedWithNext}
                  formatTime={formatMessageTime}
                />
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Кнопка прокрутки вниз */}
      {!isAtBottom && (
        <ScrollToBottomButton 
          onClick={scrollToBottom}
          newMessagesCount={newMessagesCount}
        />
      )}
    </div>
  );
};

// Компонент разделителя по датам
const DateSeparatorRedesigned = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-gray-800 border border-gray-600 px-4 py-2 relative">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600"></div>
        <div className="absolute bottom-0.5 right-0.5 w-2 h-0.5 bg-white opacity-50"></div>
        <span className="text-gray-400 font-black uppercase tracking-wider text-xs">
          {new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }).toUpperCase()}
        </span>
      </div>
    </div>
  );
};

// Компонент сообщения
const MessageBubbleRedesigned = ({ 
  message, 
  isMyMessage, 
  isGroupedWithPrev, 
  isGroupedWithNext, 
  formatTime 
}) => {
  const [showFullTime, setShowFullTime] = useState(false);

  const getBubbleStyles = () => {
    let styles = 'relative max-w-xs lg:max-w-md p-4 border-2 transition-all duration-300 group ';
    
    if (isMyMessage) {
      styles += 'bg-orange-600 border-black text-black ml-auto ';
    } else {
      styles += 'bg-gray-800 border-gray-600 text-white mr-auto ';
    }

    // Группировка сообщений
    if (isGroupedWithPrev && isGroupedWithNext) {
      styles += 'my-1 ';
    } else if (isGroupedWithPrev) {
      styles += 'mt-1 mb-3 ';
    } else if (isGroupedWithNext) {
      styles += 'mt-3 mb-1 ';
    } else {
      styles += 'my-3 ';
    }

    return styles;
  };

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={getBubbleStyles()}>
        {/* Геометрические элементы */}
        <div className={`
          absolute top-1 left-1 w-2 h-2 transition-colors duration-300
          ${isMyMessage ? 'bg-black group-hover:bg-white' : 'bg-orange-600 group-hover:bg-white'}
        `}></div>
        <div className={`
          absolute bottom-1 right-1 w-3 h-0.5 transition-opacity duration-300
          ${isMyMessage ? 'bg-black opacity-50 group-hover:opacity-100' : 'bg-white opacity-50 group-hover:opacity-100'}
        `}></div>

        {/* Содержимое сообщения */}
        <div className="relative z-10">
          <div className="font-bold leading-relaxed mb-2 break-words">
            {message.message_text}
          </div>

          {/* Информация о сообщении */}
          <div 
            className={`
              flex items-center justify-end text-xs font-bold uppercase tracking-wider cursor-pointer
              ${isMyMessage ? 'text-black opacity-70' : 'text-gray-400'}
            `}
            onClick={() => setShowFullTime(!showFullTime)}
          >
            <span className="mr-2">
              {showFullTime 
                ? new Date(message.sent_date).toLocaleString('ru-RU').toUpperCase()
                : formatTime(message.sent_date)
              }
            </span>
            
            {message.edited_date && (
              <Edit3 size={12} className="mr-2" />
            )}
            
            {isMyMessage && (
              <MessageStatusIndicator message={message} />
            )}
          </div>
        </div>

        {/* Хвостик сообщения */}
        {!isGroupedWithNext && (
          <div className={`
            absolute top-4 w-0 h-0 border-solid
            ${isMyMessage 
              ? '-left-2 border-l-0 border-r-8 border-t-8 border-b-8 border-transparent border-r-orange-600' 
              : '-right-2 border-r-0 border-l-8 border-t-8 border-b-8 border-transparent border-l-gray-800'
            }
          `}></div>
        )}
      </div>
    </div>
  );
};

// Индикатор статуса сообщения
const MessageStatusIndicator = ({ message }) => {
  const getStatusIcon = () => {
    if (message.is_read) {
      return <CheckCheck size={12} className="text-blue-300" />;
    }
    if (message.is_delivered) {
      return <Check size={12} className="text-gray-300" />;
    }
    return <Clock size={12} className="text-yellow-300" />;
  };

  return getStatusIcon();
};

// Кнопка прокрутки вниз
const ScrollToBottomButton = ({ onClick, newMessagesCount }) => {
  return (
    <button
      onClick={onClick}
      className="group absolute bottom-4 right-4 w-12 h-12 bg-orange-600 hover:bg-white border-2 border-black hover:border-orange-600 text-black hover:text-black transition-all duration-300 transform hover:scale-110 z-10"
    >
      <span className="relative flex items-center justify-center">
        <ChevronDown size={20} className="font-black" />
        {newMessagesCount > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 border-2 border-black flex items-center justify-center">
            <span className="text-white font-black text-xs">
              {newMessagesCount > 9 ? '9+' : newMessagesCount}
            </span>
          </div>
        )}
      </span>
      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
    </button>
  );
};

// Скелетон загрузки
const MessageThreadSkeleton = () => {
  return (
    <div className="h-full bg-gray-900 p-4 space-y-4">
      <div className="flex items-center justify-center mb-6">
        <Loader2 size={48} className="text-orange-600 animate-spin" />
      </div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className="max-w-xs bg-gray-800 border border-gray-600 p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Пустое состояние
const EmptyMessageThread = ({ conversation }) => {
  const getEmptyMessage = () => {
    if (conversation?.subject) {
      return `НАЧНИТЕ ОБСУЖДЕНИЕ: ${conversation.subject.toUpperCase()}`;
    }
    return 'СООБЩЕНИЙ ПОКА НЕТ. НАЧНИТЕ ДИАЛОГ!';
  };

  return (
    <div className="h-full bg-gray-900 flex items-center justify-center text-center relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute top-10 left-10 w-6 h-6 border border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-orange-600 opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white opacity-25"></div>
      <div className="absolute bottom-1/3 left-1/4 w-3 h-3 border border-white rotate-45 opacity-15"></div>

      <div className="relative z-10 max-w-md px-8">
        <div className="text-6xl mb-6 flex justify-center">
          <MessageCircle size={64} className="text-orange-600" />
        </div>
        
        <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
          НАЧНИТЕ ДИАЛОГ
        </h3>
        <div className="w-16 h-1 bg-orange-600 mx-auto mb-6"></div>
        
        <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mb-8">
          {getEmptyMessage()}
        </p>

        <div className="space-y-3 text-gray-500 font-bold uppercase tracking-wide text-xs">
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            НАПИШИТЕ ПЕРВОЕ СООБЩЕНИЕ
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            ЗАДАЙТЕ ВОПРОС О ТОВАРЕ
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            ОБСУДИТЕ ДЕТАЛИ СДЕЛКИ
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент для системных сообщений
export const SystemMessageRedesigned = ({ message, type = 'info' }) => {
  const typeStyles = {
    info: 'bg-blue-900 border-blue-600 text-blue-300',
    warning: 'bg-yellow-900 border-yellow-600 text-yellow-300',
    error: 'bg-red-900 border-red-600 text-red-300',
    success: 'bg-green-900 border-green-600 text-green-300'
  };

  return (
    <div className="flex justify-center my-4">
      <div className={`px-4 py-2 border text-center max-w-md ${typeStyles[type]}`}>
        <div className="font-bold uppercase tracking-wide text-xs">
          {message}
        </div>
      </div>
    </div>
  );
};

// Добавляем CSS для кастомного скроллбара
const styles = `
  .scroll-smooth::-webkit-scrollbar {
    width: 6px;
  }
  
  .scroll-smooth::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  .scroll-smooth::-webkit-scrollbar-thumb {
    background: #ff6600;
    border-radius: 3px;
  }
  
  .scroll-smooth::-webkit-scrollbar-thumb:hover {
    background: #e55a00;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('message-thread-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'message-thread-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MessageThread;