// src/api/listingAPI.js
import API from './config';

// Get all listings
export const getAllListings = async () => {
  try {
    const response = await API.get('/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Get listing by ID
export const getListingById = async (id) => {
  try {
    const response = await API.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    throw error;
  }
};

// Search listings with parameters
export const searchListings = async (params) => {
  try {
    const response = await API.get('/listings', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};

// For provider to add listings
export const createListing = async (listingData) => {
  try {
    const response = await API.post('/providers/add-listing', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// For provider to update listings
export const updateListing = async (id, listingData) => {
  try {
    const response = await API.put(`/providers/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// For provider to delete listings
export const deleteListing = async (id) => {
  try {
    const response = await API.delete(`/providers/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// For provider to get their own listings
export const getProviderListings = async () => {
  try {
    const response = await API.get('/providers/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider listings:', error);
    throw error;
  }
};

// For provider to get bookings for their listings
export const getProviderBookings = async (status = 'all') => {
  try {
    const response = await API.get('/providers/bookings', { params: { status } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw error;
  }
};

// For provider to get earnings data
export const getProviderEarnings = async (timeFrame = 'all') => {
  try {
    const response = await API.get('/providers/earnings', { params: { timeFrame } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider earnings:', error);
    throw error;
  }
};

// For provider to get transactions
export const getProviderTransactions = async (params = {}) => {
  try {
    const response = await API.get('/providers/transactions', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider transactions:', error);
    throw error;
  }
};

// For provider to get dashboard stats
export const getProviderDashboardStats = async (timeFrame = 'month') => {
  try {
    const response = await API.get('/providers/dashboard', { params: { timeFrame } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider dashboard stats:', error);
    throw error;
  }
};