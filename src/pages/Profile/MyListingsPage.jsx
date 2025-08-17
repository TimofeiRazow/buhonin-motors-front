import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Plus,
  Calendar,
  Eye,
  Heart,
  Clock,
  Edit,
  Pause,
  Check,
  Send,
  RotateCcw,
  Trash2,
  FileText
} from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-xl mt-4 uppercase tracking-wider">
            ЗАГРУЖАЕМ ОБЪЯВЛЕНИЯ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 p-12 border-4 border-orange-600 text-center">
          <h3 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-wider">
            ОШИБКА ЗАГРУЗКИ
          </h3>
          <p className="text-gray-300 font-bold uppercase">
            НЕ УДАЛОСЬ ЗАГРУЗИТЬ ОБЪЯВЛЕНИЯ
          </p>
        </div>
      </div>
    );
  }

  const listingsData = listings?.data?.listings || [];
  const totalPages = Math.ceil((listings?.data?.total || 0) / 10);
  const totalCount = listings?.data?.total || 0;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border-4 border-orange-500 rotate-45"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-orange-600 rotate-12"></div>
        </div>
        
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-wider">
                <span className="text-white">МОИ</span>
                <span className="text-orange-500"> ОБЪЯВЛЕНИЯ</span>
              </h1>
              <p className="text-xl font-bold text-gray-300 uppercase">
                ВСЕГО: {totalCount} ОБЪЯВЛЕНИЙ
              </p>
            </div>
            
            <Link to="/create-listing">
              <button className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 mt-6 md:mt-0">
                <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
                <span className="relative group-hover:text-black flex items-center gap-2">
                  <Plus size={20} />
                  ПОДАТЬ ОБЪЯВЛЕНИЕ
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-black p-6 border-4 border-orange-600">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <span className="text-white font-black text-lg uppercase tracking-wider">СТАТУС:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-900 text-white font-bold px-4 py-2 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider"
                >
                  <option value="all">ВСЕ</option>
                  <option value="active">АКТИВНЫЕ</option>
                  <option value="draft">ЧЕРНОВИКИ</option>
                  <option value="moderation">НА МОДЕРАЦИИ</option>
                  <option value="sold">ПРОДАННЫЕ</option>
                  <option value="archived">АРХИВ</option>
                  <option value="expired">ИСТЕКШИЕ</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <span className="text-white font-black text-lg uppercase tracking-wider">СОРТИРОВКА:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 text-white font-bold px-4 py-2 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider"
                >
                  <option value="date_desc">СНАЧАЛА НОВЫЕ</option>
                  <option value="date_asc">СНАЧАЛА СТАРЫЕ</option>
                  <option value="views_desc">ПО ПРОСМОТРАМ</option>
                  <option value="price_desc">ПО ЦЕНЕ (УБЫВ.)</option>
                  <option value="price_asc">ПО ЦЕНЕ (ВОЗР.)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {listingsData.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-900 p-12 border-4 border-orange-600 inline-block">
                <div className="mb-6">
                  <FileText size={64} className="text-orange-500 mx-auto" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
                  НЕТ ОБЪЯВЛЕНИЙ
                </h3>
                <p className="text-gray-300 font-bold text-lg uppercase mb-8">
                  {statusFilter === 'all' 
                    ? 'СОЗДАЙТЕ ПЕРВОЕ ОБЪЯВЛЕНИЕ' 
                    : `НЕТ ОБЪЯВЛЕНИЙ СО СТАТУСОМ "${statusFilter.toUpperCase()}"`
                  }
                </p>
                <Link to="/create-listing">
                  <button className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
                    <span className="relative group-hover:text-black flex items-center gap-2">
                      <Plus size={20} />
                      СОЗДАТЬ ОБЪЯВЛЕНИЕ
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6">
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
                <div className="mt-12 flex justify-center">
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
      </div>
    </div>
  );
};

