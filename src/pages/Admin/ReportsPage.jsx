// src/pages/Admin/ReportsPage.jsx
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

  if (isLoading) {
    return <div>Загрузка жалоб...</div>;
  }

  const reportsList = reports?.data || [];

  const getReasonText = (reason) => {
    const reasons = {
      spam: 'Спам',
      inappropriate: 'Неподходящий контент',
      fraud: 'Мошенничество',
      duplicate: 'Дублирование',
      other: 'Другое'
    };
    return reasons[reason] || reason;
  };

  return (
    <div>
      <h1>Жалобы пользователей</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Статус: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="open">Открытые</option>
          <option value="resolved">Решенные</option>
          <option value="dismissed">Отклоненные</option>
        </select>
      </div>

      {reportsList.length === 0 ? (
        <div>Нет жалоб с выбранным статусом</div>
      ) : (
        <div>
          {reportsList.map((report) => (
            <div key={report.report_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4>Жалоба #{report.report_id}</h4>
                  <p style={{ color: '#666' }}>
                    От пользователя: {report.reporter_name} |
                    Дата: {new Date(report.created_date).toLocaleString('ru-RU')} |
                    Причина: {getReasonText(report.report_reason)}
                  </p>

                  <div style={{ marginTop: '10px' }}>
                    <strong>Описание жалобы:</strong>
                    <p>{report.description}</p>
                  </div>

                  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <strong>Объект жалобы:</strong>
                    <p>{report.content_title}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      Автор: {report.content_author} | Тип: {report.content_type}
                    </p>
                  </div>

                  {report.resolution_notes && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
                      <strong>Решение:</strong> {report.resolution_notes}
                      <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Решено: {new Date(report.resolved_date).toLocaleString('ru-RU')} 
                        пользователем {report.resolved_by_name}
                      </p>
                    </div>
                  )}
                </div>

                {statusFilter === 'open' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '20px' }}>
                    <button
                      onClick={() => handleResolveReport(report.report_id, 'action_taken')}
                      disabled={resolveReportMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Принять меры
                    </button>
                    
                    <button
                      onClick={() => handleResolveReport(report.report_id, 'dismissed')}
                      disabled={resolveReportMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#6c757d',
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

export default ReportsPage;
