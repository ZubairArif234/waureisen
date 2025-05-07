import API from './config';

export const getMyBooking = async (data) => {
  try {
    const response = await API.get('/booking', data);
    return response.data;
  } catch (error) {
    console.error('Error getting my booking:', error);
    throw error;
  }
};

export const getMyProviderBooking = async (data) => {
  try {
    const response = await API.get('/booking/provider');
    return response.data;
  } catch (error) {
    console.error('Error getting my booking:', error);
    throw error;
  }
};

export const getBookingByListing = async (id) => {
  try {
    const response = await API.get(`/booking/listing/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error booking by listing:', error);
    throw error;
  }
};