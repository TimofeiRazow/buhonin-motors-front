// src/hooks/api/usePayments.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';

export const usePayments = () => {
  const queryClient = useQueryClient();

  // Получение доступных услуг
  const services = useQuery('promotion-services', () => api.get('/api/payments/services'));

  // Получение баланса пользователя
  const balance = useQuery('user-balance', () => api.get('/api/payments/balance'));

  // Получение истории транзакций
  const transactions = useQuery('user-transactions', () => api.get('/api/payments/transactions'));

  // Получение активных продвижений
  const promotions = useQuery('user-promotions', () => api.get('/api/payments/my-promotions'));

  // Статистика платежей
  const statistics = useQuery('payment-statistics', () => api.get('/api/payments/statistics'));

  // Создание платежа
  const createPayment = useMutation(
    (paymentData) => api.post('/api/payments/create-payment', paymentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-balance');
        queryClient.invalidateQueries('user-transactions');
      }
    }
  );

  // Продвижение объявления
  const promoteListing = useMutation(
    (promotionData) => api.post('/api/payments/promote-listing', promotionData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-promotions');
        queryClient.invalidateQueries('user-balance');
        queryClient.invalidateQueries('user-transactions');
      }
    }
  );

  // Запрос возврата
  const requestRefund = useMutation(
    (transactionId) => api.post(`/api/payments/refund/${transactionId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user-transactions');
        queryClient.invalidateQueries('user-balance');
      }
    }
  );

  return {
    services,
    balance,
    transactions,
    promotions,
    statistics,
    createPayment,
    promoteListing,
    requestRefund
  };
};