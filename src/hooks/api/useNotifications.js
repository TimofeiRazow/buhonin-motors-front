// hooks/api/useNotifications.js
const useNotifications = () => {
  const notifications = useQuery('notifications',
    () => api.get('/api/notifications/'),
    { refetchInterval: 60000 }
  );

  const unreadCount = useQuery('notifications-unread',
    () => api.get('/api/notifications/unread-count'),
    { refetchInterval: 30000 }
  );

  const markAsRead = useMutation(
    (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notifications-unread');
      }
    }
  );

  const markAllAsRead = useMutation(
    () => api.put('/api/notifications/mark-all-read'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
        queryClient.invalidateQueries('notifications-unread');
      }
    }
  );

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};

export default useNotifications;