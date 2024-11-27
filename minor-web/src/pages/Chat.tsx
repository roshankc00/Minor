import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';
import { useWebSocket } from '../hooks/useWebSocket';

const ConnectionStatus: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center ${getStatusColor()}`}
    >
      <span className="mr-2">Status:</span>
      {status}
    </div>
  );
}

const Chat: React.FC = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { 
    messages, 
    sendMessage, 
    connectionStatus, 
    error 
  } = useWebSocket('ws://localhost:8000/ws');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && connectionStatus === 'connected') {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && connectionStatus === 'connected') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col mx-20">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3">

          <FaRobot size={50} />
          <h1 className="text-2xl font-bold">Health Assistant AI</h1>
        </div>
        <ConnectionStatus status={connectionStatus} />
      </header>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-3 text-center">
          {error}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={msg.id || index} 
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* User/AI Icon */}
            <div className={`mr-2 ml-2 ${msg.sender === 'user' ? 'order-last' : 'order-first'}`}>
              {msg.sender === 'user' ? (

                 <FaUser size={35}/>
              ) : (
                <FaRobot size={35}/>
              )}
            </div>

            {/* Message Bubble */}
            <div 
              className={`
                max-w-[70%] px-4 py-2 rounded-lg 
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white'}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 p-4 flex items-center">
        <input 
          type="text" 
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a health-related question..."
          disabled={connectionStatus !== 'connected'}
          className={`
            flex-grow p-2 rounded-l-lg 
            ${connectionStatus === 'connected' 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || connectionStatus !== 'connected'}
          className={`
            p-2 rounded-r-lg 
            ${connectionStatus === 'connected' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
          `}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
