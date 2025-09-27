import api from './api';

export const bookingService = {
  // Book a charging port
  bookPort: async (bookingData) => {
    try {
      const response = await api.post('/api/availability/book', bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking port error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user's booking requests
  getUserRequests: async () => {
    try {
      const response = await api.get('/api/availability/myrequests');
      return response.data;
    } catch (error) {
      console.error('Get user requests error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get availability for a station
  getAvailability: async (stationId) => {
    try {
      const response = await api.get(`/api/availability/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Get availability error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get pending requests for station (owner/admin)
  getPendingRequests: async (stationId) => {
    try {
      const response = await api.get(`/api/availability/${stationId}/requests`);
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Get pending requests error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get station bookings (alias for getPendingRequests)
  getStationBookings: async (stationId) => {
    try {
      const response = await api.get(`/api/availability/${stationId}/requests`);
      // console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Get station bookings error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Approve booking request
  approveBooking: async (stationId, bookingId, ownerMessage = '') => {
    try {
      const response = await api.patch(`/api/availability/${stationId}/approve/${bookingId}`, {
        ownerMessage
      });
      return response.data;
    } catch (error) {
      console.error('Approve booking error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Reject booking request
  rejectBooking: async (stationId, bookingId, ownerMessage = '') => {
    try {
      const response = await api.patch(`/api/availability/${stationId}/reject/${bookingId}`, {
        ownerMessage
      });
      return response.data;
    } catch (error) {
      console.error('Reject booking error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Clear expired bookings
  clearExpiredBookings: async (stationId) => {
    try {
      const response = await api.delete(`/api/availability/${stationId}/clear`);
      return response.data;
    } catch (error) {
      console.error('Clear expired bookings error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Create booking request (alias for bookPort)
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/api/availability/book', bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error.response?.data || error.message);
      throw error;
    }
  },

// Get user's booking requests
getUserBookings: async () => {
  try {
    const response = await api.get("/api/availability/myrequests");

    // Always normalize to array
    const requests = response.data?.requests || [];
    console.log("User bookings response:", requests);

    return Array.isArray(requests) ? requests : [];
  } catch (error) {
    console.error(
      "Get user bookings error:",
      error.response?.data || error.message
    );
    return []; // fallback safe return
  }
},
  

  // Get station availability (alias for getAvailability)
  getStationAvailability: async (stationId) => {
    try {
      const response = await api.get(`/api/availability/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Get station availability error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cancel booking (uses reject endpoint with cancel message)
  cancelBooking: async (stationId, bookingId) => {
    try {
      const response = await api.patch(`/api/availability/${stationId}/reject/${bookingId}`, { 
        ownerMessage: 'Cancelled by user' 
      });
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error.response?.data || error.message);
      throw error;
    }
  }
};