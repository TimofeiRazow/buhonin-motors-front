// src/components/Common/LocationSelector.jsx
import React, { useState, useEffect } from 'react';
import { useLocations } from '../../hooks/api/useLocations';

const LocationSelector = ({ value, onChange, level = 'city' }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState(value || '');

  const { countries, getRegions, getCities } = useLocations();
  const regions = getRegions(selectedCountry);
  const cities = getCities(selectedRegion);

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
    <div>
      <div>
        <label>Страна:</label>
        <select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)}>
          <option value="">Выберите страну</option>
          {countries?.data?.map((country) => (
            <option key={country.country_id} value={country.country_id}>
              {country.country_name}
            </option>
          ))}
        </select>
      </div>

      {(level === 'region' || level === 'city') && selectedCountry && (
        <div>
          <label>Регион:</label>
          <select value={selectedRegion} onChange={(e) => handleRegionChange(e.target.value)}>
            <option value="">Выберите регион</option>
            {regions?.data?.map((region) => (
              <option key={region.region_id} value={region.region_id}>
                {region.region_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {level === 'city' && selectedRegion && (
        <div>
          <label>Город:</label>
          <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
            <option value="">Выберите город</option>
            {cities?.data?.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;