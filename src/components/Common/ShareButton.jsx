import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Clipboard,
  Check,
  Send,
  MessageCircle,
  Paperclip,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Reddit,
  Vk,
  BarChart2
} from 'lucide-react';

const ShareButton = ({
  url,
  title,
  description,
  variant = 'default', // default, compact, icon-only
  position = 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  customPlatforms = null,
  onShare = null
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const shareData = {
    title: title || document.title,
    text: description || '',
    url: url || window.location.href
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleNativeShare = async () => {
    if (
      navigator.share &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      setIsSharing(true);
      try {
        await navigator.share(shareData);
        onShare?.('native', shareData);
      } catch (error) {
        console.error('Error sharing:', error);
        setShowMenu(!showMenu);
      } finally {
        setIsSharing(false);
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopySuccess(true);
      onShare?.('clipboard', shareData);

      setTimeout(() => setShowMenu(false), 1000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareToSocial = (platform) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);
    const encodedText = encodeURIComponent(shareData.text || shareData.title);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
    };

    if (urls[platform]) {
      if (platform === 'email') {
        window.location.href = urls[platform];
      } else {
        window.open(urls[platform], '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      }

      onShare?.(platform, shareData);
      setShowMenu(false);
    }
  };

  const getButtonContent = () => {
    if (isSharing) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          {variant !== 'icon-only' && 'ОТПРАВКА...'}
        </>
      );
    }

    switch (variant) {
      case 'icon-only':
        return <Share2 size={22} />;
      case 'compact':
        return (
          <>
            <Share2 size={20} className="mr-2" />
            ПОДЕЛИТЬСЯ
          </>
        );
      default:
        return (
          <>
            <Share2 size={20} className="mr-2" />
            ПОДЕЛИТЬСЯ
          </>
        );
    }
  };

  const getMenuPosition = () => {
    const positions = {
      'bottom-right': 'top-full right-0 mt-2',
      'bottom-left': 'top-full left-0 mt-2',
      'top-right': 'bottom-full right-0 mb-2',
      'top-left': 'bottom-full left-0 mb-2'
    };
    return positions[position] || positions['bottom-right'];
  };

  const platforms = customPlatforms || [
    { id: 'clipboard', name: 'КОПИРОВАТЬ ССЫЛКУ', icon: <Clipboard size={20} />, action: copyToClipboard },
    { id: 'whatsapp', name: 'WHATSAPP', icon: <MessageCircle size={20} />, action: () => shareToSocial('whatsapp') },
    { id: 'telegram', name: 'TELEGRAM', icon: <Send size={20} />, action: () => shareToSocial('telegram') },
    { id: 'vk', name: 'VKONTAKTE', icon: <Vk size={20} />, action: () => shareToSocial('vk') },
    { id: 'facebook', name: 'FACEBOOK', icon: <Facebook size={20} />, action: () => shareToSocial('facebook') },
    { id: 'twitter', name: 'TWITTER', icon: <Twitter size={20} />, action: () => shareToSocial('twitter') },
    { id: 'linkedin', name: 'LINKEDIN', icon: <Linkedin size={20} />, action: () => shareToSocial('linkedin') },
    { id: 'reddit', name: 'REDDIT', icon: <Reddit size={20} />, action: () => shareToSocial('reddit') },
    { id: 'email', name: 'EMAIL', icon: <Mail size={20} />, action: () => shareToSocial('email') }
  ];

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={handleNativeShare}
        disabled={isSharing}
        className={`
          group relative font-black uppercase tracking-wider transition-all duration-300 
          transform border-2 flex items-center justify-center
          ${isSharing
            ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed'
            : 'bg-gray-800 hover:bg-orange-600 border-gray-600 hover:border-black text-white hover:text-black hover:scale-110'
          }
          ${variant === 'icon-only' 
            ? 'w-12 h-12 text-xl' 
            : variant === 'compact' 
              ? 'px-4 py-2 text-sm' 
              : 'px-6 py-3 text-base'
          }
        `}
        title="ПОДЕЛИТЬСЯ"
      >
        <span className="relative flex items-center">
          {getButtonContent()}
        </span>
        {!isSharing && (
          <>
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
            {variant !== 'icon-only' && (
              <div className="absolute bottom-0.5 right-0.5 w-2 h-0.5 bg-orange-600 group-hover:bg-black transition-colors"></div>
            )}
          </>
        )}
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div
            ref={menuRef}
            className={`
              absolute ${getMenuPosition()} z-50 bg-black border-4 border-orange-600 
              min-w-64 overflow-hidden animate-menuSlideIn
            `}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rotate-45"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-white"></div>

            <div className="relative z-10 p-4">
              <h4 className="text-white font-black uppercase tracking-wider text-sm mb-4 flex items-center">
                <Share2 size={18} className="mr-2" /> ПОДЕЛИТЬСЯ ЧЕРЕЗ:
              </h4>
              <div className="w-12 h-0.5 bg-orange-600 mb-4"></div>

              <div className="space-y-2">
                {platforms.map((platform) => (
                  <SharePlatformButtonRedesigned
                    key={platform.id}
                    platform={platform}
                    copySuccess={copySuccess && platform.id === 'clipboard'}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-gray-400 font-bold uppercase text-xs text-center flex items-center justify-center">
                  <BarChart2 size={16} className="mr-2" /> СТАТИСТИКА БУДЕТ СОХРАНЕНА
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {copySuccess && (
        <CopySuccessNotificationRedesigned />
      )}
    </div>
  );
};

const SharePlatformButtonRedesigned = ({ platform, copySuccess }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    platform.action();
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group relative w-full p-3 border-2 transition-all duration-300 transform
        flex items-center text-left
        ${copySuccess
          ? 'bg-green-600 border-black text-white'
          : isClicked
            ? 'bg-orange-600 border-black text-black scale-95'
            : 'bg-gray-800 border-gray-600 text-white hover:bg-orange-600 hover:border-black hover:text-black'
        }
      `}
    >
      <span className="text-xl mr-3 flex-shrink-0">
        {copySuccess ? <Check size={20} /> : platform.icon}
      </span>
      <span className="font-black uppercase tracking-wide text-sm">
        {copySuccess ? 'ССЫЛКА СКОПИРОВАНА!' : platform.name}
      </span>
      {!copySuccess && (
        <>
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-orange-600 group-hover:bg-black transition-colors"></div>
          <div className="absolute bottom-0.5 right-0.5 w-2 h-0.5 bg-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
        </>
      )}
    </button>
  );
};

const CopySuccessNotificationRedesigned = () => {
  return (
    <div className="fixed bottom-4 right-4 z-60 bg-green-600 border-2 border-black text-white p-4 animate-notificationSlide">
      <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-black"></div>
      <div className="flex items-center">
        <span className="text-xl mr-3"><Check size={20} /></span>
        <span className="font-black uppercase tracking-wide text-sm">
          ССЫЛКА СКОПИРОВАНА!
        </span>
      </div>
    </div>
  );
};

export const ShareButtonWithAnalytics = ({
  url,
  title,
  description,
  entityId,
  entityType = 'listing'
}) => {
  const trackShare = async (platform, shareData) => {
    try {
      await api.post('/api/analytics/share', {
        entity_id: entityId,
        entity_type: entityType,
        platform: platform,
        url: shareData.url,
        title: shareData.title
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  return (
    <ShareButton
      url={url}
      title={title}
      description={description}
      onShare={trackShare}
    />
  );
};

export const ShareButtonMini = ({ url, title, description }) => {
  return (
    <ShareButton
      url={url}
      title={title}
      description={description}
      variant="icon-only"
      position="bottom-left"
    />
  );
};

export const ShareButtonCompact = ({ url, title, description }) => {
  return (
    <ShareButton
      url={url}
      title={title}
      description={description}
      variant="compact"
      position="top-right"
    />
  );
};

export const ShareButtonCustom = ({
  url,
  title,
  description,
  platforms = ['whatsapp', 'telegram', 'clipboard']
}) => {
  // Use lucide icons for custom platforms
  const customPlatforms = [
    { id: 'clipboard', name: 'КОПИРОВАТЬ', icon: <Clipboard size={20} />, action: copyToClipboard },
    { id: 'whatsapp', name: 'WHATSAPP', icon: <MessageCircle size={20} />, action: () => shareToSocial('whatsapp') },
    { id: 'telegram', name: 'TELEGRAM', icon: <Send size={20} />, action: () => shareToSocial('telegram') }
  ].filter(platform => platforms.includes(platform.id));

  return (
    <ShareButton
      url={url}
      title={title}
      description={description}
      customPlatforms={customPlatforms}
    />
  );
};

const styles = `
  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes notificationSlide {
    0% {
      opacity: 0;
      transform: translateX(100%);
    }
    10%, 90% {
      opacity: 1;
      transform: translateX(0);
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  .animate-menuSlideIn {
    animation: menuSlideIn 0.2s ease-out;
  }

  .animate-notificationSlide {
    animation: notificationSlide 2s ease-in-out;
  }

  .z-60 {
    z-index: 60;
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('share-button-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'share-button-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ShareButton;