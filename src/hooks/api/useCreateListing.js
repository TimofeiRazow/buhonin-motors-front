// hooks/api/useCreateListing.js
const useCreateListing = () => {
  const createListing = useMutation(
    (data) => api.post('/api/listings/', data),
    {
      onSuccess: (data) => {
        navigate(`/listings/${data.id}`);
      }
    }
  );

  const uploadImages = useMutation(
    (files) => api.post('/api/media/multiple-upload', files)
  );

  return { createListing, uploadImages };
};

// Для выбора автомобиля
const useCarSelection = () => {
  const brands = useQuery('brands', () => api.get('/api/cars/brands'));
  
  const useModels = (brandId) => 
    useQuery(['models', brandId], 
      () => api.get(`/api/cars/brands/${brandId}/models`),
      { enabled: !!brandId }
    );
  
  const useGenerations = (modelId) =>
    useQuery(['generations', modelId],
      () => api.get(`/api/cars/models/${modelId}/generations`),
      { enabled: !!modelId }
    );
};

export { useCreateListing, useCarSelection };