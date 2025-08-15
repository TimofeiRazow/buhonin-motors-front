import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';

const SearchFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Вспомогательные функции
  const safeArray = (val) => (Array.isArray(val) ? val : Array.isArray(val?.data) ? val.data : []);
  const mapOptions = (arr, valueKey, labelKey) =>
    safeArray(arr).map((item) => ({
      value: String(item[valueKey]),
      label: String(item[labelKey]),
    }));

  // Загружаем справочные данные
  const { data: brandsRes } = useQuery('brands', () => api.get('/api/cars/brands'));
  const { data: modelsRes } = useQuery(
    ['models', localFilters.brand_id],
    () => api.get(`/api/cars/brands/${localFilters.brand_id}/models`),
    { enabled: !!localFilters.brand_id }
  );
  const { data: citiesRes } = useQuery('cities', () => api.get('/api/locations/cities'));
  const { data: bodyTypesRes } = useQuery('body-types', () => api.get('/api/cars/body-types'));
  const { data: engineTypesRes } = useQuery('engine-types', () => api.get('/api/cars/engine-types'));
  const { data: transmissionsRes } = useQuery('transmissions', () => api.get('/api/cars/transmission-types'));
  const { data: driveTypesRes } = useQuery('drive-types', () => api.get('/api/cars/drive-types'));
  const { data: colorsRes } = useQuery('colors', () => api.get('/api/cars/colors'));

  // Нормализованные options
  const brandOptions = mapOptions(brandsRes?.data?.data ?? brandsRes?.data, 'brand_id', 'brand_name');
  const modelsRaw = modelsRes?.data?.data ?? modelsRes?.data;
  const modelOptions = mapOptions(modelsRaw, 'model_id', 'model_name');
  const cityOptions = mapOptions(citiesRes?.data, 'city_id', 'city_name');
  const bodyTypeOptions = mapOptions(bodyTypesRes?.data, 'body_type_id', 'body_type_name');
  const engineTypeOptions = mapOptions(engineTypesRes?.data, 'engine_type_id', 'engine_type_name');
  const transmissionOptions = mapOptions(transmissionsRes?.data, 'transmission_id', 'transmission_name');
  const driveTypeOptions = mapOptions(driveTypesRes?.data, 'drive_type_id', 'drive_type_name');
  const colorOptions = mapOptions(colorsRes?.data, 'color_id', 'color_name');

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
      ...(field === 'brand_id' ? { model_id: '' } : {}),
    };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => onFilterChange(localFilters);

  const resetFilters = () => {
    const emptyFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const activeFiltersCount = Object.values(localFilters).filter(
    (value) => value !== '' && value !== false && value !== 'false'
  ).length;

  return (
    <div className="relative overflow-visible rounded-2xl border-4 border-orange-600 bg-black">
      {/* Декор — меньше, чтобы не мешал кликам и тексту */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-orange-600" />
      <div className="pointer-events-none absolute right-4 top-4 h-3 w-3 rotate-45 bg-orange-600" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/30" />

      <div className="relative z-10 p-5 md:p-6">
        {/* Заголовок */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-black uppercase tracking-wide text-white">Фильтры</h3>
            <div className="h-0.5 w-12 bg-orange-600" />
            {/* {activeFiltersCount > 0 && (
              <div className="rounded-md border-2 border-black bg-orange-600 px-3 py-1 text-sm font-black text-black">
                {activeFiltersCount} активных
              </div>
            )} */}
          </div>

          {/* <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="relative rounded-lg border-2 border-gray-700 bg-gray-900 px-3 py-2 text-sm font-bold text-white transition-all duration-300 hover:border-black hover:bg-orange-600 hover:text-black"
          >
            {isCollapsed ? 'Развернуть' : 'Свернуть'}
          </button> */}
        </div>

        {/* Поиск */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-black uppercase tracking-wide text-white">🔍 Поиск</label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.q || ''}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              placeholder="Поиск по объявлениям…"
              className="peer w-full rounded-xl border-2 border-gray-700 bg-gray-900 px-4 py-3 pr-12 text-sm md:text-base font-semibold text-white leading-tight tracking-normal placeholder-gray-400 transition-colors duration-300 focus:bg-black focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
            />
            {/* декор слева */}
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <span className="inline-block h-1.5 w-1.5 rounded-sm bg-orange-600" />
            </div>
            {/* иконка справа */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-lg">
              🔍
            </div>
          </div>
        </div>

        {/* Блок фильтров */}
        <div className={`transition-[max-height,opacity] duration-500 ${isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-[4000px] opacity-100'}`}>
          <div className="space-y-5">
            {/* Марка / Модель */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FilterSelectRedesigned
                label="🚗 Марка"
                value={localFilters.brand_id || ''}
                onChange={(value) => handleFilterChange('brand_id', value)}
                options={brandOptions}
                placeholder="Любая марка"
                icon="🚗"
              />
              <FilterSelectRedesigned
                label="🏷️ Модель"
                value={localFilters.model_id || ''}
                onChange={(value) => handleFilterChange('model_id', value)}
                options={modelOptions}
                placeholder="Любая модель"
                disabled={!localFilters.brand_id}
                icon="🏷️"
              />
            </div>

            {/* Город */}
            <FilterSelectRedesigned
              label="📍 Город"
              value={localFilters.city_id || ''}
              onChange={(value) => handleFilterChange('city_id', value)}
              options={cityOptions}
              placeholder="Любой город"
              icon="📍"
            />

            {/* Цена */}
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-wide text-white">💰 Цена, ₸</label>
              <div className="grid grid-cols-2 gap-4">
                <FilterInputRedesigned
                  type="number"
                  value={localFilters.price_from || ''}
                  onChange={(value) => handleFilterChange('price_from', value)}
                  placeholder="От"
                  icon="💰"
                />
                <FilterInputRedesigned
                  type="number"
                  value={localFilters.price_to || ''}
                  onChange={(value) => handleFilterChange('price_to', value)}
                  placeholder="До"
                  icon="💰"
                />
              </div>
            </div>

            {/* Год выпуска */}
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-wide text-white">📅 Год выпуска</label>
              <div className="grid grid-cols-2 gap-4">
                <FilterSelectRedesigned
                  value={localFilters.year_from || ''}
                  onChange={(value) => handleFilterChange('year_from', value)}
                  options={years.map((year) => ({ value: String(year), label: String(year) }))}
                  placeholder="От"
                  icon="📅"
                />
                <FilterSelectRedesigned
                  value={localFilters.year_to || ''}
                  onChange={(value) => handleFilterChange('year_to', value)}
                  options={years.map((year) => ({ value: String(year), label: String(year) }))}
                  placeholder="До"
                  icon="📅"
                />
              </div>
            </div>

            {/* Пробег */}
            <FilterInputRedesigned
              label="🛣️ Пробег до, км"
              type="number"
              value={localFilters.mileage_to || ''}
              onChange={(value) => handleFilterChange('mileage_to', value)}
              placeholder="Максимальный пробег"
              icon="🛣️"
            />

            {/* Характеристики */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FilterSelectRedesigned
                label="🚙 Тип кузова"
                value={localFilters.body_type_id || ''}
                onChange={(value) => handleFilterChange('body_type_id', value)}
                options={bodyTypeOptions}
                placeholder="Любой"
                icon="🚙"
              />
              <FilterSelectRedesigned
                label="⚙️ Тип двигателя"
                value={localFilters.engine_type_id || ''}
                onChange={(value) => handleFilterChange('engine_type_id', value)}
                options={engineTypeOptions}
                placeholder="Любой"
                icon="⚙️"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FilterSelectRedesigned
                label="🔧 Коробка передач"
                value={localFilters.transmission_id || ''}
                onChange={(value) => handleFilterChange('transmission_id', value)}
                options={transmissionOptions}
                placeholder="Любая"
                icon="🔧"
              />
              <FilterSelectRedesigned
                label="🚗 Привод"
                value={localFilters.drive_type_id || ''}
                onChange={(value) => handleFilterChange('drive_type_id', value)}
                options={driveTypeOptions}
                placeholder="Любой"
                icon="🚗"
              />
            </div>

            {/* Цвет */}
            <FilterSelectRedesigned
              label="🎨 Цвет"
              value={localFilters.color_id || ''}
              onChange={(value) => handleFilterChange('color_id', value)}
              options={colorOptions}
              placeholder="Любой"
              icon="🎨"
            />

            {/* Доп. опции */}
            <div className="rounded-xl border-2 border-gray-700 bg-gray-900 p-4">
              <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-white">⭐ Дополнительные опции</h4>
              <div className="space-y-3">
                <FilterCheckboxRedesigned
                  label="VIP объявления"
                  checked={localFilters.featured === 'true'}
                  onChange={(checked) => handleFilterChange('featured', checked ? 'true' : '')}
                  icon="⭐"
                />
                <FilterCheckboxRedesigned
                  label="Срочная продажа"
                  checked={localFilters.urgent === 'true'}
                  onChange={(checked) => handleFilterChange('urgent', checked ? 'true' : '')}
                  icon="🔥"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки */}
<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <button
    onClick={applyFilters}
    className="w-full rounded-xl border-2 border-black bg-orange-600 p-4 text-lg font-black uppercase tracking-wide text-black transition-colors duration-300 hover:border-orange-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/60"
  >
    <span className="relative flex items-center justify-center">🔍 Применить фильтры</span>
  </button>

  <button
    onClick={resetFilters}
    className="w-full rounded-xl border-2 border-gray-800 bg-gray-600 p-4 text-lg font-black uppercase tracking-wide text-white transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
  >
    <span className="relative flex items-center justify-center">🗑️ Сбросить</span>
  </button>
</div>

      </div>
    </div>
  );
};

// SELECT
const FilterSelectRedesigned = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
}) => {
  const safeOptions = Array.isArray(options) ? options : [];
  return (
    <div className="group">
      {label && (
        <label className="mb-2 block text-sm font-black uppercase tracking-wide text-white">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-xl border-2 px-4 py-3 pr-12 text-sm md:text-base
            font-semibold leading-tight tracking-normal text-white transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-orange-500/60
            ${disabled
              ? 'cursor-not-allowed border-gray-600 bg-gray-800 text-gray-500'
              : 'border-gray-700 bg-gray-900 focus:border-orange-500 focus:bg-black'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {safeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {String(option.label)}
            </option>
          ))}
        </select>

        {/* левый декор */}
        <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${disabled ? 'opacity-50' : ''}`}>
          <span className="inline-block h-1.5 w-1.5 rounded-sm bg-orange-600" />
        </div>

        {/* иконка / стрелка справа */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-lg leading-none">
          {icon} <span className="ml-1 align-middle">▾</span>
        </div>
      </div>
    </div>
  );
};

// INPUT
const FilterInputRedesigned = ({ label, type = 'text', value, onChange, placeholder, icon }) => {
  return (
    <div className="group">
      {label && (
        <label className="mb-2 block text-sm font-black uppercase tracking-wide text-white">{label}</label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-gray-700 bg-gray-900 px-4 py-3 pr-12 text-sm md:text-base font-semibold text-white leading-tight tracking-normal placeholder-gray-400 transition-colors duration-300 focus:bg-black focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500"
        />
        {/* левый маркер */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <span className="inline-block h-1.5 w-1.5 rounded-sm bg-orange-600" />
        </div>
        {/* правый значок */}
        {icon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// CHECKBOX
const FilterCheckboxRedesigned = ({ label, checked, onChange, icon }) => {
  return (
    <label className="group flex cursor-pointer items-center gap-4 rounded-lg border border-gray-600 bg-gray-800 p-3 transition-colors duration-300 hover:border-orange-500">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors duration-300 ${
            checked ? 'border-orange-600 bg-orange-600' : 'border-gray-500 bg-gray-700 group-hover:border-orange-500'
          }`}
        >
          {checked && <span className="text-sm font-black text-black">✓</span>}
        </div>
      </div>
      <span className="flex items-center text-sm font-semibold uppercase tracking-wide text-white">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </span>
    </label>
  );
};

export default SearchFilters;
