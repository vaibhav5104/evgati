// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GOOGLE_LOGIN: '/api/auth/google-login',
    USER: '/api/auth/user',
    USERS: '/api/auth/users'
  },
  STATIONS: {
    BASE: '/api/stations',
    NEAREST: '/api/stations/nearest/search'
  },
  AVAILABILITY: {
    BASE: '/api/availability',
    BOOK: '/api/availability/book',
    MY_REQUESTS: '/api/availability/myrequests'
  },
  ADMIN: {
    PENDING_STATIONS: '/api/admin/stations/pending',
    APPROVE_STATION: '/api/admin/stations',
    REJECT_STATION: '/api/admin/stations'
  }
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  OWNER: 'owner',
  ADMIN: 'admin'
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Station Status
export const STATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'EvGati',
  DESCRIPTION: 'Electric Vehicle Charging Station Booking Platform',
  DEFAULT_LOCATION: {
    LATITUDE: 20.5937,
    LONGITUDE: 78.9629 // India center
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  DATETIME_DISPLAY: 'MMM dd, yyyy HH:mm',
  TIME_DISPLAY: 'HH:mm'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50]
};
