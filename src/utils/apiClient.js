// src/utils/apiClient.js
import API from '../api/config';
import { setAuthHeader } from './authService';

// Re-export existing functions from listingAPI
export const getProviderDashboardStats = async (timeFrame = 'month') => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    console.log(`Fetching dashboard stats with timeRange: ${timeFrame}`);
    
    // Use the correct analytics endpoint
    const response = await API.get('/providers/analytics', { 
      params: { timeRange: timeFrame } 
    });
    
    // Handle empty or invalid response
    if (!response.data) {
      return createDefaultDashboardStats();
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching provider dashboard stats:', error);
    // Instead of throwing, return default stats with error flag
    return {
      ...createDefaultDashboardStats(),
      error: error.response?.data?.message || 'Failed to load dashboard data'
    };
  }
};

// Enhanced provider bookings function with limit parameter
export const getProviderBookings = async (status = 'all', limit = 5) => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    console.log(`Fetching provider bookings with status: ${status}, limit: ${limit}`);
    
    const response = await API.get('/providers/bookings', { 
      params: { status, limit } 
    });
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    // Return empty array instead of throwing error
    return [];
  }
};

// Get provider listings with better error handling
export const getProviderListings = async () => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    console.log('Fetching provider listings');
    
    const response = await API.get('/providers/listings');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching provider listings:', error);
    return [];
  }
};

// Get provider earnings
export const getProviderEarnings = async (timeFrame = 'all') => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    const response = await API.get('/providers/earnings', { params: { timeFrame } });
    return response.data || { earnings: 0, pendingBalance: 0 };
  } catch (error) {
    console.error('Error fetching provider earnings:', error);
    return { earnings: 0, pendingBalance: 0 };
  }
};

// Get provider transactions
export const getProviderTransactions = async (params = {}) => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    const response = await API.get('/providers/transactions', { params });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching provider transactions:', error);
    return [];
  }
};

// Accept booking
export const acceptBooking = async (bookingId) => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    const response = await API.put(`/providers/bookings/${bookingId}/accept`);
    return response.data;
  } catch (error) {
    console.error('Error accepting booking:', error);
    throw error; // Still throw for action operations
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    const response = await API.put(`/providers/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error; // Still throw for action operations
  }
};

// Block calendar dates
export const blockCalendarDates = async (blockData) => {
  try {
    // Ensure auth header is set before making the request
    setAuthHeader();
    
    const response = await API.post('/providers/calendar/block', blockData);
    return response.data;
  } catch (error) {
    console.error('Error blocking calendar dates:', error);
    throw error; // Still throw for action operations
  }
};

// Helper function to create default dashboard stats when API fails
function createDefaultDashboardStats() {
  return {
    performance: {
      totalBookings: {
        current: 0,
        previous: 0
      },
      occupancyRate: {
        current: 0,
        previous: 0
      },
      averageNightlyRate: {
        current: 0,
        previous: 0
      },
      totalRevenue: {
        current: 0,
        previous: 0
      }
    },
    charts: {
      revenue: createEmptyChartData(30),
      bookings: createEmptyChartData(30)
    },
    listings: [],
    insights: [
      {
        type: 'tip',
        message: 'Add your first listing to start receiving bookings and track performance metrics.'
      },
      {
        type: 'tip',
        message: 'Adding high-quality photos and detailed descriptions will increase your listing visibility and booking rates.'
      }
    ]
  };
}

// Helper function to create empty chart data
function createEmptyChartData(length) {
  return Array(length).fill(0);
}