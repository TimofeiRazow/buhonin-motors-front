// src/store/middleware.js
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loginSuccess, logout } from './slices/authSlice';
import { clearListings } from './slices/listingsSlice';
import { clearMessages } from './slices/messagesSlice';
import { clearNotifications } from './slices/notificationsSlice';

// Создаем listener middleware для side effects
export const listenerMiddleware = createListenerMiddleware();

// Обработчик успешного входа
listenerMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: async (action, listenerApi) => {
    const { user, token } = action.payload;
    
    // Сохраняем токен в localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('User logged in:', user.first_name);
    
    // Можно добавить аналитику
    if (window.gtag) {
      window.gtag('event', 'login', {
        event_category: 'user',
        event_label: user.user_type
      });
    }
  }
});

// Обработчик выхода
listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (action, listenerApi) => {
    // Очищаем localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Очищаем связанные данные в store
    listenerApi.dispatch(clearListings());
    listenerApi.dispatch(clearMessages());
    listenerApi.dispatch(clearNotifications());
    
    console.log('User logged out');
    
    // Аналитика
    if (window.gtag) {
      window.gtag('event', 'logout', {
        event_category: 'user'
      });
    }
  }
});

// Middleware для логирования действий в development
export const loggingMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Action: ${action.type}`);
    console.log('Payload:', action.payload);
    console.log('Previous State:', store.getState());
  }
  
  const result = next(action);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('New State:', store.getState());
    console.groupEnd();
  }
  
  return result;
};

// Middleware для обработки ошибок
export const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    
    // Можно отправить ошибку в сервис мониторинга
    if (window.Sentry) {
      window.Sentry.captureException(error);
    }
    
    // Показать уведомление пользователю
    if (error.message) {
      // Dispatch notification action если есть
      // store.dispatch(showNotification({ type: 'error', message: error.message }));
    }
    
    throw error;
  }
};

// Middleware для синхронизации с localStorage
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Сохраняем определенные части состояния в localStorage
  const state = store.getState();
  
  // Сохраняем пользовательские настройки
  if (action.type.startsWith('user/updateSettings')) {
    localStorage.setItem('userSettings', JSON.stringify(state.auth.settings));
  }
  
  // Сохраняем фильтры поиска
  if (action.type.startsWith('listings/setFilters')) {
    localStorage.setItem('searchFilters', JSON.stringify(state.listings.filters));
  }
  
  return result;
};

// Middleware для обработки API ошибок
export const apiErrorMiddleware = (store) => (next) => (action) => {
  // Обрабатываем rejected actions от createAsyncThunk
  if (action.type.endsWith('/rejected')) {
    const error = action.payload || action.error;
    
    // Если ошибка 401 - разлогиниваем пользователя
    if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
      store.dispatch(logout());
      window.location.href = '/login';
      return;
    }
    
    // Если ошибка 403 - показываем сообщение о недостатке прав
    if (error?.status === 403) {
      // store.dispatch(showNotification({ 
      //   type: 'error', 
      //   message: 'У вас недостаточно прав для выполнения этого действия' 
      // }));
    }
    
    // Логируем API ошибки
    console.error('API Error:', {
      action: action.type,
      error: error
    });
  }
  
  return next(action);
};

// Middleware для отслеживания производительности
export const performanceMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = next(action);
    const end = performance.now();
    
    if (end - start > 16) { // Если action выполняется дольше 16ms
      console.warn(`Slow action detected: ${action.type} took ${end - start}ms`);
    }
    
    return result;
  }
  
  return next(action);
};

// Объединяем все middleware
export const customMiddleware = [
  listenerMiddleware.middleware,
  loggingMiddleware,
  errorMiddleware,
  persistenceMiddleware,
  apiErrorMiddleware,
  performanceMiddleware
];