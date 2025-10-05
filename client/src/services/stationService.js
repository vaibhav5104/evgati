import api from './api';

export const stationService = {
  // Get all stations (public)
  getAllStations: async () => {
    const response = await api.get('/api/stations');
    return response.data;
  },

  // Get all pending stations (public)
  getAllPendingStations: async () => {
    const response = await api.get('/api/stations/pending');
    return response.data;
  },

  // Get station by ID (public)
  getStationById: async (id) => {
    const response = await api.get(`/api/stations/${id}`);
    return response.data;
  },

  // Create new station (authenticated)
  createStation: async (stationData) => {
    const response = await api.post('/api/stations', stationData);
    return response.data;
  },

  // Update station (owner/admin only)
  updateStation: async (id, stationData) => {
    const response = await api.put(`/api/stations/${id}`, stationData);
    return response.data;
  },

  // Delete station (owner/admin only)
  deleteStation: async (id) => {
    const response = await api.delete(`/api/stations/${id}`);
    return response.data;
  },

  // Find nearest stations
  findNearestStation: async (latitude, longitude) => {
    try {
      // Corrected: Changed query parameters from 'lat' and 'lng' to 'latitude' and 'longitude'
      // to match what the backend controller expects.
      const response = await api.get(`/api/stations/nearest/search?latitude=${latitude}&longitude=${longitude}`);
      return response.data;
    } catch (error) {
      console.error('Find nearest station error:', error.response?.data || error.message);
      throw error;
    }
  },
};
