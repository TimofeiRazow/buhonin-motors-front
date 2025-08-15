import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Pagination from '../../components/Common/Pagination';

const MyListingsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Загружаем мои объявления
  const { data: listings, isLoading, error } = useQuery(
    ['my-listings', currentPage, statusFilter, sortBy],
    () => api.get('/api/listings/my', {
      params: {
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortBy
      }
    }),
    {
      keepPreviousData: true
    }
  );

  // Мутация для действий с объявлением
  const actionMutation = useMutation(
    ({ listingId, action }) => api.post(`/api/listings/${listingId}/action`, { action }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-listings');
        alert('Действие выполнено успешно');
      },
      onError: (error) => {
        alert('Ошибка: ' + (error.response?.data?.message || 'Попробуйте позже'));
      }
    }
  );

  const handleAction = (listingId, action, confirmMessage) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    actionMutation.mutate({ listingId, action });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <LoadingSpinner text="Загружаем ваши объявления..." />;

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>
          Ошибка загрузки
        </h3>
        <p style={{ color: '#666' }}>
          Не удалось загрузить объявления. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }

  const listingsData = listings?.data?.listings || [];
  const totalPages = Math.ceil((listings?.data?.total || 0) / 10);
  const totalCount = listings?.data?.total || 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>Мои объявления ({totalCount})</h1>
        <Link
          to="/create-listing"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          ➕ Подать объявление
        </Link>
      </div>

      {/* Фильтры и сортировка */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Статус:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="draft">Черновики</option>
            <option value="moderation">На модерации</option>
            <option value="sold">Проданные</option>
            <option value="archived">Архив</option>
            <option value="expired">Истекшие</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Сортировка:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="views_desc">По просмотрам</option>
            <option value="price_desc">По цене (убыв.)</option>
            <option value="price_asc">По цене (возр.)</option>
          </select>
        </div>
      </div>

      {/* Список объявлений */}
      {listingsData.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
          <h3 style={{ marginBottom: '10px' }}>
            {statusFilter === 'all' ? 'У вас нет объявлений' : `Нет объявлений со статусом "${statusFilter}"`}
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Создайте первое объявление, чтобы начать продавать
          </p>
          <Link
            to="/create-listing"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}
          >
            Создать объявление
          </Link>
        </div>
      ) : (
        <>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd',
            overflow: 'hidden'
          }}>
            {listingsData.map((listing, index) => (
              <ListingItem
                key={listing.listing_id}
                listing={listing}
                isLast={index === listingsData.length - 1}
                onAction={handleAction}
                onEdit={() => navigate(`/edit-listing/${listing.listing_id}`)}
                onView={() => navigate(`/listings/${listing.listing_id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '20px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ListingItem = ({ listing, isLast, onAction, onEdit, onView }) => {
  const formatPrice = (price, currency) => {
    if (!price) return 'Цена не указана';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#28a745',
      draft: '#6c757d',
      moderation: '#ffc107',
      sold: '#007bff',
      archived: '#6c757d',
      expired: '#dc3545',
      rejected: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Активно',
      draft: 'Черновик',
      moderation: 'На модерации',
      sold: 'Продано',
      archived: 'В архиве',
      expired: 'Истек срок',
      rejected: 'Отклонено'
    };
    return texts[status] || status;
  };

  return (
    <div style={{
      padding: '20px',
      borderBottom: isLast ? 'none' : '1px solid #eee'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Изображение */}
        <div style={{
          width: '150px',
          height: '100px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          cursor: 'pointer'
        }} onClick={onView}>
          <img
            src={listing.main_image_url || '/placeholder-car.jpg'}
            alt={listing.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg';
            }}
          />
        </div>

        {/* Информация */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '10px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#007bff'
            }} onClick={onView}>
              {listing.title}
            </h3>

            <div style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: getStatusColor(listing.status),
              whiteSpace: 'nowrap'
            }}>
              {getStatusText(listing.status)}
            </div>
          </div>

          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '10px'
          }}>
            {formatPrice(listing.price, listing.currency_code)}
          </div>

          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '14px',
            color: '#666',
            marginBottom: '15px'
          }}>
            <span>📅 {formatDate(listing.created_date)}</span>
            <span>👁 {listing.view_count || 0} просмотров</span>
            <span>❤️ {listing.favorite_count || 0} в избранном</span>
            {listing.expires_date && (
              <span>⏰ До {formatDate(listing.expires_date)}</span>
            )}
          </div>

          {/* Действия */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={onView}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              👁 Посмотреть
            </button>

            {(listing.status === 'active' || listing.status === 'draft') && (
              <button
                onClick={onEdit}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ffc107',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✏️ Редактировать
              </button>
            )}

            {listing.status === 'active' && (
              <>
                <button
                  onClick={() => onAction(listing.listing_id, 'deactivate', 'Деактивировать объявление?')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ⏸ Снять с публикации
                </button>
                <button
                  onClick={() => onAction(listing.listing_id, 'mark_sold', 'Отметить как проданное?')}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✅ Продано
                </button>
              </>
            )}

            {listing.status === 'draft' && (
              <button
                onClick={() => onAction(listing.listing_id, 'publish')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📤 Опубликовать
              </button>
            )}

            {listing.status === 'expired' && (
              <button
                onClick={() => onAction(listing.listing_id, 'renew')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔄 Продлить
              </button>
            )}

            <button
              onClick={() => onAction(listing.listing_id, 'delete', 'Удалить объявление безвозвратно?')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🗑 Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;