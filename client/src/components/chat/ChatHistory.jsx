import React, { useState, useEffect } from "react";
import { chatService } from "../../services/chatService";

const ChatHistory = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await chatService.getUserChats(userId);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
      setLoading(false);
    };
    fetchChats();
  }, [userId]);

  if (loading) return <div className="p-4">Loading chat history...</div>;

  return (
    <div className="space-y-2">
      {chats.map(chat => (
        <div key={chat.id} className="border rounded p-3">
          <h4 className="font-medium">{chat.stationName}</h4>
          <p className="text-sm text-gray-600">{chat.lastMessage}</p>
          <p className="text-xs text-gray-500">{chat.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;


