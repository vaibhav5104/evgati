import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  trigger, 
  children, 
  className = '', 
  position = 'bottom-right',
  onOpen,
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const positionClasses = {
    'top-left': 'origin-top-left left-0 -top-2 -translate-y-full',
    'top-right': 'origin-top-right right-0 -top-2 -translate-y-full',
    'bottom-left': 'origin-bottom-left left-0 top-full',
    'bottom-right': 'origin-bottom-right right-0 top-full'
  };

  const toggleDropdown = () => {
    setIsOpen(prev => {
      const newState = !prev;
      newState ? onOpen?.() : onClose?.();
      return newState;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={triggerRef} onClick={toggleDropdown}>
        {trigger}
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className={`
            absolute z-50 
            ${positionClasses[position]}
            w-56 
            mt-2 
            bg-white 
            rounded-lg 
            shadow-xl 
            border 
            border-gray-200
            transition-all 
            duration-300 
            ease-in-out 
            scale-100 
            opacity-100
          `}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ 
  children, 
  onClick, 
  icon, 
  className = '',
  disabled = false 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full 
        text-left 
        px-4 py-2 
        text-sm 
        text-gray-700 
        hover:bg-gray-100 
        hover:text-gray-900 
        focus:outline-none 
        focus:bg-gray-100 
        flex items-center
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </button>
  );
};

Dropdown.Item = DropdownItem;

export default Dropdown;

