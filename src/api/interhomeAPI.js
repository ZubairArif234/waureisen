import API from './config';

export const fetchInterhomePrices = async ({
  accommodationCode,
  checkInDate = null,
  pax = null,
  duration = null,
  los = true
}) => {
  try {
    const response = await API.get(`/interhome/prices/${accommodationCode}`, {
      params: {
        checkInDate,
        pax,
        duration,
        los
      }
    });
    
    return response.data;
  } catch (error) {
    console.warn(`Failed to fetch Interhome prices: ${error.message}`);
    throw error;
  }
};