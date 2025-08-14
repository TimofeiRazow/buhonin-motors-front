// src/components/Cars/CarAttributes.jsx
import React from 'react';
import { useCars } from '../../hooks/api/useCars';

const CarAttributes = ({ attributes, onChange }) => {
  const { 
    bodyTypes, 
    engineTypes, 
    transmissionTypes, 
    driveTypes, 
    colors 
  } = useCars();

  const handleAttributeChange = (key, value) => {
    onChange({
      ...attributes,
      [key]: value
    });
  };

  return (
    <div>
      <h3>Характеристики автомобиля</h3>
      
      <div>
        <label>Год выпуска:</label>
        <input
          type="number"
          min="1980"
          max={new Date().getFullYear() + 1}
          value={attributes.year || ''}
          onChange={(e) => handleAttributeChange('year', e.target.value)}
        />
      </div>

      <div>
        <label>Пробег (км):</label>
        <input
          type="number"
          min="0"
          value={attributes.mileage || ''}
          onChange={(e) => handleAttributeChange('mileage', e.target.value)}
        />
      </div>

      <div>
        <label>Состояние:</label>
        <select
          value={attributes.condition || ''}
          onChange={(e) => handleAttributeChange('condition', e.target.value)}
        >
          <option value="">Выберите состояние</option>
          <option value="new">Новый</option>
          <option value="excellent">Отличное</option>
          <option value="good">Хорошее</option>
          <option value="fair">Удовлетворительное</option>
          <option value="poor">Требует ремонта</option>
        </select>
      </div>

      <div>
        <label>Тип кузова:</label>
        <select
          value={attributes.body_type_id || ''}
          onChange={(e) => handleAttributeChange('body_type_id', e.target.value)}
        >
          <option value="">Выберите тип кузова</option>
          {bodyTypes?.data?.map((type) => (
            <option key={type.body_type_id} value={type.body_type_id}>
              {type.body_type_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Тип двигателя:</label>
        <select
          value={attributes.engine_type_id || ''}
          onChange={(e) => handleAttributeChange('engine_type_id', e.target.value)}
        >
          <option value="">Выберите тип двигателя</option>
          {engineTypes?.data?.map((type) => (
            <option key={type.engine_type_id} value={type.engine_type_id}>
              {type.engine_type_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Объем двигателя (л):</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={attributes.engine_volume || ''}
          onChange={(e) => handleAttributeChange('engine_volume', e.target.value)}
        />
      </div>

      <div>
        <label>Коробка передач:</label>
        <select
          value={attributes.transmission_id || ''}
          onChange={(e) => handleAttributeChange('transmission_id', e.target.value)}
        >
          <option value="">Выберите КПП</option>
          {transmissionTypes?.data?.map((type) => (
            <option key={type.transmission_id} value={type.transmission_id}>
              {type.transmission_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Привод:</label>
        <select
          value={attributes.drive_type_id || ''}
          onChange={(e) => handleAttributeChange('drive_type_id', e.target.value)}
        >
          <option value="">Выберите привод</option>
          {driveTypes?.data?.map((type) => (
            <option key={type.drive_type_id} value={type.drive_type_id}>
              {type.drive_type_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Цвет:</label>
        <select
          value={attributes.color_id || ''}
          onChange={(e) => handleAttributeChange('color_id', e.target.value)}
        >
          <option value="">Выберите цвет</option>
          {colors?.data?.map((color) => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Мощность (л.с.):</label>
        <input
          type="number"
          min="0"
          value={attributes.power_hp || ''}
          onChange={(e) => handleAttributeChange('power_hp', e.target.value)}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={attributes.customs_cleared || false}
            onChange={(e) => handleAttributeChange('customs_cleared', e.target.checked)}
          />
          Растаможен
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={attributes.exchange_possible || false}
            onChange={(e) => handleAttributeChange('exchange_possible', e.target.checked)}
          />
          Возможен обмен
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={attributes.credit_available || false}
            onChange={(e) => handleAttributeChange('credit_available', e.target.checked)}
          />
          Возможен кредит
        </label>
      </div>
    </div>
  );
};

export default CarAttributes;