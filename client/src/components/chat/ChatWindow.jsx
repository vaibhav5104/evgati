import React, { useState, useEffect } from "react";
import { chatService } from "../../services/chatService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatWindow = ({ stationId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessages(stationId);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
      setLoading(false);
    };
    fetchMessages();
  }, [stationId]);

  const handleSendMessage = async (message) => {
    try {
      await chatService.sendMessage(stationId, userId, message);
      setMessages(prev => [...prev, { text: message, sender: userId, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="border rounded-lg h-96 flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;


