import API from './config';

export const createPaymentIntent = async (data) => {
  try {
    const response = await API.post('/payment', data);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const refundPayment = async (id) => {
  try {
    const response = await API.get(`/payment/refund/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error payment refund:', error);
    throw error;
  }
};

export const myCardDetails = async () => {
  try {
    const response = await API.get(`/payment/card-details`);
    return response.data;
  } catch (error) {
    console.error('Error card details:', error);
    throw error;
  }
};

export const connectToStripe = async (data) => {
  try {
    const response = await API.post(`/payment/connect-stripe`,data);
    return response.data;
  } catch (error) {
    console.error('Error connect stripe:', error);
    throw error;
  }
}

export const getStripeAccount = async (id) => {
  try {
    const response = await API.get(`/payment/get-account/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error connect stripe:', error);
    throw error;
  }
}