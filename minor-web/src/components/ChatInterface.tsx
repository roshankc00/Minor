import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

const ChatInterface: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, sendMessage, connectionStatus, error } = useWebSocket('ws://localhost:8000/ws');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">
      {/* Connection Status */}
      <div className="p-4 bg-blue-100 text-center">
        Connection Status: 
        <span 
          className={`ml-2 font-bold ${
            connectionStatus === 'connected' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}
        >
          {connectionStatus.toUpperCase()}
        </span>
        {error && (
          <div className="text-red-500 mt-2">
            {error}
          </div>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={msg.id || index} 
            className={`flex ${
              msg.sender === 'user' 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t flex">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your health-related question..."
          className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSendMessage}
          disabled={connectionStatus !== 'connected'}
          className={`px-4 py-2 ${
            connectionStatus === 'connected'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } rounded-r-lg`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
