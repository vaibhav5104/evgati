import React from "react";
import { bookingService } from "../../services/bookingService";
import Button from "../ui/Button";

const PendingRequests = ({ requests, onUpdate }) => {
  const handleApprove = async (stationId, bookingId) => {
    try {
      await bookingService.approveBooking(stationId, bookingId);
      onUpdate?.();
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const handleReject = async (stationId, bookingId) => {
    try {
      await bookingService.rejectBooking(stationId, bookingId);
      onUpdate?.();
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <div key={request._id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{request.userName}</h3>
              <p className="text-sm text-gray-600">{request.stationName}</p>
              <p className="text-sm text-gray-600">{request.time}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                color="success"
                onClick={() => handleApprove(request.stationId, request._id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                color="danger"
                onClick={() => handleReject(request.stationId, request._id)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingRequests;


