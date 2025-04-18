// src/api/chatAPI.js
import API from './config';
import { setAuthHeader } from '../utils/authService';

/**
 * Get chat history between a user and admin
 * @param {string} userId - User ID
 * @returns {Promise} Chat history
 */
export const getChatHistory = async (userId) => {
  try {
    // Ensure auth header is set
    setAuthHeader();
    
    // Make the request
    const response = await API.get(`/chat/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

/**
 * Get all conversations for admin
 * @returns {Promise} List of conversations
 */
export const getAdminConversations = async () => {
  try {
    // Ensure auth header is set
    setAuthHeader();
    
    const response = await API.get('/chat/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin conversations:', error);
    throw error;
  }
};

/**
 * Get unread count for a specific conversation
 * @param {string} userId - User ID
 * @returns {Promise} Unread count
 */
export const getUnreadCount = async (userId) => {
  try {
    // Ensure auth header is set
    setAuthHeader();
    
    const response = await API.get(`/chat/unread/${userId}`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    // Return 0 on error instead of throwing
    return 0;
  }
};

/**
 * Get total unread count for admin across all conversations
 * @returns {Promise} Total unread count
 */
export const getTotalUnreadCount = async () => {
  try {
    // Ensure auth header is set
    setAuthHeader();
    
    const response = await API.get('/chat/unread');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching total unread count:', error);
    // Return 0 on error instead of throwing
    return 0;
  }
};