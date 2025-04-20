// src/utils/authService.js
import API from '../api/config';
import { providerLogin, userLogin, adminLogin } from '../api/authAPI';

// Local Storage Keys - using consistent keys throughout the application
const TOKEN_KEY = 'token';
const USER_TYPE_KEY = 'userType';
const USER_DATA_KEY = 'user_data';
const PROVIDER_USER_KEY = 'provider_user';
const ADMIN_DATA_KEY = 'admin_data';

// Generic login function that delegates to the appropriate API call
export const login = async (credentials, userType) => {
  try {
    let response;
    
    // Call the appropriate login function based on user type
    switch (userType) {
      case 'provider':
        response = await providerLogin(credentials);
        break;
      case 'admin':
        response = await adminLogin(credentials);
        break;
      case 'user':
      default:
        response = await userLogin(credentials);
        break;
    }
    
    // For debugging, check the response structure
    console.log(`${userType} login response:`, response);
    
    // Store authentication data in localStorage
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_TYPE_KEY, userType);
      
      // Store user data based on type
      if (userType === 'provider' && response.provider) {
        localStorage.setItem(PROVIDER_USER_KEY, JSON.stringify(response.provider));
      } else if (userType === 'user' && response.user) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      } else if (userType === 'admin' && response.admin) {
        localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(response.admin));
      }
      
      // Set the authorization header immediately for subsequent requests
      API.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      console.log('Token saved and auth header set');
    } else {
      console.error('No token returned in login response');
    }
    
    return response;
  } catch (error) {
    console.error('Login error in authService:', error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(PROVIDER_USER_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
  
  // Clear auth header
  delete API.defaults.headers.common['Authorization'];
  
  // Redirect to home page
  window.location.href = '/';
};

// Get current user data (works for any user type)
export const getCurrentUser = () => {
  const userType = localStorage.getItem(USER_TYPE_KEY);
  
  if (!userType) return null;
  
  let userData;
  
  switch (userType) {
    case 'provider':
      userData = localStorage.getItem(PROVIDER_USER_KEY);
      break;
    case 'admin':
      userData = localStorage.getItem(ADMIN_DATA_KEY);
      break;
    case 'user':
    default:
      userData = localStorage.getItem(USER_DATA_KEY);
      break;
  }
  
  return userData ? JSON.parse(userData) : null;
};

// Get current provider data
export const getCurrentProvider = () => {
  if (isUserType('provider')) {
    const providerData = localStorage.getItem(PROVIDER_USER_KEY);
    return providerData ? JSON.parse(providerData) : null;
  }
  return null;
};

// Get current provider ID
export const getCurrentProviderId = () => {
  const provider = getCurrentProvider();
  if (!provider) return null;
  
  // Handle different ID formats
  return provider.id || provider._id;
};

// Get current user ID (works for any user type)
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  if (!user) return null;
  
  // Handle different ID formats
  return user.id || user._id;
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem(USER_TYPE_KEY);
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userType = localStorage.getItem(USER_TYPE_KEY);
  
  console.log('Auth check - token exists:', !!token);
  console.log('Auth check - user type:', userType);
  
  return !!token && !!userType;
};

// Check if user is of specific type
export const isUserType = (type) => {
  const userType = localStorage.getItem(USER_TYPE_KEY);
  return userType === type;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Update user profile in local storage
export const updateUserProfile = (updatedData) => {
  const userType = localStorage.getItem(USER_TYPE_KEY);
  
  if (!userType) return null;
  
  let storageKey;
  
  switch (userType) {
    case 'provider':
      storageKey = PROVIDER_USER_KEY;
      break;
    case 'admin':
      storageKey = ADMIN_DATA_KEY;
      break;
    case 'user':
    default:
      storageKey = USER_DATA_KEY;
      break;
  }
  
  const currentData = getCurrentUser();
  if (currentData) {
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    return newData;
  }
  return null;
};

// Update provider profile in local storage
export const updateProviderProfile = (updatedData) => {
  if (!isUserType('provider')) return null;
  
  const currentData = getCurrentProvider();
  if (currentData) {
    const newData = { ...currentData, ...updatedData };
    localStorage.setItem(PROVIDER_USER_KEY, JSON.stringify(newData));
    return newData;
  }
  return null;
};


export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set explicitly');
    return true;
  } else {
    delete API.defaults.headers.common['Authorization'];
    console.log('Authorization header removed - no token found');
    return false;
  }
};

// Initialize auth on app load
export const initializeAuth = () => {
  return setAuthHeader();
};