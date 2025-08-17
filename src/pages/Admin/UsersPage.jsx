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
      if (!window.confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
        return;
      }
    }

    userActionMutation.mutate({ userId, action, reason });
  };

  const statusOptions = [
    { value: 'all', label: 'ВСЕ СТАТУСЫ', icon: '👥' },
    { value: 'active', label: 'АКТИВНЫЕ', icon: '✅' },
    { value: 'blocked', label: 'ЗАБЛОКИРОВАННЫЕ', icon: '🚫' },
    { value: 'suspended', label: 'ПРИОСТАНОВЛЕННЫЕ', icon: '⏸️' }
  ];

  const getUserTypeColor = (userType) => {
    const colors = {
      regular: 'bg-gray-600',
      pro: 'bg-blue-600',
      dealer: 'bg-purple-600',
      admin: 'bg-red-600'
    };
    return colors[userType] || 'bg-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-500',
      blocked: 'text-red-500',
      suspended: 'text-yellow-500'
    };
    return colors[status] || 'text-gray-500';
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white font-black text-xl uppercase tracking-wider">
            ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ...
          </p>
        </div>
      </div>
    );
  }

  const usersList = users?.data?.users || [];
  const totalPages = users?.data?.total_pages || 1;

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="bg-black border-4 border-orange-500 p-6 relative">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white text-center mb-4">
              <span className="text-orange-500">УПРАВЛЕНИЕ</span> ПОЛЬЗОВАТЕЛЯМИ
            </h1>
            <div className="w-full h-1 bg-orange-500"></div>
            
            {/* Декоративные элементы */}
            <div className="absolute top-2 left-2 w-4 h-4 border-2 border-orange-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-orange-500"></div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="mb-8">
          <div className="bg-black border-4 border-white p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Поиск */}
              <div className="lg:col-span-2">
                <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
                  <span className="text-orange-500">🔍</span> ПОИСК ПОЛЬЗОВАТЕЛЕЙ:
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поиск по имени, телефону, email..."
                    className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black
                               focus:outline-none focus:border-orange-500 focus:bg-orange-100
                               hover:bg-gray-100 transition-all duration-300
                               placeholder:text-gray-500 placeholder:font-normal"
                  />
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Фильтр статуса */}
              <div>
                <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
                  <span className="text-orange-500">🏷️</span> СТАТУС:
                </label>
                <div className="relative group">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
                               focus:outline-none focus:border-orange-500 focus:bg-orange-100
                               hover:bg-gray-100 transition-all duration-300 cursor-pointer appearance-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] 
                                    border-l-transparent border-r-transparent border-t-black"></div>
                  </div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Список пользователей */}
        {usersList.length === 0 ? (
          <div className="bg-black border-4 border-gray-600 p-12 text-center">
            <div className="text-6xl mb-6">👤</div>
            <h3 className="text-white font-black text-2xl uppercase tracking-wider mb-4">
              ПОЛЬЗОВАТЕЛИ НЕ НАЙДЕНЫ
            </h3>
            <p className="text-gray-400 font-bold uppercase">
              ИЗМЕНИТЕ КРИТЕРИИ ПОИСКА
            </p>
          </div>
        ) : (
          <>
            {/* Desktop таблица */}
            <div className="hidden lg:block bg-black border-4 border-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 border-b-4 border-orange-500">
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">ПОЛЬЗОВАТЕЛЬ</th>
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">КОНТАКТЫ</th>
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">СТАТУС</th>
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">РЕГИСТРАЦИЯ</th>
                      <th className="px-6 py-4 text-left text-white font-black text-sm uppercase tracking-wider">ДЕЙСТВИЯ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, index) => (
                      <tr key={user.user_id} className={`border-b-2 border-gray-700 hover:bg-gray-900 transition-colors duration-300 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-black'}`}>
                        <td className="px-6 py-4">
                          <div className="text-orange-500 font-black text-lg">{user.user_id}</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-white font-black text-lg">
                                {user.first_name} {user.last_name}
                              </div>
                              {user.user_type !== 'regular' && (
                                <span className={`inline-block px-2 py-1 text-xs font-black text-white uppercase tracking-wider mt-1 ${getUserTypeColor(user.user_type)}`}>
                                  {user.user_type}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-gray-300 font-bold text-sm">
                            <div>📱 {user.phone_number}</div>
                            {user.email && <div>📧 {user.email}</div>}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`font-black text-lg uppercase ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-gray-300 font-bold text-sm">
                            {new Date(user.registration_date).toLocaleDateString('ru-RU')}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {user.status === 'active' && (
                              <>
                                <button
                                  onClick={() => handleUserAction(user.user_id, 'warn')}
                                  disabled={userActionMutation.isLoading}
                                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white font-black text-xs uppercase tracking-wider
                                           border-2 border-black transition-all duration-300 transform hover:scale-105"
                                >
                                  ⚠️ ПРЕДУПРЕДИТЬ
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.user_id, 'block')}
                                  disabled={userActionMutation.isLoading}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider
                                           border-2 border-black transition-all duration-300 transform hover:scale-105"
                                >
                                  🚫 БЛОК
                                </button>
                              </>
                            )}
                            
                            {user.status === 'blocked' && (
                              <button
                                onClick={() => handleUserAction(user.user_id, 'unblock')}
                                disabled={userActionMutation.isLoading}
                                className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase tracking-wider
                                         border-2 border-black transition-all duration-300 transform hover:scale-105"
                              >
                                ✅ РАЗБЛОКИРОВАТЬ
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile карточки */}
            <div className="lg:hidden space-y-4">
              {usersList.map((user) => (
                <div key={user.user_id} className="bg-black border-4 border-white p-6 relative hover:border-orange-500 transition-colors duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-orange-500 font-black text-lg">#{user.user_id}</div>
                        {user.user_type !== 'regular' && (
                          <span className={`px-2 py-1 text-xs font-black text-white uppercase ${getUserTypeColor(user.user_type)}`}>
                            {user.user_type}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-black text-xl mb-2">
                        {user.first_name} {user.last_name}
                      </h3>
                      <div className="text-gray-300 font-bold text-sm space-y-1">
                        <div>📱 {user.phone_number}</div>
                        {user.email && <div>📧 {user.email}</div>}
                        <div>📅 Регистрация: {new Date(user.registration_date).toLocaleDateString('ru-RU')}</div>
                      </div>
                    </div>
                    <div className={`font-black text-sm uppercase ${getStatusColor(user.status)}`}>
                      {user.status}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {user.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleUserAction(user.user_id, 'warn')}
                          disabled={userActionMutation.isLoading}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-black text-xs uppercase
                                   border-2 border-black transition-all duration-300"
                        >
                          ⚠️ ПРЕДУПРЕДИТЬ
                        </button>
                        <button
                          onClick={() => handleUserAction(user.user_id, 'block')}
                          disabled={userActionMutation.isLoading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase
                                   border-2 border-black transition-all duration-300"
                        >
                          🚫 БЛОК
                        </button>
                      </>
                    )}
                    
                    {user.status === 'blocked' && (
                      <button
                        onClick={() => handleUserAction(user.user_id, 'unblock')}
                        disabled={userActionMutation.isLoading}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black text-xs uppercase
                                 border-2 border-black transition-all duration-300"
                      >
                        ✅ РАЗБЛОКИРОВАТЬ
                      </button>
                    )}
                  </div>

                  <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50"></div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="mt-8 bg-black border-4 border-white p-6">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-6 py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                      ${page === 1 
                        ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-black text-black hover:bg-orange-500'
                      }`}
                  >
                    ← НАЗАД
                  </button>
                  
                  <div className="px-6 py-3 bg-orange-500 border-4 border-black text-black font-black text-lg">
                    {page} ИЗ {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className={`px-6 py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                      ${page === totalPages 
                        ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border-black text-black hover:bg-orange-500'
                      }`}
                  >
                    ВПЕРЕД →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Статистика */}
        <div className="mt-8 bg-black border-4 border-gray-600 p-6">
          <div className="text-center">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-4">
              📊 СТАТИСТИКА ПОЛЬЗОВАТЕЛЕЙ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border-2 border-blue-500 p-4">
                <div className="text-blue-500 font-black text-lg">👥</div>
                <div className="text-white font-bold">ВСЕГО</div>
              </div>
              <div className="bg-gray-900 border-2 border-green-500 p-4">
                <div className="text-green-500 font-black text-lg">✅</div>
                <div className="text-white font-bold">АКТИВНЫЕ</div>
              </div>
              <div className="bg-gray-900 border-2 border-red-500 p-4">
                <div className="text-red-500 font-black text-lg">🚫</div>
                <div className="text-white font-bold">ЗАБЛОКИРОВАННЫЕ</div>
              </div>
              <div className="bg-gray-900 border-2 border-yellow-500 p-4">
                <div className="text-yellow-500 font-black text-lg">⏸️</div>
                <div className="text-white font-bold">ПРИОСТАНОВЛЕННЫЕ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;