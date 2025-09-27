import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Building, 
  User, 
  Zap,
  ChevronRight 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ 
  type, 
  title, 
  message, 
  time, 
  status, 
  onAction, 
  actions = [],
  onClick 
}) => {
  // Get icon based on notification type and status
  const getIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'accepted':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'station':
        return <Building className="w-5 h-5 text-purple-500" />;
      case 'user':
        return <User className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'alert':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedTime = time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : '';

  return (
    <div 
      className="flex items-start p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-b border-gray-100 last:border-b-0"
      onClick={onClick}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {message}
            </p>
            
            {/* Time and Status */}
            <div className="flex items-center gap-3 mt-2">
              {formattedTime && (
                <span className="text-xs text-gray-500">
                  {formattedTime}
                </span>
              )}
              {status && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(action.type);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      action.variant === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : action.variant === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : action.variant === 'danger'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;