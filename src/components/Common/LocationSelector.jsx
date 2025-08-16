import React, { useState, useEffect } from 'react';
import useLocations from '../../hooks/api/useLocations';

const LocationSelector = ({ value, onChange, level = 'city' }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState(value || '');

  const { countries, useRegions, useCities } = useLocations();
  const regions = useRegions(selectedCountry);
  const cities = useCities(selectedRegion);

  useEffect(() => {
    if (value && cities.data) {
      const city = cities.data.find(c => c.city_id === parseInt(value));
      if (city) {
        setSelectedCountry(city.region?.country_id || '');
        setSelectedRegion(city.region_id || '');
      }
    }
  }, [value, cities.data]);

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedRegion('');
    setSelectedCity('');
    if (level === 'country') {
      onChange(countryId);
    }
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSelectedCity('');
    if (level === 'region') {
      onChange(regionId);
    }
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    if (level === 'city') {
      onChange(cityId);
    }
  };

  return (
    <div className="bg-black p-6 border-4 border-orange-500 relative">
      {/* Заголовок секции */}
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">ВЫБЕРИТЕ</span> ЛОКАЦИЮ
        </h3>
        <div className="w-full h-1 bg-orange-500"></div>
      </div>

      <div className="space-y-6">
        {/* Выбор страны */}
        <div className="relative group">
          <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
            <span className="text-orange-500">●</span> СТРАНА
          </label>
          <div className="relative">
            <select 
              value={selectedCountry} 
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
                         focus:outline-none focus:border-orange-500 focus:bg-orange-100
                         hover:bg-gray-100 transition-all duration-300 cursor-pointer
                         appearance-none"
            >
              <option value="">ВЫБЕРИТЕ СТРАНУ</option>
              {countries?.data?.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
            
            {/* Кастомная стрелка */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] 
                              border-l-transparent border-r-transparent border-t-black"></div>
            </div>
            
            {/* Декоративный элемент */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Выбор региона */}
        {(level === 'region' || level === 'city') && selectedCountry && (
          <div className="relative group">
            <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
              <span className="text-orange-500">●</span> РЕГИОН
            </label>
            <div className="relative">
              <select 
                value={selectedRegion} 
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
                           focus:outline-none focus:border-orange-500 focus:bg-orange-100
                           hover:bg-gray-100 transition-all duration-300 cursor-pointer
                           appearance-none"
              >
                <option value="">ВЫБЕРИТЕ РЕГИОН</option>
                {regions?.data?.map((region) => (
                  <option key={region.region_id} value={region.region_id}>
                    {region.region_name}
                  </option>
                ))}
              </select>
              
              {/* Кастомная стрелка */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] 
                                border-l-transparent border-r-transparent border-t-black"></div>
              </div>
              
              {/* Декоративный элемент */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        )}

        {/* Выбор города */}
        {level === 'city' && selectedRegion && (
          <div className="relative group">
            <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
              <span className="text-orange-500">●</span> ГОРОД
            </label>
            <div className="relative">
              <select 
                value={selectedCity} 
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
                           focus:outline-none focus:border-orange-500 focus:bg-orange-100
                           hover:bg-gray-100 transition-all duration-300 cursor-pointer
                           appearance-none"
              >
                <option value="">ВЫБЕРИТЕ ГОРОД</option>
                {cities?.data?.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
              
              {/* Кастомная стрелка */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] 
                                border-l-transparent border-r-transparent border-t-black"></div>
              </div>
              
              {/* Декоративный элемент */}
              <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        )}

        {/* Индикатор выбранного пути */}
        {(selectedCountry || selectedRegion || selectedCity) && (
          <div className="mt-8 p-4 bg-gray-900 border-2 border-orange-500">
            <h4 className="text-orange-500 font-black text-sm uppercase tracking-wider mb-2">
              ВЫБРАННЫЙ ПУТЬ:
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-white font-bold text-sm">
              {selectedCountry && (
                <>
                  <span className="text-orange-500">
                    {countries?.data?.find(c => c.country_id === parseInt(selectedCountry))?.country_name}
                  </span>
                  {selectedRegion && <span className="text-gray-400">→</span>}
                </>
              )}
              {selectedRegion && (
                <>
                  <span className="text-orange-500">
                    {regions?.data?.find(r => r.region_id === parseInt(selectedRegion))?.region_name}
                  </span>
                  {selectedCity && <span className="text-gray-400">→</span>}
                </>
              )}
              {selectedCity && (
                <span className="text-orange-500">
                  {cities?.data?.find(c => c.city_id === parseInt(selectedCity))?.city_name}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Декоративные элементы в углах */}
      <div className="absolute top-2 left-2 w-4 h-4 border-2 border-orange-500"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-orange-500"></div>
    </div>
  );
};

export default LocationSelector;