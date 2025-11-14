import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Bell,
  Inbox,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import NotificationItem from "./NotificationItem";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const NotificationDropdown = ({ isOpen, onClose, notifications, loading, onNotificationRead }) => {
  const dropdownRef = useRef(null);
  const [expanded, setExpanded] = useState(true);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(0);

  // Update local state when props change
  useEffect(() => {
    setLocalNotifications(notifications);
    setLocalUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Handle "Mark all as read"
  const handleMarkAllRead = async (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    
    try {
      await fetch(`${API_BASE_URL}/api/notifications/read/all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Update local state immediately for better UX
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setLocalUnreadCount(0);
      
      // Notify parent to refresh
      onNotificationRead?.();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Handle single notification read
  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      // Update local state immediately
      setLocalNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setLocalUnreadCount((prev) => Math.max(prev - 1, 0));
      
      // Notify parent to refresh
      onNotificationRead?.();
    } catch (error) {
      console.error("Error marking notification as read:", error.message);
    }
  };

  // Handle notification actions (approve/reject)
  const handleNotificationAction = async () => {
    // Refresh notifications after action
    onNotificationRead?.();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className=" absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-xl overflow-hidden z-90 border border-gray-200"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing dropdown
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Notifications</h3>
              {localUnreadCount > 0 && (
                <p className="text-blue-100 text-xs">
                  {localUnreadCount} unread notification
                  {localUnreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Mark all read */}
      {localUnreadCount > 0 && (
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 z-40 font-medium hover:underline transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications list */}
      <div className="max-h-[500px] overflow-y-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="w-full px-5 py-3 flex items-center z-99 justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <span className="flex items-center gap-2">
            All Notifications
            {localUnreadCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">
                {localUnreadCount}
              </span>
            )}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {expanded && (
          <div className="divide-y divide-gray-100">
          
            {loading ? (
              <div className="text-center py-8 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm">Loading notifications...</p>
              </div>
            ) : localNotifications.length > 0 ? (
              [...localNotifications].reverse().map((n) => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onAction={handleNotificationAction}
                  onMarkAsRead={() => handleMarkAsRead(n._id)}
                />
              ))

            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-5">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-500 text-center">
                  We'll notify you when something arrives
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;