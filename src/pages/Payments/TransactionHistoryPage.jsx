// src/pages/Payments/TransactionHistoryPage.jsx
import React, { useState } from 'react';
import { usePayments } from '../../hooks/api/usePayments';

const TransactionHistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const { transactions, requestRefund } = usePayments();

  const getTransactionTypeText = (type) => {
    const types = {
      payment: 'Платеж',
      refund: 'Возврат',
      bonus: 'Бонус',
      withdrawal: 'Вывод'
    };
    return types[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#28a745',
      pending: '#ffc107',
      failed: '#dc3545',
      cancelled: '#6c757d'
    };
    return colors[status] || '#333';
  };

  const handleRefundRequest = async (transactionId) => {
    if (confirm('Вы уверены, что хотите запросить возврат средств?')) {
      try {
        await requestRefund.mutateAsync(transactionId);
        alert('Запрос на возврат отправлен');
      } catch (error) {
        console.error('Error requesting refund:', error);
        alert('Ошибка при запросе возврата');
      }
    }
  };

  if (transactions.isLoading) {
    return <div>Загрузка истории транзакций...</div>;
  }

  const transactionsList = transactions.data?.data || [];
  const filteredTransactions = filter === 'all' 
    ? transactionsList 
    : transactionsList.filter(t => t.transaction_type === filter);

  return (
    <div>
      <h1>История платежей</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Фильтр: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Все транзакции</option>
          <option value="payment">Платежи</option>
          <option value="refund">Возвраты</option>
          <option value="bonus">Бонусы</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div>Транзакции не найдены</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Тип</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Сумма</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Статус</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Описание</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Дата</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    #{transaction.transaction_id}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {getTransactionTypeText(transaction.transaction_type)}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {transaction.amount.toLocaleString()} {transaction.currency_code}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{ color: getStatusColor(transaction.status) }}>
                      {transaction.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {transaction.description || '-'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(transaction.created_date).toLocaleString('ru-RU')}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {transaction.transaction_type === 'payment' && 
                     transaction.status === 'completed' && (
                      <button
                        onClick={() => handleRefundRequest(transaction.transaction_id)}
                        disabled={requestRefund.isLoading}
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
                        Возврат
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;