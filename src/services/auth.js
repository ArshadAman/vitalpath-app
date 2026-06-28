import { apiRequest } from './api';
import * as SecureStore from 'expo-secure-store';

/**
 * Sends registration payload to backend.
 */
export const registerUser = async (email, phone, password) => {
  const payload = {
    password,
    ...(email && { email }),
    ...(phone && { phone_number: phone }),
  };
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Standard password login. Caches JWT securely on success.
 */
export const loginUser = async (email, phone, password) => {
  const payload = {
    password,
    ...(email && { email }),
    ...(phone && { phone_number: phone }),
  };
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (data.access_token) {
    await SecureStore.setItemAsync('user_token', data.access_token);
  }
  return data;
};

/**
 * Requests backend to send a 6-digit OTP code to specified phone number.
 */
export const sendOTP = async (phone) => {
  return apiRequest('/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  });
};

/**
 * Submits OTP code for verification. Caches JWT on success.
 */
export const verifyOTP = async (phone, code) => {
  const data = await apiRequest('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone, otp_code: code }),
  });
  
  if (data.access_token) {
    await SecureStore.setItemAsync('user_token', data.access_token);
  }
  return data;
};

/**
 * Clears JWT from secure hardware storage on logout.
 */
export const logoutUser = async () => {
  try {
    await SecureStore.deleteItemAsync('user_token');
  } catch (error) {
    console.error('Error clearing secure token:', error);
  }
};

/**
 * Reads token from secure storage.
 */
export const getStoredToken = async () => {
  try {
    return await SecureStore.getItemAsync('user_token');
  } catch (error) {
    console.error('Error reading secure token:', error);
    return null;
  }
};
