import { VALIDATION_RULES } from './constants';

/**
 * Validation utilities
 */

// Validate email format
export const isValidEmail = (email) => {
  if (!email) return false;
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
  if (!password) return false;
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

// Validate phone number format
export const isValidPhone = (phone) => {
  if (!phone) return false;
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
};

// Validate required field
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Validate name (letters, spaces, hyphens, apostrophes)
export const isValidName = (name) => {
  if (!name) return false;
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

// Validate coordinates
export const isValidLatitude = (lat) => {
  const latitude = parseFloat(lat);
  return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
};

export const isValidLongitude = (lng) => {
  const longitude = parseFloat(lng);
  return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
};

// Validate station data
export const validateStationData = (station) => {
  const errors = {};
  
  if (!isRequired(station.name)) {
    errors.name = 'Station name is required';
  }
  
  if (!station.location) {
    errors.location = 'Location is required';
  } else {
    if (!isRequired(station.location.address)) {
      errors.address = 'Address is required';
    }
    
    if (!isValidLatitude(station.location.latitude)) {
      errors.latitude = 'Valid latitude is required';
    }
    
    if (!isValidLongitude(station.location.longitude)) {
      errors.longitude = 'Valid longitude is required';
    }
  }
  
  if (!station.totalPorts || station.totalPorts < 1) {
    errors.totalPorts = 'At least 1 port is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate booking data
export const validateBookingData = (booking) => {
  const errors = {};
  
  if (!isRequired(booking.stationId)) {
    errors.stationId = 'Station ID is required';
  }
  
  if (!booking.portId || booking.portId < 1) {
    errors.portId = 'Valid port number is required';
  }
  
  if (!booking.startTime) {
    errors.startTime = 'Start time is required';
  }
  
  if (!booking.endTime) {
    errors.endTime = 'End time is required';
  }
  
  if (booking.startTime && booking.endTime) {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    
    if (start >= end) {
      errors.endTime = 'End time must be after start time';
    }
    
    if (start <= new Date()) {
      errors.startTime = 'Start time must be in the future';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user registration data
export const validateRegistrationData = (user) => {
  const errors = {};
  
  if (!isValidName(user.name)) {
    errors.name = 'Valid name is required';
  }
  
  if (!isValidEmail(user.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!isValidPassword(user.password)) {
    errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate user login data
export const validateLoginData = (credentials) => {
  const errors = {};
  
  if (!isValidEmail(credentials.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!isRequired(credentials.password)) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// General form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.message || `${field} is required`;
      return;
    }
    
    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = fieldRules.message || 'Invalid email format';
      return;
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `Minimum ${fieldRules.minLength} characters required`;
      return;
    }
    
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || `Maximum ${fieldRules.maxLength} characters allowed`;
      return;
    }
    
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || 'Invalid format';
      return;
    }
    
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};