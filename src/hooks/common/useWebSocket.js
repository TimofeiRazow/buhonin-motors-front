// src/hooks/common/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/useAuth';

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    shouldReconnect = true,
    maxReconnectAttempts = 5,
    reconnectInterval = 3000
  } = options;

  const connect = () => {
    try {
      const wsUrl = token ? `${url}?token=${token}` : url;
      const ws = new WebSocket(wsUrl);

      ws.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        setError(null);
        reconnectAttempts.current = 0;
        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (err) {
          setLastMessage(event.data);
          onMessage?.(event.data);
        }
      };

      ws.onerror = (event) => {
        setError(event);
        onError?.(event);
      };

      ws.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        onClose?.(event);

        if (
          shouldReconnect &&
          reconnectAttempts.current < maxReconnectAttempts &&
          !event.wasClean
        ) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, reconnectInterval);
        }
      };

      setSocket(ws);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [url, token]);

  const sendMessage = (message) => {
    if (socket && readyState === WebSocket.OPEN) {
      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
      socket.send(messageToSend);
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
    }
  };

  return {
    socket,
    lastMessage,
    readyState,
    error,
    sendMessage,
    disconnect,
    reconnect: connect
  };
};