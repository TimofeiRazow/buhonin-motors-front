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
<<<<<<< HEAD
      className={`
        group relative w-14 h-14 border-4 transition-all duration-300 transform
        ${loading 
          ? 'border-gray-600 bg-gray-800 cursor-not-allowed' 
          : favorite 
            ? 'border-black bg-orange-500 hover:bg-orange-400 hover:scale-110 active:scale-95' 
            : 'border-orange-500 bg-black hover:bg-orange-500 hover:scale-110 active:scale-95'
        }
        ${!loading && 'hover:shadow-lg'}
      `}
    >
      {/* Декоративные элементы */}
      <div className={`absolute top-1 right-1 w-2 h-2 transition-colors duration-300
        ${loading 
          ? 'bg-gray-600' 
          : favorite 
            ? 'bg-black' 
            : 'bg-orange-500 group-hover:bg-black'
        }`}
      ></div>
      
      {/* Иконка или состояние загрузки */}
      <div className="flex items-center justify-center w-full h-full">
        {loading ? (
          <div className={`w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin`}></div>
        ) : (
          <div className={`text-2xl font-black transition-colors duration-300
            ${favorite 
              ? 'text-black' 
              : 'text-orange-500 group-hover:text-black'
            }`}
          >
            {favorite ? '●' : '○'}
          </div>
        )}
      </div>

      {/* Пульс эффект при активном состоянии */}
      {favorite && !loading && (
        <div className="absolute inset-0 border-4 border-orange-500 animate-pulse opacity-50"></div>
=======
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
>>>>>>> 0593c2272dc54756eb84593a00f8aecbb9408f28
      )}
    </button>
  );
};

// Демо компонент для демонстрации
const FavoriteButtonDemo = () => {
  const [favorites, setFavorites] = React.useState({
    1: false,
    2: true,
    3: false
  });

  const handleToggle = (listingId, newState) => {
    setFavorites(prev => ({
      ...prev,
      [listingId]: newState
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-wider">
            <span className="text-orange-500">FAVORITE</span> BUTTON
          </h1>
          <p className="text-xl text-gray-300 font-bold uppercase">
            ДОБАВЛЕНИЕ В ИЗБРАННОЕ
          </p>
        </div>

        {/* Демо карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-black border-4 border-orange-500 p-6 relative">
              {/* Кнопка избранного */}
              <div className="absolute top-4 right-4">
                <FavoriteButton
                  listingId={id}
                  isFavorite={favorites[id]}
                  onToggle={(newState) => handleToggle(id, newState)}
                />
              </div>

              {/* Контент карточки */}
              <div className="pr-20">
                <div className="w-full h-32 bg-gray-800 mb-4 border-2 border-gray-600"></div>
                <h3 className="text-white font-black text-lg uppercase mb-2">
                  АВТОМОБИЛЬ #{id}
                </h3>
                <p className="text-orange-500 font-bold text-xl">
                  {1000000 + id * 500000} ₸
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {favorites[id] ? 'В ИЗБРАННОМ' : 'НЕ В ИЗБРАННОМ'}
                </p>
              </div>

              {/* Декоративные элементы */}
              <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-orange-500"></div>
            </div>
          ))}
        </div>

        {/* Варианты размеров */}
        <div className="mt-16 bg-black border-4 border-white p-8">
          <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-8 text-center">
            <span className="text-orange-500">РАЗНЫЕ</span> РАЗМЕРЫ
          </h2>
          
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Маленький */}
            <div className="text-center">
              <div className="mb-4">
                <button className="group relative w-10 h-10 border-4 border-orange-500 bg-black hover:bg-orange-500 transition-all duration-300 transform hover:scale-110">
                  <div className="absolute top-1 right-1 w-1 h-1 bg-orange-500 group-hover:bg-black"></div>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-lg font-black text-orange-500 group-hover:text-black">○</div>
                  </div>
                </button>
              </div>
              <p className="text-white font-bold text-sm uppercase">МАЛЕНЬКИЙ</p>
            </div>

            {/* Обычный */}
            <div className="text-center">
              <div className="mb-4">
                <FavoriteButton listingId={999} isFavorite={false} />
              </div>
              <p className="text-white font-bold text-sm uppercase">ОБЫЧНЫЙ</p>
            </div>

            {/* Большой */}
            <div className="text-center">
              <div className="mb-4">
                <button className="group relative w-20 h-20 border-4 border-orange-500 bg-orange-500 hover:bg-orange-400 transition-all duration-300 transform hover:scale-110">
                  <div className="absolute top-2 right-2 w-3 h-3 bg-black"></div>
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-4xl font-black text-black">●</div>
                  </div>
                  <div className="absolute inset-0 border-4 border-orange-500 animate-pulse opacity-50"></div>
                </button>
              </div>
              <p className="text-white font-bold text-sm uppercase">БОЛЬШОЙ</p>
            </div>
          </div>
        </div>

        {/* Состояния */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Не в избранном */}
          <div className="bg-black border-4 border-white p-6 text-center">
            <div className="mb-4 flex justify-center">
              <button className="w-14 h-14 border-4 border-orange-500 bg-black">
                <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500"></div>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-2xl font-black text-orange-500">○</div>
                </div>
              </button>
            </div>
            <h3 className="text-white font-black text-sm uppercase">НЕ В ИЗБРАННОМ</h3>
          </div>

          {/* В избранном */}
          <div className="bg-black border-4 border-white p-6 text-center">
            <div className="mb-4 flex justify-center">
              <button className="relative w-14 h-14 border-4 border-black bg-orange-500">
                <div className="absolute top-1 right-1 w-2 h-2 bg-black"></div>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-2xl font-black text-black">●</div>
                </div>
                <div className="absolute inset-0 border-4 border-orange-500 animate-pulse opacity-50"></div>
              </button>
            </div>
            <h3 className="text-white font-black text-sm uppercase">В ИЗБРАННОМ</h3>
          </div>

          {/* Загрузка */}
          <div className="bg-black border-4 border-white p-6 text-center">
            <div className="mb-4 flex justify-center">
              <button className="w-14 h-14 border-4 border-gray-600 bg-gray-800 cursor-not-allowed">
                <div className="absolute top-1 right-1 w-2 h-2 bg-gray-600"></div>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </button>
            </div>
            <h3 className="text-white font-black text-sm uppercase">ЗАГРУЗКА</h3>
          </div>

          {/* Hover */}
          <div className="bg-black border-4 border-white p-6 text-center">
            <div className="mb-4 flex justify-center">
              <button className="w-14 h-14 border-4 border-orange-500 bg-orange-500 transform scale-110 shadow-lg">
                <div className="absolute top-1 right-1 w-2 h-2 bg-black"></div>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-2xl font-black text-black">○</div>
                </div>
              </button>
            </div>
            <h3 className="text-white font-black text-sm uppercase">HOVER</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteButtonDemo;