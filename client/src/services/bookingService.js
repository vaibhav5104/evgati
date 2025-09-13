import api from './api';

export const bookingService = {
  // Create booking request
  createBooking: async (bookingData) => {
    const response = await api.post('/api/availability/book', bookingData);
    return response.data;
  },

  // Get user's booking requests
  getUserBookings: async () => {
    const response = await api.get('/api/availability/myrequests');
    return response.data;
  },

  // Get station availability
  getStationAvailability: async (stationId) => {
    const response = await api.get(`/api/availability/${stationId}`);
    return response.data;
  },

  // Get pending requests for a station (owner/admin)
  getStationBookings: async (stationId) => {
    const response = await api.get(`/api/availability/${stationId}/requests`);
    return response.data;
  },

  // Approve booking request (owner/admin)
  approveBooking: async (stationId, bookingId) => {
    const response = await api.patch(`/api/availability/${stationId}/approve/${bookingId}`);
    return response.data;
  },

  // Reject booking request (owner/admin)
  rejectBooking: async (stationId, bookingId, message = '') => {
    const response = await api.patch(`/api/availability/${stationId}/reject/${bookingId}`, { message });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (stationId, bookingId) => {
    const response = await api.patch(`/api/availability/${stationId}/reject/${bookingId}`, { message: 'Cancelled by user' });
    return response.data;
  },

  // Clear expired bookings (admin)
  clearExpiredBookings: async (stationId) => {
    const response = await api.delete(`/api/availability/${stationId}/clear`);
    return response.data;
  }
};
