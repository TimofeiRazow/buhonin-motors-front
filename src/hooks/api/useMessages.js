// src/hooks/api/useMessages.js
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import api from '../../services/api';

export const useMessages = () => {
  const queryClient = useQueryClient();

  // Получение списка диалогов
  const conversations = useQuery('conversations', 
    () => api.get('/api/conversations/')
  );
  
  // Количество непрочитанных диалогов
  const unreadCount = useQuery('unread-count',
    () => api.get('/api/conversations/unread-count'),
    { refetchInterval: 30000 }
  );

  // Отправка сообщения
  const sendMessage = useMutation(
    ({ conversationId, message_text }) => 
      api.post(`/api/conversations/${conversationId}/messages`, { message_text }),
    {
      onSuccess: (data, variables) => {
        // Обновляем список сообщений конкретного диалога
        queryClient.invalidateQueries(['messages', variables.conversationId]);
        // Обновляем список диалогов
        queryClient.invalidateQueries('conversations');
      }
    }
  );

  // Создание нового диалога
  const createConversation = useMutation(
    (conversationData) => api.post('/api/conversations/', conversationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('conversations');
      }
    }
  );

  // Получение сообщений конкретного диалога
  const useConversationMessages = (conversationId) => {
    return useQuery(
      ['messages', conversationId],
      () => api.get(`/api/conversations/${conversationId}/messages`),
      { 
        enabled: !!conversationId,
        refetchInterval: 10000 // Обновляем каждые 10 секунд
      }
    );
  };

  // Отметка диалога как прочитанного
  const markAsRead = useMutation(
    (conversationId) => api.post(`/api/conversations/${conversationId}/read`),
    {
      onSuccess: (data, conversationId) => {
        queryClient.invalidateQueries(['messages', conversationId]);
        queryClient.invalidateQueries('conversations');
        queryClient.invalidateQueries('unread-count');
      }
    }
  );

  return {
    conversations,
    unreadCount,
    sendMessage,
    createConversation,
    useConversationMessages,
    markAsRead
  };
};

export const useConversations = () => {
  const conversations = useQuery('conversations', 
    () => api.get('/api/conversations/')
  );
  
  const unreadCount = useQuery('unread-count',
    () => api.get('/api/conversations/unread-count'),
    { refetchInterval: 30000 }
  );

  return { conversations, unreadCount };
};

export const useConversation = (conversationId) => {
  const queryClient = useQueryClient();

  const messages = useQuery(
    ['messages', conversationId],
    () => api.get(`/api/conversations/${conversationId}/messages`),
    { 
      enabled: !!conversationId,
      refetchInterval: 10000
    }
  );

  const sendMessage = useMutation(
    (message) => api.post(`/api/conversations/${conversationId}/messages`, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', conversationId]);
        queryClient.invalidateQueries('conversations');
      }
    }
  );

  const markAsRead = useMutation(
    () => api.post(`/api/conversations/${conversationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', conversationId]);
        queryClient.invalidateQueries('conversations');
        queryClient.invalidateQueries('unread-count');
      }
    }
  );

  return { messages, sendMessage, markAsRead };
};

// WebSocket для real-time сообщений
export const useWebSocketMessages = (conversationId) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.token && conversationId) {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:5000'}/ws/conversations/${conversationId}?token=${user.token}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Обновляем кэш сообщений
          queryClient.invalidateQueries(['messages', conversationId]);
          queryClient.invalidateQueries('conversations');
          
          console.log('New message received:', message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      setSocket(ws);
      
      return () => {
        ws.close();
      };
    }
  }, [user?.token, conversationId, queryClient]);

  return socket;
};