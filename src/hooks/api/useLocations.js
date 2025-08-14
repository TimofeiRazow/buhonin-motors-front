// hooks/api/useLocations.js
const useLocations = () => {
  const countries = useQuery('countries', () => api.get('/api/locations/countries'));
  
  const getRegions = (countryId) =>
    useQuery(['regions', countryId],
      () => api.get(`/api/locations/regions?country_id=${countryId}`),
      { enabled: !!countryId }
    );

  const getCities = (regionId) =>
    useQuery(['cities', regionId],
      () => api.get(`/api/locations/regions/${regionId}/cities`),
      { enabled: !!regionId }
    );

  const searchCities = (query) =>
    useQuery(['cities-search', query],
      () => api.get(`/api/locations/cities/search?q=${query}`),
      { enabled: query.length > 2 }
    );

  return { countries, getRegions, getCities, searchCities };
};

export default useLocations;

//