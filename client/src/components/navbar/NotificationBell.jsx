import React from 'react';
import { Bell } from 'lucide-react';

const NotificationBell = ({ count, hasNew, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${className}`}
      aria-label="Notifications"
    >
      {/* Bell Icon */}
      <Bell 
        className={`w-5 h-5 ${hasNew ? 'text-blue-600' : 'text-gray-600'} transition-colors`}
      />
      
      {/* Notification Badge */}
      {count > 0 && (
        <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full ${hasNew ? 'animate-pulse' : ''}`}>
          {count > 99 ? '99+' : count}
        </span>
      )}
      
      {/* New notification indicator dot */}
      {hasNew && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
      )}
    </button>
  );
};

export default NotificationBell;