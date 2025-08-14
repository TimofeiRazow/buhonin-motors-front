    // hooks/api/useMessages.js
const useConversations = () => {
  const conversations = useQuery('conversations', 
    () => api.get('/api/conversations/')
  );
  
  const unreadCount = useQuery('unread-count',
    () => api.get('/api/conversations/unread-count'),
    { refetchInterval: 30000 }
  );

  return { conversations, unreadCount };
};

const useConversation = (conversationId) => {
  const messages = useQuery(
    ['messages', conversationId],
    () => api.get(`/api/conversations/${conversationId}/messages`)
  );

  const sendMessage = useMutation(
    (message) => api.post(`/api/conversations/${conversationId}/messages`, message)
  );

  const markAsRead = useMutation(
    () => api.post(`/api/conversations/${conversationId}/read`)
  );

  return { messages, sendMessage, markAsRead };
};

// WebSocket для real-time сообщений
const useWebSocketMessages = (conversationId) => {
  const [socket, setSocket] = useState(null);
  const { data: auth } = useAuth();

  useEffect(() => {
    if (auth?.token && conversationId) {
      const ws = new WebSocket(`ws://localhost:5000/ws/conversations/${conversationId}?token=${auth.token}`);
      setSocket(ws);
      
      return () => ws.close();
    }
  }, [auth?.token, conversationId]);

  return socket;
};

export { useConversations, useConversation, useWebSocketMessages };