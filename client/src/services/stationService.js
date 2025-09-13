import axios from "axios";
import { useAuth } from "../store/auth";

export const stationService = () => {
  const { API } = useAuth();
  const API_URL = `${API}/api/stations`;

  return {
    getAllStations: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },

    getStationById: async (id) => {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    }
  };
};
