import API from './config';

export const createPaymentIntent = async (data) => {
  try {
    const response = await API.post('/payment', data);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};