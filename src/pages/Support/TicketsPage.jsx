// src/pages/Support/TicketsPage.jsx
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const TicketsPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: tickets, isLoading } = useQuery(
    ['support-tickets', statusFilter],
    () => api.get(`/api/support/tickets?status=${statusFilter}`)
  );

  const getStatusColor = (status) => {
    const colors = {
      open: '#007bff',
      in_progress: '#ffc107',
      waiting_user: '#17a2b8',
      resolved: '#28a745',
      closed: '#6c757d'
    };
    return colors[status] || '#333';
  };

  const getStatusText = (status) => {
    const statuses = {
      open: 'Открыт',
      in_progress: 'В работе',
      waiting_user: 'Ожидает ответа',
      resolved: 'Решен',
      closed: 'Закрыт'
    };
    return statuses[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545'
    };
    return colors[priority] || '#333';
  };

  const getPriorityText = (priority) => {
    const priorities = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
      critical: 'Критический'
    };
    return priorities[priority] || priority;
  };

  if (isLoading) {
    return <div>Загрузка обращений...</div>;
  }

  const ticketsList = tickets?.data || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Мои обращения</h1>
        <Link to="/support/create-ticket">
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Создать обращение
          </button>
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Фильтр по статусу: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Все</option>
          <option value="open">Открытые</option>
          <option value="in_progress">В работе</option>
          <option value="waiting_user">Ожидают ответа</option>
          <option value="resolved">Решенные</option>
          <option value="closed">Закрытые</option>
        </select>
      </div>

      {ticketsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          {statusFilter === 'all' ? 'У вас пока нет обращений' : `Нет обращений со статусом "${getStatusText(statusFilter)}"`}
        </div>
      ) : (
        <div>
          {ticketsList.map((ticket) => (
            <div key={ticket.ticket_id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4>
                    <Link to={`/support/tickets/${ticket.ticket_id}`} style={{ textDecoration: 'none' }}>
                      #{ticket.ticket_id} - {ticket.subject}
                    </Link>
                  </h4>
                  
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    {ticket.description.substring(0, 200)}
                    {ticket.description.length > 200 && '...'}
                  </p>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getStatusColor(ticket.status)
                    }}>
                      {getStatusText(ticket.status)}
                    </span>

                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getPriorityColor(ticket.priority)
                    }}>
                      {getPriorityText(ticket.priority)}
                    </span>

                    <span style={{ fontSize: '14px', color: '#666' }}>
                      Создано: {new Date(ticket.created_date).toLocaleDateString('ru-RU')}
                    </span>

                    {ticket.first_response_date && (
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        Первый ответ: {new Date(ticket.first_response_date).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>

                  {ticket.assigned_to && (
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                      Назначен: {ticket.assigned_to_name}
                    </div>
                  )}
                </div>

                <div>
                  {ticket.status !== 'closed' && (
                    <Link to={`/support/tickets/${ticket.ticket_id}`}>
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        Открыть
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;