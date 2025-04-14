// src/api/authAPI.js
import API from './config';

// User authentication
export const userLogin = async (credentials) => {
  try {
    const response = await API.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const userSignup = async (userData) => {
  try {
    const response = await API.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Provider authentication
export const providerLogin = async (credentials) => {
  try {
    const response = await API.post('/providers/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Provider login error:', error);
    throw error;
  }
};

export const providerSignup = async (providerData) => {
  try {
    const response = await API.post('/providers/signup', providerData);
    return response.data;
  } catch (error) {
    console.error('Provider signup error:', error);
    throw error;
  }
};

// Admin authentication
export const adminLogin = async (credentials) => {
  try {
    const response = await API.post('/admins/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Add this function to your existing authAPI.js file

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await API.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};