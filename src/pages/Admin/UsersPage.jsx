// src/pages/Admin/UsersPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery(
    ['admin-users', searchTerm, statusFilter, page],
    () => api.get(`/api/users/search?q=${searchTerm}&status=${statusFilter}&page=${page}&limit=20`)
  );

  const userActionMutation = useMutation(
    ({ userId, action, reason }) => 
      api.post(`/api/admin/users/${userId}/action`, { action, reason }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-users');
      }
    }
  );

  const handleUserAction = (userId, action) => {
    let reason = '';
    
    if (action === 'block' || action === 'warn') {
      reason = prompt(`Укажите причину для действия "${action}":`);
      if (!reason) return;
    }

    if (action === 'block') {
      if (!confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
        return;
      }
    }

    userActionMutation.mutate({ userId, action, reason });
  };

  if (isLoading) {
    return <div>Загрузка пользователей...</div>;
  }

  const usersList = users?.data?.users || [];
  const totalPages = users?.data?.total_pages || 1;

  return (
    <div>
      <h1>Управление пользователями</h1>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по имени, телефону, email..."
          style={{ flex: 1, padding: '8px' }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="blocked">Заблокированные</option>
          <option value="suspended">Приостановленные</option>
        </select>
      </div>

      {usersList.length === 0 ? (
        <div>Пользователи не найдены</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Имя</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Телефон</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Статус</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Регистрация</th>
                  <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.user_id}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.user_id}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {user.first_name} {user.last_name}
                      {user.user_type !== 'regular' && (
                        <span style={{ 
                          backgroundColor: '#007bff', 
                          color: 'white', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          marginLeft: '5px'
                        }}>
                          {user.user_type}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.phone_number}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email || '-'}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <span style={{
                        color: user.status === 'active' ? '#28a745' : 
                              user.status === 'blocked' ? '#dc3545' : '#ffc107'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {new Date(user.registration_date).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {user.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleUserAction(user.user_id, 'warn')}
                              disabled={userActionMutation.isLoading}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#ffc107',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Предупредить
                            </button>
                            <button
                              onClick={() => handleUserAction(user.user_id, 'block')}
                              disabled={userActionMutation.isLoading}
                              style={{
                                padding: '4px 8px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              Заблокировать
                            </button>
                          </>
                        )}
                        
                        {user.status === 'blocked' && (
                          <button
                            onClick={() => handleUserAction(user.user_id, 'unblock')}
                            disabled={userActionMutation.isLoading}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Разблокировать
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                style={{ padding: '8px 16px' }}
              >
                Назад
              </button>
              
              <span style={{ padding: '8px 16px' }}>
                {page} из {totalPages}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                style={{ padding: '8px 16px' }}
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;