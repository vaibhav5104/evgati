import React, { useEffect, useState } from "react";
import { bookingService } from "../../services/bookingService";
import { BookingList, BookingForm } from "../../components/booking";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { toast } from 'react-toastify';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      const data = await bookingService.getUserBookings();
      console.log("Booking data received:", data);
      
      // Ensure bookings is always an array
      const safeData = Array.isArray(data)
        ? data
        : Array.isArray(data?.requests)
        ? data.requests
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];

  
      setBookings(safeData);
      setError(null);

      // If no bookings found, show a helpful message
      if (safeData.length === 0) {
        toast.info("You have no current bookings.");
      }
    } catch (err) {
      console.error("Booking fetch error:", err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Failed to fetch bookings";
      
      setError(errorMessage);
      toast.error(errorMessage);
      setBookings([]); // reset to empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (stationId, bookingId) => {
    try {
      await bookingService.cancelBooking(stationId, bookingId);
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">My Bookings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <BookingList 
          bookings={bookings} 
          onCancel={(bookingId) => {
            const booking = bookings.find(b => b._id === bookingId);
            if (booking) handleCancel(booking.stationId, bookingId);
          }}
        />
      )}
    </div>
  );
};

export default Bookings;
