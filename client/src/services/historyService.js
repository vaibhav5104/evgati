import api  from './api';

export const historyService = {
  // 🧑 User: Get their booking history
  async getUserHistory() {
    try {
      const response = await api.get('api/history/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  },

  // 👨‍💼 Owner: Get history of owned stations
  async getOwnerHistory() {
    try {
      const response = await api.get('api/history/owner');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner history:', error);
      throw error;
    }
  },

  // 🛡️ Admin: Get full booking history
  async getAdminHistory() {
    try {
      const response = await api.get('api/history/admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin history:', error);
      throw error;
    }
  },

  // 📍 Optional: Fetch history of a specific station (admin/owner only)
  async getStationHistory(stationId) {
    try {
      const response = await api.get(`api/history/station/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching station history:', error);
      throw error;
    }
  }
};