// src/api/authAPI.js
import API from './config';

// User authentication
export const userLogin = async (credentials) => {
  try {
    console.log('Attempting user login with:', credentials);
    const response = await API.post('/users/login', credentials);
    console.log('User login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const userSignup = async (userData) => {
  try {
    console.log('Attempting user signup with:', userData);
    const response = await API.post('/users/signup', userData);
    console.log('User signup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('User signup error:', error);
    throw error;
  }
};

// Provider authentication
export const providerLogin = async (credentials) => {
  try {
    console.log('Attempting provider login with:', credentials);
    const response = await API.post('/providers/login', credentials);
    console.log('Provider login response:', response.data);
    
    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Provider login error:', error);
    throw error;
  }
};

export const providerSignup = async (providerData) => {
  try {
    console.log('Attempting provider signup with:', providerData);
    const response = await API.post('/providers/signup', providerData);
    console.log('Provider signup response:', response.data);
    
    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Provider signup error:', error);
    throw error;
  }
};

// Admin authentication
export const adminLogin = async (credentials) => {
  try {
    console.log('Attempting admin login with:', credentials);
    const response = await API.post('/admins/login', credentials);
    console.log('Admin login response:', response.data);
    
    // Set auth header immediately if token is received
    if (response.data.token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

export const adminSignup = async (adminData) => {
  try {
    const response = await API.post('/admins/signup', adminData);
    return response.data;
  } catch (error) {
    console.error('Admin signup error:', error);
    throw error;
  }
};

// Get user profile
// Update this function to use the new endpoint
export const getUserProfile = async () => {
  try {
    const response = await API.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get provider profile
export const getProviderProfile = async () => {
  try {
    const response = await API.get('/providers/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    throw error;
  }
};

// Update user profile
// Update this function to use the correct endpoint
export const updateUserProfile = async (userData) => {
  try {
    console.log('Sending profile update:', userData);
    const response = await API.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Update provider profile
export const updateProviderProfile = async (profileData) => {
  try {
    const response = await API.put('/providers/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating provider profile:', error);
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await API.get('/auth/verify');
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

// Logout function - only clears frontend state
export const logout = () => {
  // Return a resolved promise for consistency with other functions
  return Promise.resolve({ success: true });
};