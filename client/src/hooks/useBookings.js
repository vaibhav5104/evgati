import { useState, useCallback } from 'react';
import { bookingService } from '../services';
import { toast } from 'react-toastify';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch bookings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingService.createBooking(bookingData);
      toast.success('Booking request submitted successfully');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBookingStatus = useCallback(async (stationId, bookingId, status, message = '') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = status === 'accepted'
        ? await bookingService.approveBooking(stationId, bookingId)
        : await bookingService.rejectBooking(stationId, bookingId, message);
      
      toast.success(`Booking ${status} successfully`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to ${status} booking`;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStationBookings = useCallback(async (stationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookingService.getStationBookings(stationId);
      return response.data || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch station bookings';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelBooking = useCallback(async (stationId, bookingId) => {
    setLoading(true);
    setError(null);
    
    try {
      await bookingService.cancelBooking(stationId, bookingId);
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchUserBookings,
    createBooking,
    updateBookingStatus,
    getStationBookings,
    cancelBooking
  };
};