import React from "react";

const ChatMessage = ({ message }) => {
  const isOwn = message.sender === message.currentUserId;
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-3 py-2 rounded-lg ${
        isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}>
        <p className="text-sm">{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;


