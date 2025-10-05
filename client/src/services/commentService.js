import api  from './api';

export const commentService = {
  async getComments(stationId) {
    try {
      const response = await api.get(`api/comments/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async addComment(data) {
    try {
      const response = await api.post('api/comments', data);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async updateComment(commentId, data) {
    try {
      const response = await api.put(`api/comments/${commentId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`api/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};
