// src/utils/validators.js
import { PHONE_REGEX, EMAIL_REGEX } from './constants';

export const validateRequired = (value, fieldName = 'Поле') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null;
  
  if (!EMAIL_REGEX.test(email)) {
    return 'Некорректный формат email';
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null;
  
  if (!PHONE_REGEX.test(phone)) {
    return 'Некорректный формат номера телефона';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Пароль обязателен';
  }
  
  if (password.length < 6) {
    return 'Пароль должен содержать минимум 6 символов';
  }
  
  if (password.length > 50) {
    return 'Пароль не должен превышать 50 символов';
  }
  
  return null;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Пароли не совпадают';
  }
  return null;
};

export const validatePrice = (price) => {
  if (!price && price !== 0) {
    return 'Цена обязательна';
  }
  
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return 'Цена должна быть числом';
  }
  
  if (numPrice < 0) {
    return 'Цена не может быть отрицательной';
  }
  
  if (numPrice > 999999999) {
    return 'Слишком большая цена';
  }
  
  return null;
};

export const validateYear = (year) => {
  if (!year) return null;
  
  const numYear = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  if (isNaN(numYear)) {
    return 'Год должен быть числом';
  }
  
  if (numYear < 1900) {
    return 'Год не может быть меньше 1900';
  }
  
  if (numYear > currentYear + 1) {
    return 'Год не может быть больше следующего года';
  }
  
  return null;
};

export const validateMileage = (mileage) => {
  if (!mileage && mileage !== 0) return null;
  
  const numMileage = parseInt(mileage);
  
  if (isNaN(numMileage)) {
    return 'Пробег должен быть числом';
  }
  
  if (numMileage < 0) {
    return 'Пробег не может быть отрицательным';
  }
  
  if (numMileage > 9999999) {
    return 'Слишком большой пробег';
  }
  
  return null;
};

export const validateFileUpload = (file) => {
  const { MAX_FILE_SIZE, ALLOWED_TYPES } = require('./constants').FILE_UPLOAD_LIMITS;
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Неподдерживаемый тип файла. Разрешены только изображения.';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return `Размер файла превышает ${MAX_FILE_SIZE / 1024 / 1024}МБ`;
  }
  
  return null;
};

export const validateListingForm = (formData) => {
  const errors = {};
  
  // Обязательные поля
  const titleError = validateRequired(formData.title, 'Заголовок');
  if (titleError) errors.title = titleError;
  
  const priceError = validatePrice(formData.price);
  if (priceError) errors.price = priceError;
  
  const brandError = validateRequired(formData.brand_id, 'Марка');
  if (brandError) errors.brand_id = brandError;
  
  const modelError = validateRequired(formData.model_id, 'Модель');
  if (modelError) errors.model_id = modelError;
  
  const cityError = validateRequired(formData.city_id, 'Город');
  if (cityError) errors.city_id = cityError;
  
  // Валидация атрибутов
  if (formData.attributes) {
    if (formData.attributes.year) {
      const yearError = validateYear(formData.attributes.year);
      if (yearError) errors.year = yearError;
    }
    
    if (formData.attributes.mileage) {
      const mileageError = validateMileage(formData.attributes.mileage);
      if (mileageError) errors.mileage = mileageError;
    }
  }
  
  // Валидация контактов
  if (formData.contact_phone) {
    const phoneError = validatePhone(formData.contact_phone);
    if (phoneError) errors.contact_phone = phoneError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};