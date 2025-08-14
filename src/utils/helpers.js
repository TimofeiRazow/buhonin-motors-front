// src/utils/helpers.js
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

export const getImageUrl = (imagePath, size = 'medium') => {
  if (!imagePath) return '/placeholder-image.jpg';
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const baseUrl = process.env.REACT_APP_MEDIA_URL || '/media';
  return `${baseUrl}/${size}/${imagePath}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

export const scrollToTop = (smooth = true) => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto'
  });
};

export const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

export const getDeviceType = () => {
  const width = window.innerWidth;
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const formatSearchFilters = (filters) => {
  const formatted = { ...filters };
  
  // Удаляем пустые значения
  Object.keys(formatted).forEach(key => {
    if (formatted[key] === '' || formatted[key] === null || formatted[key] === undefined) {
      delete formatted[key];
    }
  });
  
  // Преобразуем числовые значения
  if (formatted.price_from) formatted.price_from = parseInt(formatted.price_from);
  if (formatted.price_to) formatted.price_to = parseInt(formatted.price_to);
  if (formatted.year_from) formatted.year_from = parseInt(formatted.year_from);
  if (formatted.year_to) formatted.year_to = parseInt(formatted.year_to);
  if (formatted.mileage_from) formatted.mileage_from = parseInt(formatted.mileage_from);
  if (formatted.mileage_to) formatted.mileage_to = parseInt(formatted.mileage_to);
  
  return formatted;
};
