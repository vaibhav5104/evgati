import api  from './api';

export const availabilityService = {
  // 🔹 Get live availability (only accepted bookings)
  async getAvailability(stationId) {
    try {
      const response = await api.get(`/availability/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    }
  },

  // 🔹 User: Send booking request
  async requestBooking(data) {
    try {
      const response = await api.post('/availability/book', data);
      return response.data;
    } catch (error) {
      console.error('Error requesting booking:', error);
      throw error;
    }
  },

  // 🔹 User: Get all booking requests (pending/accepted/rejected)
  async getUserRequests() {
    try {
      const response = await api.get('/availability/my-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching user requests:', error);
      throw error;
    }
  },

  // 🔹 Owner/Admin: Get pending requests for a station
  async getPendingRequests(stationId) {
    try {
      const response = await api.get(`/availability/${stationId}/requests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      throw error;
    }
  },

  // 🔹 Owner/Admin: Respond to a booking request
  async respondBookingRequest(stationId, bookingId, status, ownerMessage = "") {
    try {
      const response = await api.patch(`/availability/${stationId}/respond/${bookingId}`, {
        status,
        ownerMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error responding to booking request:', error);
      throw error;
    }
  },

  // 🔹 Admin/Owner: Clear expired bookings
  async clearExpiredBookings(stationId) {
    try {
      const response = await api.delete(`/availability/${stationId}/clear`);
      return response.data;
    } catch (error) {
      console.error('Error clearing expired bookings:', error);
      throw error;
    }
  }
};
