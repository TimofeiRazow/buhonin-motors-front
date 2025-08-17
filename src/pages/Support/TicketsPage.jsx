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
      open: 'bg-blue-600',
      in_progress: 'bg-orange-600',
      waiting_user: 'bg-cyan-600',
      resolved: 'bg-green-600',
      closed: 'bg-gray-600'
    };
    return colors[status] || 'bg-gray-800';
  };

  const getStatusText = (status) => {
    const statuses = {
      open: 'ОТКРЫТ',
      in_progress: 'В РАБОТЕ',
      waiting_user: 'ЖДЕТ ОТВЕТА',
      resolved: 'РЕШЕН',
      closed: 'ЗАКРЫТ'
    };
    return statuses[status] || status.toUpperCase();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-600',
      medium: 'bg-yellow-600',
      high: 'bg-orange-600',
      critical: 'bg-red-600'
    };
    return colors[priority] || 'bg-gray-800';
  };

  const getPriorityText = (priority) => {
    const priorities = {
      low: 'НИЗКИЙ',
      medium: 'СРЕДНИЙ',
      high: 'ВЫСОКИЙ',
      critical: 'КРИТИЧЕСКИЙ'
    };
    return priorities[priority] || priority.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-xl mt-4 uppercase tracking-wider">
            ЗАГРУЗКА...
          </p>
        </div>
      </div>
    );
  }

  const ticketsList = tickets?.data || [];

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-600">
        {/* Фоновые элементы */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border-4 border-orange-500 rotate-45"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-orange-600 rotate-12"></div>
        </div>
        
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-wider">
                <span className="text-white">МОИ</span>
                <span className="text-orange-500"> ОБРАЩЕНИЯ</span>
              </h1>
              <p className="text-xl font-bold text-gray-300 uppercase">
                ОТСЛЕЖИВАЙТЕ СТАТУС ВАШИХ ТИКЕТОВ
              </p>
            </div>
            
            <Link to="/support/create-ticket">
              <button className="group relative bg-orange-600 hover:bg-white text-black font-black px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 mt-6 md:mt-0">
                <div className="absolute inset-0 border-4 border-black group-hover:border-orange-600 transition-colors"></div>
                <span className="relative group-hover:text-black">+ СОЗДАТЬ ТИКЕТ</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-black p-6 border-4 border-orange-600">
            <label className="block text-white font-black text-lg mb-4 uppercase tracking-wider">
              ФИЛЬТР ПО СТАТУСУ:
            </label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 text-white font-bold px-6 py-3 border-4 border-orange-600 focus:border-white outline-none uppercase tracking-wider text-lg w-full md:w-auto"
            >
              <option value="all">ВСЕ ОБРАЩЕНИЯ</option>
              <option value="open">ОТКРЫТЫЕ</option>
              <option value="in_progress">В РАБОТЕ</option>
              <option value="waiting_user">ЖДУТ ОТВЕТА</option>
              <option value="resolved">РЕШЕННЫЕ</option>
              <option value="closed">ЗАКРЫТЫЕ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {ticketsList.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-900 p-12 border-4 border-orange-600 inline-block">
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
                  НЕТ ТИКЕТОВ
                </h3>
                <p className="text-gray-300 font-bold text-lg uppercase">
                  {statusFilter === 'all' 
                    ? 'У ВАС ПОКА НЕТ ОБРАЩЕНИЙ' 
                    : `НЕТ ТИКЕТОВ СО СТАТУСОМ "${getStatusText(statusFilter)}"`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {ticketsList.map((ticket) => (
                <div 
                  key={ticket.ticket_id} 
                  className="group bg-gray-900 hover:bg-gray-800 border-4 border-orange-600 p-6 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                      {/* Ticket Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                          <Link 
                            to={`/support/tickets/${ticket.ticket_id}`} 
                            className="text-white hover:text-orange-500 transition-colors"
                          >
                            #{ticket.ticket_id}
                          </Link>
                        </h4>
                        <div className="w-2 h-8 bg-orange-600"></div>
                      </div>
                      
                      {/* Subject */}
                      <h5 className="text-xl font-bold text-orange-500 mb-4 uppercase tracking-wide">
                        {ticket.subject}
                      </h5>
                      
                      {/* Description Preview */}
                      <p className="text-gray-300 font-bold mb-6 text-lg leading-relaxed">
                        {ticket.description.substring(0, 200)}
                        {ticket.description.length > 200 && '...'}
                      </p>

                      {/* Status and Priority Tags */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className={`${getStatusColor(ticket.status)} text-white px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black`}>
                          {getStatusText(ticket.status)}
                        </span>

                        <span className={`${getPriorityColor(ticket.priority)} text-white px-4 py-2 font-black text-sm uppercase tracking-wider border-2 border-black`}>
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <div className="text-gray-400 font-bold uppercase tracking-wide">
                          СОЗДАНО: <span className="text-white">{new Date(ticket.created_date).toLocaleDateString('ru-RU')}</span>
                        </div>

                        {ticket.first_response_date && (
                          <div className="text-gray-400 font-bold uppercase tracking-wide">
                            ПЕРВЫЙ ОТВЕТ: <span className="text-white">{new Date(ticket.first_response_date).toLocaleDateString('ru-RU')}</span>
                          </div>
                        )}

                        {ticket.assigned_to && (
                          <div className="text-gray-400 font-bold uppercase tracking-wide">
                            НАЗНАЧЕН: <span className="text-orange-500">{ticket.assigned_to_name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-end gap-4">
                      {ticket.status !== 'closed' && (
                        <Link to={`/support/tickets/${ticket.ticket_id}`}>
                          <button className="group relative bg-white hover:bg-orange-600 text-black hover:text-white font-black px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105">
                            <div className="absolute inset-0 border-4 border-black transition-colors"></div>
                            <span className="relative">ОТКРЫТЬ</span>
                          </button>
                        </Link>
                      )}
                      
                      {/* Geometric accent */}
                      <div className="hidden lg:block">
                        <div className="w-8 h-8 border-4 border-orange-600 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Section */}
      {ticketsList.length > 0 && (
        <div className="bg-orange-600 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-black p-4 mb-2">
                  <h3 className="text-3xl font-black text-orange-500">
                    {ticketsList.length}
                  </h3>
                </div>
                <p className="text-black font-black uppercase tracking-wide">
                  ВСЕГО ТИКЕТОВ
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-black p-4 mb-2">
                  <h3 className="text-3xl font-black text-orange-500">
                    {ticketsList.filter(t => t.status === 'open').length}
                  </h3>
                </div>
                <p className="text-black font-black uppercase tracking-wide">
                  ОТКРЫТЫХ
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-black p-4 mb-2">
                  <h3 className="text-3xl font-black text-orange-500">
                    {ticketsList.filter(t => t.status === 'resolved').length}
                  </h3>
                </div>
                <p className="text-black font-black uppercase tracking-wide">
                  РЕШЕННЫХ
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-black p-4 mb-2">
                  <h3 className="text-3xl font-black text-orange-500">
                    {ticketsList.filter(t => t.status === 'closed').length}
                  </h3>
                </div>
                <p className="text-black font-black uppercase tracking-wide">
                  ЗАКРЫТЫХ
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;