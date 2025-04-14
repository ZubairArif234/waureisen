
// src/utils/authService.js
import API from '../api/config';

// Local Storage Keys - using same token key as in config.js
const TOKEN_KEY = 'token';
const USER_KEY = 'provider_user';

// Provider login
export const login = async (credentials) => {
  try {
    const response = await API.post('/providers/login', credentials);
    
    // Store token and user data in local storage
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.provider));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Provider signup
export const signup = async (userData) => {
  try {
    const response = await API.post('/providers/signup', userData);
    
    // Store token and user data in local storage
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.provider));
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // Clear any other auth-related data
  // Redirect to login page or home page as needed
  window.location.href = '/login';
};

// Get current provider data
export const getCurrentProvider = () => {
  const providerData = localStorage.getItem(USER_KEY);
  return providerData ? JSON.parse(providerData) : null;
};

// Get current provider ID
export const getCurrentProviderId = () => {
  const provider = getCurrentProvider();
  return provider ? provider.id : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Update provider profile in local storage
export const updateProviderProfile = (updatedData) => {
  const currentData = getCurrentProvider();
  if (currentData) {
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem(USER_KEY, JSON.stringify(newData));
    return newData;
  }
  return null;
};

// Set authorization header for all requests
export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

// Initialize auth on app load
export const initializeAuth = () => {
  setAuthHeader();
};