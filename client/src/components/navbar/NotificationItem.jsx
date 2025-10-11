import React, { useEffect, useState } from "react";
import { Bell, Circle, Check, XCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const NotificationItem = ({ notification, onAction, onMarkAsRead }) => {
  const [loading, setLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);
  const [isStillPending, setIsStillPending] = useState(true);

  const getNotificationIcon = (type) => {
    const iconClasses = "w-5 h-5";
    switch (type) {
      case "booking":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className={`${iconClasses} text-blue-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case "station":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <svg className={`${iconClasses} text-green-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case "system":
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <svg className={`${iconClasses} text-purple-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Bell className={`${iconClasses} text-gray-600`} />
          </div>
        );
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  // Check if booking/station is still pending
  useEffect(() => {
    const checkPending = async () => {
      try {
        if (notification.type === "station" && notification.relatedId) {
          const res = await fetch(`${API_BASE_URL}/api/stations/${notification.relatedId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = await res.json();
          setIsStillPending(data.status === "pending");
        } else if (notification.type === "booking" && notification.stationId && notification.relatedId) {
          const res = await fetch(`${API_BASE_URL}/api/availability/${notification.stationId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const data = await res.json();
          const booking = data.bookings?.find(b => b._id === notification.relatedId);
          setIsStillPending(booking?.status === "pending");
        }
      } catch (err) {
        console.error("Error checking pending status:", err);
        setIsStillPending(false);
      }
    };

    if (notification.relatedId) {
      checkPending();
    }
  }, [notification]);

  const handleApproveBooking = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!notification.stationId || !notification.relatedId || loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/availability/${notification.stationId}/approve/${notification.relatedId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ownerMessage: "Your booking has been approved!" }),
        }
      );

      if (response.ok) {
        setActionTaken("approved");
        setIsStillPending(false);
        // Delay refresh to show feedback
        setTimeout(() => {
          onAction?.();
        }, 800);
      } else {
        const error = await response.json();
        console.error("Failed to approve booking:", error);
        alert(error.message || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Error approving booking:", error);
      alert("An error occurred while approving the booking");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectBooking = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!notification.stationId || !notification.relatedId || loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/availability/${notification.stationId}/reject/${notification.relatedId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ownerMessage: "Your booking has been rejected." }),
        }
      );

      if (response.ok) {
        setActionTaken("rejected");
        setIsStillPending(false);
        // Delay refresh to show feedback
        setTimeout(() => {
          onAction?.();
        }, 800);
      } else {
        const error = await response.json();
        console.error("Failed to reject booking:", error);
        alert(error.message || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("An error occurred while rejecting the booking");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStation = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!notification.relatedId || loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/stations/${notification.relatedId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setActionTaken("approved");
        setIsStillPending(false);
        setTimeout(() => {
          onAction?.();
        }, 800);
      } else {
        const error = await response.json();
        console.error("Failed to approve station:", error);
        alert(error.message || "Failed to approve station");
      }
    } catch (error) {
      console.error("Error approving station:", error);
      alert("An error occurred while approving the station");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectStation = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!notification.relatedId || loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/stations/${notification.relatedId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setActionTaken("rejected");
        setIsStillPending(false);
        setTimeout(() => {
          onAction?.();
        }, 800);
      } else {
        const error = await response.json();
        console.error("Failed to reject station:", error);
        alert(error.message || "Failed to reject station");
      }
    } catch (error) {
      console.error("Error rejecting station:", error);
      alert("An error occurred while rejecting the station");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (e) => {
    // Only mark as read if clicking on the notification itself, not buttons
    if (e.target.closest('button')) return;
    
    if (!notification.isRead) {
      onMarkAsRead?.(notification._id);
    }
  };

  const showBookingActions = 
    notification.title === "New Booking Request" && 
    !actionTaken && 
    isStillPending;
    
  const showStationActions = 
    notification.title === "New Station Request" && 
    !actionTaken && 
    isStillPending;

  return (
    <div
      className={`px-5 py-4 hover:bg-gray-50 transition-colors relative cursor-pointer ${
        !notification.isRead ? "bg-blue-50/30" : ""
      } ${actionTaken ? "opacity-80" : ""}`}
      onClick={handleItemClick}
    >
      <div className="flex gap-3">
        {getNotificationIcon(notification.type)}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {notification.title}
            </p>
            {!notification.isRead && !actionTaken && (
              <Circle className="w-2 h-2 fill-blue-500 text-blue-500 flex-shrink-0 mt-1" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            {notification.message}
          </p>

          {/* Action Buttons */}
          {(showBookingActions || showStationActions) && (
            <div className="flex gap-2 mt-3 mb-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={showBookingActions ? handleApproveBooking : handleApproveStation}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {loading ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={showBookingActions ? handleRejectBooking : handleRejectStation}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                {loading ? "Processing..." : "Reject"}
              </button>
            </div>
          )}

          {/* Action Taken Indicator */}
          {actionTaken && (
            <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${
              actionTaken === 'approved' ? 'text-green-600' : 'text-red-600'
            }`}>
              {actionTaken === 'approved' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{actionTaken === 'approved' ? 'Approved' : 'Rejected'}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 font-medium">
              {formatTimeAgo(notification.createdAt)}
            </span>
            <span className="text-gray-300">•</span>
            <span className={`text-xs font-medium ${
              notification.type === 'booking' ? 'text-blue-600' :
              notification.type === 'station' ? 'text-green-600' :
              'text-purple-600'
            }`}>
              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;