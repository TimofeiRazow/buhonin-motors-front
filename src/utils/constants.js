// src/utils/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const LISTING_STATUSES = {
  DRAFT: 'draft',
  MODERATION: 'moderation',
  ACTIVE: 'active',
  SOLD: 'sold',
  ARCHIVED: 'archived',
  REJECTED: 'rejected',
  EXPIRED: 'expired'
};

export const USER_TYPES = {
  REGULAR: 'regular',
  PRO: 'pro',
  DEALER: 'dealer',
  ADMIN: 'admin'
};

export const PAYMENT_METHODS = {
  CARD: 'card',
  QIWI: 'qiwi',
  KASPI: 'kaspi',
  PAYPAL: 'paypal'
};

export const CURRENCIES = {
  KZT: { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге' },
  USD: { code: 'USD', symbol: '$', name: 'Доллар США' },
  EUR: { code: 'EUR', symbol: '€', name: 'Евро' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Российский рубль' }
};

export const CAR_CONDITIONS = [
  { value: 'new', label: 'Новый' },
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
  { value: 'poor', label: 'Требует ремонта' }
];

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  SYSTEM: 'system',
  MEDIA: 'media',
  ACTION: 'action'
};

export const NOTIFICATION_CHANNELS = {
  PUSH: 'push',
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in_app'
};

export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 16 * 1024 * 1024, // 16MB
  MAX_FILES_COUNT: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
};

export const PAGINATION_LIMITS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const SEARCH_DEBOUNCE_DELAY = 300;

export const PHONE_REGEX = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
