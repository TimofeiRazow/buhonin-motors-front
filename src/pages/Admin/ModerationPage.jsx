// src/pages/Admin/ModerationPage.jsx
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

  if (isLoading) {
    return <div>Загрузка очереди модерации...</div>;
  }

  const items = moderationQueue?.data || [];

  return (
    <div>
      <h1>Модерация контента</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Статус: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="pending">Ожидает модерации</option>
          <option value="approved">Одобрено</option>
          <option value="rejected">Отклонено</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div>Нет элементов для модерации</div>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.moderation_id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4>{item.title || 'Без названия'}</h4>
                  <p style={{ color: '#666' }}>
                    Автор: {item.user_name} | 
                    Отправлено: {new Date(item.submitted_date).toLocaleString('ru-RU')} |
                    Приоритет: {item.priority}
                  </p>
                  
                  {item.description && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Описание:</strong>
                      <p>{item.description}</p>
                    </div>
                  )}

                  {item.auto_moderation_score && (
                    <p style={{ color: '#ffc107' }}>
                      Оценка автомодерации: {item.auto_moderation_score}/100
                    </p>
                  )}

                  {item.rejection_reason && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                      <strong>Причина отклонения:</strong> {item.rejection_reason}
                    </div>
                  )}
                </div>

                {statusFilter === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                    <button
                      onClick={() => handleModeration(item.moderation_id, 'approve')}
                      disabled={moderationMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Одобрить
                    </button>
                    
                    <button
                      onClick={() => handleModeration(item.moderation_id, 'reject')}
                      disabled={moderationMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationPage;