// hooks/api/useListingDetails.js
const useListingDetails = (listingId) => {
  const listing = useQuery(
    ['listing', listingId],
    () => api.get(`/api/listings/${listingId}`)
  );

  const incrementView = useMutation(
    () => api.post(`/api/listings/${listingId}/view`)
  );

  const toggleFavorite = useMutation(
    () => api.post(`/api/listings/${listingId}/favorite`)
  );

  return { listing, incrementView, toggleFavorite };
};

export default useListingDetails;