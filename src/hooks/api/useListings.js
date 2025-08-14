// hooks/api/useListings.js
const useListingsSearch = (filters, page = 1) => {
  return useQuery(
    ['listings', filters, page],
    () => api.get('/api/listings/', { 
      params: { ...filters, page, limit: 20 }
    }),
    { keepPreviousData: true }
  );
};

// Для фильтров
const useCarAttributes = () => ({
  brands: useQuery('car-brands', () => api.get('/api/cars/brands')),
  bodyTypes: useQuery('body-types', () => api.get('/api/cars/body-types')),
  engineTypes: useQuery('engine-types', () => api.get('/api/cars/engine-types')),
  colors: useQuery('colors', () => api.get('/api/cars/colors'))
});

export { useListingsSearch, useCarAttributes };