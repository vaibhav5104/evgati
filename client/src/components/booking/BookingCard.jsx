import React from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const BookingCard = ({ booking, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{booking.stationName}</h3>
        <Badge variant={getStatusColor(booking.status)}>
          {booking.status}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-2">{booking.time}</p>
      <p className="text-sm text-gray-600 mb-2">Duration: {booking.duration}h</p>
      <p className="text-sm text-gray-600 mb-3">Port: {booking.portType}</p>
      {booking.status === 'pending' && (
        <Button size="sm" color="danger" onClick={() => onCancel(booking._id)}>
          Cancel
        </Button>
      )}
    </div>
  );
};

export default BookingCard;


