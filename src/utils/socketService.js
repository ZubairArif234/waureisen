// src/utils/socketService.js
import { io } from 'socket.io-client';
import { getToken, getUserType, getCurrentUserId } from './authService';

let socket = null;
const listeners = new Map();
const messageCache = new Set(); // Cache to prevent duplicate message processing

// Extract the base URL without the /api path
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace(/\/api$/, ''); // Remove /api suffix if present

/**
 * Initialize the socket connection
 * @returns {boolean} Connection success
 */
export const initSocket = () => {
  // If already connected, return
  if (socket && socket.connected) {
    console.log('Socket already connected');
    return true;
  }
  
  // Get authentication token
  const token = getToken();
  if (!token) {
    console.warn('Cannot connect to socket: No authentication token');
    return false;
  }
  
  try {
    console.log(`Attempting to connect to socket at ${SOCKET_URL}`);
    
    // Create socket instance with correct configuration
    socket = io(SOCKET_URL, {
      path: '/socket.io', // Make sure this matches server path
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Set up connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected successfully with ID:', socket.id);
      
      // Join the appropriate chat room based on user type
      const userType = getUserType();
      const userId = getCurrentUserId();
      
      if (userType === 'user') {
        // Users join their own chat
        socket.emit('join-chat', { userId });
      } else if (userType === 'admin') {
        // Admins don't automatically join any chat
        // They'll join specific chats when selecting conversations
      }
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error details:', error);
      console.log('Connection attempt details:', {
        url: SOCKET_URL,
        path: '/socket.io',
        token: token ? 'Token exists (length: ' + token.length + ')' : 'No token',
        userType: getUserType()
      });
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    return true;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return false;
  }
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};

/**
 * Get the socket instance
 * @returns {object|null} Socket instance
 */
export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized');
    return null;
  }
  
  return socket;
};

/**
 * Join a specific chat room
 * @param {string} userId - The user ID to chat with
 */
export const joinChat = (userId) => {
  if (!socket) {
    console.warn('Cannot join chat: Socket not initialized');
    return;
  }
  
  socket.emit('join-chat', { userId });
};

/**
 * Send a message
 * @param {object} message - Message object
 * @param {string} message.receiverId - Recipient user ID
 * @param {string} message.content - Message content
 * @returns {Promise} Resolves when message is acknowledged
 */
export const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error('Cannot send message: Socket not initialized'));
      return;
    }
    
    // Log the message being sent
    console.log('Sending message:', message);
    
    // Generate a temp ID for duplicate detection
    const tempId = `temp-${Date.now()}`;
    message.tempId = tempId;
    
    // Add to message cache to prevent duplication
    messageCache.add(tempId);
    
    // Clean old cache entries (keep only last 50 messages)
    if (messageCache.size > 50) {
      const oldestEntries = Array.from(messageCache).slice(0, messageCache.size - 50);
      oldestEntries.forEach(entry => messageCache.delete(entry));
    }
    
    socket.emit('send-message', message, (acknowledgement) => {
      if (acknowledgement && acknowledgement.error) {
        reject(new Error(acknowledgement.error));
      } else {
        resolve(acknowledgement);
      }
    });
  });
};

/**
 * Mark messages as read
 * @param {string} conversationId - The conversation to mark as read
 */
export const markMessagesAsRead = (conversationId) => {
  if (!socket) {
    console.warn('Cannot mark messages as read: Socket not initialized');
    return;
  }
  
  console.log(`Marking messages as read for conversation: ${conversationId}`);
  socket.emit('mark-read', { conversationId });
};

/**
 * Add event listener
 * @param {string} event - Event name
 * @param {function} callback - Event callback
 */
export const addEventListener = (event, callback) => {
  if (!socket) {
    console.warn(`Cannot add listener for ${event}: Socket not initialized`);
    return;
  }
  
  // Store callback in listeners map
  if (!listeners.has(event)) {
    listeners.set(event, []);
  }
  
  const eventListeners = listeners.get(event);
  
  // Wrap the callback for 'new-message' event to prevent duplicates
  if (event === 'new-message') {
    const wrappedCallback = (message) => {
      // If we have a tempId, check against cache
      if (message.tempId && messageCache.has(message.tempId)) {
        console.log('Ignoring duplicate message with tempId:', message.tempId);
        return;
      }
      
      // For messages we sent, check if it's a duplicate based on timing and content
      const isSentByMe = message.sender === getCurrentUserId();
      if (isSentByMe) {
        // If it's a message we just sent (within 5 seconds), it might be a duplicate
        const recentTimeThreshold = Date.now() - 5000; // 5 seconds ago
        const messageTime = new Date(message.timestamp).getTime();
        
        if (messageTime > recentTimeThreshold) {
          // This is a recent message - check if we already processed it by content
          const messageKey = `${message.sender}-${message.content}-${messageTime}`;
          if (messageCache.has(messageKey)) {
            console.log('Ignoring duplicate message with content:', message.content);
            return;
          }
          
          // Add to cache to prevent future duplicates
          messageCache.add(messageKey);
          
          // Clean old cache entries (keep only last 50 messages)
          if (messageCache.size > 50) {
            const oldestEntries = Array.from(messageCache).slice(0, messageCache.size - 50);
            oldestEntries.forEach(entry => messageCache.delete(entry));
          }
        }
      }
      
      // Call the original callback
      callback(message);
    };
    
    eventListeners.push(wrappedCallback);
    socket.on(event, wrappedCallback);
  } else {
    // For other events, just register the callback directly
    eventListeners.push(callback);
    socket.on(event, callback);
  }
  
  console.log(`Added listener for event: ${event}`);
};

/**
 * Remove event listener
 * @param {string} event - Event name
 * @param {function} callback - Event callback to remove
 */
export const removeEventListener = (event, callback) => {
  if (!socket) {
    return;
  }
  
  // Remove from listeners map
  if (listeners.has(event)) {
    const eventListeners = listeners.get(event);
    const index = eventListeners.indexOf(callback);
    
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }
  }
  
  // Remove socket listener
  socket.off(event, callback);
  console.log(`Removed listener for event: ${event}`);
};

/**
 * Check if socket is connected
 * @returns {boolean} Connection status
 */
export const isConnected = () => {
  return socket && socket.connected;
};