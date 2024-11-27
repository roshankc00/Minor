import { useState, useCallback, useEffect, useRef } from 'react';

interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
}

interface WebSocketHook {
  messages: Message[];
  sendMessage: (message: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  error: string | null;
}

export const useWebSocket = (url: string): WebSocketHook => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Welcome to Health Assistant AI. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [error, setError] = useState<string | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef<boolean>(true);

  const createWebSocket = useCallback(() => {
    // Clear any existing reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    // Ensure any existing connection is closed
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    console.log(`Attempting to connect to WebSocket: ${url}`);
    setConnectionStatus('connecting');
    setError(null);

    try {
      const ws = new WebSocket(url);
      websocketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket Connected Successfully');
        setConnectionStatus('connected');
        setError(null);
        
        // Reset reconnect flag
        shouldReconnectRef.current = true;
      };

      ws.onmessage = (event) => {
        try {
          console.log('Received WebSocket message:', event.data);
          const receivedMessage = JSON.parse(event.data);
          
          // Handle different message types
          if (receivedMessage.response) {
            const aiMessage: Message = {
              text: receivedMessage.response,
              sender: 'ai',
              timestamp: new Date(),
              id: Date.now().toString()
            };

            setMessages(prevMessages => [...prevMessages, aiMessage]);
          } else if (receivedMessage.error) {
            // Handle error messages
            console.error('WebSocket Error Message:', receivedMessage.error);
            setError(receivedMessage.error);
          }
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError);
          setError('Error processing server response');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setConnectionStatus('disconnected');
        setError('WebSocket connection error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket Disconnected:', event);
        setConnectionStatus('disconnected');
        
        // Only attempt reconnection if explicitly allowed
        if (shouldReconnectRef.current) {
          reconnectTimerRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            createWebSocket();
          }, 3000);
        }
      };

    } catch (err) {
      console.error('WebSocket connection failed:', err);
      setConnectionStatus('disconnected');
      setError('Failed to establish WebSocket connection');

      // Only attempt reconnection if explicitly allowed
      if (shouldReconnectRef.current) {
        reconnectTimerRef.current = setTimeout(() => {
          createWebSocket();
        }, 3000);
      }
    }
  }, [url]);

  const sendMessage = useCallback((text: string) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      // Add user message to the chat immediately
      const userMessage: Message = {
        text,
        sender: 'user',
        timestamp: new Date(),
        id: Date.now().toString()
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Send message to server in the expected format
      const messageToSend = {
        message: text
      };
      websocketRef.current.send(JSON.stringify(messageToSend));
    } else {
      setError('Connection is not open');
    }
  }, []);

  // Initial connection and reconnection handling
  useEffect(() => {
    createWebSocket();

    // Cleanup function
    return () => {
      // Prevent reconnection
      shouldReconnectRef.current = false;

      // Clear reconnect timer
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      // Close WebSocket
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [createWebSocket]);

  return {
    messages,
    sendMessage,
    connectionStatus,
    error
  };
};
