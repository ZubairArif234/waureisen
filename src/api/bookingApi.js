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