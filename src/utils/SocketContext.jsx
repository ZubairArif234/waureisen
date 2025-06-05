// src/utils/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getToken, getUserType, isAuthenticated } from './authService';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    // Get auth token for socket authentication
    const token = getToken();
    const userType = getUserType();

    // Create socket instance
    const socketInstance = io(import.meta.env.VITE_API_URL || 'https://waureisen.com', {
      auth: { token },
      query: { userType },
      transports: ['websocket'],
      autoConnect: true
    });

    // Set up event handlers
    socketInstance.on('connect', () => {
      // console.log('Socket connected');
      setIsConnected(true);
      
      // Join user's conversations
      socketInstance.emit('join_conversations');
    });

    socketInstance.on('disconnect', () => {
      // console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      // console.error('Socket error:', error);
    });

    // Set the socket in state
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setIsConnected(false);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};