// src/components/Cars/ModelSelector.jsx
import React from 'react';
import { useCars } from '../../hooks/api/useCars';

const ModelSelector = ({ brandId, value, onChange, placeholder = "Выберите модель" }) => {
  const { useModels } = useCars();
  const { data: models, isLoading } = useModels(brandId);

  if (!brandId) {
    return (
      <select disabled>
        <option>Сначала выберите марку</option>
      </select>
    );
  }

  if (isLoading) {
    return <select disabled><option>Загрузка моделей...</option></select>;
  }

  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {models?.data?.map((model) => (
        <option key={model.model_id} value={model.model_id}>
          {model.model_name}
        </option>
      ))}
    </select>
  );
};

export default ModelSelector;
