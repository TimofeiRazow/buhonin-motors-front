import React, { useState, useMemo } from 'react';
import { useMessages } from '../../hooks/api/useMessages';

const ConversationsList = ({ 
  onSelectConversation, 
  selectedConversationId, 
  showSearch = true,
  showFilters = true 
}) => {
  const { conversations, isLoading, unreadCount } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, today
  const [sortBy, setSortBy] = useState('date'); // date, name, unread

  // Фильтрация и сортировка диалогов
  const filteredConversations = useMemo(() => {
    if (!conversations?.data) return [];

    let filtered = conversations.data.filter(conv => {
      // Поиск
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          conv.subject?.toLowerCase().includes(query) ||
          conv.participant_name?.toLowerCase().includes(query) ||
          conv.last_message_text?.toLowerCase().includes(query)
        );
      }
      return true;
    });

    // Фильтры
    switch (filter) {
      case 'unread':
        filtered = filtered.filter(conv => conv.unread_count > 0);
        break;
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter(conv => 
          new Date(conv.last_message_date).toDateString() === today
        );
        break;
      default:
        break;
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.participant_name || '').localeCompare(b.participant_name || '');
        case 'unread':
          return b.unread_count - a.unread_count;
        case 'date':
        default:
          return new Date(b.last_message_date) - new Date(a.last_message_date);
      }
    });

    return filtered;
  }, [conversations?.data, searchQuery, filter, sortBy]);

  const formatLastMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    const diffInDays = (now - date) / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const diffInMins = Math.floor((now - date) / (1000 * 60));
      if (diffInMins < 1) return 'СЕЙЧАС';
      return `${diffInMins} МИН`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} ДН`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const truncateMessage = (text, maxLength = 60) => {
    if (!text) return 'НЕТ СООБЩЕНИЙ';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getConversationStatus = (conversation) => {
    if (conversation.unread_count > 0) return 'unread';
    if (conversation.is_online) return 'online';
    return 'read';
  };

  if (isLoading) {
    return <ConversationsListSkeleton />;
  }

  if (!conversations?.data?.length) {
    return <EmptyConversationsList />;
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Геометрические элементы */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-orange-600 rotate-45 opacity-30"></div>
      <div className="absolute bottom-4 right-4 w-2 h-8 bg-white opacity-20"></div>

      {/* Хедер со статистикой */}
      <div className="bg-black border-b-2 border-orange-600 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
        <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              💬 ДИАЛОГИ
            </h2>
            <div className="w-12 h-0.5 bg-orange-600 mt-1"></div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gray-800 border border-gray-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-gray-400">
              ВСЕГО: {conversations.data.length}
            </div>
            {unreadCount > 0 && (
              <div className="bg-red-600 border border-black px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                НОВЫХ: {unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Панель поиска и фильтров */}
      {showSearch && (
        <SearchAndFiltersRedesigned
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
        />
      )}

      {/* Список диалогов */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <NoResultsRedesigned searchQuery={searchQuery} filter={filter} />
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation, index) => (
              <ConversationItemRedesigned
                key={conversation.conversation_id}
                conversation={conversation}
                isSelected={conversation.conversation_id === selectedConversationId}
                onClick={() => onSelectConversation(conversation.conversation_id)}
                formatTime={formatLastMessageTime}
                truncateMessage={truncateMessage}
                status={getConversationStatus(conversation)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент поиска и фильтров
const SearchAndFiltersRedesigned = ({ 
  searchQuery, 
  setSearchQuery, 
  filter, 
  setFilter, 
  sortBy, 
  setSortBy, 
  showFilters 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-3 space-y-3">
      {/* Поиск */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ПОИСК ДИАЛОГОВ..."
          className="w-full p-3 bg-gray-900 text-white font-bold border border-gray-600 focus:border-orange-500 hover:border-gray-500 focus:outline-none placeholder-gray-500 uppercase tracking-wide transition-all duration-300"
        />
        <div className="absolute top-1 left-1 w-1 h-1 bg-orange-600"></div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
          🔍
        </div>
      </div>

      {/* Быстрые фильтры */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <FilterButtonRedesigned
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              ВСЕ
            </FilterButtonRedesigned>
            <FilterButtonRedesigned
              active={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              НОВЫЕ
            </FilterButtonRedesigned>
            <FilterButtonRedesigned
              active={filter === 'today'}
              onClick={() => setFilter('today')}
            >
              СЕГОДНЯ
            </FilterButtonRedesigned>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 bg-gray-700 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold text-xs uppercase tracking-wide transition-all duration-300"
          >
            {showAdvanced ? '▲' : '▼'}
          </button>
        </div>
      )}

      {/* Расширенные фильтры */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-700">
          <div className="text-gray-400 font-black uppercase text-xs mb-2">СОРТИРОВКА:</div>
          <div className="flex gap-2">
            <FilterButtonRedesigned
              active={sortBy === 'date'}
              onClick={() => setSortBy('date')}
              size="small"
            >
              ПО ДАТЕ
            </FilterButtonRedesigned>
            <FilterButtonRedesigned
              active={sortBy === 'name'}
              onClick={() => setSortBy('name')}
              size="small"
            >
              ПО ИМЕНИ
            </FilterButtonRedesigned>
            <FilterButtonRedesigned
              active={sortBy === 'unread'}
              onClick={() => setSortBy('unread')}
              size="small"
            >
              ПО НОВЫМ
            </FilterButtonRedesigned>
          </div>
        </div>
      )}
    </div>
  );
};

// Кнопка фильтра
const FilterButtonRedesigned = ({ active, onClick, children, size = 'normal' }) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    normal: 'px-3 py-2 text-xs'
  };

  return (
    <button
      onClick={onClick}
      className={`
        font-black uppercase tracking-wider border transition-all duration-300
        ${active
          ? 'bg-orange-600 border-black text-black'
          : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-orange-500'
        }
        ${sizeClasses[size]}
      `}
    >
      {children}
    </button>
  );
};

// Компонент элемента диалога
const ConversationItemRedesigned = ({ 
  conversation, 
  isSelected, 
  onClick, 
  formatTime, 
  truncateMessage, 
  status,
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative p-4 cursor-pointer border-2 transition-all duration-300 group
        ${isSelected 
          ? 'bg-orange-600 border-black text-black transform scale-105' 
          : 'bg-gray-800 border-gray-600 hover:border-orange-500 text-white hover:bg-gray-700'
        }
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
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

      {/* Индикатор статуса */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300
        ${status === 'unread' ? 'bg-red-600' : status === 'online' ? 'bg-green-500' : 'bg-gray-600'}
      `}></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-3">
          {/* Заголовок и бейдж */}
          <div className="flex items-center mb-2">
            <h4 className={`
              font-black uppercase tracking-wide text-sm truncate mr-2
              ${isSelected ? 'text-black' : 'text-white'}
            `}>
              {conversation.subject || 'БЕЗ ТЕМЫ'}
            </h4>
            
            {conversation.unread_count > 0 && (
              <div className="w-6 h-6 bg-red-600 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">
                  {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                </span>
              </div>
            )}
          </div>

          {/* Участник */}
          {conversation.participant_name && (
            <div className={`
              text-xs font-bold uppercase tracking-wide mb-1
              ${isSelected ? 'text-black opacity-70' : 'text-gray-400'}
            `}>
              👤 {conversation.participant_name}
            </div>
          )}

          {/* Последнее сообщение */}
          <p className={`
            text-xs font-medium leading-relaxed truncate
            ${isSelected ? 'text-black opacity-60' : 'text-gray-300'}
          `}>
            {truncateMessage(conversation.last_message_text)}
          </p>
        </div>

        {/* Время и статус */}
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          <span className={`
            text-xs font-bold uppercase tracking-wide
            ${isSelected ? 'text-black opacity-70' : 'text-gray-500'}
          `}>
            {formatTime(conversation.last_message_date)}
          </span>

          {/* Дополнительные индикаторы */}
          <div className="flex items-center space-x-1">
            {conversation.is_pinned && (
              <span className="text-orange-500 text-xs">📌</span>
            )}
            {conversation.is_muted && (
              <span className="text-gray-500 text-xs">🔇</span>
            )}
            {conversation.has_attachments && (
              <span className="text-blue-500 text-xs">📎</span>
            )}
          </div>
        </div>
      </div>

      {/* Hover индикатор */}
      {isHovered && !isSelected && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 opacity-70">
          →
        </div>
      )}
    </div>
  );
};

