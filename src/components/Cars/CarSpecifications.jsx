// src/components/Cars/CarSpecifications.jsx
import React from 'react';

const CarSpecifications = ({ specifications, brands, models, bodyTypes, engineTypes, transmissionTypes, driveTypes, colors }) => {
  const getBrandName = (brandId) => {
    const brand = brands?.find(b => b.brand_id === parseInt(brandId));
    return brand?.brand_name || 'Не указана';
  };

  const getModelName = (modelId) => {
    const model = models?.find(m => m.model_id === parseInt(modelId));
    return model?.model_name || 'Не указана';
  };

  const getBodyTypeName = (bodyTypeId) => {
    const bodyType = bodyTypes?.find(bt => bt.body_type_id === parseInt(bodyTypeId));
    return bodyType?.body_type_name || 'Не указан';
  };

  const getEngineTypeName = (engineTypeId) => {
    const engineType = engineTypes?.find(et => et.engine_type_id === parseInt(engineTypeId));
    return engineType?.engine_type_name || 'Не указан';
  };

  const getTransmissionName = (transmissionId) => {
    const transmission = transmissionTypes?.find(t => t.transmission_id === parseInt(transmissionId));
    return transmission?.transmission_name || 'Не указана';
  };

  const getDriveTypeName = (driveTypeId) => {
    const driveType = driveTypes?.find(dt => dt.drive_type_id === parseInt(driveTypeId));
    return driveType?.drive_type_name || 'Не указан';
  };

  const getColorName = (colorId) => {
    const color = colors?.find(c => c.color_id === parseInt(colorId));
    return color?.color_name || 'Не указан';
  };

  return (
    <div>
      <h3>Характеристики</h3>
      
      <div>
        <strong>Марка:</strong> {getBrandName(specifications.brand_id)}
      </div>
      
      <div>
        <strong>Модель:</strong> {getModelName(specifications.model_id)}
      </div>
      
      {specifications.year && (
        <div>
          <strong>Год выпуска:</strong> {specifications.year}
        </div>
      )}
      
      {specifications.mileage && (
        <div>
          <strong>Пробег:</strong> {specifications.mileage.toLocaleString()} км
        </div>
      )}
      
      {specifications.condition && (
        <div>
          <strong>Состояние:</strong> {specifications.condition}
        </div>
      )}
      
      {specifications.body_type_id && (
        <div>
          <strong>Тип кузова:</strong> {getBodyTypeName(specifications.body_type_id)}
        </div>
      )}
      
      {specifications.engine_type_id && (
        <div>
          <strong>Тип двигателя:</strong> {getEngineTypeName(specifications.engine_type_id)}
        </div>
      )}
      
      {specifications.engine_volume && (
        <div>
          <strong>Объем двигателя:</strong> {specifications.engine_volume} л
        </div>
      )}
      
      {specifications.power_hp && (
        <div>
          <strong>Мощность:</strong> {specifications.power_hp} л.с.
        </div>
      )}
      
      {specifications.transmission_id && (
        <div>
          <strong>Коробка передач:</strong> {getTransmissionName(specifications.transmission_id)}
        </div>
      )}
      
      {specifications.drive_type_id && (
        <div>
          <strong>Привод:</strong> {getDriveTypeName(specifications.drive_type_id)}
        </div>
      )}
      
      {specifications.color_id && (
        <div>
          <strong>Цвет:</strong> {getColorName(specifications.color_id)}
        </div>
      )}
      
      {specifications.customs_cleared !== undefined && (
        <div>
          <strong>Растаможен:</strong> {specifications.customs_cleared ? 'Да' : 'Нет'}
        </div>
      )}
      
      {specifications.exchange_possible !== undefined && (
        <div>
          <strong>Возможен обмен:</strong> {specifications.exchange_possible ? 'Да' : 'Нет'}
        </div>
      )}
      
      {specifications.credit_available !== undefined && (
        <div>
          <strong>Возможен кредит:</strong> {specifications.credit_available ? 'Да' : 'Нет'}
        </div>
      )}
    </div>
  );
};

export default CarSpecifications;