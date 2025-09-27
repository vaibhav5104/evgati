import api  from './api';

export const chatService = {
  // Get messages for a station
  async getMessages(stationId) {
    try {
      const response = await api.get(`api/chat/messages/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(stationId, userId, message) {
    try {
      const response = await api.post('api/chat/send', {
        stationId,
        userId,
        message,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history for a user
  async getChatHistory(userId) {
    try {
      const response = await api.get(`api/chat/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Mark messages as read
  async markAsRead(stationId, userId) {
    try {
      const response = await api.put(`api/chat/read/${stationId}`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
};


