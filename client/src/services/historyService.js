import axios from "axios";
import { useAuth } from "../store/auth";

export const historyService = () => {
  const { API } = useAuth();
  const API_URL = `${API}/api/history`;

  return {
    // 🧑 User: Get their booking history
    getUserHistory: async () => {
      const res = await axios.get(`${API_URL}/user`);
      return res.data;
    },

    // 👨‍💼 Owner: Get history of owned stations
    getOwnerHistory: async () => {
      const res = await axios.get(`${API_URL}/owner`);
      return res.data;
    },

    // 🛡️ Admin: Get full booking history
    getAdminHistory: async () => {
      const res = await axios.get(`${API_URL}/admin`);
      return res.data;
    },

    // 📍 Optional: Fetch history of a specific station (admin/owner only)
    getStationHistory: async (stationId) => {
      const res = await axios.get(`${API_URL}/station/${stationId}`);
      return res.data;
    }
  };
};