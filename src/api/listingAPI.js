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