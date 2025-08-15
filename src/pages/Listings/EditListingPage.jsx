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

  // Загрузка
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <LoadingSpinner />
        <span style={{ marginLeft: '10px' }}>Загрузка объявления...</span>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '60px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        border: '1px solid #f5c6cb'
      }}>
        <h2>Ошибка загрузки</h2>
        <p>Не удалось загрузить данные объявления.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Попробовать снова
          </button>
          <button
            onClick={() => navigate('/my-listings')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            К моим объявлениям
          </button>
        </div>
      </div>
    );
  }

  // Нет прав доступа
  if (!canEdit) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '60px auto',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        border: '1px solid #f5c6cb'
      }}>
        <h2>Нет доступа</h2>
        <p>У вас нет прав для редактирования этого объявления.</p>
        <button
          onClick={() => navigate('/my-listings')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          К моим объявлениям
        </button>
      </div>
    );
  }

  const listingData = listing.data;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Заголовок */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Редактирование объявления</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            ID: {listingId} • Статус: 
            <span style={{
              marginLeft: '5px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              backgroundColor: listingData.status === 'active' ? '#d4edda' : '#fff3cd',
              color: listingData.status === 'active' ? '#155724' : '#856404'
            }}>
              {listingData.status === 'active' ? 'Активно' :
               listingData.status === 'draft' ? 'Черновик' :
               listingData.status === 'moderation' ? 'На модерации' :
               listingData.status === 'sold' ? 'Продано' :
               listingData.status === 'expired' ? 'Истек срок' : listingData.status}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm('У вас есть несохраненные изменения. Продолжить?')) {
                return;
              }
              navigate(`/listings/${listingId}`);
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Просмотр
          </button>
          
          <button
            onClick={() => {
              if (hasUnsavedChanges && !window.confirm('У вас есть несохраненные изменения. Продолжить?')) {
                return;
              }
              navigate('/my-listings');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#007bff',
              border: '2px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            К моим объявлениям
          </button>
        </div>
      </div>

      {/* Предупреждения */}
      {hasUnsavedChanges && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ У вас есть несохраненные изменения
        </div>
      )}

      {listingData.status === 'moderation' && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#cce5ff',
          color: '#004085',
          borderRadius: '8px',
          border: '1px solid #66b3ff'
        }}>
          ℹ️ Объявление находится на модерации. После изменений потребуется повторная проверка.
        </div>
      )}

      {listingData.status === 'rejected' && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ Объявление было отклонено модератором. Исправьте указанные замечания и сохраните изменения.
          {listingData.rejection_reason && (
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Причина: {listingData.rejection_reason}
            </div>
          )}
        </div>
      )}

      {listingData.status === 'expired' && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          ⏰ Срок действия объявления истек. После сохранения изменений оно будет продлено.
        </div>
      )}

      {/* Статистика объявления */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
            {listingData.view_count || 0}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Просмотров</div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {listingData.favorite_count || 0}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>В избранном</div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {listingData.messages_count || 0}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Сообщений</div>
        </div>

        <div style={{
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666' }}>
            {new Date(listingData.created_date).toLocaleDateString('ru-RU')}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Создано</div>
        </div>
      </div>

      {/* Форма редактирования */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd',
        padding: '30px'
      }}>
        <ListingForm
          initialData={getInitialFormData()}
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          loading={updateListingMutation.isLoading}
          submitButtonText={updateListingMutation.isLoading ? 'Сохраняем...' : 'Сохранить изменения'}
        />
      </div>

      {/* Дополнительные действия */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0 }}>Дополнительные действия</h3>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
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
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Снять с публикации
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
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Отметить как проданное
            </button>
          )}

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
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Удалить объявление
          </button>

          <button
            onClick={() => navigate(`/payments/services?listing_id=${listingId}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Продвинуть объявление
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListingPage;