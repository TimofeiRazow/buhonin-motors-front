import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';

const ModerationPage = () => {
  const [statusFilter, setStatusFilter] = useState('pending');
  const queryClient = useQueryClient();

  const { data: moderationQueue, isLoading } = useQuery(
    ['moderation-queue', statusFilter],
    () => api.get(`/api/admin/moderation?status=${statusFilter}`)
  );

  const moderationMutation = useMutation(
    ({ moderationId, action, reason }) => 
      api.post(`/api/admin/moderation/${moderationId}`, { action, reason }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('moderation-queue');
        queryClient.invalidateQueries('admin-stats');
      }
    }
  );

  const handleModeration = (moderationId, action, reason = '') => {
    if (action === 'reject' && !reason.trim()) {
      const userReason = prompt('Укажите причину отклонения:');
      if (!userReason) return;
      reason = userReason;
    }

    moderationMutation.mutate({ moderationId, action, reason });
  };

  const statusOptions = [
    { value: 'pending', label: 'ОЖИДАЕТ МОДЕРАЦИИ', icon: '⏳', color: 'text-yellow-500' },
    { value: 'approved', label: 'ОДОБРЕНО', icon: '✅', color: 'text-green-500' },
    { value: 'rejected', label: 'ОТКЛОНЕНО', icon: '❌', color: 'text-red-500' }
  ];

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white font-black text-xl uppercase tracking-wider">
            ЗАГРУЗКА ОЧЕРЕДИ МОДЕРАЦИИ...
          </p>
        </div>
      </div>
    );
  }

  const items = moderationQueue?.data || [];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="bg-black border-4 border-orange-500 p-6 relative">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white text-center mb-4">
              <span className="text-orange-500">МОДЕРАЦИЯ</span> КОНТЕНТА
            </h1>
            <div className="w-full h-1 bg-orange-500"></div>
            
            {/* Декоративные элементы */}
            <div className="absolute top-2 left-2 w-4 h-4 border-2 border-orange-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-orange-500"></div>
          </div>
        </div>

        {/* Фильтр статуса */}
        <div className="mb-8">
          <div className="bg-black border-4 border-white p-6">
            <label className="block text-white font-black text-sm uppercase tracking-wider mb-4">
              <span className="text-orange-500">🔍</span> ФИЛЬТР ПО СТАТУСУ:
            </label>
            
            <div className="flex flex-wrap gap-4">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-6 py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                    ${statusFilter === option.value 
                      ? 'bg-orange-500 border-black text-black' 
                      : 'bg-black border-gray-600 text-white hover:border-orange-500'
                    }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Список элементов */}
        {items.length === 0 ? (
          <div className="bg-black border-4 border-gray-600 p-12 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-white font-black text-2xl uppercase tracking-wider mb-4">
              НЕТ ЭЛЕМЕНТОВ ДЛЯ МОДЕРАЦИИ
            </h3>
            <p className="text-gray-400 font-bold uppercase">
              С ВЫБРАННЫМ СТАТУСОМ
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.moderation_id} className="bg-black border-4 border-white p-6 relative hover:border-orange-500 transition-colors duration-300">
                {/* Заголовок элемента */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Основная информация */}
                    <div className="mb-6">
                      <h4 className="text-white font-black text-xl uppercase tracking-wider mb-3">
                        {item.title || 'БЕЗ НАЗВАНИЯ'}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">АВТОР:</div>
                          <div className="text-orange-500 font-bold">{item.user_name}</div>
                        </div>
                        
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">ДАТА:</div>
                          <div className="text-orange-500 font-bold">
                            {new Date(item.submitted_date).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">ПРИОРИТЕТ:</div>
                          <div className={`font-bold ${
                            item.priority === 'high' ? 'text-red-500' :
                            item.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {item.priority?.toUpperCase() || 'ОБЫЧНЫЙ'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Описание */}
                    {item.description && (
                      <div className="mb-6 bg-gray-900 border-2 border-gray-600 p-4">
                        <div className="text-gray-400 font-black text-sm uppercase tracking-wider mb-2">
                          📝 ОПИСАНИЕ:
                        </div>
                        <p className="text-white font-bold">{item.description}</p>
                      </div>
                    )}

                    {/* Оценка автомодерации */}
                    {item.auto_moderation_score && (
                      <div className="mb-6 bg-yellow-900 border-2 border-yellow-500 p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-500 text-lg">🤖</span>
                          <div>
                            <div className="text-yellow-400 font-black text-sm uppercase tracking-wider">
                              ОЦЕНКА АВТОМОДЕРАЦИИ:
                            </div>
                            <div className="text-white font-bold text-lg">
                              {item.auto_moderation_score}/100
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Причина отклонения */}
                    {item.rejection_reason && (
                      <div className="bg-red-900 border-2 border-red-500 p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-red-500 text-lg">⚠️</span>
                          <div>
                            <div className="text-red-400 font-black text-sm uppercase tracking-wider mb-2">
                              ПРИЧИНА ОТКЛОНЕНИЯ:
                            </div>
                            <p className="text-red-300 font-bold">{item.rejection_reason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Действия модерации */}
                  {statusFilter === 'pending' && (
                    <div className="lg:min-w-[200px]">
                      <div className="bg-gray-900 border-2 border-orange-500 p-4">
                        <h5 className="text-orange-500 font-black text-sm uppercase tracking-wider mb-4 text-center">
                          ДЕЙСТВИЯ:
                        </h5>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => handleModeration(item.moderation_id, 'approve')}
                            disabled={moderationMutation.isLoading}
                            className={`w-full py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                              ${moderationMutation.isLoading
                                ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 border-black text-white hover:bg-green-500'
                              }`}
                          >
                            ✅ ОДОБРИТЬ
                          </button>
                          
                          <button
                            onClick={() => handleModeration(item.moderation_id, 'reject')}
                            disabled={moderationMutation.isLoading}
                            className={`w-full py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                              ${moderationMutation.isLoading
                                ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 border-black text-white hover:bg-red-500'
                              }`}
                          >
                            ❌ ОТКЛОНИТЬ
                          </button>
                        </div>

                        {/* Индикатор загрузки */}
                        {moderationMutation.isLoading && (
                          <div className="mt-4 text-center">
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-orange-500 font-bold text-xs uppercase">
                              ОБРАБОТКА...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Декоративные элементы */}
                <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50"></div>
                <div className="absolute bottom-2 left-2 w-6 h-1 bg-orange-500"></div>
              </div>
            ))}
          </div>
        )}

        {/* Статистика */}
        <div className="mt-8 bg-black border-4 border-gray-600 p-6">
          <div className="text-center">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-4">
              📊 СТАТИСТИКА МОДЕРАЦИИ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border-2 border-yellow-500 p-4">
                <div className="text-yellow-500 font-black text-lg">⏳</div>
                <div className="text-white font-bold">В ОЖИДАНИИ</div>
              </div>
              <div className="bg-gray-900 border-2 border-green-500 p-4">
                <div className="text-green-500 font-black text-lg">✅</div>
                <div className="text-white font-bold">ОДОБРЕНО</div>
              </div>
              <div className="bg-gray-900 border-2 border-red-500 p-4">
                <div className="text-red-500 font-black text-lg">❌</div>
                <div className="text-white font-bold">ОТКЛОНЕНО</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;