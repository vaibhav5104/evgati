import React, { useState } from 'react';

const Tooltip = ({ 
  children, 
  text, 
  position = 'top', 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2'
  };

  const arrowPositionClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 rotate-180',
    bottom: 'top-0 left-1/2 -translate-x-1/2',
    left: 'right-0 top-1/2 -translate-y-1/2 rotate-90',
    right: 'left-0 top-1/2 -translate-y-1/2 -rotate-90'
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div 
          role="tooltip"
          className={`
            absolute z-50 
            ${positionClasses[position]}
            px-3 py-2 
            bg-gray-800 
            text-white 
            text-sm 
            rounded-lg 
            shadow-lg 
            transition-all 
            duration-300 
            ease-in-out
            opacity-100
            pointer-events-none
          `}
        >
          {text}
          
          {/* Tooltip Arrow */}
          <div 
            className={`
              absolute 
              w-0 h-0 
              border-l-8 border-r-8 border-t-8 
              border-l-transparent 
              border-r-transparent 
              border-t-gray-800
              ${arrowPositionClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;

