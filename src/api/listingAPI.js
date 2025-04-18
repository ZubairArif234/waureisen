// src/api/listingAPI.js
import API from './config';
import axios from 'axios';

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

// Search listings with parameters (combined function)
export const searchListings = async (params) => {
  try {
    if (typeof params === 'number' || typeof params === 'string') {
      const [lat, lng, page = 1, pageSize = 10] = arguments;
      
      const response = await API.get('/listings/search', {
        params: {
          lat,
          lng,
          page,
          pageSize,
          select: 'Code title description images location pricePerNight provider' // Added Code to selection
        }
      });
      
      return {
        listings: response?.data?.listings || [],
        hasMore: response?.data?.hasMore || false,
        ...response.data
      };
    }
    
    // For regular search, ensure Code is included in the response
    const response = await API.get('/listings/search', { 
      params: {
        ...params,
        select: 'Code title description images location pricePerNight provider' // Added Code to selection
      }
    });
    
    return {
      listings: response?.data?.listings || [],
      hasMore: response?.data?.hasMore || false,
      ...response.data
    };
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

// For provider to get dashboard stats - UPDATED with correct endpoint
export const getProviderDashboardStats = async (timeFrame = 'month') => {
  try {
    // Changed from '/dashboard' to '/analytics' to match backend route
    const response = await API.get('/providers/analytics', { params: { timeRange: timeFrame } });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider dashboard stats:', error);
    throw error;
  }
};