// hooks/api/useHome.js
const useHomePage = () => {
  const featuredListings = useQuery('featured-listings', 
    () => api.get('/api/listings/?featured=true&limit=8')
  );
  
  const popularBrands = useQuery('popular-brands',
    () => api.get('/api/cars/brands?popular=true')
  );
  
  const locations = useQuery('popular-cities',
    () => api.get('/api/locations/cities?popular=true')
  );
};

export default useHomePage;