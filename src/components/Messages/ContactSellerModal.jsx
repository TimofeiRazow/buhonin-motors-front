import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ContactSellerModal = ({ 
  listing, 
  isOpen, 
  onClose, 
  onSuccess,
  initialMessage = ''
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: form, 2: success
  const [conversationId, setConversationId] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  // Автофокус на textarea при открытии
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Блокировка скролла при открытом модале
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const getDefaultMessage = () => {
    if (initialMessage) return initialMessage;
    
    const price = listing.price ? `за ${listing.price.toLocaleString()} ${listing.currency_code || '₸'}` : '';
    return `ЗДРАВСТВУЙТЕ! МЕНЯ ИНТЕРЕСУЕТ ВАШЕ ОБЪЯВЛЕНИЕ "${listing.title.toUpperCase()}" ${price}. ПОЖАЛУЙСТА, СВЯЖИТЕСЬ СО МНОЙ.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      setError('ВВЕДИТЕ СООБЩЕНИЕ');
      return;
    }

    setLoading(true);

    try {
      // Создаем диалог или находим существующий
      const conversationResponse = await api.post('/api/conversations/', {
        related_entity_id: listing.entity_id,
        subject: `ПО ОБЪЯВЛЕНИЮ: ${listing.title.toUpperCase()}`,
        participant_user_id: listing.user_id
      });

      // Отправляем сообщение
      await api.post(`/api/conversations/${conversationResponse.data.conversation_id}/messages`, {
        message_text: message.trim()
      });

      setConversationId(conversationResponse.data.conversation_id);
      setStep(2);
      
      onSuccess?.(conversationResponse.data.conversation_id);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.message || 'ОШИБКА ПРИ ОТПРАВКЕ СООБЩЕНИЯ');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage(getDefaultMessage());
    setError('');
    setStep(1);
  };

  const handleClose = () => {
    setMessage('');
    setError('');
    setStep(1);
    setConversationId(null);
    onClose();
  };

  const goToConversation = () => {
    if (conversationId) {
      navigate(`/messages/${conversationId}`);
      handleClose();
    }
  };

  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return `${price.toLocaleString()} ${currency || '₸'}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Фон */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={handleClose}
      />

      {/* Модальное окно */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-black border-4 border-orange-600 overflow-hidden animate-modalSlideIn"
      >
        {/* Геометрические элементы */}
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute top-4 right-4 w-6 h-6 bg-orange-600 rotate-45"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-white"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>

        <div className="relative z-10 p-8">
          {step === 1 ? (
            /* Форма отправки сообщения */
            <ContactFormRedesigned
              listing={listing}
              message={message}
              setMessage={setMessage}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onClose={handleClose}
              onReset={handleReset}
              textareaRef={textareaRef}
              formatPrice={formatPrice}
              getDefaultMessage={getDefaultMessage}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            /* Успешная отправка */
            <SuccessStateRedesigned
              listing={listing}
              onClose={handleClose}
              goToConversation={goToConversation}
              conversationId={conversationId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент формы
const ContactFormRedesigned = ({ 
  listing, 
  message, 
  setMessage, 
  loading, 
  error, 
  onSubmit, 
  onClose, 
  onReset,
  textareaRef,
  formatPrice,
  getDefaultMessage,
  isAuthenticated
}) => {
  return (
    <>
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
          💬 НАПИСАТЬ ПРОДАВЦУ
        </h2>
        <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
      </div>

      {/* Информация об объявлении */}
      <ListingInfoCardRedesigned listing={listing} formatPrice={formatPrice} />

      {/* Ошибки */}
      {error && (
        <div className="bg-red-600 border-2 border-black text-white p-4 mb-6 relative animate-shake">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
          <p className="font-bold uppercase tracking-wide text-sm">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Предупреждение для неавторизованных */}
      {!isAuthenticated && (
        <div className="bg-yellow-600 border-2 border-black text-black p-4 mb-6 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <p className="font-bold uppercase tracking-wide text-sm">
            🔒 ДЛЯ ОТПРАВКИ СООБЩЕНИЯ НЕОБХОДИМО ВОЙТИ В СИСТЕМУ
          </p>
        </div>
      )}

      {/* Форма */}
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block mb-3 text-white font-black uppercase tracking-wider text-sm">
            💬 ВАШЕ СООБЩЕНИЕ:
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={getDefaultMessage()}
              className="w-full p-4 bg-gray-900 text-white font-bold border-2 border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:outline-none focus:bg-black placeholder-gray-500 resize-vertical transition-all duration-300"
              style={{ minHeight: '120px', maxHeight: '200px' }}
              required
            />
            <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
            <div className="absolute bottom-2 right-2 w-3 h-0.5 bg-white opacity-50"></div>
          </div>
          
          {/* Счетчик символов */}
          <div className="flex items-center justify-between mt-2 text-xs font-bold uppercase tracking-wide">
            <button
              type="button"
              onClick={onReset}
              className="text-orange-500 hover:text-orange-400 transition-colors"
            >
              🔄 ИСПОЛЬЗОВАТЬ ШАБЛОН
            </button>
            <span className="text-gray-500">
              {message.length}/1000 СИМВОЛОВ
            </span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={onClose}
            className="group relative flex-1 p-4 bg-gray-600 hover:bg-gray-700 text-white font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
          >
            <span className="relative">✕ ОТМЕНА</span>
            <div className="absolute top-1 left-1 w-3 h-3 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
            <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
          </button>
          
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            className={`
              group relative flex-1 p-4 font-black uppercase tracking-wider text-lg
              transition-all duration-300 transform border-2
              ${loading || !message.trim()
                ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-105'
              }
            `}
          >
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-3"></div>
                  ОТПРАВКА...
                </>
              ) : (
                <>
                  🚀 ОТПРАВИТЬ СООБЩЕНИЕ
                </>
              )}
            </span>
            
            {!loading && message.trim() && (
              <>
                <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
                <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Советы */}
      <MessageTipsRedesigned />
    </>
  );
};

// Компонент успешной отправки
const SuccessStateRedesigned = ({ listing, onClose, goToConversation, conversationId }) => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-4">
          СООБЩЕНИЕ ОТПРАВЛЕНО!
        </h2>
        <div className="w-20 h-1 bg-orange-600 mx-auto"></div>
      </div>

      <div className="bg-green-600 border-2 border-black text-white p-6 mb-8 text-center relative">
        <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black"></div>
        <p className="font-bold uppercase tracking-wide text-lg mb-2">
          🎉 ВАШЕ СООБЩЕНИЕ УСПЕШНО ДОСТАВЛЕНО!
        </p>
        <p className="font-bold uppercase tracking-wide text-sm opacity-80">
          ПРОДАВЕЦ ПОЛУЧИТ УВЕДОМЛЕНИЕ И СВЯЖЕТСЯ С ВАМИ
        </p>
      </div>

      <ListingInfoCardRedesigned listing={listing} formatPrice={(price, currency) => 
        price ? `${price.toLocaleString()} ${currency || '₸'}` : 'ЦЕНА НЕ УКАЗАНА'
      } />

      <div className="flex gap-4 mt-8">
        <button 
          onClick={onClose}
          className="group relative flex-1 p-4 bg-gray-600 hover:bg-gray-700 text-white font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-gray-800"
        >
          <span className="relative">ЗАКРЫТЬ</span>
          <div className="absolute top-1 left-1 w-3 h-3 bg-gray-800 group-hover:bg-gray-600 transition-colors"></div>
        </button>
        
        {conversationId && (
          <button 
            onClick={goToConversation}
            className="group relative flex-1 p-4 bg-orange-600 hover:bg-white text-black hover:text-black font-black uppercase tracking-wider text-lg transition-all duration-300 transform hover:scale-105 border-2 border-black hover:border-orange-600"
          >
            <span className="relative">💬 ПЕРЕЙТИ К ДИАЛОГУ</span>
            <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
            <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
          </button>
        )}
      </div>
    </>
  );
};

// Карточка с информацией об объявлении
const ListingInfoCardRedesigned = ({ listing, formatPrice }) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-6 mb-6 relative overflow-hidden">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10">
        <h3 className="text-white font-black uppercase tracking-wider text-lg mb-3">
          📝 ОБЪЯВЛЕНИЕ:
        </h3>
        <div className="w-16 h-0.5 bg-orange-600 mb-4"></div>
        
        <div className="space-y-3">
          <h4 className="text-white font-bold text-base leading-tight">
            {listing.title}
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-black text-orange-600">
              {formatPrice(listing.price, listing.currency_code)}
            </div>
            
            {listing.city_name && (
              <div className="text-gray-400 font-bold uppercase text-sm">
                📍 {listing.city_name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Советы по сообщениям
const MessageTipsRedesigned = () => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="mt-6 pt-6 border-t-2 border-gray-700">
      <button
        onClick={() => setShowTips(!showTips)}
        className="w-full p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-bold uppercase text-sm tracking-wide transition-all duration-300"
      >
        💡 СОВЕТЫ ПО ОБЩЕНИЮ {showTips ? '▲' : '▼'}
      </button>

      {showTips && (
        <div className="mt-4 bg-gray-800 border border-gray-600 p-4 text-sm font-bold uppercase tracking-wide text-gray-400 space-y-3 animate-slideDown">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>БУДЬТЕ ВЕЖЛИВЫ И КОНКРЕТНЫ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>УКАЗЫВАЙТЕ УДОБНОЕ ВРЕМЯ ДЛЯ СВЯЗИ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>ЗАДАВАЙТЕ УТОЧНЯЮЩИЕ ВОПРОСЫ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>НЕ ПЕРЕДАВАЙТЕ ЛИЧНЫЕ ДАННЫЕ В СООБЩЕНИЯХ</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Быстрые шаблоны сообщений
const QuickTemplatesRedesigned = ({ onSelectTemplate }) => {
  const templates = [
    "ЗДРАВСТВУЙТЕ! ИНТЕРЕСУЕТ ВАШЕ ОБЪЯВЛЕНИЕ. В КАКОМ СОСТОЯНИИ АВТОМОБИЛЬ?",
    "ДОБРЫЙ ДЕНЬ! ВОЗМОЖЕН ЛИ ТОРГ ПО ЦЕНЕ? ГОТОВ ПОСМОТРЕТЬ В БЛИЖАЙШЕЕ ВРЕМЯ.",
    "ПРИВЕТ! АВТОМОБИЛЬ ЕЩЕ АКТУАЛЕН? МОЖНО ДОГОВОРИТЬСЯ О ВСТРЕЧЕ?",
    "ЗДРАВСТВУЙТЕ! ЕСТЬ ЛИ КАКИЕ-ЛИБО ПРОБЛЕМЫ С АВТОМОБИЛЕМ? СПАСИБО!"
  ];

  return (
    <div className="mb-6">
      <h4 className="text-white font-black uppercase tracking-wider text-sm mb-3">
        ⚡ БЫСТРЫЕ ШАБЛОНЫ:
      </h4>
      <div className="space-y-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelectTemplate(template)}
            className="w-full p-3 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold text-sm text-left transition-all duration-300"
          >
            "{template.substring(0, 60)}..."
          </button>
        ))}
      </div>
    </div>
  );
};

// Добавляем CSS анимации
const styles = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-modalSlideIn {
    animation: modalSlideIn 0.3s ease-out;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('contact-seller-modal-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'contact-seller-modal-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ContactSellerModal;