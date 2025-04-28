import API from './config';

// Send verification code to an email
export const sendVerificationCode = async (email, userType) => {
  try {
    const response = await API.post('/verification/send-code', { email, userType });
    return response.data;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// Verify the code entered by the user
export const verifyCode = async (email, code) => {
  try {
    const response = await API.post('/verification/verify-code', { email, code });
    return response.data;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};