import React from 'react';

const Progress = ({ 
  value, 
  max = 100, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  showLabel = true 
}) => {
  const progress = Math.min(Math.max(value, 0), max);
  const percentage = (progress / max) * 100;

  const variantColors = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    info: 'bg-indigo-500'
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div 
            className={`
              w-full 
              bg-gray-200 
              rounded-full 
              overflow-hidden
            `}
          >
            <div 
              className={`
                ${variantColors[variant]} 
                ${sizeClasses[size]} 
                transition-all 
                duration-500 
                ease-in-out
              `}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        {showLabel && (
          <div className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;

