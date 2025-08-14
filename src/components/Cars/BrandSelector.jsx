// src/components/Cars/BrandSelector.jsx
import React from 'react';
import { useCars } from '../../hooks/api/useCars';

const BrandSelector = ({ value, onChange, placeholder = "Выберите марку" }) => {
  const { brands, isLoading } = useCars();

  if (isLoading) {
    return <select disabled><option>Загрузка марок...</option></select>;
  }

  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {brands?.data?.map((brand) => (
        <option key={brand.brand_id} value={brand.brand_id}>
          {brand.brand_name}
        </option>
      ))}
    </select>
  );
};

export default BrandSelector;
