import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "ВВЕДИТЕ СООБЩЕНИЕ...",
  maxLength = 1000,
  showAttachments = true,
  showEmojis = true,
  autoFocus = false
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage({
      text: message.trim(),
      attachments: attachments
    });
    
    setMessage('');
    setAttachments([]);
    setIsTyping(false);
    
    // Сброс высоты textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (value.length <= maxLength) {
      setMessage(value);
      setIsTyping(value.length > 0);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files].slice(0, 5)); // Максимум 5 файлов
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const newMessage = message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);
    
    if (newMessage.length <= maxLength) {
      setMessage(newMessage);
      
      // Возвращаем курсор в правильную позицию
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }, 0);
    }
    
    setShowEmojiPicker(false);
  };

  const quickEmojis = ['😊', '😂', '👍', '❤️', '😢', '😡', '🤔', '🔥', '👏', '🎉'];

  return (
    <div className="bg-black border-t-4 border-orange-600 relative overflow-hidden">
      {/* Геометрические элементы */}
      <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-orange-600"></div>
      <div className="absolute bottom-2 right-2 w-4 h-1 bg-white opacity-50"></div>

      <div className="relative z-10 p-4">
        {/* Вложения */}
        {attachments.length > 0 && (
          <AttachmentsPreviewRedesigned 
            attachments={attachments}
            onRemove={removeAttachment}
          />
        )}

        {/* Панель эмодзи */}
        {showEmojiPicker && (
          <EmojiPickerRedesigned 
            onEmojiSelect={insertEmoji}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Кнопки дополнительных действий */}
          <div className="flex items-center gap-2">
            {/* Кнопка вложений */}
            {showAttachments && (
              <AttachmentButtonRedesigned
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              />
            )}

            {/* Кнопка эмодзи */}
            {showEmojis && (
              <EmojiButtonRedesigned
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                active={showEmojiPicker}
              />
            )}
          </div>

          {/* Поле ввода */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={`
                w-full p-4 bg-gray-900 text-white font-bold border-2 transition-all duration-300
                focus:outline-none placeholder-gray-500 uppercase tracking-wide resize-none
                ${disabled 
                  ? 'border-gray-600 bg-gray-800 cursor-not-allowed opacity-50' 
                  : 'border-gray-700 focus:border-orange-500 hover:border-gray-600 focus:bg-black'
                }
              `}
              style={{
                minHeight: '56px',
                maxHeight: '120px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#ff6600 #1f2937'
              }}
            />
            
            {/* Геометрические элементы поля ввода */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-orange-600"></div>
            <div className="absolute bottom-2 right-2 w-3 h-0.5 bg-white opacity-50"></div>

            {/* Счетчик символов */}
            <div className="absolute bottom-1 left-4 text-xs font-bold uppercase tracking-wide text-gray-500">
              {message.length}/{maxLength}
            </div>

            {/* Индикатор печатания */}
            {isTyping && !disabled && (
              <div className="absolute -top-8 left-4 bg-gray-800 border border-gray-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                ✏️ ПЕЧАТАЕТ...
              </div>
            )}
          </div>

          {/* Кнопка отправки */}
          <SendButtonRedesigned
            disabled={disabled || !message.trim()}
            loading={disabled}
            hasContent={message.trim() || attachments.length > 0}
          />

          {/* Скрытый input для файлов */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </form>

        {/* Быстрые эмодзи */}
        {showEmojis && !showEmojiPicker && (
          <QuickEmojisRedesigned
            emojis={quickEmojis}
            onEmojiSelect={insertEmoji}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

// Кнопка отправки
const SendButtonRedesigned = ({ disabled, loading, hasContent }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        group relative w-14 h-14 font-black transition-all duration-300 transform border-2
        ${disabled
          ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
          : hasContent
            ? 'bg-orange-600 hover:bg-white text-black hover:text-black border-black hover:border-orange-600 hover:scale-110'
            : 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      <span className="relative flex items-center justify-center text-xl">
        {loading ? '⏳' : hasContent ? '🚀' : '📤'}
      </span>
      
      {hasContent && !disabled && (
        <>
          <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-orange-600 transition-colors"></div>
          <div className="absolute bottom-1 right-1 w-3 h-0.5 bg-black group-hover:bg-orange-600 transition-colors"></div>
        </>
      )}
    </button>
  );
};

// Кнопка вложений
const AttachmentButtonRedesigned = ({ onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        group p-3 border-2 transition-all duration-300 transform
        ${disabled
          ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
          : 'bg-gray-800 hover:bg-orange-600 border-gray-600 hover:border-black text-white hover:text-black hover:scale-110'
        }
      `}
      title="ПРИКРЕПИТЬ ФАЙЛ"
    >
      <span className="font-black text-lg">📎</span>
      {!disabled && (
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
      )}
    </button>
  );
};

// Кнопка эмодзи
const EmojiButtonRedesigned = ({ onClick, disabled, active }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        group p-3 border-2 transition-all duration-300 transform
        ${disabled
          ? 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
          : active
            ? 'bg-orange-600 border-black text-black'
            : 'bg-gray-800 hover:bg-orange-600 border-gray-600 hover:border-black text-white hover:text-black hover:scale-110'
        }
      `}
      title="ЭМОДЗИ"
    >
      <span className="font-black text-lg">😊</span>
      {!disabled && (
        <div className={`
          absolute top-0.5 right-0.5 w-1 h-1 transition-colors
          ${active ? 'bg-black' : 'bg-orange-600 group-hover:bg-black'}
        `}></div>
      )}
    </button>
  );
};

// Превью вложений
const AttachmentsPreviewRedesigned = ({ attachments, onRemove }) => {
  return (
    <div className="mb-4 bg-gray-800 border-2 border-gray-600 p-3">
      <h4 className="text-white font-black uppercase tracking-wider text-sm mb-3">
        📎 ПРИКРЕПЛЕННЫЕ ФАЙЛЫ ({attachments.length}/5)
      </h4>
      
      <div className="flex flex-wrap gap-2">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="relative bg-gray-700 border border-gray-600 p-2 pr-8 max-w-xs"
          >
            <div className="text-white font-bold text-xs truncate">
              {file.name}
            </div>
            <div className="text-gray-400 font-bold text-xs">
              {(file.size / 1024).toFixed(1)} KB
            </div>
            
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-colors duration-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Панель выбора эмодзи
const EmojiPickerRedesigned = ({ onEmojiSelect, onClose }) => {
  const emojiCategories = {
    'ЛИЦА': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰'],
    'ЖЕСТЫ': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️'],
    'ОБЪЕКТЫ': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖'],
    'СИМВОЛЫ': ['✨', '🎉', '🎊', '🔥', '💯', '⭐', '🌟', '💫', '⚡', '💥', '💢', '💨', '💤', '💦', '💧', '🌊']
  };

  return (
    <div className="absolute bottom-16 left-4 right-4 bg-black border-4 border-orange-600 p-4 z-50 max-h-64 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-black uppercase tracking-wider text-sm">
          😊 ВЫБЕРИТЕ ЭМОДЗИ
        </h4>
        <button
          onClick={onClose}
          className="p-1 bg-gray-800 hover:bg-red-600 border border-gray-600 hover:border-black text-white hover:text-black transition-all duration-300"
        >
          <span className="font-black">×</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <div className="text-gray-400 font-black uppercase text-xs mb-2">
              {category}
            </div>
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => onEmojiSelect(emoji)}
                  className="w-8 h-8 bg-gray-800 hover:bg-orange-600 border border-gray-600 hover:border-black text-lg transition-all duration-300 transform hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Быстрые эмодзи
const QuickEmojisRedesigned = ({ emojis, onEmojiSelect, disabled }) => {
  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700">
      <span className="text-gray-400 font-black uppercase text-xs mr-2">
        БЫСТРЫЕ:
      </span>
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          disabled={disabled}
          className={`
            w-8 h-8 border transition-all duration-300 transform
            ${disabled
              ? 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
              : 'bg-gray-800 hover:bg-orange-600 border-gray-600 hover:border-black hover:scale-110'
            }
          `}
        >
          <span className="text-lg">{emoji}</span>
        </button>
      ))}
    </div>
  );
};

// Компонент для уведомлений о состоянии
export const MessageInputStatus = ({ isConnected, isTyping }) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs font-bold uppercase tracking-wide">
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className="text-gray-400">
          {isConnected ? 'ПОДКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}
        </span>
      </div>
      
      {isTyping && (
        <div className="text-orange-500">
          СОБЕСЕДНИК ПЕЧАТАЕТ...
        </div>
      )}
    </div>
  );
};

// Добавляем CSS для кастомного скроллбара
const styles = `
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  
  textarea::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  textarea::-webkit-scrollbar-thumb {
    background: #ff6600;
    border-radius: 2px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover {
    background: #e55a00;
  }
`;

// Инжектируем стили
if (typeof document !== 'undefined' && !document.getElementById('message-input-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'message-input-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default MessageInput;