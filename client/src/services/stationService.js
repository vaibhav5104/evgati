import api from './api';

export const stationService = {
  // Get all stations (public)
  getAllStations: async () => {
    const response = await api.get('/api/stations');
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
  findNearestStations: async (latitude, longitude) => {
    const response = await api.get(`/api/stations/nearest/search?lat=${latitude}&lng=${longitude}`);
    return response.data;
  }
};
