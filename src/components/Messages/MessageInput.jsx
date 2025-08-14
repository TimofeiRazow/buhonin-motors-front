// src/components/Messages/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', padding: '15px' }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите сообщение..."
        disabled={disabled}
        style={{
          flex: 1,
          minHeight: '40px',
          maxHeight: '120px',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '20px',
          resize: 'none',
          fontFamily: 'inherit'
        }}
      />
      
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: disabled || !message.trim() ? 'not-allowed' : 'pointer',
          opacity: disabled || !message.trim() ? 0.6 : 1
        }}
      >
        📤
      </button>
    </form>
  );
};

export default MessageInput;
