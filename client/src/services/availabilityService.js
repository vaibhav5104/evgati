import axios from "axios";
import { useAuth } from "../store/auth";

export const availabilityService = () => {
  const { API } = useAuth();
  const API_URL = `${API}/api/availability`;

  return {
    // 🔹 Get live availability (only accepted bookings)
    getAvailability: async (stationId) => {
      const res = await axios.get(`${API_URL}/${stationId}`);
      return res.data;
    },

    // 🔹 User: Send booking request
    requestBooking: async (data) => {
      const res = await axios.post(`${API_URL}/book`, data);
      return res.data;
    },

    // 🔹 User: Get all booking requests (pending/accepted/rejected)
    getUserRequests: async () => {
      const res = await axios.get(`${API_URL}/my-requests`);
      return res.data;
    },

    // 🔹 Owner/Admin: Get pending requests for a station
    getPendingRequests: async (stationId) => {
      const res = await axios.get(`${API_URL}/${stationId}/requests`);
      return res.data;
    },

    // 🔹 Owner/Admin: Respond to a booking request
    respondBookingRequest: async (stationId, bookingId, status, ownerMessage = "") => {
      const res = await axios.patch(`${API_URL}/${stationId}/respond/${bookingId}`, {
        status,
        ownerMessage
      });
      return res.data;
    },

    // 🔹 Admin/Owner: Clear expired bookings
    clearExpiredBookings: async (stationId) => {
      const res = await axios.delete(`${API_URL}/${stationId}/clear`);
      return res.data;
    }
  };
};
