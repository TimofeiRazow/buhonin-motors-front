import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth/useAuth';

const ContactButtons = ({ listing }) => {
  const [showPhone, setShowPhone] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const createConversationMutation = useMutation(
    (data) => api.post('/api/conversations/', data),
    {
      onSuccess: (response) => {
        navigate(`/messages/${response.data.conversation_id}`);
      },
      onError: (error) => {
        // Показать стильное уведомление об ошибке
        console.error('Ошибка создания диалога:', error);
        setIsCreatingConversation(false);
      }
    }
  );

  const handleShowPhone = () => {
    if (!isAuthenticated) {
      // Показать модал авторизации вместо alert
      navigate('/login');
      return;
    }
    setShowPhone(true);
    setShowContactOptions(true);
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsCreatingConversation(true);
    createConversationMutation.mutate({
      conversation_type: 'user_chat',
      subject: `ИНТЕРЕСУЕТ: ${listing.title.toUpperCase()}`,
      related_entity_id: listing.entity_id,
      participant_user_id: listing.user_id
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'НЕ УКАЗАН';
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }
    return phone;
  };

  const phoneNumber = listing.contact_phone || listing.seller?.phone_number;
  const contactName = listing.contact_name || `${listing.seller?.first_name || ''} ${listing.seller?.last_name || ''}`.trim();

  return (
    <div className="space-y-4">
      {/* Главная кнопка - показать телефон */}
      <ContactButtonRedesigned
        onClick={handleShowPhone}
        variant="primary"
        icon="📞"
        size="large"
      >
        {showPhone ? formatPhone(phoneNumber) : 'ПОКАЗАТЬ ТЕЛЕФОН'}
      </ContactButtonRedesigned>

      {/* Кнопка написать сообщение */}
      <ContactButtonRedesigned
        onClick={handleSendMessage}
        disabled={isCreatingConversation}
        variant="secondary"
        icon={isCreatingConversation ? '⏳' : '💬'}
        size="large"
        loading={isCreatingConversation}
      >
        {isCreatingConversation ? 'СОЗДАНИЕ ДИАЛОГА...' : 'НАПИСАТЬ СООБЩЕНИЕ'}
      </ContactButtonRedesigned>

      {/* Расширенные опции контакта */}
      {showContactOptions && phoneNumber && (
        <ContactOptionsRedesigned
          phoneNumber={phoneNumber}
          listing={listing}
          contactName={contactName}
        />
      )}

      {/* Информация о контактном лице */}
      {contactName && (
        <ContactInfoRedesigned contactName={contactName} />
      )}
    </div>
  );
};

// Основной компонент кнопки
const ContactButtonRedesigned = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  icon, 
  size = 'medium', 
  disabled = false, 
  loading = false,
  className = '' 
}) => {
  const variants = {
    primary: 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600',
    secondary: 'bg-gray-800 hover:bg-orange-600 text-white hover:text-black border-gray-600 hover:border-black',
    success: 'bg-green-600 hover:bg-white text-white hover:text-black border-black hover:border-green-600',
    info: 'bg-blue-600 hover:bg-white text-white hover:text-black border-black hover:border-blue-600',
    whatsapp: 'bg-green-500 hover:bg-white text-white hover:text-black border-black hover:border-green-500'
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group relative w-full font-black uppercase tracking-wider transition-all duration-300 
        transform border-2 flex items-center justify-center gap-3
        ${disabled || loading
          ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
          : `${variants[variant]} hover:scale-105`
        }
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="relative flex items-center justify-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </span>
      
      {!disabled && !loading && (
        <>
          <div className="absolute top-1 left-1 w-3 h-3 bg-black group-hover:bg-orange-600 transition-colors"></div>
          <div className="absolute bottom-1 right-1 w-4 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
        </>
      )}

      {loading && (
        <div className="absolute inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

// Расширенные опции контакта
const ContactOptionsRedesigned = ({ phoneNumber, listing, contactName }) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent(`Здравствуйте! Интересует ваше объявление: ${listing.title}`);

  return (
    <div className="bg-gray-900 border-2 border-gray-700 p-4 relative overflow-hidden animate-slideIn">
      <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10">
        <h4 className="text-white font-black uppercase tracking-wider text-sm mb-4">
          📱 СПОСОБЫ СВЯЗИ
        </h4>
        <div className="w-12 h-0.5 bg-orange-600 mb-4"></div>

        <div className="space-y-3">
          {/* Прямой звонок */}
          <a
            href={`tel:${phoneNumber}`}
            className="block"
          >
            <ContactButtonRedesigned
              variant="success"
              icon="📞"
              size="medium"
            >
              ПОЗВОНИТЬ СЕЙЧАС
            </ContactButtonRedesigned>
          </a>

          {/* SMS */}
          <a
            href={`sms:${phoneNumber}`}
            className="block"
          >
            <ContactButtonRedesigned
              variant="info"
              icon="📱"
              size="medium"
            >
              ОТПРАВИТЬ SMS
            </ContactButtonRedesigned>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <ContactButtonRedesigned
              variant="whatsapp"
              icon="📱"
              size="medium"
            >
              НАПИСАТЬ В WHATSAPP
            </ContactButtonRedesigned>
          </a>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide">
            <span className="text-gray-400">ЛУЧШЕЕ ВРЕМЯ ЗВОНКА:</span>
            <span className="text-white">09:00 - 21:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Информация о контактном лице
const ContactInfoRedesigned = ({ contactName }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 p-3 relative overflow-hidden">
      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600"></div>
      <div className="absolute bottom-0.5 right-0.5 w-2 h-0.5 bg-white opacity-50"></div>
      
      <div className="relative z-10 text-center">
        <div className="text-gray-400 font-bold uppercase tracking-wide text-xs mb-1">
          КОНТАКТНОЕ ЛИЦО:
        </div>
        <div className="text-white font-black uppercase tracking-wider text-sm">
          👤 {contactName}
        </div>
      </div>
    </div>
  );
};

// Компонент с советами по безопасности
const SafetyTipsRedesigned = () => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowTips(!showTips)}
        className="w-full p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-bold uppercase text-xs tracking-wide transition-all duration-300"
      >
        🛡️ СОВЕТЫ ПО БЕЗОПАСНОСТИ {showTips ? '▲' : '▼'}
      </button>

      {showTips && (
        <div className="mt-3 bg-gray-900 border border-gray-700 p-4 text-xs font-bold uppercase tracking-wide text-gray-400 space-y-2 animate-slideIn">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>ВСТРЕЧАЙТЕСЬ В ЛЮДНЫХ МЕСТАХ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>ПРОВЕРЯЙТЕ ДОКУМЕНТЫ НА АВТОМОБИЛЬ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>НЕ ПЕРЕДАВАЙТЕ ДЕНЬГИ ЗАРАНЕЕ</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-600 mr-3 mt-1 flex-shrink-0"></span>
            <span>ПРОВОДИТЕ ТЕХОСМОТР У СПЕЦИАЛИСТА</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент быстрых действий
const QuickActionsRedesigned = ({ listing }) => {
  const shareUrl = window.location.href;
  const shareText = `Посмотрите это объявление: ${listing.title}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Ошибка при шаринге:', error);
      }
    } else {
      // Fallback - копирование в буфер обмена
      navigator.clipboard.writeText(shareUrl);
      // Показать уведомление о копировании
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleShare}
        className="flex-1 p-2 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold uppercase text-xs tracking-wide transition-all duration-300"
        title="ПОДЕЛИТЬСЯ"
      >
        📤
      </button>
      
      <button
        onClick={handlePrint}
        className="flex-1 p-2 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-white hover:text-black font-bold uppercase text-xs tracking-wide transition-all duration-300"
        title="ПЕЧАТЬ"
      >
        🖨️
      </button>
    </div>
  );
};

// Расширенная версия с дополнительными функциями
export const ContactButtonsExtended = ({ listing }) => {
  return (
    <div className="space-y-6">
      <ContactButtons listing={listing} />
      <SafetyTipsRedesigned />
      <QuickActionsRedesigned listing={listing} />
    </div>
  );
};

// Добавляем CSS анимации
const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('contact-buttons-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'contact-buttons-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ContactButtons;