// src/api/providerAPI.js
import API from './config';
import { setAuthHeader } from '../utils/authService';

// Provider profile functions
export const getProviderProfile = async () => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    throw error;
  }
};

export const updateProviderProfile = async (profileData) => {
  try {
    setAuthHeader();
    const response = await API.put('/providers/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating provider profile:', error);
    throw error;
  }
};

// Listing management functions
export const getProviderListings = async () => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider listings:', error);
    return [];
  }
};

export const createListing = async (listingData) => {
  try {
    setAuthHeader();
    const response = await API.post('/providers/add-listing', listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    setAuthHeader();
    const response = await API.delete(`/providers/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// Booking management functions
export const getProviderBookings = async (status = 'all', limit = null) => {
  try {
    setAuthHeader();
    const params = { status };
    if (limit) params.limit = limit;
    
    const response = await API.get('/providers/bookings', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    return [];
  }
};

export const acceptBooking = async (id) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/bookings/${id}/accept`);
    return response.data;
  } catch (error) {
    console.error('Error accepting booking:', error);
    throw error;
  }
};

export const rejectBooking = async (id) => {
  try {
    setAuthHeader();
    const response = await API.put(`/providers/bookings/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting booking:', error);
    throw error;
  }
};

// Dashboard/Analytics functions
export const getProviderStats = async (timeFrame = 'month') => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/analytics', { 
      params: { timeRange: timeFrame } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return null;
  }
};

// Calendar management functions
export const blockCalendarDates = async (blockData) => {
  try {
    setAuthHeader();
    const response = await API.post('/providers/calendar/block', blockData);
    return response.data;
  } catch (error) {
    console.error('Error blocking calendar dates:', error);
    throw error;
  }
};

// Earnings functions
export const getProviderEarnings = async (timeFrame = 'all') => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/earnings', { 
      params: { timeFrame } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider earnings:', error);
    return {
      totalEarnings: '0 CHF',
      pendingPayouts: '0 CHF',
      nextPayout: '0 CHF'
    };
  }
};

export const getProviderTransactions = async (filters = {}) => {
  try {
    setAuthHeader();
    const response = await API.get('/providers/transactions', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching provider transactions:', error);
    return [];
  }
};

export const getProviderDashboardStats = async (timeFrame = 'month') => {
    return getProviderStats(timeFrame);
  };
  
  export const cancelBooking = async (id) => {
    return rejectBooking(id);
  };