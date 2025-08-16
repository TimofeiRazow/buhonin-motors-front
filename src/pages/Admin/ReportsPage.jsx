import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';

const ReportsPage = () => {
  const [statusFilter, setStatusFilter] = useState('open');
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery(
    ['admin-reports', statusFilter],
    () => api.get(`/api/admin/reports?status=${statusFilter}`)
  );

  const resolveReportMutation = useMutation(
    ({ reportId, resolution, notes }) => 
      api.post(`/api/admin/reports/${reportId}/resolve`, { resolution, notes }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-reports');
        queryClient.invalidateQueries('admin-stats');
      }
    }
  );

  const handleResolveReport = (reportId, resolution) => {
    const notes = prompt('Комментарий к решению (необязательно):');
    resolveReportMutation.mutate({ reportId, resolution, notes });
  };

  const getReasonText = (reason) => {
    const reasons = {
      spam: 'СПАМ',
      inappropriate: 'НЕПОДХОДЯЩИЙ КОНТЕНТ',
      fraud: 'МОШЕННИЧЕСТВО',
      duplicate: 'ДУБЛИРОВАНИЕ',
      other: 'ДРУГОЕ'
    };
    return reasons[reason] || reason.toUpperCase();
  };

  const getReasonIcon = (reason) => {
    const icons = {
      spam: '🚫',
      inappropriate: '⚠️',
      fraud: '💀',
      duplicate: '📄',
      other: '❓'
    };
    return icons[reason] || '❓';
  };

  const statusOptions = [
    { value: 'open', label: 'ОТКРЫТЫЕ', icon: '🔓', color: 'text-red-500' },
    { value: 'resolved', label: 'РЕШЕННЫЕ', icon: '✅', color: 'text-green-500' },
    { value: 'dismissed', label: 'ОТКЛОНЕННЫЕ', icon: '❌', color: 'text-gray-500' }
  ];

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white font-black text-xl uppercase tracking-wider">
            ЗАГРУЗКА ЖАЛОБ...
          </p>
        </div>
      </div>
    );
  }

  const reportsList = reports?.data || [];

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="bg-black border-4 border-orange-500 p-6 relative">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white text-center mb-4">
              <span className="text-orange-500">ЖАЛОБЫ</span> ПОЛЬЗОВАТЕЛЕЙ
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

        {/* Список жалоб */}
        {reportsList.length === 0 ? (
          <div className="bg-black border-4 border-gray-600 p-12 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h3 className="text-white font-black text-2xl uppercase tracking-wider mb-4">
              НЕТ ЖАЛОБ
            </h3>
            <p className="text-gray-400 font-bold uppercase">
              С ВЫБРАННЫМ СТАТУСОМ
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reportsList.map((report) => (
              <div key={report.report_id} className="bg-black border-4 border-white p-6 relative hover:border-orange-500 transition-colors duration-300">
                {/* Заголовок жалобы */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    {/* Основная информация */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{getReasonIcon(report.report_reason)}</span>
                        <h4 className="text-white font-black text-xl uppercase tracking-wider">
                          ЖАЛОБА #{report.report_id}
                        </h4>
                        <div className="px-3 py-1 bg-orange-500 text-black font-black text-xs uppercase">
                          {getReasonText(report.report_reason)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">ЖАЛОБЩИК:</div>
                          <div className="text-orange-500 font-bold">{report.reporter_name}</div>
                        </div>
                        
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">ДАТА:</div>
                          <div className="text-orange-500 font-bold">
                            {new Date(report.created_date).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 border-2 border-gray-600 p-3">
                          <div className="text-gray-400 font-black text-xs uppercase mb-1">ТИП:</div>
                          <div className="text-orange-500 font-bold">{report.content_type?.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Описание жалобы */}
                    <div className="mb-6 bg-red-900 border-2 border-red-500 p-4">
                      <div className="text-red-400 font-black text-sm uppercase tracking-wider mb-2">
                        📝 ОПИСАНИЕ ЖАЛОБЫ:
                      </div>
                      <p className="text-red-300 font-bold">{report.description}</p>
                    </div>

                    {/* Объект жалобы */}
                    <div className="mb-6 bg-gray-900 border-2 border-gray-600 p-4">
                      <div className="text-gray-400 font-black text-sm uppercase tracking-wider mb-3">
                        🎯 ОБЪЕКТ ЖАЛОБЫ:
                      </div>
                      <div className="bg-black border-2 border-gray-700 p-3">
                        <h5 className="text-white font-bold text-lg mb-2">{report.content_title}</h5>
                        <div className="text-gray-400 text-sm">
                          <span className="font-bold">Автор:</span> {report.content_author} • 
                          <span className="font-bold ml-2">Тип:</span> {report.content_type}
                        </div>
                      </div>
                    </div>

                    {/* Решение */}
                    {report.resolution_notes && (
                      <div className="bg-green-900 border-2 border-green-500 p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-green-500 text-lg">✅</span>
                          <div>
                            <div className="text-green-400 font-black text-sm uppercase tracking-wider mb-2">
                              РЕШЕНИЕ:
                            </div>
                            <p className="text-green-300 font-bold mb-3">{report.resolution_notes}</p>
                            <div className="text-green-400 text-xs">
                              <span className="font-bold">Решено:</span> {new Date(report.resolved_date).toLocaleString('ru-RU')} 
                              <span className="font-bold ml-4">Модератор:</span> {report.resolved_by_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Действия */}
                  {statusFilter === 'open' && (
                    <div className="lg:min-w-[200px]">
                      <div className="bg-gray-900 border-2 border-orange-500 p-4">
                        <h5 className="text-orange-500 font-black text-sm uppercase tracking-wider mb-4 text-center">
                          ДЕЙСТВИЯ:
                        </h5>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => handleResolveReport(report.report_id, 'action_taken')}
                            disabled={resolveReportMutation.isLoading}
                            className={`w-full py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                              ${resolveReportMutation.isLoading
                                ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-600 border-black text-white hover:bg-green-500'
                              }`}
                          >
                            ✅ ПРИНЯТЬ МЕРЫ
                          </button>
                          
                          <button
                            onClick={() => handleResolveReport(report.report_id, 'dismissed')}
                            disabled={resolveReportMutation.isLoading}
                            className={`w-full py-3 font-black text-sm uppercase tracking-wider border-4 transition-all duration-300 transform hover:scale-105
                              ${resolveReportMutation.isLoading
                                ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-600 border-black text-white hover:bg-gray-500'
                              }`}
                          >
                            ❌ ОТКЛОНИТЬ
                          </button>
                        </div>

                        {/* Индикатор загрузки */}
                        {resolveReportMutation.isLoading && (
                          <div className="mt-4 text-center">
                            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-orange-500 font-bold text-xs uppercase">
                              ОБРАБОТКА...
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Приоритет */}
                      <div className="mt-4 bg-yellow-900 border-2 border-yellow-500 p-3 text-center">
                        <div className="text-yellow-500 font-black text-xs uppercase mb-1">
                          ПРИОРИТЕТ:
                        </div>
                        <div className="text-white font-bold">
                          {report.priority?.toUpperCase() || 'ОБЫЧНЫЙ'}
                        </div>
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

        {/* Статистика жалоб */}
        <div className="mt-8 bg-black border-4 border-gray-600 p-6">
          <div className="text-center">
            <h3 className="text-white font-black text-lg uppercase tracking-wider mb-4">
              📊 СТАТИСТИКА ЖАЛОБ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 border-2 border-red-500 p-4">
                <div className="text-red-500 font-black text-lg">🔓</div>
                <div className="text-white font-bold">ОТКРЫТЫЕ</div>
              </div>
              <div className="bg-gray-900 border-2 border-green-500 p-4">
                <div className="text-green-500 font-black text-lg">✅</div>
                <div className="text-white font-bold">РЕШЕННЫЕ</div>
              </div>
              <div className="bg-gray-900 border-2 border-gray-500 p-4">
                <div className="text-gray-500 font-black text-lg">❌</div>
                <div className="text-white font-bold">ОТКЛОНЕННЫЕ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;