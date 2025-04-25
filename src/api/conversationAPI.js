// src/api/conversationAPI.js
import API from './config';
import { setAuthHeader } from '../utils/authService';

// Get conversations for current user
export const getUserConversations = async () => {
  try {
    setAuthHeader();
    const response = await API.get('/conversations/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user conversations:', error);
    throw error;
  }
};

// Get conversations for current provider
export const getProviderConversations = async () => {
  try {
    setAuthHeader();
    const response = await API.get('/conversations/provider');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider conversations:', error);
    throw error;
  }
};

// Get or create conversation for a booking
export const getConversationByBooking = async (bookingId) => {
  try {
    setAuthHeader();
    const response = await API.get(`/conversations/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation by booking:', error);
    throw error;
  }
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    setAuthHeader();
    const response = await API.get(`/conversations/${conversationId}/messages`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (conversationId, content) => {
  try {
    setAuthHeader();
    const response = await API.post(`/conversations/${conversationId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId) => {
  try {
    setAuthHeader();
    const response = await API.put(`/conversations/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};