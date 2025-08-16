import React from 'react';
import { useCars } from '../../hooks/api/useCars';

const BrandSelector = ({ value, onChange, placeholder = "Выберите марку" }) => {
  const { brands, isLoading } = useCars();

  return (
    <div className="relative group">
      <label className="block text-white font-black text-sm uppercase tracking-wider mb-3">
        <span className="text-orange-500">●</span> МАРКА АВТОМОБИЛЯ
      </label>
      
      <div className="relative">
        <select 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className={`
            w-full bg-white border-4 border-black px-4 py-4 font-black text-black uppercase tracking-wide
            focus:outline-none focus:border-orange-500 focus:bg-orange-100
            hover:bg-gray-100 transition-all duration-300 cursor-pointer appearance-none
            ${isLoading ? 'bg-gray-200 cursor-not-allowed text-gray-500' : ''}
          `}
        >
          <option value="">{isLoading ? 'ЗАГРУЗКА МАРОК...' : placeholder.toUpperCase()}</option>
          {brands?.data?.map((brand) => (
            <option key={brand.brand_id} value={brand.brand_id}>
              {brand.brand_name.toUpperCase()}
            </option>
          ))}
        </select>
        
        {/* Кастомная стрелка */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] 
                            border-l-transparent border-r-transparent border-t-black"></div>
          )}
        </div>
        
        {/* Декоративный элемент */}
        <div className={`absolute top-2 right-2 w-3 h-3 transition-opacity
          ${isLoading ? 'bg-gray-400 opacity-50' : 'bg-orange-500 opacity-50 group-hover:opacity-100'}
        `}></div>
      </div>

      {/* Индикатор выбранного бренда */}
      {value && brands?.data && (
        <div className="mt-3 p-2 bg-gray-900 border-2 border-orange-500">
          <div className="text-orange-500 font-black text-xs uppercase tracking-wider">
            ВЫБРАНО: {brands.data.find(b => b.brand_id === parseInt(value))?.brand_name}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;