// Скелетон загрузки
const ConversationsListSkeleton = () => {
  return (
    <div className="h-full bg-gray-900 p-4 space-y-3">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gray-800 border border-gray-600 p-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-full"></div>
            </div>
            <div className="w-12 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Пустое состояние
const EmptyConversationsList = () => {
  return (
    <div className="h-full bg-gray-900 flex items-center justify-center text-center relative overflow-hidden">
      {/* Фоновые элементы */}
      <div className="absolute top-10 left-10 w-6 h-6 border border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 bg-orange-600 opacity-30"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white opacity-25"></div>

      <div className="relative z-10 max-w-md px-8">
        <div className="text-6xl mb-6">💬</div>
        
        <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-4">
          НЕТ ДИАЛОГОВ
        </h3>
        <div className="w-16 h-1 bg-orange-600 mx-auto mb-6"></div>
        
        <p className="text-gray-400 font-bold uppercase tracking-wide text-sm mb-8">
          У ВАС ПОКА НЕТ СООБЩЕНИЙ
        </p>

        <div className="space-y-3 text-gray-500 font-bold uppercase tracking-wide text-xs">
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            НАЙДИТЕ ИНТЕРЕСНОЕ ОБЪЯВЛЕНИЕ
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            СВЯЖИТЕСЬ С ПРОДАВЦОМ
          </div>
          <div className="flex items-center justify-center">
            <span className="w-2 h-2 bg-orange-600 mr-3"></span>
            НАЧНИТЕ ДИАЛОГ
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент отсутствия результатов поиска
const NoResultsRedesigned = ({ searchQuery, filter }) => {
  const getMessage = () => {
    if (searchQuery.trim()) {
      return `НЕТ РЕЗУЛЬТАТОВ ДЛЯ "${searchQuery.toUpperCase()}"`;
    }
    if (filter === 'unread') {
      return 'НЕТ НЕПРОЧИТАННЫХ ДИАЛОГОВ';
    }
    if (filter === 'today') {
      return 'НЕТ ДИАЛОГОВ ЗА СЕГОДНЯ';
    }
    return 'НЕТ ДИАЛОГОВ';
  };

  return (
    <div className="h-full flex items-center justify-center text-center p-8">
      <div>
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
          {getMessage()}
        </h3>
        <div className="w-12 h-0.5 bg-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-wide text-sm">
          ПОПРОБУЙТЕ ИЗМЕНИТЬ ПАРАМЕТРЫ ПОИСКА
        </p>
      </div>
    </div>
  );
};

// Добавляем CSS анимации
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.3s ease-out;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('conversations-list-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'conversations-list-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ConversationsList;