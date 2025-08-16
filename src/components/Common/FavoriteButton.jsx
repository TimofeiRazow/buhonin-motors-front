import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import api from '../../services/api';
import { Heart, HeartOff } from 'lucide-react';

const FavoriteButton = ({ listingId, isFavorite, onToggle }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [favorite, setFavorite] = React.useState(isFavorite);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      alert('Для добавления в избранное необходимо войти в систему');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/listings/${listingId}/favorite`);
      const newFavoriteState = !favorite;
      setFavorite(newFavoriteState);
      onToggle?.(newFavoriteState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      style={{
        background: 'none',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '20px',
        padding: 0,
        display: 'flex',
        alignItems: 'center'
      }}
      aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {loading ? (
        <span style={{ fontSize: '20px' }}>...</span>
      ) : (
        favorite ? (
          <Heart color="#e63946" fill="#e63946" size={24} />
        ) : (
          <HeartOff color="#222" size={24} />
        )
      )}
    </button>
  );
};

export default FavoriteButton;