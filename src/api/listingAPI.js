// src/api/listingAPI.js
import API from './config';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';






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
    const response = await API.put(`/providers/listing-with-filter/${id}`, listingData);
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

// Fetch listings by map bounds
export const fetchListingsByMapBounds = async (params) => {
  try {
    const { lat, lng, radius, bounds, page = 1, limit = 200, filters = {} } = params;

    const queryParams = new URLSearchParams({
      lat,
      lng,
      radius: radius || 1000,
      page,
      limit,
    });

    // Add filters to query (assumes flat key-value structure)
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    if (bounds) {
      queryParams.append('neLat', bounds.ne.lat);
      queryParams.append('neLng', bounds.ne.lng);
      queryParams.append('swLat', bounds.sw.lat);
      queryParams.append('swLng', bounds.sw.lng);
    }

    const response = await API.get(`/listings/map?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching listings by map bounds:', error);
    throw error;
  }
};







export const getStreamedListings = async (params) => {
  try {
    const {
      limit = 12,
      page = 1,
      skip = null,
      lat,
      lng,
      radius = 500,
      filters = {},
      priceMin,
      priceMax
    } = params;

    console.log("API REQUEST WITH COORDINATES:", { lat, lng });

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('limit', limit);
    queryParams.append('page', page);
    
    // Use skip if provided, or calculate from page
    const skipCount = skip !== null ? skip : (page - 1) * limit;
    queryParams.append('skip', skipCount);
    
    // Add coordinates as numbers, not strings
    if (lat !== undefined && lat !== null) {
      queryParams.append('lat', parseFloat(lat));
    }
    
    if (lng !== undefined && lng !== null) {
      queryParams.append('lng', parseFloat(lng));
    }
    
    if (radius) {
      queryParams.append('radius', radius);
    }
    
    // Add filters if provided
    if (typeof filters === 'string') {
      queryParams.append('filters', filters);
    } else if (Object.keys(filters).length > 0) {
      queryParams.append('filters', JSON.stringify(filters));
    }
    
    // Add price range
    if (priceMin) queryParams.append('priceMin', priceMin);
    if (priceMax) queryParams.append('priceMax', priceMax);

    // Log the final request URL
    console.log("API REQUEST URL:", `/listings/stream?${queryParams.toString()}`);

    // Make the request
    const response = await API.get(`/listings/stream?${queryParams.toString()}`);
    
    if (!response.data) {
      return { listings: [], total: 0, page: 1, totalPages: 0, hasMore: false };
    }
    
    const listings = response.data.listings || [];
    const total = response.data.total || 0;
    const totalPages = response.data.totalPages || Math.ceil(total / limit) || 1;
    
    return {
      listings,
      total,
      page: parseInt(page),
      totalPages,
      hasMore: response.data.hasMore !== undefined ? response.data.hasMore : (page < totalPages)
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
    return { listings: [], total: 0, page: 1, totalPages: 0, hasMore: false };
  }
};
/**
 * Get a single listing by ID
 * @param {string} id - Listing ID
 * @returns {Promise<Object>} Listing data
 */
export const getSingleListing = async (id) => {
  try {
    const response = await API.get(`/listings/single/${id}`);
    return response.data.listing;
  } catch (error) {
    console.error(`Error fetching single listing ${id}:`, error);
    throw error;
  }
};

/**
 * Get multiple listings by IDs (batch)
 * @param {Array<string>} ids - Array of listing IDs
 * @returns {Promise<Array<Object>>} Array of listings
 */
export const getListingsByIds = async (ids) => {
  try {
    const response = await API.post('/listings/batch', { ids });
    return response.data.listings;
  } catch (error) {
    console.error('Error fetching batch listings:', error);
    throw error;
  }
};

// Keep existing API methods
export const getAllListings = async () => {
  try {
    const response = await API.get('/listings');
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

export const getListingById = async (id) => {
  try {
    const response = await API.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing ${id}:`, error);
    throw error;
  }
};

export const searchListings = async (params) => {
  try {
    const { lat, lng, page, pageSize, filters, moreFilters, radius } = params;

    const queryParams = new URLSearchParams({
      lat,
      lng,
      page,
      pageSize,
    });

    if (radius) {
      queryParams.append('radius', radius);
    }

    if (filters && filters.length > 0) {
      queryParams.append('filters', JSON.stringify(filters));
    }

    if (moreFilters) {
      queryParams.append('moreFilters', JSON.stringify(moreFilters));
    }

    const response = await API.get(`/listings/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error searching listings:', error);
    throw error;
  }
};
