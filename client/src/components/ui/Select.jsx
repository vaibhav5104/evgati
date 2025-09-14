import React, { forwardRef } from 'react';

const Select = forwardRef(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'block appearance-none w-full bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2';
  
  // Variant styles
  const variantStyles = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50',
    primary: 'border-blue-500 focus:border-blue-600 focus:ring-blue-600/50',
    secondary: 'border-gray-500 focus:border-gray-600 focus:ring-gray-600/50',
    success: 'border-green-500 focus:border-green-600 focus:ring-green-600/50',
    danger: 'border-red-500 focus:border-red-600 focus:ring-red-600/50'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  // Combine styles
  const combinedClassName = `
    ${baseStyles} 
    ${variantStyles[variant] || variantStyles.default}
    ${sizeStyles[size] || sizeStyles.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
    relative
  `;

  return (
    <div className="relative">
      <select
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg 
          className="fill-current h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20"
        >
          <path 
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" 
          />
        </svg>
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

