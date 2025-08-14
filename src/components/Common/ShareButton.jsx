// src/components/Common/ShareButton.jsx
import React, { useState } from 'react';

const ShareButton = ({ url, title, description }) => {
  const [showMenu, setShowMenu] = useState(false);

  const shareData = {
    title: title,
    text: description,
    url: url || window.location.href
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('Ссылка скопирована в буфер обмена');
      setShowMenu(false);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareToSocial = (platform) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);
    const encodedText = encodeURIComponent(shareData.text);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setShowMenu(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleNativeShare}>
        📤 Поделиться
      </button>

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <button onClick={copyToClipboard} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>
            📋 Копировать ссылку
          </button>
          <button onClick={() => shareToSocial('whatsapp')} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>
            💬 WhatsApp
          </button>
          <button onClick={() => shareToSocial('telegram')} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>
            ✈️ Telegram
          </button>
          <button onClick={() => shareToSocial('vk')} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>
            📘 VKontakte
          </button>
          <button onClick={() => shareToSocial('facebook')} style={{ display: 'block', width: '100%', marginBottom: '5px' }}>
            📘 Facebook
          </button>
          <button onClick={() => shareToSocial('twitter')} style={{ display: 'block', width: '100%' }}>
            🐦 Twitter
          </button>
        </div>
      )}

      {showMenu && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ShareButton;