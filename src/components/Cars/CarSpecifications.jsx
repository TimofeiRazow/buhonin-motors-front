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

  // Группировка характеристик по категориям
  const specifications_groups = [
    {
      title: 'ОСНОВНЫЕ ДАННЫЕ',
      icon: '🚗',
      items: [
        { label: 'МАРКА', value: getBrandName(specifications.brand_id), key: 'brand' },
        { label: 'МОДЕЛЬ', value: getModelName(specifications.model_id), key: 'model' },
        { label: 'ГОД ВЫПУСКА', value: specifications.year, key: 'year' },
        { label: 'ПРОБЕГ', value: specifications.mileage ? `${specifications.mileage.toLocaleString()} КМ` : null, key: 'mileage' },
        { label: 'СОСТОЯНИЕ', value: specifications.condition?.toUpperCase(), key: 'condition' }
      ]
    },
    {
      title: 'ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ',
      icon: '⚙️',
      items: [
        { label: 'ТИП КУЗОВА', value: getBodyTypeName(specifications.body_type_id), key: 'body_type' },
        { label: 'ТИП ДВИГАТЕЛЯ', value: getEngineTypeName(specifications.engine_type_id), key: 'engine_type' },
        { label: 'ОБЪЕМ ДВИГАТЕЛЯ', value: specifications.engine_volume ? `${specifications.engine_volume} Л` : null, key: 'engine_volume' },
        { label: 'МОЩНОСТЬ', value: specifications.power_hp ? `${specifications.power_hp} Л.С.` : null, key: 'power' },
        { label: 'КОРОБКА ПЕРЕДАЧ', value: getTransmissionName(specifications.transmission_id), key: 'transmission' },
        { label: 'ПРИВОД', value: getDriveTypeName(specifications.drive_type_id), key: 'drive_type' }
      ]
    },
    {
      title: 'ДОПОЛНИТЕЛЬНО',
      icon: '📋',
      items: [
        { label: 'ЦВЕТ', value: getColorName(specifications.color_id), key: 'color' },
        { label: 'РАСТАМОЖЕН', value: specifications.customs_cleared !== undefined ? (specifications.customs_cleared ? 'ДА' : 'НЕТ') : null, key: 'customs', boolean: true },
        { label: 'ВОЗМОЖЕН ОБМЕН', value: specifications.exchange_possible !== undefined ? (specifications.exchange_possible ? 'ДА' : 'НЕТ') : null, key: 'exchange', boolean: true },
        { label: 'ВОЗМОЖЕН КРЕДИТ', value: specifications.credit_available !== undefined ? (specifications.credit_available ? 'ДА' : 'НЕТ') : null, key: 'credit', boolean: true }
      ]
    }
  ];

  return (
    <div className="bg-black border-4 border-orange-500 p-6 relative">
      {/* Заголовок */}
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-4">
          <span className="text-orange-500">ХАРАКТЕРИСТИКИ</span> АВТОМОБИЛЯ
        </h3>
        <div className="w-full h-1 bg-orange-500"></div>
      </div>

      {/* Группы характеристик */}
      <div className="space-y-8">
        {specifications_groups.map((group, groupIndex) => {
          // Фильтруем только заполненные характеристики
          const filledItems = group.items.filter(item => item.value && item.value !== 'Не указана' && item.value !== 'Не указан');
          
          if (filledItems.length === 0) return null;

          return (
            <div key={groupIndex} className="bg-gray-900 border-2 border-white p-6">
              {/* Заголовок группы */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.icon}</span>
                <h4 className="text-white font-black text-lg uppercase tracking-wider">
                  {group.title}
                </h4>
                <div className="flex-1 h-1 bg-orange-500 ml-4"></div>
              </div>

              {/* Характеристики в сетке */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filledItems.map((item, index) => (
                  <div key={index} className="bg-black border-2 border-gray-600 p-4 relative group hover:border-orange-500 transition-colors duration-300">
                    {/* Метка */}
                    <div className="text-gray-400 font-black text-xs uppercase tracking-wider mb-2">
                      {item.label}:
                    </div>
                    
                    {/* Значение */}
                    <div className={`font-black text-lg uppercase tracking-wide
                      ${item.boolean 
                        ? item.value === 'ДА' ? 'text-green-400' : 'text-red-400'
                        : 'text-orange-500'
                      }`}
                    >
                      {item.value}
                    </div>

                    {/* Декоративный элемент */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Если нет данных */}
      {specifications_groups.every(group => 
        group.items.filter(item => item.value && item.value !== 'Не указана' && item.value !== 'Не указан').length === 0
      ) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h4 className="text-white font-black text-xl uppercase tracking-wider mb-2">
            ХАРАКТЕРИСТИКИ НЕ УКАЗАНЫ
          </h4>
          <p className="text-gray-400 font-bold uppercase text-sm">
            ДАННЫЕ ОТСУТСТВУЮТ
          </p>
        </div>
      )}

      {/* Декоративные элементы */}
      <div className="absolute top-2 left-2 w-6 h-6 border-2 border-orange-500"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 bg-orange-500"></div>
    </div>
  );
};

export default CarSpecifications;