import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const PendingStationCard = ({ 
  station, 
  onApprove, 
  onReject, 
  className = '' 
}) => {
  const { 
    name, 
    location, 
    owner, 
    totalPorts, 
    pricing, 
    status 
  } = station;

  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          <Badge 
            variant={status === 'pending' ? 'warning' : 'secondary'}
            className="mt-2"
          >
            {status}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Ports: {totalPorts}</p>
          <p className="text-sm text-gray-600">
            Price: ₹{pricing?.perHour || 0}/hr, ₹{pricing?.perKWh || 0}/kWh
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Location</h4>
            <p className="text-sm text-gray-600">
              {location?.address}
            </p>
            <p className="text-sm text-gray-600">
              Lat: {location?.latitude}, Lon: {location?.longitude}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Owner Details</h4>
            <p className="text-sm text-gray-600">{owner?.name}</p>
            <p className="text-sm text-gray-600">{owner?.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <Button 
          variant="success" 
          className="flex-1" 
          onClick={() => onApprove(station._id)}
        >
          Approve Station
        </Button>
        <Button 
          variant="danger" 
          className="flex-1" 
          onClick={() => onReject(station._id)}
        >
          Reject Station
        </Button>
      </div>
    </div>
  );
};

export default PendingStationCard;

