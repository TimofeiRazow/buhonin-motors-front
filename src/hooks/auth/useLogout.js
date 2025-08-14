export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation(
    () => api.post('/api/auth/logout'),
    {
      onSettled: () => {
        // Очищаем локальное хранилище
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        
        // Очищаем состояние Redux
        dispatch(logoutAction());
        
        // Перенаправляем на главную
        navigate('/');
      }
    }
  );

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    logout,
    loading: logoutMutation.isLoading
  };
};