const ListingItem = ({ listing, isLast, onAction, onEdit, onView }) => {
  const formatPrice = (price, currency) => {
    if (!price) return 'ЦЕНА НЕ УКАЗАНА';
    return new Intl.NumberFormat('ru-KZ').format(price) + ' ' + (currency || '₸');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-600',
      draft: 'bg-gray-600',
      moderation: 'bg-yellow-600',
      sold: 'bg-blue-600',
      archived: 'bg-gray-600',
      expired: 'bg-red-600',
      rejected: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'АКТИВНО',
      draft: 'ЧЕРНОВИК',
      moderation: 'НА МОДЕРАЦИИ',
      sold: 'ПРОДАНО',
      archived: 'В АРХИВЕ',
      expired: 'ИСТЕК СРОК',
      rejected: 'ОТКЛОНЕНО'
    };
    return texts[status] || status.toUpperCase();
  };

  return (
    <div className="group bg-gray-900 hover:bg-gray-800 border-4 border-orange-600 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="p-6 flex flex-col lg:flex-row gap-6">
        {/* Image */}
        <div 
          className="w-full lg:w-48 h-48 lg:h-32 bg-gray-800 border-4 border-black overflow-hidden cursor-pointer flex-shrink-0 group"
          onClick={onView}
        >
          <img
            src={listing.main_image_url || '/placeholder-car.jpg'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-car.jpg';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
            <h3 
              className="text-2xl font-black text-white cursor-pointer hover:text-orange-500 transition-colors uppercase tracking-wide"
              onClick={onView}
            >
              {listing.title}
            </h3>

            <div className={`${getStatusColor(listing.status)} text-white px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black`}>
              {getStatusText(listing.status)}
            </div>
          </div>

          <div className="text-3xl font-black text-orange-500 mb-4 uppercase">
            {formatPrice(listing.price, listing.currency_code)}
          </div>

          <div className="flex flex-wrap gap-6 text-gray-300 font-bold mb-6">
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <Calendar size={16} className="text-orange-500" />
              {formatDate(listing.created_date)}
            </span>
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <Eye size={16} className="text-orange-500" />
              {listing.view_count || 0} ПРОСМОТРОВ
            </span>
            <span className="flex items-center gap-2 uppercase tracking-wide">
              <Heart size={16} className="text-orange-500" />
              {listing.favorite_count || 0} В ИЗБРАННОМ
            </span>
            {listing.expires_date && (
              <span className="flex items-center gap-2 uppercase tracking-wide">
                <Clock size={16} className="text-orange-500" />
                ДО {formatDate(listing.expires_date)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onView}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
            >
              <Eye size={14} />
              ПОСМОТРЕТЬ
            </button>

            {(listing.status === 'active' || listing.status === 'draft') && (
              <button
                onClick={onEdit}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
              >
                <Edit size={14} />
                РЕДАКТИРОВАТЬ
              </button>
            )}

            {listing.status === 'active' && (
              <>
                <button
                  onClick={() => onAction(listing.listing_id, 'deactivate', 'Деактивировать объявление?')}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
                >
                  <Pause size={14} />
                  СНЯТЬ
                </button>
                <button
                  onClick={() => onAction(listing.listing_id, 'mark_sold', 'Отметить как проданное?')}
                  className="bg-green-600 hover:bg-green-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
                >
                  <Check size={14} />
                  ПРОДАНО
                </button>
              </>
            )}

            {listing.status === 'draft' && (
              <button
                onClick={() => onAction(listing.listing_id, 'publish')}
                className="bg-green-600 hover:bg-green-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
              >
                <Send size={14} />
                ОПУБЛИКОВАТЬ
              </button>
            )}

            {listing.status === 'expired' && (
              <button
                onClick={() => onAction(listing.listing_id, 'renew')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
              >
                <RotateCcw size={14} />
                ПРОДЛИТЬ
              </button>
            )}

            <button
              onClick={() => onAction(listing.listing_id, 'delete', 'Удалить объявление безвозвратно?')}
              className="bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2 text-sm uppercase tracking-wider transition-colors border-2 border-black flex items-center gap-2"
            >
              <Trash2 size={14} />
              УДАЛИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;