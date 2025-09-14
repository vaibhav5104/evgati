import React, { useState } from 'react';
import Button from './Button';

const DateTimePicker = ({ 
  value, 
  onChange, 
  min, 
  max, 
  className = '',
  label = 'Select Date and Time',
  required = false 
}) => {
  const [dateTime, setDateTime] = useState(value || '');

  const handleChange = (e) => {
    const newDateTime = e.target.value;
    setDateTime(newDateTime);
    onChange?.(newDateTime);
  };

  const clearDateTime = () => {
    setDateTime('');
    onChange?.('');
  };

  return (
    <div className={`relative ${className}`}>
      <label 
        htmlFor="datetime-picker" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          type="datetime-local"
          id="datetime-picker"
          value={dateTime}
          onChange={handleChange}
          min={min}
          max={max}
          required={required}
          className="
            block w-full 
            border border-gray-300 rounded-lg 
            px-3 py-2 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-gray-900 
            placeholder-gray-400
          "
        />
        
        {dateTime && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="
              absolute right-2 top-1/2 transform -translate-y-1/2
              text-gray-400 hover:text-gray-600
            "
            onClick={clearDateTime}
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </Button>
        )}
      </div>

      {dateTime && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {new Date(dateTime).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

