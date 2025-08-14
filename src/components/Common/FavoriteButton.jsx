// src/components/Common/FavoriteButton.jsx
import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import api from '../../services/api';

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
        fontSize: '20px'
      }}
    >
      {loading ? '...' : (favorite ? '❤️' : '🤍')}
    </button>
  );
};

export default FavoriteButton;