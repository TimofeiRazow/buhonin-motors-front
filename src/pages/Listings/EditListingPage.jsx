// src/pages/Listings/EditListingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import ListingForm from '../../components/Listings/ListingForm';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useAuth } from '../../hooks/auth/useAuth';

const EditListingPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Загружаем данные объявления
  const { data: listing, isLoading, error } = useQuery(
    ['listing', listingId],
    () => api.get(`/api/listings/${listingId}`),
    {
      retry: 1,
      onError: (error) => {
        if (error.response?.status === 404) {
          navigate('/404');
        } else if (error.response?.status === 403) {
          alert('У вас нет прав для редактирования этого объявления');
          navigate('/my-listings');
        }
      }
    }
  );

  // Обновление объявления
  const updateListingMutation = useMutation(
    (formData) => api.put(`/api/listings/${listingId}`, formData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries(['listing', listingId]);
        queryClient.invalidateQueries('my-listings');
        setHasUnsavedChanges(false);
        
        // Показываем сообщение в зависимости от статуса
        const newStatus = response.data.status;
        if (newStatus === 'moderation') {
          alert('Объявление отправлено на модерацию. После проверки оно будет опубликовано.');
        } else {
          alert('Объявление успешно обновлено!');
        }
        
        navigate(`/listings/${listingId}`);
      },
      onError: (error) => {
        console.error('Error updating listing:', error);
        alert(error.response?.data?.message || 'Ошибка при обновлении объявления');
      }
    }
  );

  // Проверяем права доступа
  const canEdit = listing?.data?.user_id === user?.user_id || user?.user_type === 'admin';

  // Преобразуем данные для формы
  const getInitialFormData = () => {
    if (!listing?.data) return {};

    const data = listing.data;
    return {
      title: data.title || '',
      description: data.description || '',
      price: data.price || '',
      currency_id: data.currency_id || 1,
      city_id: data.city_id || '',
      address: data.address || '',
      contact_phone: data.contact_phone || '',
      contact_name: data.contact_name || '',
      is_negotiable: data.is_negotiable || false,
      brand_id: data.specifications?.brand_id || '',
      model_id: data.specifications?.model_id || '',
      attributes: {
        year: data.specifications?.year || '',
        mileage: data.specifications?.mileage || '',
        condition: data.specifications?.condition || '',
        body_type_id: data.specifications?.body_type_id || '',
        engine_type_id: data.specifications?.engine_type_id || '',
        engine_volume: data.specifications?.engine_volume || '',
        transmission_id: data.specifications?.transmission_id || '',
        drive_type_id: data.specifications?.drive_type_id || '',
        color_id: data.specifications?.color_id || '',
        power_hp: data.specifications?.power_hp || '',
        customs_cleared: data.specifications?.customs_cleared || false,
        exchange_possible: data.specifications?.exchange_possible || false,
        credit_available: data.specifications?.credit_available || false,
        vin_number: data.specifications?.vin_number || ''
      },
      images: data.images || []
    };
  };

  const handleFormSubmit = (formData) => {
    updateListingMutation.mutate(formData);
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  // Предупреждение о несохраненных изменениях
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const getStatusText = (status) => {
    const statuses = {
      active: 'АКТИВНО',
      draft: 'ЧЕРНОВИК',
      moderation: 'НА МОДЕРАЦИИ',
      sold: 'ПРОДАНО',
      expired: 'ИСТЕК СРОК',
      rejected: 'ОТКЛОНЕНО'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-600',
      draft: 'bg-gray-600',
      moderation: 'bg-blue-600',
      sold: 'bg-blue-600',
      expired: 'bg-yellow-600',
      rejected: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  // Загрузка
  if (isLoading) {
    return (
      <div className="bg-black border-4 border-orange-600 p-8 sm:p-16 text-center">
        <div className="text-5xl sm:text-6xl mb-6">✏️</div>
        <p className="text-orange-100 font-black uppercase tracking-wider text-lg sm:text-xl mb-6">
          ЗАГРУЖАЕМ ОБЪЯВЛЕНИЕ...
        </p>
        <LoadingSpinner />
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="bg-red-600 border-4 border-black p-6 sm:p-8 text-center relative">
        <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
        <div className="absolute bottom-2 right-2 w-6 h-1 bg-black"></div>
        
        <div className="text-5xl sm:text-6xl mb-6">💥</div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-4">
          ОШИБКА ЗАГРУЗКИ
        </h2>
        <p className="text-white font-bold mb-6 uppercase text-sm sm:text-base">
          НЕ УДАЛОСЬ ЗАГРУЗИТЬ ДАННЫЕ ОБЪЯВЛЕНИЯ
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="group relative bg-black hover:bg-white text-red-600 hover:text-black font-black px-6 py-3 border-2 border-red-600 hover:border-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative">🔄 ПОПРОБОВАТЬ СНОВА</span>
          </button>
          <button
            onClick={() => navigate('/my-listings')}
            className="group relative bg-gray-900 hover:bg-red-600 text-white font-black px-6 py-3 border-2 border-red-600 uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative">📋 К МОИМ ОБЪЯВЛЕНИЯМ</span>
          </button>
        </div>
      </div>
    );
  }

  // Нет прав доступа
  if (!canEdit) {
    return (
      <div className="bg-red-600 border-4 border-black p-6 sm:p-8 text-center relative">
        <div className="absolute top-2 left-2 w-4 h-4 bg-black"></div>
        <div className="absolute bottom-2 right-2 w-6 h-1 bg-black"></div>
        
        <div className="text-5xl sm:text-6xl mb-6">🚫</div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-4">
          НЕТ ДОСТУПА
        </h2>
        <p className="text-white font-bold mb-6 uppercase text-sm sm:text-base">
          У ВАС НЕТ ПРАВ ДЛЯ РЕДАКТИРОВАНИЯ<br />
          ЭТОГО ОБЪЯВЛЕНИЯ
        </p>
        <button
          onClick={() => navigate('/my-listings')}
          className="group relative bg-black hover:bg-white text-red-600 hover:text-black font-black px-8 py-4 border-2 border-red-600 hover:border-black uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
        >
          <span className="relative">📋 К МОИМ ОБЪЯВЛЕНИЯМ</span>
        </button>
      </div>
    );
  }

  const listingData = listing.data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Фоновые декоративные элементы */}
      <div className="absolute top-10 right-10 w-6 h-6 sm:w-8 sm:h-8 border-2 border-orange-600 rotate-45 opacity-20"></div>
      <div className="absolute top-1/3 left-4 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rotate-12 opacity-30"></div>

      {/* Заголовок */}
      <div className="bg-black border-4 border-orange-600 p-4 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
        <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-orange-600 rotate-45"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-wider mb-2">
                РЕДАКТИРОВАНИЕ
                <span className="block text-orange-500 text-xl sm:text-2xl md:text-3xl">ОБЪЯВЛЕНИЯ</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-orange-300 font-bold text-sm uppercase tracking-wide">
                  ID: {listingId}
                </p>
                <span className={`${getStatusColor(listingData.status)} text-white font-black px-3 py-1 text-xs uppercase tracking-wider border-2 border-black inline-block`}>
                  {getStatusText(listingData.status)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (hasUnsavedChanges && !window.confirm('У вас есть несохраненные изменения. Продолжить?')) {
                    return;
                  }
                  navigate(`/listings/${listingId}`);
                }}
                className="group relative bg-gray-900 hover:bg-orange-600 text-white hover:text-black font-black px-4 py-3 border-2 border-orange-600 hover:border-black uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">👁️ ПРОСМОТР</span>
              </button>
              
              <button
                onClick={() => {
                  if (hasUnsavedChanges && !window.confirm('У вас есть несохраненные изменения. Продолжить?')) {
                    return;
                  }
                  navigate('/my-listings');
                }}
                className="group relative bg-orange-600 hover:bg-white text-black font-black px-4 py-3 border-2 border-black hover:border-orange-600 uppercase tracking-wider text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">📋 К МОИМ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Предупреждения */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-600 border-4 border-black p-4 mb-6 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <p className="text-black font-black uppercase tracking-wide text-sm flex items-center">
            ⚠️ У ВАС ЕСТЬ НЕСОХРАНЕННЫЕ ИЗМЕНЕНИЯ
          </p>
        </div>
      )}

      {listingData.status === 'moderation' && (
        <div className="bg-blue-600 border-4 border-black p-4 mb-6 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <p className="text-white font-black uppercase tracking-wide text-sm">
            ℹ️ ОБЪЯВЛЕНИЕ НА МОДЕРАЦИИ.<br className="sm:hidden" />
            <span className="sm:ml-2">ПОСЛЕ ИЗМЕНЕНИЙ ПОТРЕБУЕТСЯ ПОВТОРНАЯ ПРОВЕРКА.</span>
          </p>
        </div>
      )}

      {listingData.status === 'rejected' && (
        <div className="bg-red-600 border-4 border-black p-4 mb-6 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <div className="text-white">
            <p className="font-black uppercase tracking-wide text-sm mb-2">
              ❌ ОБЪЯВЛЕНИЕ ОТКЛОНЕНО МОДЕРАТОРОМ
            </p>
            <p className="font-bold text-sm">
              ИСПРАВЬТЕ УКАЗАННЫЕ ЗАМЕЧАНИЯ И СОХРАНИТЕ ИЗМЕНЕНИЯ
            </p>
            {listingData.rejection_reason && (
              <div className="mt-3 p-3 bg-black border-2 border-white">
                <p className="font-black text-sm uppercase">ПРИЧИНА:</p>
                <p className="font-bold text-sm">{listingData.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {listingData.status === 'expired' && (
        <div className="bg-yellow-600 border-4 border-black p-4 mb-6 relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-black"></div>
          <p className="text-black font-black uppercase tracking-wide text-sm">
            ⏰ СРОК ДЕЙСТВИЯ ИСТЕК.<br className="sm:hidden" />
            <span className="sm:ml-2">ПОСЛЕ СОХРАНЕНИЯ БУДЕТ ПРОДЛЕНО.</span>
          </p>
        </div>
      )}

      {/* Статистика объявления */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-black border-4 border-orange-600 p-3 sm:p-4 text-center relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-orange-600"></div>
          <div className="text-2xl sm:text-3xl font-black text-orange-500 mb-1">
            {listingData.view_count || 0}
          </div>
          <div className="text-orange-300 font-bold text-xs sm:text-sm uppercase tracking-wide">ПРОСМОТРОВ</div>
        </div>

        <div className="bg-black border-4 border-green-600 p-3 sm:p-4 text-center relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-green-600"></div>
          <div className="text-2xl sm:text-3xl font-black text-green-500 mb-1">
            {listingData.favorite_count || 0}
          </div>
          <div className="text-green-300 font-bold text-xs sm:text-sm uppercase tracking-wide">В ИЗБРАННОМ</div>
        </div>

        <div className="bg-black border-4 border-blue-600 p-3 sm:p-4 text-center relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-blue-600"></div>
          <div className="text-2xl sm:text-3xl font-black text-blue-500 mb-1">
            {listingData.messages_count || 0}
          </div>
          <div className="text-blue-300 font-bold text-xs sm:text-sm uppercase tracking-wide">СООБЩЕНИЙ</div>
        </div>

        <div className="bg-black border-4 border-gray-600 p-3 sm:p-4 text-center relative">
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600"></div>
          <div className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide mb-1">
            {new Date(listingData.created_date).toLocaleDateString('ru-RU')}
          </div>
          <div className="text-gray-300 font-bold text-xs uppercase tracking-wide">СОЗДАНО</div>
        </div>
      </div>

      {/* Форма редактирования */}
      <div className="bg-black border-4 border-orange-600 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-600"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-white"></div>
        
        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center">
            ✏️ ФОРМА РЕДАКТИРОВАНИЯ
            <div className="w-8 sm:w-12 h-1 bg-orange-600 ml-4"></div>
          </h2>
          <ListingForm
            initialData={getInitialFormData()}
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            loading={updateListingMutation.isLoading}
            submitButtonText={updateListingMutation.isLoading ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ ИЗМЕНЕНИЯ'}
          />
        </div>
      </div>

      {/* Дополнительные действия */}
      <div className="bg-gray-900 border-4 border-gray-600 p-4 sm:p-6 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-600"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-white opacity-50"></div>
        <div className="absolute top-4 left-4 w-3 h-3 bg-white"></div>
        
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider mb-4 sm:mb-6">
            ⚡ ДОПОЛНИТЕЛЬНЫЕ ДЕЙСТВИЯ
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {listingData.status === 'active' && (
              <button
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите снять объявление с публикации?')) {
                    api.post(`/api/listings/${listingId}/action`, { action: 'archive' })
                      .then(() => {
                        alert('Объявление снято с публикации');
                        navigate('/my-listings');
                      })
                      .catch(() => alert('Ошибка при снятии с публикации'));
                  }
                }}
                className="group relative bg-yellow-600 hover:bg-white text-black font-black px-4 py-3 border-2 border-black hover:border-yellow-600 uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">📦 СНЯТЬ</span>
                <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-yellow-600 transition-colors"></div>
              </button>
            )}

            {listingData.status === 'active' && (
              <button
                onClick={() => {
                  if (window.confirm('Отметить объявление как проданное?')) {
                    api.post(`/api/listings/${listingId}/action`, { action: 'mark_sold' })
                      .then(() => {
                        alert('Объявление отмечено как проданное');
                        navigate('/my-listings');
                      })
                      .catch(() => alert('Ошибка при отметке как проданное'));
                  }
                }}
                className="group relative bg-green-600 hover:bg-white text-white hover:text-black font-black px-4 py-3 border-2 border-black hover:border-green-600 uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative">✅ ПРОДАНО</span>
                <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-green-600 transition-colors"></div>
              </button>
            )}

            <button
              onClick={() => navigate(`/payments/services?listing_id=${listingId}`)}
              className="group relative bg-blue-600 hover:bg-white text-white hover:text-black font-black px-4 py-3 border-2 border-black hover:border-blue-600 uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🚀 ПРОДВИНУТЬ</span>
              <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-blue-600 transition-colors"></div>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.')) {
                  api.delete(`/api/listings/${listingId}`)
                    .then(() => {
                      alert('Объявление удалено');
                      navigate('/my-listings');
                    })
                    .catch(() => alert('Ошибка при удалении объявления'));
                }
              }}
              className="group relative bg-red-600 hover:bg-white text-white hover:text-black font-black px-4 py-3 border-2 border-black hover:border-red-600 uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative">🗑️ УДАЛИТЬ</span>
              <div className="absolute top-1 left-1 w-2 h-2 bg-black group-hover:bg-red-600 transition-colors"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;