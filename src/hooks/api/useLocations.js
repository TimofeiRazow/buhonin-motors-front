import { useQuery } from 'react-query';
import api from '../../services/api';

// hooks/api/useLocations.js
const useLocations = () => {
  const countries = useQuery('countries', () => api.get('/api/locations/countries'));
  
  const useRegions = (countryId) =>
    useQuery(['regions', countryId],
      () => api.get(`/api/locations/regions?country_id=${countryId}`),
      { enabled: !!countryId }
    );

  const useCities = (regionId) =>
    useQuery(['cities', regionId],
      () => api.get(`/api/locations/regions/${regionId}/cities`),
      { enabled: !!regionId }
    );

  const useSearchCities = (query) =>
    useQuery(['cities-search', query],
      () => api.get(`/api/locations/cities/search?q=${query}`),
      { enabled: query.length > 2 }
    );

  return { countries, useRegions, useCities, useSearchCities };
};

export default useLocations;

//