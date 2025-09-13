import axios from "axios";
import { useAuth } from "../store/auth";

export const commentService = () => {
  const { API } = useAuth();
  const API_URL = `${API}/api/comments`;

  return {
    getComments: async (stationId) => {
      const res = await axios.get(`${API_URL}/${stationId}`);
      return res.data;
    },

    addComment: async (data) => {
      const res = await axios.post(`${API_URL}`, data);
      return res.data;
    }
  };
};
