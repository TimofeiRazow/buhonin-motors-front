// src/hooks/api/useCars.js
import { useQuery } from 'react-query';
import api from '../../services/api';

export const useCars = () => {
  const brands = useQuery('car-brands', () => api.get('/api/cars/brands'));
  
  const bodyTypes = useQuery('body-types', () => api.get('/api/cars/body-types'));
  
  const engineTypes = useQuery('engine-types', () => api.get('/api/cars/engine-types'));
  
  const transmissionTypes = useQuery('transmission-types', () => api.get('/api/cars/transmission-types'));
  
  const driveTypes = useQuery('drive-types', () => api.get('/api/cars/drive-types'));
  
  const colors = useQuery('colors', () => api.get('/api/cars/colors'));
  
  const features = useQuery('car-features', () => api.get('/api/cars/features'));

  const useModels = (brandId) => {
    return useQuery(
      ['car-models', brandId],
      () => api.get(`/api/cars/brands/${brandId}/models`),
      { 
        enabled: !!brandId,
        staleTime: 5 * 60 * 1000 // 5 минут
      }
    );
  };

  const useGenerations = (modelId) => {
    return useQuery(
      ['car-generations', modelId],
      () => api.get(`/api/cars/models/${modelId}/generations`),
      { 
        enabled: !!modelId,
        staleTime: 5 * 60 * 1000
      }
    );
  };

  const useSearchCars = (query) => {
    return useQuery(
      ['cars-search', query],
      () => api.get(`/api/cars/search?q=${query}`),
      {
        enabled: query && query.length > 2,
        staleTime: 1 * 60 * 1000
      }
    );
  };

  return {
    brands,
    bodyTypes,
    engineTypes,
    transmissionTypes,
    driveTypes,
    colors,
    features,
    useModels,
    useGenerations,
    useSearchCars
  };
};