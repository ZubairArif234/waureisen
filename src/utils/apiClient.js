// src/utils/apiClient.js
import {
    getProviderDashboardStats as fetchDashboardStats,
    getProviderBookings as fetchBookings,
    getProviderListings as fetchListings,
    getProviderEarnings as fetchEarnings,
    getProviderTransactions as fetchTransactions
  } from '../api/listingAPI';
  import API from '../api/config';
  
  // Re-export existing functions from listingAPI
  export const getProviderDashboardStats = fetchDashboardStats;
  export const getProviderListings = fetchListings;
  export const getProviderEarnings = fetchEarnings;
  export const getProviderTransactions = fetchTransactions;
  
  // Enhanced provider bookings function with limit parameter
  export const getProviderBookings = async (status = 'all', limit = 5) => {
    try {
      // Use the original function if no limit is needed
      if (!limit) {
        return await fetchBookings(status);
      }
      
      // Otherwise, add the limit parameter
      const response = await API.get('/providers/bookings', { 
        params: { status, limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching provider bookings:', error);
      throw error;
    }
  };
  
  // Get provider analytics (not in original listingAPI)
  export const getProviderAnalytics = async (timeRange = 'month') => {
    try {
      const response = await API.get('/providers/analytics', { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  };
  
  // Accept booking
  export const acceptBooking = async (bookingId) => {
    try {
      const response = await API.put(`/providers/bookings/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  };
  
  // Cancel booking
  export const cancelBooking = async (bookingId) => {
    try {
      const response = await API.put(`/providers/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  };
  
  // Block calendar dates
  export const blockCalendarDates = async (blockData) => {
    try {
      const response = await API.post('/providers/calendar/block', blockData);
      return response.data;
    } catch (error) {
      console.error('Error blocking calendar dates:', error);
      throw error;
    }
  };