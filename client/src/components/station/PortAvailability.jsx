import React, { useState, useEffect } from 'react';
import { availabilityService } from '../../services/availabilityService';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

const PortAvailability = ({ stationId, className = '' }) => {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await availabilityService.getAvailability(stationId);
        setAvailability(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch port availability');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (stationId) {
      fetchAvailability();
    }
  }, [stationId]);

  const getPortStatus = (portNumber) => {
    if (!availability) return 'unknown';
    
    const isOccupied = availability.occupiedPorts?.includes(portNumber.toString());
    const hasPendingBooking = availability.bookings?.some(
      booking => booking.portId === portNumber && booking.status === 'pending'
    );
    
    if (isOccupied) return 'occupied';
    if (hasPendingBooking) return 'pending';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Checking port availability..." />;
  }

  if (error) {
    return (
      <div className={`bg-red-50 text-red-600 p-4 rounded-lg ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold">Port Availability</h3>
      
      {availability && availability.stationId ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: availability.stationId.totalPorts }, (_, i) => i + 1).map(portNumber => {
            const status = getPortStatus(portNumber);
            return (
              <div 
                key={portNumber} 
                className="bg-white border rounded-lg p-3 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Port {portNumber}</span>
                  <Badge variant={getStatusColor(status)}>
                    {status}
                  </Badge>
                </div>
                {status === 'available' && (
                  <div className="text-sm text-gray-600 mt-2">
                    Ready for booking
                  </div>
                )}
                {status === 'occupied' && (
                  <div className="text-sm text-gray-600 mt-2">
                    Currently in use
                  </div>
                )}
                {status === 'pending' && (
                  <div className="text-sm text-gray-600 mt-2">
                    Booking in progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No port information available</p>
      )}
    </div>
  );
};

export default PortAvailability;

