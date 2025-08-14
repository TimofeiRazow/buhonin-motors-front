// src/utils/storage.js
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Специфичные методы для приложения
export const saveSearchFilters = (filters) => {
  setItem('searchFilters', filters);
};

export const getSavedSearchFilters = () => {
  return getItem('searchFilters', {});
};

export const saveUserPreferences = (preferences) => {
  setItem('userPreferences', preferences);
};

export const getUserPreferences = () => {
  return getItem('userPreferences', {
    theme: 'light',
    language: 'ru',
    notifications: true
  });
};

export const saveRecentSearches = (searches) => {
  // Ограничиваем количество сохраненных поисков
  const limitedSearches = searches.slice(0, 10);
  setItem('recentSearches', limitedSearches);
};

export const getRecentSearches = () => {
  return getItem('recentSearches', []);
};

export const addToRecentSearches = (searchQuery) => {
  const recent = getRecentSearches();
  const updated = [searchQuery, ...recent.filter(q => q !== searchQuery)].slice(0, 10);
  saveRecentSearches(updated);
};