// hooks/api/useProfile.js
const useProfile = () => {
  const profile = useQuery('profile', () => api.get('/api/users/profile'));
  const stats = useQuery('user-stats', () => api.get('/api/users/stats'));
  
  const updateProfile = useMutation(
    (data) => api.put('/api/users/profile', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profile');
      }
    }
  );

  return { profile, stats, updateProfile };
};

const useMyListings = () => {
  return useQuery('my-listings', () => api.get('/api/listings/my'));
};

export { useProfile, useMyListings };