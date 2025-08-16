import React from 'react';
import { useCars } from '../../hooks/api/useCars';

const ModelSelector = ({ brandId, value, onChange, placeholder = "Выберите модель" }) => {
  const { useModels } = useCars();
  const { data: models, isLoading } = useModels(brandId);

  const isDisabled = !brandId || isLoading;

  return (
    <div className="relative group">
      <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
        <span className="text-orange-500">●</span> МОДЕЛЬ АВТОМОБИЛЯ
      </label>
      
      <div className="relative">
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className={`
            w-full border-4 px-4 py-4 font-black uppercase tracking-wide
            focus:outline-none transition-all duration-300 appearance-none
            ${isDisabled 
              ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-black text-black focus:border-orange-500 focus:bg-orange-100 hover:bg-gray-100 cursor-pointer'
            }
          `}
        >
          <option value="">
            {!brandId 
              ? 'СНАЧАЛА ВЫБЕРИТЕ МАРКУ'
              : isLoading 
                ? 'ЗАГРУЗКА МОДЕЛЕЙ...'
                : placeholder.toUpperCase()
            }
          </option>
          {models?.data?.map((model) => (
            <option key={model.model_id} value={model.model_id}>
              {model.model_name.toUpperCase()}
            </option>
          ))}
        </select>
        
        {/* Кастомная стрелка */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className={`w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent
              ${isDisabled ? 'border-t-gray-400' : 'border-t-black'}
            `}></div>
          )}
        </div>
        
        {/* Декоративный элемент */}
        <div className={`absolute top-2 right-2 w-3 h-3 transition-opacity
          ${isDisabled 
            ? 'bg-gray-600 opacity-50' 
            : 'bg-orange-500 opacity-50 group-hover:opacity-100'
          }
        `}></div>
      </div>

      {/* Предупреждение если марка не выбрана */}
      {!brandId && (
        <div className="mt-3 p-3 bg-gray-800 border-2 border-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-black">⚠</span>
            <span className="text-gray-400 font-bold text-xs uppercase tracking-wide">
              СНАЧАЛА ВЫБЕРИТЕ МАРКУ АВТОМОБИЛЯ
            </span>
          </div>
        </div>
      )}

      {/* Индикатор выбранной модели */}
      {value && models?.data && (
        <div className="mt-3 p-2 bg-gray-900 border-2 border-orange-500">
          <div className="text-orange-500 font-black text-xs uppercase tracking-wider">
            ВЫБРАНО: {models.data.find(m => m.model_id === parseInt(value))?.model_name}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;