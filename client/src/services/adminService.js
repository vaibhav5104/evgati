import api from './api';

export const adminService = {
  // Get pending stations for approval
  getPendingStations: async () => {
    const response = await api.get('/api/admin/stations/pending');
    return response.data;
  },

  // Approve station
  approveStation: async (stationId) => {
    const response = await api.post(`/api/admin/stations/${stationId}/approve`);
    return response.data;
  },

  // Reject station
  rejectStation: async (stationId) => {
    const response = await api.post(`/api/admin/stations/${stationId}/reject`);
    return response.data;
  }
};
