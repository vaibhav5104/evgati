import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  Inbox
} from 'lucide-react';
import NotificationItem from './NotificationItem';
import { useAuth } from '../../hooks/useAuth';
import {bookingService} from '../../services/bookingService' 
import {adminService} from '../../services/adminService';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { 
    user, 
    userNotifications, 
    ownerNotifications, 
    adminNotifications,
    setOwnerNotifications,
    setAdminNotifications,
    setUserNotifications
  } = useAuth();
  
  const [expandedSections, setExpandedSections] = useState({
    pending: true,
    approved: false,
    rejected: false,
    newRequests: true,
    stationRequests: false,
    recentActivity: false,
    verifications: true,
    reports: false,
    alerts: false
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const handleMarkAllRead = () => {
    {user?.role === 'user' && 
      setUserNotifications({
        approvedRequestsLength: 0,
        rejectedRequestsLength: 0
      })
    ;}
    {user?.role === 'owner' && 
      setOwnerNotifications({
      total : 0
      });
    ;}
    {user?.role === 'owner' && 
      setAdminNotifications({
        pendingStationRequestsLength: 0,
        pendingUserRequestsLength: 0,
        totalPendingActionsLength: 0
      });
    ;}
  };
  
  const handleNotificationClick = (path) => {
    navigate(path);
    onClose();
  };
  
  const handleAction = async (notificationId, action) => {
    try {
      // Find the booking notification to get the stationId
      const bookingNotification = ownerNotifications.pending?.find(
        item => item.type === "booking" && item.bookingId === notificationId
      );
      
      if (!bookingNotification) {
        console.error('Could not find booking notification');
        return;
      }
      
      // Extract stationId from the booking notification
      // You'll need to add stationId to your booking data structure in useAuth
      const stationId = bookingNotification.stationId;
      console.log(bookingNotification)
      
      if (!stationId) {
        console.error('StationId not found in booking notification');
        return;
      }
      
      if (action === 'approve') {
        
        const response = await bookingService.approveBooking(stationId, notificationId);
        console.log('Booking approved:', response);
        
        // Update the notifications state to remove the approved booking
        setOwnerNotifications(prev => ({
          ...prev,
          pending: prev.pending?.filter(
            item => !(item.type === "booking" && item.bookingId === notificationId)
          ) || [],
          total: (prev.total || 0) - 1
        }));
        
        // Optional: Show success message
        // toast.success('Booking approved successfully!');
        
      } else if (action === 'reject') {
        
        const response = await bookingService.rejectBooking(stationId, notificationId);
        console.log('Booking rejected:', response);
        
        // Update the notifications state to remove the rejected booking
        setOwnerNotifications(prev => ({
          ...prev,
          pending: prev.pending?.filter(
            item => !(item.type === "booking" && item.bookingId === notificationId)
          ) || [],
          total: (prev.total || 0) - 1
        }));
        
        // Optional: Show success message
        // toast.success('Booking rejected successfully!');
      }
      
    } catch (error) {
      console.error('Action failed:', error);
      // Optional: Show error message
      // toast.error('Failed to process booking request');
    }
  };

const handleAdminStationAction = async (stationId, action) => {
  try {
    if (action === 'approve') {
      const response = await adminService.approveStation(stationId);
      console.log('Station approved:', response);
      
      // Update the notifications state to remove the approved station
      setAdminNotifications(prev => ({
        ...prev,
        pendingStations: prev.pendingStations?.filter(
          station => (station._id || station.id) !== stationId
        ) || [],
        totalPendingActionsLength: Math.max((prev.totalPendingActionsLength || 0) - 1, 0)
      }));
      
      // Optional: Show success message
      // toast.success('Station approved successfully!');
      
    } else if (action === 'reject') {
      const response = await adminService.rejectStation(stationId);
      console.log('Station rejected:', response);
      
      // Update the notifications state to remove the rejected station
      setAdminNotifications(prev => ({
        ...prev,
        pendingStations: prev.pendingStations?.filter(
          station => (station._id || station.id) !== stationId
        ) || [],
        totalPendingActionsLength: Math.max((prev.totalPendingActionsLength || 0) - 1, 0)
      }));
      
      // Optional: Show success message
      // toast.success('Station rejected successfully!');
    }
    
  } catch (error) {
    console.error('Station action failed:', error);
    // Optional: Show error message
    // toast.error(`Failed to ${action} station`);
  }
};

  if (!isOpen) return null;

  const renderUserNotifications = () => {
    const approved = userNotifications.approvedRequestsLength || 0;
    const rejected = userNotifications.rejectedRequestsLength || 0;
    const pending = userNotifications.pendingRequestsLength || 0;
  
    return (
      <>
        {/* Pending Requests */}
        {/* {pending > 0 && (
          <Section
            title="Pending Requests"
            count={pending}
            color="orange"
            expanded={expandedSections.pending}
            onToggle={() => toggleSection('pending')}
          >
            {Array.from({ length: pending }).map((_, index) => (
              <NotificationItem
                key={index}
                type="booking"
                status="pending"
                title="Booking Pending"
                message="Waiting for approval"
                time={null}
                onClick={() => handleNotificationClick('/my-bookings')}
              />
            ))}
          </Section>
        )} */}
  
        {/* Approved Requests */}
        {approved > 0 && (
          <Section
            title="Approved Bookings"
            count={approved}
            color="green"
            expanded={expandedSections.approved}
            onToggle={() => toggleSection('approved')}
          >
            {Array.from({ length: approved }).map((_, index) => (
              <NotificationItem
                key={index}
                type="booking"
                status="accepted"
                title="Booking Approved"
                message="Your booking has been approved"
                time={null}
                onClick={() => handleNotificationClick('/my-bookings')}
              />
            ))}
          </Section>
        )}
  
        {/* Rejected Requests */}
        {rejected > 0 && (
          <Section
            title="Rejected Requests"
            count={rejected}
            color="red"
            expanded={expandedSections.rejected}
            onToggle={() => toggleSection('rejected')}
          >
            {Array.from({ length: rejected }).map((_, index) => (
              <NotificationItem
                key={index}
                type="booking"
                status="rejected"
                title="Booking Rejected"
                message="Your booking request was not approved"
                time={null}
                onClick={() => handleNotificationClick('/my-bookings')}
              />
            ))}
          </Section>
        )}
      </>
    );
  };
  

  // // ================== OWNER NOTIFICATIONS ==================
  // const renderOwnerNotifications = () => (
  //   <>
  //     {/* New Booking Requests */}
  //     {ownerNotifications.newBookingRequests?.length > 0 && (
  //       <Section 
  //         title="New Booking Requests" 
  //         count={ownerNotifications.newBookingRequests.length} 
  //         color="blue" 
  //         expanded={expandedSections.newRequests} 
  //         onToggle={() => toggleSection('newRequests')}
  //       >
  //         {ownerNotifications.newBookingRequests.map((request, index) => (
  //           <NotificationItem
  //             key={index}
  //             type="booking"
  //             status="pending"
  //             title="New Booking Request"
  //             message={`${request.userId?.name || 'User'} wants to book Port ${request.portId} at ${request.stationName}`}
  //             time={request.createdAt}
  //             actions={[
  //               { type: 'approve', label: 'Approve', variant: 'success' },
  //               { type: 'reject', label: 'Reject', variant: 'danger' }
  //             ]}
  //             onAction={(action) => handleAction(request._id, action)}
  //             onClick={() => handleNotificationClick(`/owner/stations/${request.stationId}/bookings`)}
  //           />
  //         ))}
  //       </Section>
  //     )}

  //     {/* Station Requests */}
  //     {ownerNotifications.stationRequests?.length > 0 && (
  //       <Section 
  //         title="Station Verifications" 
  //         count={ownerNotifications.stationRequests.length} 
  //         color="purple" 
  //         expanded={expandedSections.stationRequests} 
  //         onToggle={() => toggleSection('stationRequests')}
  //       >
  //         {ownerNotifications.stationRequests.map((station, index) => (
  //           <NotificationItem
  //             key={index}
  //             type="station"
  //             status="station"
  //             title="Station Pending Verification"
  //             message={`${station.name} is awaiting admin approval`}
  //             time={station.createdAt}
  //             onClick={() => handleNotificationClick('/owner/stations')}
  //           />
  //         ))}
  //       </Section>
  //     )}
  //   </>
  // );

  // ================== OWNER NOTIFICATIONS ==================
const renderOwnerNotifications = () => {
  // Separate booking and station requests from the unified pending array
  const bookingRequests = ownerNotifications.pending?.filter(item => item.type === "booking") || [];
  const stationRequests = ownerNotifications.pending?.filter(item => item.type === "station") || [];

  return (
    <>
      {/* New Booking Requests */}
      {bookingRequests.length > 0 && (
        <Section 
          title="New Booking Requests" 
          count={bookingRequests.length} 
          color="blue" 
          expanded={expandedSections.newRequests} 
          onToggle={() => toggleSection('newRequests')}
        >
          {bookingRequests.map((request, index) => (
            <NotificationItem
              key={`booking-${request.bookingId}-${index}`}
              type="booking"
              status="pending"
              title="New Booking Request"
              message={`${request.userName} wants to book Port ${request.portId} from ${new Date(request.startTime).toLocaleDateString()} ${new Date(request.startTime).toLocaleTimeString()} to ${new Date(request.endTime).toLocaleTimeString()}`}
              time={request.startTime}
              actions={[
                { type: 'approve', label: 'Approve', variant: 'success' },
                { type: 'reject', label: 'Reject', variant: 'danger' }
              ]}
              onAction={(action) => handleAction(request.bookingId, action)}
              onClick={() => handleNotificationClick(`/owner/bookings/${request.bookingId}`)}
            />
          ))}
        </Section>
      )}

      {/* Station Requests */}
      {stationRequests.length > 0 && (
        <Section 
          title="Station Verifications" 
          count={stationRequests.length} 
          color="purple" 
          expanded={expandedSections.stationRequests} 
          onToggle={() => toggleSection('stationRequests')}
        >
          {stationRequests.map((station, index) => (
            <NotificationItem
              key={`station-${station.stationId}-${index}`}
              type="station"
              status="pending"
              title="Station Pending Verification"
              message={`${station.stationName} is awaiting admin approval`}
              time={station.createdAt || new Date().toISOString()}
              onClick={() => handleNotificationClick(`/owner/stations/${station.stationId}`)}
            />
          ))}
        </Section>
      )}

      {/* Show message if no notifications */}
      {(!ownerNotifications.pending || ownerNotifications.pending.length === 0) && (
        <div className="p-4 text-center text-gray-500">
          <p>No pending notifications</p>
        </div>
      )}
    </>
  );
};

// ================== ADMIN NOTIFICATIONS ==================
const renderAdminNotifications = () => (
  <>
    {/* Pending Verifications */}
    {adminNotifications.totalPendingActionsLength > 0 && (
      <Section 
        title="Pending Verifications" 
        count={adminNotifications.totalPendingActionsLength} 
        color="purple" 
        expanded={expandedSections.verifications} 
        onToggle={() => toggleSection('verifications')}
      >
        {adminNotifications.pendingStations.map((station, index) => (
          <NotificationItem
            key={`station-${station._id || station.id}-${index}`}
            type="station"
            status="pending"
            title="Station Verification Needed"
            message={`${station.name} submitted by ${station.ownerName}`}
            time={station.createdAt}
            actions={[
              { type: 'approve', label: 'Approve', variant: 'success' },
              { type: 'reject', label: 'Reject', variant: 'danger' }
            ]}
            onAction={(action) => handleAdminStationAction(station._id || station.id, action)}
            onClick={() => handleNotificationClick(`/admin/stations/${station._id || station.id}`)}
          />
        ))}
      </Section>
    )}

    {/* Show message if no notifications */}
    {(!adminNotifications.pendingStations || adminNotifications.pendingStations.length === 0) && (
      <div className="p-4 text-center text-gray-500">
        <p>No pending verifications</p>
      </div>
    )}
      {/* User Reports */}
      {/* {adminNotifications.reports?.length > 0 && (
        <Section 
          title="User Reports" 
          count={adminNotifications.reports.length} 
          color="red" 
          expanded={expandedSections.reports} 
          onToggle={() => toggleSection('reports')}
        >
          {adminNotifications.reports.map((report, index) => (
            <NotificationItem
              key={index}
              type="report"
              status="report"
              title="New User Report"
              message={report.message}
              time={report.createdAt}
              onClick={() => handleNotificationClick('/admin/reports')}
            />
          ))}
        </Section>
      )} */}

      {/* System Alerts */}
      {/* {adminNotifications.alerts?.length > 0 && (
        <Section 
          title="System Alerts" 
          count={adminNotifications.alerts.length} 
          color="yellow" 
          expanded={expandedSections.alerts} 
          onToggle={() => toggleSection('alerts')}
        >
          {adminNotifications.alerts.map((alert, index) => (
            <NotificationItem
              key={index}
              type="alert"
              status="alert"
              title="System Alert"
              message={alert.message}
              time={alert.createdAt}
              onClick={() => handleNotificationClick('/admin/alerts')}
            />
          ))}
        </Section>
      )} */}
    </>
  );

  // ================== MAIN RENDER ==================
  return (
    <div 
      ref={dropdownRef} 
      className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-700">Notifications</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMarkAllRead} 
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all read
          </button>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {user?.role === 'user' && renderUserNotifications()}
        {user?.role === 'owner' && renderOwnerNotifications()}
        {user?.role === 'admin' && renderAdminNotifications()}

        {/* Empty State */}
        {(!userNotifications?.userRequestsLength?.length &&
          !userNotifications?.approvedRequestsLength?.length &&
          !userNotifications?.rejectedRequestsLength?.length &&
          !ownerNotifications?.pendingRequestsLength?.length &&
          !ownerNotifications?.stationRequestsLength?.length &&
          !adminNotifications?.pendingStationRequestsLength?.length &&
          !adminNotifications?.pendingUserRequestsLength?.length &&
          !adminNotifications?.totalPendingActionsLength?.length) && (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <Inbox className="w-10 h-10 mb-2" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============= Collapsible Section Component =============
const Section = ({ title, count, color, expanded, onToggle, children }) => (
  <div className="mb-2">
    <button
      onClick={onToggle}
      className="w-full px-4 py-2 flex items-center justify-between text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="flex items-center gap-2">
        {title}
        <span className={`bg-${color}-100 text-${color}-600 px-2 py-0.5 rounded-full text-xs`}>
          {count}
        </span>
      </span>
      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>
    {expanded && <div className="max-h-60 overflow-y-auto">{children}</div>}
  </div>
);

export default NotificationDropdown;